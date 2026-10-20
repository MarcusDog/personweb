const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const escapeXml = (value) =>
  String(value ?? "").replace(
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
const local = (value) =>
  typeof value === "string" ? value : value?.zh || value?.en || "";
let renderer;
async function buildFeed({ posts, books, origin, mode = "all" }) {
  renderer ||= Promise.all([import("react-markdown"), import("remark-gfm")]);
  const [{ default: Markdown, defaultUrlTransform }, { default: gfm }] =
    await renderer;
  const path =
    mode === "articles"
      ? "/feeds/articles.xml"
      : mode === "reading"
        ? "/feeds/reading.xml"
        : "/rss.xml";
  const title =
    mode === "articles"
      ? "小天Aya · 文章"
      : mode === "reading"
        ? "小天Aya · 读书"
        : "小天Aya · 文章与读书";
  const entries = [
    ...(mode === "reading"
      ? []
      : posts.map((p) => ({
          ...p,
          type: "article",
          link: `${origin}/journal/${encodeURIComponent(p.slug)}`,
          heading: local(p.title),
          summary: local(p.standfirst),
          updated: p.updatedAt || p.date,
        }))),
    ...(mode === "articles"
      ? []
      : books.map((b) => ({
          ...b,
          type: "book",
          link: `${origin}/reading?book=${encodeURIComponent(b.slug)}`,
          heading: `读书 · ${local(b.title)}`,
          summary: `${b.author || ""} · ${{ wish: "想读", reading: "在读", read: "已读" }[b.readingStatus] || "书目"}`,
          updated: b.updatedAt || b.date,
        }))),
  ]
    .sort((a, b) => String(b.updated).localeCompare(String(a.updated)))
    .slice(0, 100);
  const items = entries
    .map((entry) => {
      const body =
        entry.type === "book"
          ? `${entry.summary}\n\n${local(entry.body)}`
          : local(entry.body);
      const html = renderToStaticMarkup(
        React.createElement(
          Markdown,
          {
            remarkPlugins: [gfm],
            skipHtml: true,
            urlTransform: (url) => {
              const safe = defaultUrlTransform(url);
              return safe.startsWith("/") ? origin + safe : safe;
            },
          },
          body,
        ),
      );
      const date = new Date(entry.updated);
      const pubDate = Number.isNaN(date.getTime())
        ? ""
        : `<pubDate>${date.toUTCString()}</pubDate>`;
      const guid =
        entry.type === "article"
          ? entry.link
          : `aya:book:${entry.id || entry.slug}`;
      return `<item><title>${escapeXml(entry.heading)}</title><link>${escapeXml(entry.link)}</link><guid isPermaLink="${entry.type === "article"}">${escapeXml(guid)}</guid><category>${entry.type === "book" ? "读书" : "文章"}</category><description>${escapeXml(entry.summary)}</description><content:encoded>${escapeXml(html)}</content:encoded>${pubDate}</item>`;
    })
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${escapeXml(title)}</title><link>${escapeXml(origin)}</link><description>AI、项目、阅读与生活中的记录。书目状态如实标注。</description><language>zh-cn</language><atom:link href="${escapeXml(origin + path)}" rel="self" type="application/rss+xml"/>${items}</channel></rss>`;
}
module.exports = { buildFeed };
