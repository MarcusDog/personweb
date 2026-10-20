// @vitest-environment node
import { createRequire } from "node:module";
import { describe, it, expect, afterEach, vi } from "vitest";
const require = createRequire(import.meta.url);
const Database = require("better-sqlite3");
const {
  createCoverLookup,
  validISBN,
  backfillCovers,
  curatedCover,
} = require("../../server/book-covers.cjs");
const { createContentStore } = require("../../server/garden-cms.cjs");
const { seedEditorial } = require("../../server/editorial-seed.cjs");
const databases: ReturnType<typeof Database>[] = [];
const setup = () => {
  const db = new Database(":memory:");
  databases.push(db);
  return db;
};
afterEach(() => {
  databases.forEach((db) => db.close());
  databases.length = 0;
});
describe("real book cover lookup", () => {
  it("validates ISBN checksum, not only length", () => {
    expect(validISBN("978-1449373320")).toBe("9781449373320");
    expect(validISBN("9781449373321")).toBe("");
    expect(validISBN("0300078153")).toBe("0300078153");
  });
  it("uses ISBN edition and persists successful lookup cache", async () => {
    const fetcher = vi.fn(async () =>
      Response.json({
        title: "A real title",
        key: "/books/OL123M",
        covers: [123],
        publishers: ["Publisher"],
        publish_date: "2020",
      }),
    );
    const lookup = createCoverLookup({ db: setup(), fetcher });
    const result = await lookup({ isbn: "9781449373320" });
    expect(result.status).toBe("matched");
    expect(result.candidates[0].coverMatch).toBe("confirmed");
    expect(result.candidates[0].coverImage).toBe(
      "https://covers.openlibrary.org/b/id/123-L.jpg?default=false",
    );
    expect((await lookup({ isbn: "9781449373320" })).cached).toBe(true);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it("requires confirmation if multiple editions remain, even for an exact work", async () => {
    const lookup = createCoverLookup({
      db: setup(),
      fetcher: async () =>
        Response.json({
          docs: [
            {
              title: "Book",
              author_name: ["Writer"],
              cover_i: 123,
              key: "/works/OL1W",
              edition_key: ["OL1M", "OL2M"],
            },
          ],
        }),
    });
    expect((await lookup({ title: "Book", author: "Writer" })).status).toBe(
      "ambiguous",
    );
  });
  it("automatically adopts only a unique exact title, author and edition", async () => {
    const lookup = createCoverLookup({
      db: setup(),
      fetcher: async () =>
        Response.json({
          docs: [
            {
              title: "Book",
              author_name: ["Writer"],
              cover_i: 123,
              key: "/works/OL1W",
              edition_key: ["OL1M"],
            },
          ],
        }),
    });
    expect((await lookup({ title: "Book", author: "Writer" })).status).toBe(
      "matched",
    );
  });
  it("handles upstream quota and timeout without poisoning the cache", async () => {
    const db = setup();
    await expect(
      createCoverLookup({
        db,
        fetcher: async () => new Response("", { status: 429 }),
      })({ title: "Book", author: "Writer" }),
    ).rejects.toMatchObject({ status: 429 });
    await expect(
      createCoverLookup({
        db,
        fetcher: async () => {
          throw Error("timeout");
        },
      })({ title: "Book", author: "Writer" }),
    ).rejects.toMatchObject({ status: 504 });
    expect(
      db.prepare("SELECT COUNT(*) AS n FROM garden_cover_cache").get().n,
    ).toBe(0);
  });
  it("does not query Google Books without an explicitly configured key", async () => {
    const fetcher = vi.fn(async () => Response.json({ docs: [] }));
    expect(
      (
        await createCoverLookup({ db: setup(), fetcher, googleKey: "" })({
          title: "Book",
          author: "Writer",
        })
      ).status,
    ).toBe("missing");
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it("fills only missing cover metadata, without changing public timestamps or drafts", () => {
    const db = setup(),
      store = createContentStore(db);
    seedEditorial(db, store);
    const book = store.list("books")[0];
    const published = store.get("books", book.id);
    const old = {
      ...published,
      coverImage: "",
      coverMatch: "missing",
      body: { zh: "我自己的笔记", en: "" },
      progress: 0,
    };
    db.prepare("UPDATE garden_content SET published=?,draft=? WHERE id=?").run(
      JSON.stringify(old),
      JSON.stringify({
        ...old,
        coverImage: "/uploads/my-cover.webp",
        coverOrigin: "manual",
        coverMatch: "confirmed",
      }),
      book.id,
    );
    backfillCovers(db);
    backfillCovers(db);
    const next = store.get("books", book.id);
    expect(next.coverImage).toContain("covers.openlibrary.org");
    expect(next.body.zh).toBe("我自己的笔记");
    expect(next.updatedAt).toBe(published.updatedAt);
    expect(store.get("books", book.id, true).coverImage).toBe(
      "/uploads/my-cover.webp",
    );
    expect(store.list("books")).toHaveLength(6);
  });
  it("saves incomplete drafts but requires a confirmed real cover to publish", () => {
    const store = createContentStore(setup());
    const book = { slug: "new-book", title: { zh: "书" }, author: "作者" };
    expect(() => store.save("books", "new", book, "draft")).not.toThrow();
    expect(() => store.save("books", "new", book, "publish")).toThrow(
      "真实封面",
    );
    expect(() =>
      store.save(
        "books",
        "new",
        { ...book, ...curatedCover("ai-engineering") },
        "publish",
      ),
    ).not.toThrow();
  });
});
