const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const sharp = require("sharp");
const KINDS = ["posts", "projects", "notes", "books"];
const defaults = {
  name: "小天Aya",
  intro: {
    zh: "喜欢研究 AI，也喜欢把脑海里的想法，做成真正能用的小东西。",
    en: "Exploring AI and turning the ideas in my head into useful little things.",
  },
  about: {
    zh: "我是小天，一个独立开发者。我做 AI 工具，也写下开发中遇到的问题和自己的判断。这里收着我的项目、读书笔记，以及一些还在慢慢想的事。",
    en: "I am Tian, an independent developer. I build AI tools and write about the decisions, questions, and everyday experiences along the way.",
  },
  homeProjects: ["shizaolu", "voicedesk", "ainews-platform", "flow-socket"],
};
const parse = (value) => (value ? JSON.parse(value) : null);
const escapeXml = (value) =>
  String(value || "").replace(
    /[<>&"']/g,
    (c) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[c],
  );
function createContentStore(db, seeds = []) {
  db.exec(`CREATE TABLE IF NOT EXISTS garden_content(kind TEXT NOT NULL,id TEXT PRIMARY KEY,slug TEXT NOT NULL,published TEXT,draft TEXT,updated_at TEXT NOT NULL,UNIQUE(kind,slug));
    CREATE TABLE IF NOT EXISTS garden_meta(key TEXT PRIMARY KEY,value TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS garden_media(id TEXT PRIMARY KEY,data TEXT NOT NULL);`);
  const history = require("./studio-history.cjs").createHistory(db);
  const read = (row, admin = false) => {
    if (!row) return null;
    const content = parse(admin ? row.draft || row.published : row.published);
    return content
      ? {
          ...content,
          id: row.id,
          slug: row.slug,
          status: row.published ? "published" : "draft",
          hasDraft: !!row.draft,
          updatedAt: admin
            ? row.updated_at
            : content.updatedAt || row.updated_at,
        }
      : null;
  };
  const list = (kind, admin = false) =>
    db
      .prepare(
        `SELECT * FROM garden_content WHERE kind=? ${admin ? "" : "AND published IS NOT NULL"} ORDER BY updated_at DESC`,
      )
      .all(kind)
      .map((r) => read(r, admin))
      .sort((a, b) =>
        kind === "projects"
          ? (a.order ?? 999) - (b.order ?? 999)
          : String(b.date || b.updatedAt).localeCompare(
              String(a.date || a.updatedAt),
            ),
      );
  const get = (kind, id, admin = false) =>
    read(
      db
        .prepare(
          "SELECT * FROM garden_content WHERE kind=? AND (id=? OR slug=?)",
        )
        .get(kind, id, id),
      admin,
    );
  const save = (kind, id, value, action = "draft") => {
    if (!KINDS.includes(kind)) throw new Error("不支持的内容类型");
    if (!["draft", "publish", "unpublish"].includes(action))
      throw new Error("保存操作无效");
    const old = db
      .prepare("SELECT * FROM garden_content WHERE kind=? AND id=?")
      .get(kind, id);
    const slug = String(value.slug || old?.slug || id).trim();
    if (old?.published && slug !== old.slug)
      throw new Error("已发布内容的链接不能直接修改，以免原有链接失效");
    if (!/^[\p{L}\p{N}][\p{L}\p{N}_-]*$/u.test(slug))
      throw new Error("链接只支持文字、数字、横线和下划线");
    const title =
      typeof value.title === "string"
        ? value.title
        : value.title?.zh || value.title?.en;
    if (action === "publish" && kind !== "notes" && !String(title || "").trim())
      throw new Error("请填写标题");
    if (
      action === "publish" &&
      (kind === "posts" || kind === "notes") &&
      !String(value.body?.zh || value.body?.en || "").trim()
    )
      throw new Error("请填写正文");
    if (value.coverImage && !/^(\/[^/]|https?:\/\/)/i.test(value.coverImage))
      throw new Error("封面地址无效");
    if (
      kind === "books" &&
      action === "publish" &&
      (!value.coverImage || value.coverMatch !== "confirmed")
    )
      throw new Error("发布书籍前，请确认真实封面；你仍然可以保存草稿。");
    if (value.date && Number.isNaN(Date.parse(value.date)))
      throw new Error("日期无效");
    for (const link of value.externalLinks || [])
      if (!/^https?:\/\//i.test(link.url))
        throw new Error("项目外链需要完整的 http 或 https 地址");
    const clean = {
      ...value,
      id,
      slug,
      date:
        value.date ||
        new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Shanghai" }),
      updatedAt: new Date().toISOString(),
    };
    delete clean.hasDraft;
    delete clean.action;
    const serialized = JSON.stringify(clean);
    const published =
      action === "publish"
        ? serialized
        : action === "unpublish"
          ? null
          : old?.published || null;
    const draft = action === "publish" ? null : serialized;
    db.transaction(() => {
      history.capture(
        kind,
        id,
        parse(old?.draft || old?.published),
        old?.draft ? "draft" : "publish",
      );
      db.prepare(
        `INSERT INTO garden_content(kind,id,slug,published,draft,updated_at) VALUES(?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET slug=excluded.slug,published=excluded.published,draft=excluded.draft,updated_at=excluded.updated_at`,
      ).run(kind, id, slug, published, draft, new Date().toISOString());
      history.capture(kind, id, clean, action);
    })();
    return get(kind, id, true);
  };
  if (!db.prepare("SELECT key FROM garden_meta WHERE key='import-v1'").get()) {
    db.transaction(() => {
      const exists = db
        .prepare(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='journal_posts'",
        )
        .get();
      if (exists)
        for (const row of db.prepare("SELECT * FROM journal_posts").all()) {
          const p = {
            id: row.id,
            slug: row.slug,
            date: row.date,
            title: { zh: row.title_zh, en: row.title_en },
            category: { zh: row.category_zh, en: row.category_en },
            standfirst: { zh: row.standfirst_zh, en: row.standfirst_en },
            body: { zh: row.body_zh, en: row.body_en },
            tags: parse(row.tags) || [],
            coverImage: row.cover_image || undefined,
            featured: row.slug === "durable-agent-systems",
          };
          save(
            "posts",
            row.id,
            p,
            row.status === "published" ? "publish" : "draft",
          );
        }
      for (const p of seeds) save("projects", p.id || p.slug, p, "publish");
      db.prepare(
        "INSERT INTO garden_meta(key,value) VALUES('import-v1','1')",
      ).run();
    })();
  }
  return {
    list,
    get,
    save,
    history,
    restore: (kind, id, revisionId) => {
      const current = get(kind, id, true),
        snapshot = history.get(kind, id, revisionId);
      if (!current || !snapshot)
        throw Error("这个版本不存在，或不属于当前内容");
      return save(kind, id, { ...snapshot, slug: current.slug }, "draft");
    },
    remove: (kind, id) =>
      db.transaction(() => {
        const result = db
          .prepare("DELETE FROM garden_content WHERE kind=? AND id=?")
          .run(kind, id);
        history.remove(kind, id);
        return result;
      })(),
    settings: () => ({
      ...defaults,
      ...parse(
        db.prepare("SELECT value FROM garden_meta WHERE key='settings'").get()
          ?.value,
      ),
    }),
  };
}

function installGardenCms({
  app,
  db,
  requireAdmin,
  rootDir,
  callEditorialModel,
  buildEditorialMessages,
  llmConfig,
}) {
  const seed = JSON.parse(
    fs.readFileSync(path.join(__dirname, "project-seed.json"), "utf8"),
  );
  const store = createContentStore(db, seed);
  require("./editorial-seed.cjs").seedEditorial(db, store);
  require("./book-covers.cjs").backfillCovers(db);
  require("./book-covers.cjs").installCoverLookup(app, db, requireAdmin);
  const ok = (res, data) => res.json({ success: true, data });
  const handler = (fn) => (req, res) => {
    try {
      fn(req, res);
    } catch (e) {
      res.status(e.code === "SQLITE_CONSTRAINT_UNIQUE" ? 409 : 400).json({
        success: false,
        error:
          e.code === "SQLITE_CONSTRAINT_UNIQUE"
            ? "这个链接已经存在，请换一个"
            : e.message,
      });
    }
  };
  app.use("/api", (_req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  });
  app.get("/api/site", (_req, res) =>
    ok(res, {
      posts: store.list("posts"),
      projects: store.list("projects"),
      notes: store.list("notes"),
      books: store.list("books"),
      settings: store.settings(),
    }),
  );
  // Older clients and the new studio share the same published/draft snapshots.
  const legacyPost = (value) =>
    value.title
      ? value
      : {
          slug: value.slug,
          date: value.date,
          title: { zh: value.titleZh || "", en: value.titleEn || "" },
          category: { zh: value.categoryZh || "", en: value.categoryEn || "" },
          standfirst: {
            zh: value.standfirstZh || "",
            en: value.standfirstEn || "",
          },
          body: { zh: value.bodyZh || "", en: value.bodyEn || "" },
          tags: Array.isArray(value.tags)
            ? value.tags
            : String(value.tags || "")
                .split(/[,，]/)
                .filter(Boolean),
          coverImage: value.coverImage || "",
        };
  app.get("/api/admin/posts", requireAdmin, (_req, res) =>
    ok(res, store.list("posts", true)),
  );
  app.post(
    "/api/admin/posts",
    requireAdmin,
    handler((req, res) =>
      ok(
        res,
        store.save(
          "posts",
          crypto.randomUUID(),
          legacyPost(req.body),
          req.body.status === "published" ? "publish" : "draft",
        ),
      ),
    ),
  );
  app.put(
    "/api/admin/posts/:id",
    requireAdmin,
    handler((req, res) => {
      if (!store.get("posts", req.params.id, true))
        return res.status(404).json({ success: false, error: "文章不存在" });
      ok(
        res,
        store.save(
          "posts",
          req.params.id,
          legacyPost(req.body),
          req.body.status === "published" ? "publish" : "draft",
        ),
      );
    }),
  );
  app.delete(
    "/api/admin/posts/:id",
    requireAdmin,
    handler((req, res) => {
      if (!store.remove("posts", req.params.id).changes)
        return res.status(404).json({ success: false, error: "文章不存在" });
      ok(res, true);
    }),
  );
  app.get("/api/journal", (_req, res) => ok(res, store.list("posts")));
  app.get("/api/journal/:slug", (req, res) => {
    const p = store.get("posts", req.params.slug);
    return p
      ? ok(res, p)
      : res.status(404).json({ success: false, error: "文章不存在" });
  });
  app.get(
    "/api/admin/content/:kind/:id/revisions",
    requireAdmin,
    handler((req, res) => {
      if (!store.get(req.params.kind, req.params.id, true))
        return res.status(404).json({ success: false, error: "内容不存在" });
      ok(res, store.history.list(req.params.kind, req.params.id));
    }),
  );
  app.get(
    "/api/admin/content/:kind/:id/revisions/:revisionId",
    requireAdmin,
    handler((req, res) => {
      const value = store.history.get(
        req.params.kind,
        req.params.id,
        req.params.revisionId,
      );
      if (!store.get(req.params.kind, req.params.id, true) || !value)
        return res.status(404).json({ success: false, error: "版本不存在" });
      ok(res, value);
    }),
  );
  app.post(
    "/api/admin/content/:kind/:id/revisions/:revisionId/restore",
    requireAdmin,
    handler((req, res) =>
      ok(
        res,
        store.restore(req.params.kind, req.params.id, req.params.revisionId),
      ),
    ),
  );
  app.post(
    "/api/admin/content/:kind/:id/duplicate",
    requireAdmin,
    handler((req, res) => {
      const original = store.get(req.params.kind, req.params.id, true);
      if (!original)
        return res.status(404).json({ success: false, error: "内容不存在" });
      const id = crypto.randomUUID();
      const copy = {
        ...original,
        slug: `${original.slug}-copy-${id.slice(0, 8)}`,
        title: {
          zh: `${original.title?.zh || "未命名"}（副本）`,
          en: original.title?.en ? `${original.title.en} (copy)` : "",
        },
        date: new Date().toLocaleDateString("en-CA", {
          timeZone: "Asia/Shanghai",
        }),
      };
      ok(res, store.save(req.params.kind, id, copy, "draft"));
    }),
  );
  app.get(
    "/api/admin/export",
    requireAdmin,
    handler((_req, res) => {
      const rows = db
        .prepare(
          "SELECT kind,id,slug,published,draft,updated_at FROM garden_content ORDER BY kind,id",
        )
        .all();
      const contents = Object.fromEntries(
        KINDS.map((kind) => [
          kind,
          rows
            .filter((r) => r.kind === kind)
            .map((r) => ({
              id: r.id,
              slug: r.slug,
              published: parse(r.published),
              draft: parse(r.draft),
              updatedAt: r.updated_at,
            })),
        ]),
      );
      res.set("Cache-Control", "no-store");
      ok(res, {
        schemaVersion: 1,
        exportedAt: new Date().toISOString(),
        settings: store.settings(),
        contents,
      });
    }),
  );
  app.get(
    "/api/admin/content/:kind",
    requireAdmin,
    handler((req, res) => {
      if (!KINDS.includes(req.params.kind)) throw Error("内容类型无效");
      ok(res, store.list(req.params.kind, true));
    }),
  );
  app.post(
    "/api/admin/content/:kind",
    requireAdmin,
    handler((req, res) => {
      const id = crypto.randomUUID();
      ok(
        res,
        store.save(
          req.params.kind,
          id,
          { ...req.body, slug: req.body.slug || `entry-${Date.now()}` },
          req.body.action || "draft",
        ),
      );
    }),
  );
  app.put(
    "/api/admin/content/:kind/:id",
    requireAdmin,
    handler((req, res) => {
      if (!store.get(req.params.kind, req.params.id, true))
        return res.status(404).json({ success: false, error: "内容不存在" });
      ok(
        res,
        store.save(
          req.params.kind,
          req.params.id,
          req.body,
          req.body.action || "draft",
        ),
      );
    }),
  );
  app.delete(
    "/api/admin/content/:kind/:id",
    requireAdmin,
    handler((req, res) => {
      if (!store.remove(req.params.kind, req.params.id).changes)
        return res.status(404).json({ success: false, error: "内容不存在" });
      ok(res, true);
    }),
  );
  app.get("/api/admin/settings", requireAdmin, (_req, res) =>
    ok(res, store.settings()),
  );
  app.put(
    "/api/admin/settings",
    requireAdmin,
    handler((req, res) => {
      const value = {
        ...store.settings(),
        name: String(req.body.name || "小天Aya"),
        intro: req.body.intro || defaults.intro,
        about: req.body.about || defaults.about,
        homeProjects: Array.isArray(req.body.homeProjects)
          ? req.body.homeProjects.map(String).slice(0, 8)
          : defaults.homeProjects,
      };
      db.prepare(
        "INSERT INTO garden_meta(key,value) VALUES('settings',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
      ).run(JSON.stringify(value));
      ok(res, value);
    }),
  );
  const manifestFile = path.join(rootDir, "public/garden/manifest.json");
  const mediaList = () => [
    ...new Map(
      [
        ...(fs.existsSync(manifestFile)
          ? JSON.parse(fs.readFileSync(manifestFile, "utf8"))
          : []),
        ...db
          .prepare("SELECT data FROM garden_media")
          .all()
          .map((r) => parse(r.data)),
      ].map((m) => [m.id, m]),
    ).values(),
  ];
  app.get("/api/admin/media", requireAdmin, (_req, res) =>
    ok(res, mediaList()),
  );
  app.put(
    "/api/admin/media/:id",
    requireAdmin,
    handler((req, res) => {
      const old = mediaList().find((m) => m.id === req.params.id);
      if (!old)
        return res.status(404).json({ success: false, error: "素材不存在" });
      if (
        ![
          "screenshot",
          "design",
          "generated",
          "illustration",
          "upload",
          "concept",
        ].includes(req.body.type)
      )
        throw Error("来源类型无效");
      const value = {
        ...old,
        caption: String(req.body.caption || old.caption),
        projectId: String(req.body.projectId || ""),
        type: req.body.type,
      };
      db.prepare(
        "INSERT INTO garden_media(id,data) VALUES(?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data",
      ).run(old.id, JSON.stringify(value));
      ok(res, value);
    }),
  );
  app.post("/api/admin/upload", requireAdmin, async (req, res) => {
    try {
      const match = String(req.body.dataUrl || "").match(
        /^data:image\/(?:png|jpeg|webp|gif);base64,([A-Za-z0-9+/=]+)$/,
      );
      if (!match) throw Error("请选择 PNG、JPEG、WebP 或 GIF 图片");
      const buffer = Buffer.from(match[1], "base64");
      if (buffer.length > 5 * 1024 * 1024) throw Error("图片不能超过 5MB");
      const meta = await sharp(buffer, {
        limitInputPixels: 40000000,
      }).metadata();
      if (!meta.width || !meta.height) throw Error("无法读取图片");
      if (!["png", "jpeg", "webp", "gif"].includes(meta.format))
        throw Error("图片实际格式不支持，请使用 PNG、JPEG、WebP 或 GIF");
      const id = crypto.randomUUID();
      const upload = path.join(rootDir, "public/uploads");
      fs.mkdirSync(upload, { recursive: true });
      const original = `${id}-original.${meta.format === "jpeg" ? "jpg" : meta.format}`;
      fs.writeFileSync(path.join(upload, original), buffer);
      await sharp(buffer)
        .rotate()
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 86 })
        .toFile(path.join(upload, `${id}.webp`));
      const data = {
        id,
        url: `/uploads/${id}.webp`,
        original: `/uploads/${original}`,
        width: meta.width,
        height: meta.height,
        type: req.body.sourceType || "upload",
        caption: String(req.body.caption || "上传图片"),
        projectId: String(req.body.projectId || ""),
      };
      db.prepare("INSERT INTO garden_media(id,data) VALUES(?,?)").run(
        id,
        JSON.stringify(data),
      );
      res.status(201).json({ success: true, data });
    } catch (e) {
      res
        .status(400)
        .json({ success: false, error: e.message || "图片上传失败" });
    }
  });
  app.patch(
    "/api/admin/contacts/:id",
    requireAdmin,
    handler((req, res) => {
      if (!["read", "unread"].includes(req.body.status))
        throw Error("状态无效");
      db.prepare("UPDATE contacts SET status=? WHERE id=?").run(
        req.body.status,
        req.params.id,
      );
      ok(res, true);
    }),
  );
  app.post("/api/admin/llm/test", requireAdmin, async (_req, res) => {
    if (!llmConfig.apiKey || !llmConfig.model)
      return res.status(503).json({
        success: false,
        error: "请在服务端配置 LLM_API_KEY 和 LLM_MODEL",
      });
    try {
      await callEditorialModel(
        buildEditorialMessages({
          task: "format",
          language: "zh",
          title: "连接测试",
          body: "这是一段连接测试。",
          tags: [],
        }),
      );
      ok(res, { connected: true, model: llmConfig.model });
    } catch (e) {
      res.status(502).json({ success: false, error: e.message });
    }
  });
  const origin = () =>
    String(process.env.SITE_URL || "https://xiaotianaya.com").replace(
      /\/$/,
      "",
    );
  const { buildFeed } = require("./garden-feeds.cjs");
  for (const [route, mode] of [
    ["/rss.xml", "all"],
    ["/feeds/articles.xml", "articles"],
    ["/feeds/reading.xml", "reading"],
  ]) {
    app.get(route, async (_req, res) => {
      try {
        const xml = await buildFeed({
          posts: store.list("posts"),
          books: store.list("books"),
          origin: origin(),
          mode,
        });
        res
          .type("application/rss+xml")
          .set("Cache-Control", "no-cache")
          .send(xml);
      } catch (error) {
        console.error("Feed rendering failed:", error.message);
        res
          .status(500)
          .type("text/plain")
          .send("订阅源暂时不可用，请稍后重试。");
      }
    });
  }
  app.get("/sitemap.xml", (_req, res) => {
    const urls = [
      "/",
      "/journal",
      "/projects",
      "/notes",
      "/reading",
      "/about",
      "/commercial",
      "/contact",
      "/subscribe",
      ...store
        .list("posts")
        .map((p) => `/journal/${encodeURIComponent(p.slug)}`),
      ...store
        .list("projects")
        .map((p) => `/projects/${encodeURIComponent(p.slug)}`),
    ];
    res
      .type("application/xml")
      .set("Cache-Control", "no-cache")
      .send(
        `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((u) => `<url><loc>${escapeXml(origin() + u)}</loc></url>`).join("")}</urlset>`,
      );
  });
  return store;
}
module.exports = { createContentStore, installGardenCms, defaults };
