// @vitest-environment node
import { createRequire } from "node:module";
import { afterEach, describe, expect, it } from "vitest";
import { writingStats, writingTemplates } from "../garden/writing";
const require = createRequire(import.meta.url);
const Database = require("better-sqlite3");
const { createContentStore } = require("../../server/garden-cms.cjs");
const {
  seedEditorial,
  posts,
  books,
} = require("../../server/editorial-seed.cjs");
const { buildFeed } = require("../../server/garden-feeds.cjs");
const databases: ReturnType<typeof Database>[] = [];
function setup() {
  const db = new Database(":memory:");
  databases.push(db);
  const store = createContentStore(db);
  seedEditorial(db, store);
  return { db, store };
}
afterEach(() => {
  databases.forEach((db) => db.close());
  databases.length = 0;
});

describe("editorial collection and RSS", () => {
  it("adds source-backed essays and honest science / humanities wish-list entries", () => {
    const { store } = setup();
    expect(store.list("posts")).toHaveLength(4);
    expect(store.list("books")).toHaveLength(6);
    expect(
      books.every(
        (book: { readingStatus: string; progress: number }) =>
          book.readingStatus === "wish" && book.progress === 0,
      ),
    ).toBe(true);
    expect(
      posts.every(
        (post: { body: { zh: string } }) =>
          post.body.zh.includes("https://") && post.body.zh.length > 600,
      ),
    ).toBe(true);
  });
  it("does not overwrite edits, duplicate slugs or resurrect a removed entry", () => {
    const { db, store } = setup();
    const original = store.list("posts")[0];
    store.save(
      "posts",
      original.id,
      { ...original, title: { zh: "作者修改的标题", en: "" } },
      "publish",
    );
    store.remove("books", books[0].id);
    seedEditorial(db, store);
    expect(store.get("posts", original.id).title.zh).toBe("作者修改的标题");
    expect(store.list("posts")).toHaveLength(4);
    expect(store.list("books")).toHaveLength(5);
  });
  it("offers combined and separate feeds with full safe Markdown and stable article URLs", async () => {
    const { store } = setup();
    const data = {
      posts: store.list("posts"),
      books: store.list("books"),
      origin: "https://example.com",
    };
    const combined = await buildFeed(data);
    expect(combined.match(/<item>/g)).toHaveLength(10);
    expect(combined).toContain("<content:encoded>");
    expect(combined).toContain("xmlns:content=");
    expect(combined).toContain("想读");
    expect(combined).toContain(
      'isPermaLink="true">https://example.com/journal/',
    );
    const articles = await buildFeed({ ...data, mode: "articles" });
    expect(articles.match(/<item>/g)).toHaveLength(4);
    expect(articles).not.toContain("aya:book:");
    const reading = await buildFeed({ ...data, mode: "reading" });
    expect(reading.match(/<item>/g)).toHaveLength(6);
    expect(reading).toContain("reading?book=");
  });
  it("does not leak draft text or draft timestamps into published feeds", async () => {
    const { store } = setup();
    const initial = store.list("posts")[0];
    const before = await buildFeed({
      posts: store.list("posts"),
      books: [],
      origin: "https://example.com",
    });
    await new Promise((resolve) => setTimeout(resolve, 5));
    store.save(
      "posts",
      initial.id,
      { ...initial, body: { zh: "私密草稿不可见", en: "" } },
      "draft",
    );
    const after = await buildFeed({
      posts: store.list("posts"),
      books: [],
      origin: "https://example.com",
    });
    expect(after).toBe(before);
    expect(after).not.toContain("私密草稿不可见");
  });
  it("strips raw HTML and unsafe links from feed bodies", async () => {
    const xml = await buildFeed({
      posts: [
        {
          slug: "unsafe",
          title: { zh: "<标题>&" },
          date: "2026-10-20",
          body: {
            zh: "<script>alert(1)</script>\n\n[危险链接](javascript:alert(1))\n\n[站内链接](/about)",
          },
        },
      ],
      books: [],
      origin: "https://example.com",
    });
    expect(xml).toContain("&lt;标题&gt;&amp;");
    expect(xml).not.toContain("javascript:");
    expect(xml).not.toContain("alert(1)");
    expect(xml).toContain("https://example.com/about");
  });
});
describe("writing helpers", () => {
  it("counts Chinese characters and English words without counting image URLs", () => {
    expect(
      writingStats("你好 AI tools\n\n![图](https://example.com/a.png)"),
    ).toEqual({ count: 4, minutes: 1, images: 1 });
    expect(writingStats("我".repeat(701)).minutes).toBe(3);
  });
  it("offers distinct, factual templates for essays, reviews, books and notes", () => {
    expect(new Set(writingTemplates.map((item) => item.id)).size).toBe(4);
    expect(
      writingTemplates.find((item) => item.id === "technical")?.body,
    ).toContain("原始链接");
    expect(
      writingTemplates.find((item) => item.id === "reading")?.kinds,
    ).toContain("books");
  });
});
