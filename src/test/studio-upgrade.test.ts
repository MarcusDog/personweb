// @vitest-environment node
import { createRequire } from "node:module";
import { afterEach, describe, it, expect } from "vitest";
import {
  matchCount,
  replaceLiteral,
  writingChecks,
} from "../garden/writing-tools";
const require = createRequire(import.meta.url),
  Database = require("better-sqlite3");
const { createContentStore } = require("../../server/garden-cms.cjs");
const dbs: ReturnType<typeof Database>[] = [];
const setup = () => {
  const db = new Database(":memory:");
  dbs.push(db);
  return { db, store: createContentStore(db) };
};
const article = {
  slug: "test-studio",
  title: { zh: "文章", en: "" },
  body: { zh: "最初的正文", en: "" },
  tags: [],
};
afterEach(() => {
  dbs.forEach((db) => db.close());
  dbs.length = 0;
});
describe("writing tools", () => {
  it("treats punctuation as literal text, not a regular expression", () => {
    for (const term of ["a+b", "[abc]", "a.b", "\\", "(test)", "💡"])
      expect(matchCount(`${term} ${term}`, term)).toBe(2);
  });
  it("supports case sensitivity, one occurrence and literal replacement dollars", () => {
    expect(matchCount("AI ai", "AI")).toBe(2);
    expect(matchCount("AI ai", "AI", true)).toBe(1);
    expect(replaceLiteral("AI ai", "ai", "$&", false, false)).toBe("$& ai");
    expect(replaceLiteral("AI ai", "ai", "")).toBe(" ");
    expect(replaceLiteral("abc", "", "x")).toBe("abc");
  });
  it("flags unfinished links, headings, placeholders and open code fences", () => {
    expect(writingChecks("# 标题\n[资料](https://)\nTODO\n```js")).toHaveLength(
      4,
    );
    expect(
      writingChecks("## 正文\n\n已核对的内容。\n```js\nx\n```"),
    ).toHaveLength(0);
  });
});
describe("content revision history", () => {
  it("deduplicates saves with no meaningful change", () => {
    const { store } = setup();
    store.save("posts", "p", article);
    store.save("posts", "p", article);
    expect(store.history.list("posts", "p")).toHaveLength(1);
  });
  it("restores into draft and leaves the published snapshot unchanged", () => {
    const { store } = setup();
    store.save("posts", "p", article, "publish");
    const old = store.history.list("posts", "p")[0];
    store.save("posts", "p", { ...article, body: { zh: "新的草稿", en: "" } });
    store.restore("posts", "p", old.id);
    expect(store.get("posts", "p").body.zh).toBe("最初的正文");
    expect(store.get("posts", "p", true).body.zh).toBe("最初的正文");
    expect(store.get("posts", "p", true).hasDraft).toBe(true);
    expect(
      store.history
        .list("posts", "p")
        .some((r: { characters: number }) => r.characters === 5),
    ).toBe(true);
  });
  it("preserves current slug and rejects revisions from a different item", () => {
    const { store } = setup();
    store.save("posts", "p", article);
    const revision = store.history.list("posts", "p")[0];
    store.save("posts", "p", { ...article, slug: "renamed" });
    expect(store.restore("posts", "p", revision.id).slug).toBe("renamed");
    store.save("posts", "other", { ...article, slug: "other" });
    expect(() => store.restore("posts", "other", revision.id)).toThrow(
      "不属于",
    );
  });
  it("retains the most recent 60 versions and persists across store recreation", () => {
    const { db, store } = setup();
    for (let n = 0; n < 70; n++)
      store.save("posts", "p", {
        ...article,
        body: { zh: `正文 ${n}`, en: "" },
      });
    const next = createContentStore(db);
    expect(next.history.list("posts", "p")).toHaveLength(60);
    expect(
      next.history.get("posts", "p", next.history.list("posts", "p")[0].id).body
        .zh,
    ).toBe("正文 69");
  });
  it("deletes only the selected item history and rolls back invalid saves", () => {
    const { store } = setup();
    store.save("posts", "p", article);
    store.save("posts", "other", { ...article, slug: "other" });
    expect(() =>
      store.save(
        "posts",
        "p",
        { ...article, body: { zh: "", en: "" } },
        "publish",
      ),
    ).toThrow("正文");
    expect(store.history.list("posts", "p")).toHaveLength(1);
    store.remove("posts", "p");
    expect(store.history.list("posts", "p")).toHaveLength(0);
    expect(store.history.list("posts", "other")).toHaveLength(1);
  });
});
