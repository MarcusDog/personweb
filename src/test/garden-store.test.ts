// @vitest-environment node
import { createRequire } from "node:module";
import { afterEach, describe, expect, it } from "vitest";
const require = createRequire(import.meta.url);
const Database = require("better-sqlite3");
const { createContentStore } = require("../../server/garden-cms.cjs");
const databases: ReturnType<typeof Database>[] = [];
function setup() {
  const db = new Database(":memory:");
  databases.push(db);
  return { db, store: createContentStore(db, []) };
}
const content = {
  slug: "中文文章",
  title: { zh: "只写中文也能发布", en: "" },
  body: { zh: "## 第一节\n\n真实的内容。", en: "" },
  date: "2026-10-19",
  tags: [],
};
afterEach(() => {
  databases.forEach((db) => db.close());
  databases.length = 0;
});
describe("content snapshots", () => {
  it("publishes Chinese without mandatory English", () => {
    const { store } = setup();
    store.save("posts", "one", content, "publish");
    expect(store.list("posts")[0].title.zh).toBe(content.title.zh);
  });
  it("separates autosaved edits from the published article", () => {
    const { store } = setup();
    store.save("posts", "one", content, "publish");
    store.save(
      "posts",
      "one",
      { ...content, body: { zh: "修改尚未发布", en: "" } },
      "draft",
    );
    expect(store.get("posts", "one").body.zh).toBe(content.body.zh);
    expect(store.get("posts", "one", true).body.zh).toBe("修改尚未发布");
    expect(store.get("posts", "one", true).hasDraft).toBe(true);
    store.save(
      "posts",
      "one",
      { ...content, body: { zh: "修改尚未发布", en: "" } },
      "publish",
    );
    expect(store.get("posts", "one").body.zh).toBe("修改尚未发布");
  });
  it("unpublishes without losing the editable document", () => {
    const { store } = setup();
    store.save("posts", "one", content, "publish");
    store.save("posts", "one", content, "unpublish");
    expect(store.list("posts")).toHaveLength(0);
    expect(store.get("posts", "one", true).body.zh).toBe(content.body.zh);
  });
  it("does not recreate deleted seed content when migration runs again", () => {
    const { db } = setup();
    const item = {
      slug: "test-project",
      title: { zh: "项目" },
      detailSections: [],
      gallery: [],
    };
    const first = createContentStore(db, [item]);
    first.save("projects", "custom", item, "publish");
    first.remove("projects", "custom");
    const next = createContentStore(db, [item]);
    expect(next.list("projects")).toHaveLength(0);
  });
  it("persists structured documents and all four content types", () => {
    const { db, store } = setup();
    for (const kind of ["posts", "notes", "books", "projects"])
      store.save(
        kind,
        kind,
        { ...content, bodyDocuments: { zh: { type: "doc", content: [] } }, ...(kind === 'books' ? {coverImage:'/garden/still-life-480.webp',coverMatch:'confirmed',coverOrigin:'manual'} : {}) },
        "publish",
      );
    const reloaded = createContentStore(db, []);
    for (const kind of ["posts", "notes", "books", "projects"])
      expect(reloaded.get(kind, kind).bodyDocuments.zh.type).toBe("doc");
  });
  it("rejects malformed external links and empty published posts", () => {
    const { store } = setup();
    expect(() =>
      store.save(
        "posts",
        "one",
        { ...content, body: { zh: "", en: "" } },
        "publish",
      ),
    ).toThrow("正文");
    expect(() =>
      store.save(
        "projects",
        "two",
        { ...content, externalLinks: [{ url: "javascript:alert(1)" }] },
        "publish",
      ),
    ).toThrow("外链");
  });
});
