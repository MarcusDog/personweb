const crypto = require("node:crypto");

// Individually checked ISBN editions; these are metadata, never mirrored images.
const curated = {
  "ai-engineering": [
    "9781098166304",
    15091156,
    "OL54058212M",
    "AI Engineering",
    "英文版 · O’Reilly",
  ],
  "designing-ml-systems": [
    "9781098107963",
    13314480,
    "OL36277220M",
    "Designing Machine Learning Systems",
    "英文版 · O’Reilly · 2022",
  ],
  "data-intensive-applications": [
    "9781449373320",
    8434671,
    "OL26780701M",
    "Designing Data-Intensive Applications",
    "英文第 1 版 · O’Reilly · 2017",
  ],
  "design-everyday-things": [
    "9780262525671",
    8749094,
    "OL27255111M",
    "The Design of Everyday Things",
    "英文修订版 · MIT Press · 2014",
  ],
  "how-to-do-nothing": [
    "9781612197494",
    8750439,
    "OL27258148M",
    "How to Do Nothing",
    "英文版 · Melville House · 2019",
  ],
  "seeing-like-a-state": [
    "9780300078152",
    8290759,
    "OL9626676M",
    "Seeing Like a State",
    "英文版 · Yale University Press · 1999",
  ],
};
function curatedCover(slug) {
  const item = curated[slug];
  if (!item) return {};
  const [isbn, cover, edition, originalTitle, coverEdition] = item;
  return {
    isbn,
    originalTitle,
    coverEdition,
    coverImage: `https://covers.openlibrary.org/b/id/${cover}-L.jpg?default=false`,
    coverSource: "Open Library",
    coverSourceUrl: `https://openlibrary.org/books/${edition}`,
    coverMatch: "confirmed",
    coverOrigin: "lookup",
  };
}
function backfillCovers(db) {
  const marker = "book-covers-v1";
  if (db.prepare("SELECT key FROM garden_meta WHERE key=?").get(marker)) return;
  const update = db.prepare(
    "UPDATE garden_content SET published=?,draft=? WHERE id=? AND kind='books'",
  );
  db.transaction(() => {
    for (const row of db
      .prepare("SELECT * FROM garden_content WHERE kind='books'")
      .all()) {
      // Only the six original seeds, only missing cover fields; never rewrite user content.
      if (row.id !== `reading-${row.slug}` || !curated[row.slug]) continue;
      const seed = require("./editorial-seed.cjs").books.find(
        (b) => b.slug === row.slug,
      );
      let touched = false;
      const fill = (raw) => {
        if (!raw) return raw;
        const value = JSON.parse(raw);
        if (
          value.coverImage ||
          value.coverOrigin === "manual" ||
          value.author !== seed?.author ||
          value.title?.zh !== seed?.title.zh
        )
          return raw;
        touched = true;
        return JSON.stringify({
          ...curatedCover(row.slug),
          ...value,
          coverImage: curatedCover(row.slug).coverImage,
          coverSource: "Open Library",
          coverSourceUrl: curatedCover(row.slug).coverSourceUrl,
          coverMatch: "confirmed",
          coverOrigin: "lookup",
        });
      };
      const published = fill(row.published),
        draft = fill(row.draft);
      if (touched) update.run(published, draft, row.id);
    }
    db.prepare("INSERT INTO garden_meta(key,value) VALUES(?,?)").run(
      marker,
      "1",
    );
  })();
}
const normalize = (value) =>
  String(value || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, "");
function validISBN(raw) {
  const isbn = String(raw || "")
    .replace(/[\s-]/g, "")
    .toUpperCase();
  if (/^\d{13}$/.test(isbn))
    return [...isbn].reduce((n, c, i) => n + Number(c) * (i % 2 ? 3 : 1), 0) %
      10 ===
      0
      ? isbn
      : "";
  if (/^\d{9}[\dX]$/.test(isbn))
    return [...isbn].reduce(
      (n, c, i) => n + (c === "X" ? 10 : Number(c)) * (10 - i),
      0,
    ) %
      11 ===
      0
      ? isbn
      : "";
  return "";
}
function createCoverLookup({
  db,
  fetcher = fetch,
  timeout = 8000,
  googleKey = process.env.GOOGLE_BOOKS_API_KEY || "",
  now = Date.now,
} = {}) {
  db.exec(
    "CREATE TABLE IF NOT EXISTS garden_cover_cache(key TEXT PRIMARY KEY,value TEXT NOT NULL,expires INTEGER NOT NULL)",
  );
  const inflight = new Map();
  let nextRequest = 0;
  async function json(url) {
    const wait = Math.max(0, nextRequest - now());
    nextRequest = Math.max(nextRequest, now()) + 1100;
    if (wait) await new Promise((resolve) => setTimeout(resolve, wait));
    let response;
    try {
      response = await fetcher(url, {
        signal: AbortSignal.timeout(timeout),
        headers: {
          Accept: "application/json",
          "User-Agent":
            "AyaPersonalGarden/1.0 (book cover lookup; https://xiaotianaya.com)",
        },
      });
    } catch {
      throw Object.assign(
        Error("书封服务连接超时，请稍后重试，或补充 ISBN / 手动上传。"),
        { status: 504 },
      );
    }
    if (response.status === 404) return null;
    if (response.status === 429 || response.status === 403)
      throw Object.assign(
        Error("书封来源暂时限流，请稍后重试；草稿仍可保存。"),
        { status: 429 },
      );
    if (!response.ok)
      throw Object.assign(Error("书封来源暂时不可用，请稍后重试。"), {
        status: 502,
      });
    return response.json();
  }
  async function query({ isbn, title, author }) {
    if (isbn) {
      const book = await json(`https://openlibrary.org/isbn/${isbn}.json`);
      if (book?.covers?.some((id) => id > 0)) {
        const cover = book.covers.find((id) => id > 0);
        return {
          status: "matched",
          candidates: [
            {
              isbn,
              title: book.title,
              author,
              coverEdition: [...(book.publishers || []), book.publish_date]
                .filter(Boolean)
                .join(" · "),
              coverImage: `https://covers.openlibrary.org/b/id/${cover}-L.jpg?default=false`,
              coverSource: "Open Library",
              coverSourceUrl: `https://openlibrary.org${book.key}`,
              coverMatch: "confirmed",
              coverOrigin: "lookup",
            },
          ],
        };
      }
    } else {
      const search = new URLSearchParams({
        title,
        author,
        limit: "6",
        fields: "key,title,author_name,cover_i,edition_key",
      });
      const result = await json(
        `https://openlibrary.org/search.json?${search}`,
      );
      const docs = (result?.docs || []).filter((d) => d.cover_i > 0);
      const candidates = docs.map((d) => ({
        title: d.title,
        author: (d.author_name || []).join(", "),
        coverImage: `https://covers.openlibrary.org/b/id/${d.cover_i}-L.jpg?default=false`,
        coverSource: "Open Library",
        coverSourceUrl: `https://openlibrary.org${d.key}`,
        coverEdition: "版本待确认，请对照 ISBN",
        coverMatch: "ambiguous",
        coverOrigin: "lookup",
      }));
      const exact =
        docs.length === 1 &&
        normalize(docs[0].title) === normalize(title) &&
        (docs[0].author_name || []).some(
          (a) => normalize(a) === normalize(author),
        ) &&
        docs[0].edition_key?.length === 1;
      if (exact) {
        candidates[0].coverMatch = "confirmed";
        candidates[0].coverEdition = "唯一匹配版本";
      }
      if (candidates.length)
        return { status: exact ? "matched" : "ambiguous", candidates };
    }
    if (googleKey) {
      const q = isbn ? `isbn:${isbn}` : `intitle:${title} inauthor:${author}`;
      const result = await json(
        `https://www.googleapis.com/books/v1/volumes?${new URLSearchParams({ q, key: googleKey, maxResults: "5" })}`,
      );
      const candidates = (result?.items || [])
        .filter((x) => x.volumeInfo?.imageLinks?.thumbnail)
        .map((x) => {
          const b = x.volumeInfo;
          return {
            title: b.title,
            author: (b.authors || []).join(", "),
            coverImage: b.imageLinks.thumbnail.replace(/^http:/, "https:"),
            coverSource: "Google Books",
            coverSourceUrl: `https://books.google.com/books?id=${encodeURIComponent(x.id)}`,
            coverEdition: [b.publisher, b.publishedDate]
              .filter(Boolean)
              .join(" · "),
            coverMatch: "ambiguous",
            coverOrigin: "lookup",
          };
        })
        .filter((x) =>
          /^https:\/\/(books\.google\.com|books\.googleusercontent\.com)\//.test(
            x.coverImage,
          ),
        );
      if (candidates.length) return { status: "ambiguous", candidates };
    }
    return { status: "missing", candidates: [] };
  }
  return async (input) => {
    const rawISBN = String(input.isbn || "").trim(),
      isbn = validISBN(rawISBN);
    const title = String(input.originalTitle || input.title || "")
        .trim()
        .slice(0, 200),
      author = String(input.author || "")
        .trim()
        .slice(0, 120);
    if (rawISBN && !isbn)
      throw Object.assign(Error("ISBN 格式或校验位不正确，请检查。"), {
        status: 400,
      });
    if (!isbn && (!title || !author))
      throw Object.assign(Error("请提供 ISBN，或填写书名和作者。"), {
        status: 400,
      });
    const key = crypto
      .createHash("sha256")
      .update(
        JSON.stringify({
          isbn,
          title: normalize(title),
          author: normalize(author),
        }),
      )
      .digest("hex");
    const cached = db
      .prepare("SELECT value FROM garden_cover_cache WHERE key=? AND expires>?")
      .get(key, now());
    if (cached) return { ...JSON.parse(cached.value), cached: true };
    if (inflight.has(key)) return inflight.get(key);
    const pending = query({ isbn, title, author })
      .then((value) => {
        db.prepare(
          "INSERT INTO garden_cover_cache(key,value,expires) VALUES(?,?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,expires=excluded.expires",
        ).run(
          key,
          JSON.stringify(value),
          now() + (value.status === "missing" ? 3600000 : 86400000),
        );
        return value;
      })
      .finally(() => inflight.delete(key));
    inflight.set(key, pending);
    return pending;
  };
}
function installCoverLookup(app, db, requireAdmin) {
  const lookup = createCoverLookup({ db });
  const windows = new Map();
  app.post("/api/admin/books/cover-lookup", requireAdmin, async (req, res) => {
    const key = req.ip,
      stamp = Date.now();
    let limit = windows.get(key);
    if (!limit || stamp - limit.start > 60000) {
      limit = { start: stamp, count: 0 };
      windows.set(key, limit);
    }
    if (++limit.count > 12)
      return res
        .status(429)
        .set("Retry-After", "60")
        .json({ success: false, error: "每分钟最多查询 12 次，请稍后重试。" });
    for (const [ip, value] of windows)
      if (stamp - value.start > 60000) windows.delete(ip);
    try {
      res.json({ success: true, data: await lookup(req.body) });
    } catch (error) {
      if (error.status === 429) res.set("Retry-After", "60");
      res
        .status(error.status || 502)
        .json({ success: false, error: error.message });
    }
  });
}
module.exports = {
  curatedCover,
  backfillCovers,
  validISBN,
  createCoverLookup,
  installCoverLookup,
};
