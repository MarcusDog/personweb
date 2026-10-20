import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  BookOpen,
  FileText,
  FolderOpen,
  Home,
  ImagePlus,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Plus,
  Settings2,
  StickyNote,
  ArrowLeft,
  Upload,
  X,
  Maximize2,
  Minimize2,
  Code2,
  Eye,
  Check,
  Circle,
  Copy,
  Mail,
  History,
  Download,
} from "lucide-react";
import type { LocalizedText } from "../types/content";
import { api, useGarden } from "./context";
import { coverTypeForMedia, sourceLabel } from "./media";
import { usePageTitle } from "../hooks/usePageTitle";
import { Prose, textFor, uploadImage } from "./components";
import RichEditor, { MediaPicker } from "./RichEditor";
import type { CmsItem, Kind, Media, Settings } from "./types";
import { extractMarkdownHeadings } from "../lib/markdown";
import { writingStats, writingTemplates } from "./writing";
import { markdownDocument } from "./editor-document";
import { BookCoverLookup } from "./BookCoverLookup";
import { WritingTools } from "./WritingTools";
import { RevisionHistory } from "./RevisionHistory";

const kinds: Kind[] = ["posts", "notes", "books", "projects"];
const labels: Record<Kind, string> = {
  posts: "文章",
  notes: "随想",
  books: "书架",
  projects: "项目",
};
type View = Kind | "dashboard" | "media" | "contacts" | "settings";
type Contact = {
  id: string;
  problem: string;
  contact_info: string;
  created_at: string;
  status: string;
  role: string;
  delivery: string;
  timeline: string;
  metadata?: string;
};
type Model = { configured: boolean; model: string | null; endpoint: string };
const localized = (zh = ""): LocalizedText => ({ zh, en: "" });
const today = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Shanghai" });
function fresh(kind: Kind): CmsItem {
  return {
    slug: `${kind}-${Date.now()}`,
    title: localized(),
    body: localized(),
    date: today(),
    tags: [],
    category: localized(),
    standfirst: localized(),
    summary: localized(),
    subtitle: localized(),
    role: localized(),
    challenge: localized(),
    approach: localized(),
    outcome: localized(),
    result: localized(),
    nextStep: localized(),
    year: String(new Date().getFullYear()),
    capabilities: [],
    detailSections: [],
    gallery: [],
    showcaseGroups: [],
    externalLinks: [],
    accent: "sage",
    projectStatus: "开发中",
    readingStatus: "wish",
    progress: 0,
    author: "",
    status: "draft",
  };
}
const request = (method: string, value?: unknown): RequestInit => ({
  method,
  body: value === undefined ? undefined : JSON.stringify(value),
});
function Login({ onLogin }: { onLogin: () => void }) {
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  return (
    <main className="login-page">
      <div className="login-panel">
        <Link className="site-logo" to="/">
          小天Aya
        </Link>
        <p className="eyebrow">PRIVATE STUDIO</p>
        <h1>回来写点什么。</h1>
        <p>文章、随想、书架和项目，都在这里更新。</p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            setBusy(true);
            setError("");
            try {
              await api(
                "/api/admin/login",
                request("POST", {
                  username: form.get("username"),
                  password: form.get("password"),
                }),
              );
              onLogin();
            } catch (err) {
              setError((err as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <label>
            账号
            <input name="username" autoComplete="username" required />
          </label>
          <label>
            密码
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>
          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}
          <button className="button primary" disabled={busy}>
            {busy ? "登录中…" : "登录写作台"}
          </button>
        </form>
        <small>
          私人管理入口，不开放公众注册。首次启动的账号说明见服务器本地凭据文件。
        </small>
        <Link className="text-link" to="/journal">
          ← 返回文章
        </Link>
      </div>
    </main>
  );
}
export function Studio() {
  usePageTitle("写作台｜小天Aya");
  const { refresh } = useGarden(),
    [params, setParams] = useSearchParams();
  const [user, setUser] = useState<string | null>(null),
    [checking, setChecking] = useState(true),
    [error, setError] = useState("");
  const [collections, setCollections] = useState<Record<Kind, CmsItem[]>>({
    posts: [],
    notes: [],
    books: [],
    projects: [],
  });
  const [view, setView] = useState<View>(() =>
    kinds.includes(params.get("kind") as Kind)
      ? (params.get("kind") as Kind)
      : "dashboard",
  );
  const [listQuery, setListQuery] = useState("");
  const [listStatus, setListStatus] = useState("");
  const [selected, setEditing] = useState<{ kind: Kind; item: CmsItem } | null>(
    null,
  );
  const load = useCallback(async () => {
    const all = await Promise.all(
      kinds.map((k) => api<CmsItem[]>(`/api/admin/content/${k}`)),
    );
    setCollections(
      Object.fromEntries(kinds.map((k, i) => [k, all[i]])) as Record<
        Kind,
        CmsItem[]
      >,
    );
  }, []);
  const login = useCallback(async () => {
    try {
      const session = await api<{ authenticated: boolean; username: string }>(
        "/api/admin/session",
      );
      if (session.authenticated) {
        setUser(session.username);
        await load();
        await refresh();
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setChecking(false);
    }
  }, [load, refresh]);
  useEffect(() => {
    // Session loading updates state only after its network request resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void login();
  }, [login]);
  const editId = params.get("edit"),
    kindParam = params.get("kind") as Kind;
  const routeItem =
    editId && kinds.includes(kindParam)
      ? collections[kindParam].find((x) => x.id === editId)
      : null;
  const editing =
    selected || (routeItem ? { kind: kindParam, item: routeItem } : null);
  function navigate(next: View) {
    setEditing(null);
    setView(next);
    setError("");
    setListQuery("");
    setListStatus("");
    setParams(kinds.includes(next as Kind) ? { kind: next } : {});
  }
  async function saved(published: boolean) {
    await load();
    if (published) await refresh();
  }
  async function exportBackup() {
    try {
      const backup = await api("/api/admin/export");
      const url = URL.createObjectURL(
        new Blob([JSON.stringify(backup, null, 2)], {
          type: "application/json;charset=utf-8",
        }),
      );
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `aya-content-backup-${today()}.json`;
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      setError((e as Error).message);
    }
  }
  if (checking)
    return (
      <main className="login-page">
        <p>正在打开写作台…</p>
      </main>
    );
  if (!user) return <Login onLogin={() => void login()} />;
  const nav = [
    ["dashboard", "概览", LayoutDashboard],
    ["posts", "文章", FileText],
    ["notes", "随想", StickyNote],
    ["books", "书架", BookOpen],
    ["projects", "项目", FolderOpen],
    ["media", "素材库", ImagePlus],
    ["contacts", "留言", MessageSquare],
    ["settings", "站点设置", Settings2],
  ] as const;
  return (
    <div className="studio">
      <header className="studio-header">
        <div>
          <Link className="site-logo" to="/">
            小天Aya
          </Link>
          <small>写作台 / {user}</small>
        </div>
        <div>
          <Link className="button" to="/" target="_blank">
            <Home size={15} />
            查看网站
          </Link>
          <button
            className="icon-button"
            aria-label="退出登录"
            onClick={async () => {
              await api("/api/admin/logout", request("POST"));
              setUser(null);
              await refresh();
            }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>
      <div className="studio-layout">
        <nav className="studio-nav" aria-label="后台栏目">
          <p className="nav-label">内容与记录</p>
          {nav.map(([id, title, Icon]) => (
            <button
              key={id}
              className={view === id ? "active" : ""}
              onClick={() => navigate(id)}
            >
              <Icon size={17} />
              {title}
            </button>
          ))}
        </nav>
        <main className="studio-content">
          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}
          {editing ? (
            <ContentEditor
              key={`${editing.kind}-${editing.item.id || "new"}`}
              kind={editing.kind}
              initial={editing.item}
              onSaved={saved}
              onBack={() => navigate(editing.kind)}
            />
          ) : (
            <>
              {view === "dashboard" && (
                <>
                  <div className="studio-title">
                    <div>
                      <p className="eyebrow">YOUR DIGITAL GARDEN</p>
                      <h1>慢慢写，持续记录。</h1>
                    </div>
                    <button
                      className="button primary"
                      onClick={() => {
                        setView("posts");
                        setEditing({ kind: "posts", item: fresh("posts") });
                      }}
                    >
                      <Plus size={16} />
                      写文章
                    </button>
                  </div>
                  <div className="studio-summary">
                    {kinds.map((k) => (
                      <button key={k} onClick={() => navigate(k)}>
                        <strong>{collections[k].length}</strong>
                        <span>
                          {labels[k]} ·{" "}
                          {
                            collections[k].filter(
                              (x) => x.status === "published",
                            ).length
                          }{" "}
                          已发布
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="notice">
                    <h2>先写中文就好。</h2>
                    <p>
                      草稿自动保存；已发布内容的修改会留在草稿，点击“更新发布”才会对外显示。英文是选填项，暂时不写也不影响发布。
                    </p>
                    <p>
                      技术文章与待阅读书单可以继续修改。新书默认标记为“想读”，实际读到哪里再更新状态。编辑时可用模板、Markdown
                      源码和专注模式，Ctrl / ⌘ S 保存草稿。
                    </p>
                  </div>
                </>
              )}
              {view === "dashboard" && (
                <section className="studio-backup-card">
                  <div>
                    <h2>给内容留一份备份。</h2>
                    <p>
                      导出文章、随想、书籍、项目及各自的草稿和公开版本。不包含留言、账号或密钥；图片文件需另行备份。
                    </p>
                  </div>
                  <button
                    className="button"
                    onClick={() => void exportBackup()}
                  >
                    <Download size={17} />
                    导出内容备份
                  </button>
                </section>
              )}
              {kinds.includes(view as Kind) && (
                <>
                  <div className="studio-title">
                    <h1>{labels[view as Kind]}</h1>
                    <button
                      className="button primary"
                      onClick={() =>
                        setEditing({
                          kind: view as Kind,
                          item: fresh(view as Kind),
                        })
                      }
                    >
                      <Plus size={16} />
                      新增{labels[view as Kind]}
                    </button>
                  </div>
                  <div className="message-admin-filters">
                    <input
                      aria-label="搜索管理内容"
                      placeholder="搜索标题、标签或链接标识…"
                      value={listQuery}
                      onChange={(e) => setListQuery(e.target.value)}
                    />
                    <select
                      aria-label="筛选发布状态"
                      value={listStatus}
                      onChange={(e) => setListStatus(e.target.value)}
                    >
                      <option value="">全部状态</option>
                      <option value="draft">草稿</option>
                      <option value="published">已发布</option>
                      <option value="changes">有未发布修改</option>
                    </select>
                  </div>
                  <div className="studio-list">
                    {collections[view as Kind]
                      .filter(
                        (item) =>
                          (!listStatus ||
                            (listStatus === "changes"
                              ? item.hasDraft && item.status === "published"
                              : item.status === listStatus)) &&
                          `${textFor(item.title, "zh")} ${textFor(item.body, "zh")} ${(item.tags || []).join(" ")} ${item.slug}`
                            .toLowerCase()
                            .includes(listQuery.toLowerCase()),
                      )
                      .map((item) => (
                        <div className="studio-list-entry" key={item.id}>
                          <button
                            className="studio-list-open"
                            onClick={() =>
                              setEditing({ kind: view as Kind, item })
                            }
                          >
                            <div>
                              <strong>
                                {textFor(item.title, "zh") ||
                                  textFor(item.body, "zh").slice(0, 60) ||
                                  "未命名草稿"}
                              </strong>
                              <small>
                                {item.date || item.year} · /{item.slug}
                              </small>
                            </div>
                            <span className="tag">
                              {item.status === "published"
                                ? item.hasDraft
                                  ? "已发布 · 有修改草稿"
                                  : "已发布"
                                : "草稿"}
                            </span>
                          </button>
                          <button
                            className="duplicate-content text-link"
                            aria-label={
                              "复制成草稿：" +
                              (textFor(item.title, "zh") || item.slug)
                            }
                            onClick={async () => {
                              try {
                                const copy = await api<CmsItem>(
                                  `/api/admin/content/${view}/${item.id}/duplicate`,
                                  request("POST"),
                                );
                                await load();
                                setEditing({ kind: view as Kind, item: copy });
                              } catch (e) {
                                setError((e as Error).message);
                              }
                            }}
                          >
                            <Copy size={16} />
                            <span>复制成草稿</span>
                          </button>
                        </div>
                      ))}
                    {!collections[view as Kind].length && (
                      <p className="empty-state">还没有内容，从第一条开始。</p>
                    )}
                  </div>
                </>
              )}
              {view === "media" && <MediaManager />}
              {view === "contacts" && <Contacts />}
              {view === "settings" && <SiteSettings />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function ContentEditor({
  kind,
  initial,
  onSaved,
  onBack,
}: {
  kind: Kind;
  initial: CmsItem;
  onSaved: (published: boolean) => Promise<void>;
  onBack: () => void;
}) {
  const key = `aya-draft-${kind}-${initial.id || "new"}`;
  const [value, setValue] = useState<CmsItem>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(key) || "null");
      return saved && saved.savedAt > new Date(initial.updatedAt || 0).getTime()
        ? saved.value
        : initial;
    } catch {
      return initial;
    }
  });
  const [lang, setLang] = useState<"zh" | "en">("zh"),
    [dirty, setDirty] = useState(value !== initial),
    [status, setStatus] = useState(
      value !== initial
        ? "已恢复本机草稿，等待同步…"
        : initial.hasDraft
          ? "已恢复服务端草稿"
          : "已保存",
    ),
    [error, setError] = useState(""),
    [preview, setPreview] = useState(false),
    [busy, setBusy] = useState(false),
    [picker, setPicker] = useState<"cover" | "gallery" | null>(null);
  const [panel, setPanel] = useState<"editor" | "settings">("editor");
  const [sourceMode, setSourceMode] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [toolUndo, setToolUndo] = useState<string | null>(null);
  const [historyId, setHistoryId] = useState<string | null>(null);
  const [restoredEditor, setRestoredEditor] = useState(0);
  useEffect(() => {
    document.body.classList.toggle("writing-focus", focusMode);
    return () => document.body.classList.remove("writing-focus");
  }, [focusMode]);
  const [published, setPublished] = useState(initial.status === "published"),
    [suggestion, setSuggestion] = useState<{
      title: string;
      body: string;
      standfirst: string;
      tags: string[];
      target: "zh" | "en";
    } | null>(null),
    [undo, setUndo] = useState<CmsItem | null>(null);
  const id = useRef(value.id || initial.id),
    latest = useRef(value),
    revision = useRef(0),
    queue = useRef<Promise<unknown>>(Promise.resolve()),
    importRef = useRef<HTMLInputElement>(null),
    coverRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    latest.current = value;
  }, [value]);
  const change = useCallback(
    (patch: Partial<CmsItem>) => {
      setValue((v) => {
        const next = { ...v, ...patch };
        latest.current = next;
        try {
          localStorage.setItem(
            key,
            JSON.stringify({ savedAt: Date.now(), value: next }),
          );
        } catch {
          /* Server autosave still runs if storage quota is full. */
        }
        return next;
      });
      revision.current++;
      setDirty(true);
      setStatus("等待保存…");
    },
    [key],
  );
  function localField(
    field:
      | "title"
      | "body"
      | "standfirst"
      | "summary"
      | "subtitle"
      | "category"
      | "challenge"
      | "approach"
      | "outcome"
      | "result"
      | "nextStep"
      | "role",
    text: string,
  ) {
    change({
      ...(field === "body"
        ? { bodyDocuments: { ...value.bodyDocuments, [lang]: null } }
        : {}),
      [field]: {
        ...value[field],
        zh: value[field]?.zh || "",
        en: value[field]?.en || "",
        [lang]: text,
      },
    });
  }
  const save = useCallback(
    (action: "draft" | "publish" | "unpublish") => {
      const snapshot = structuredClone(latest.current),
        version = revision.current;
      setStatus("正在保存…");
      setError("");
      const operation = queue.current
        .catch(() => {})
        .then(async () => {
          if (kind !== "projects") {
            snapshot.bodyDocuments = { ...snapshot.bodyDocuments };
            for (const language of ["zh", "en"] as const)
              if (!snapshot.bodyDocuments[language])
                snapshot.bodyDocuments[language] = markdownDocument(
                  snapshot.body?.[language] || "",
                );
          }
          const result = await api<CmsItem>(
            `/api/admin/content/${kind}${id.current ? `/${id.current}` : ""}`,
            request(id.current ? "PUT" : "POST", { ...snapshot, action }),
          );
          id.current = result.id;
          setValue((v) => ({ ...v, id: result.id }));
          setPublished(result.status === "published");
          if (version === revision.current) {
            setDirty(false);
            localStorage.removeItem(key);
            setStatus(
              action === "publish"
                ? "已发布"
                : action === "unpublish"
                  ? "已撤回，保留为草稿"
                  : result.hasDraft && result.status === "published"
                    ? "修改已存草稿，前台未改变"
                    : "草稿已自动保存",
            );
          }
          await onSaved(action !== "draft");
          return result;
        })
        .catch((e) => {
          setError(`${(e as Error).message}。原稿仍保留在本机，可重试或导出。`);
          setStatus("未保存到服务端");
          throw e;
        });
      queue.current = operation;
      return operation;
    },
    [key, kind, onSaved],
  );
  const saveRef = useRef(save);
  useEffect(() => {
    saveRef.current = save;
  }, [save]);
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void saveRef.current("draft").catch(() => {});
      }
      if (event.altKey && event.key.toLowerCase() === "p") {
        event.preventDefault();
        setPreview((current) => !current);
      }
      if (event.key === "Escape") setFocusMode(false);
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);
  useEffect(() => {
    if (!dirty) return;
    const timer = setTimeout(() => {
      void saveRef.current("draft").catch(() => {});
    }, 1400);
    return () => clearTimeout(timer);
  }, [value, dirty]);
  useEffect(() => {
    if (!dirty) return;
    const prevent = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", prevent);
    return () => window.removeEventListener("beforeunload", prevent);
  }, [dirty]);
  async function back() {
    if (dirty) {
      try {
        await save("draft");
      } catch {
        return;
      }
    }
    onBack();
  }
  async function ai(task: string) {
    setBusy(true);
    setError("");
    try {
      const target =
        task === "translate" ? (lang === "zh" ? "en" : "zh") : lang;
      const result = await api<{
        title: string;
        body: string;
        standfirst: string;
        tags: string[];
      }>(
        "/api/admin/llm/rewrite",
        request("POST", {
          task,
          language: lang,
          title: textFor(value.title, lang),
          standfirst: textFor(value.standfirst, lang),
          body: textFor(value.body, lang),
          tags: value.tags || [],
        }),
      );
      setSuggestion({ ...result, target });
    } catch (e) {
      setError(`${(e as Error).message}；原稿没有改动。`);
    } finally {
      setBusy(false);
    }
  }
  const gallery = [
    ...(value.gallery || [])
      .filter((g) => g.image)
      .map((g) => ({
        image: g.image!,
        original: g.original,
        title: g.label,
        description: g.description,
      })),
    ...(value.showcaseGroups || []).flatMap((g) => g.items),
  ].filter((g, i, a) => a.findIndex((v) => v.image === g.image) === i);
  function setGallery(items: typeof gallery) {
    change({
      gallery: items.map((g) => ({
        image: g.image,
        original: g.original,
        label: g.title,
        description: g.description,
      })),
      showcaseGroups: [],
    });
  }
  async function chooseCover(file: File) {
    setBusy(true);
    if (kind === "books")
      change({ coverOrigin: "manual", coverMatch: "missing" });
    try {
      const media = await uploadImage(file);
      change({
        coverImage: media.url,
        coverType: coverTypeForMedia(media.type),
        ...(kind === "books"
          ? {
              coverOrigin: "manual" as const,
              coverMatch: "confirmed" as const,
              coverSource: "手动上传",
              coverSourceUrl: "",
              coverEdition: "",
            }
          : {}),
      });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const body = value.body?.[lang] || "";
  const stats = writingStats(body);
  const outline = extractMarkdownHeadings(body);
  return (
    <>
      <div className="editor-header">
        <div>
          <button className="text-link" onClick={() => void back()}>
            <ArrowLeft size={16} />
            返回{labels[kind]}
          </button>
          <span role="status" className="metadata">
            {status}
          </span>
        </div>
        <div>
          <button
            className="button"
            aria-pressed={focusMode}
            onClick={() => {
              setFocusMode(!focusMode);
              setPanel("editor");
            }}
            title="专注模式，Esc 退出"
          >
            {focusMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            {focusMode ? "退出专注" : "专注写作"}
          </button>
          <button
            className="button"
            onClick={async () => {
              try {
                const result = await save("draft");
                setHistoryId(result.id || null);
              } catch {
                /* The save error remains visible; do not open stale history. */
              }
            }}
          >
            <History size={16} />
            版本历史
          </button>
          <button className="button" onClick={() => setPreview(!preview)}>
            {preview ? "继续编辑" : "预览"}
          </button>
          <button
            className="button"
            onClick={() => void save("draft").catch(() => {})}
          >
            保存草稿
          </button>
          <button
            className="button primary"
            onClick={() => void save("publish").catch(() => {})}
          >
            {published ? "更新发布" : "发布"}
          </button>
        </div>
      </div>
      {error && (
        <div className="error-message" role="alert">
          {error}{" "}
          <a href="/studio" target="_blank" rel="noreferrer">
            在新窗口重新登录（原稿保留）
          </a>
        </div>
      )}
      <div className="editor-mobile-tabs" role="group" aria-label="编辑面板">
        <button
          aria-pressed={panel === "editor"}
          onClick={() => setPanel("editor")}
        >
          正文编辑
        </button>
        <button
          aria-pressed={panel === "settings"}
          onClick={() => setPanel("settings")}
        >
          发布设置
        </button>
      </div>
      <div className={`editor-layout editor-tab-${panel}`}>
        <section className="editor-body">
          <div className="language-control" aria-label="编辑语言">
            <button aria-pressed={lang === "zh"} onClick={() => setLang("zh")}>
              中文
            </button>
            <button aria-pressed={lang === "en"} onClick={() => setLang("en")}>
              English · 选填
            </button>
          </div>
          {preview ? (
            <article className="editor-preview">
              <h1>{textFor(value.title, lang)}</h1>
              {value.coverImage && (
                <img
                  className="editor-cover"
                  src={value.coverImage}
                  alt="文章封面"
                />
              )}
              <p>{textFor(value.standfirst || value.subtitle, lang)}</p>
              <Prose
                body={
                  kind === "projects"
                    ? `${textFor(value.summary, lang)}\n\n${(value.detailSections || []).map((s) => `## ${textFor(s.title, lang)}\n\n${s.paragraphs.map((p) => textFor(p, lang)).join("\n\n")}`).join("\n\n")}`
                    : body
                }
              />
            </article>
          ) : (
            <>
              {kind !== "notes" && (
                <label>
                  标题{lang === "en" ? "（英文选填）" : ""}
                  <input
                    className="editor-title-input"
                    aria-label="内容标题"
                    value={value.title?.[lang] || ""}
                    placeholder={kind === "books" ? "书名" : "写下标题…"}
                    onChange={(e) => localField("title", e.target.value)}
                  />
                </label>
              )}
              {kind === "posts" && (
                <label>
                  摘要
                  <textarea
                    aria-label="文章摘要"
                    value={value.standfirst?.[lang] || ""}
                    onChange={(e) => localField("standfirst", e.target.value)}
                    rows={3}
                  />
                </label>
              )}
              {kind === "books" && (
                <>
                  <label>
                    作者
                    <input
                      value={value.author || ""}
                      onChange={(e) => change({ author: e.target.value })}
                    />
                  </label>
                  <BookCoverLookup value={value} onChange={change} />
                  <label>
                    关联文章链接标识
                    <input
                      placeholder="文章的 slug，选填"
                      value={value.relatedSlug || ""}
                      onChange={(e) => change({ relatedSlug: e.target.value })}
                    />
                  </label>
                </>
              )}
              {kind === "projects" ? (
                <>
                  <label>
                    一句话介绍
                    <input
                      value={value.subtitle?.[lang] || ""}
                      onChange={(e) => localField("subtitle", e.target.value)}
                    />
                  </label>
                  {(
                    [
                      "summary",
                      "role",
                      "challenge",
                      "approach",
                      "outcome",
                      "result",
                      "nextStep",
                    ] as const
                  ).map((field, i) => (
                    <label key={field}>
                      {
                        [
                          "项目概述",
                          "我的角色",
                          "要解决的问题",
                          "实现方式",
                          "当前进展",
                          "成果说明",
                          "下一步",
                        ][i]
                      }
                      <textarea
                        rows={field === "summary" ? 4 : 2}
                        value={value[field]?.[lang] || ""}
                        onChange={(e) => localField(field, e.target.value)}
                      />
                    </label>
                  ))}
                  <label>
                    技术／功能标签（逗号分隔）
                    <input
                      key={`capabilities-${lang}`}
                      defaultValue={(value.capabilities || [])
                        .map((t) => textFor(t, lang))
                        .join(", ")}
                      onBlur={(e) =>
                        change({
                          capabilities: e.target.value
                            .split(/[,，]/)
                            .map((s) => localized(s.trim()))
                            .filter((x) => x.zh),
                        })
                      }
                    />
                  </label>
                  <SectionHeading title="功能说明与开发过程" />
                  <div>
                    {(value.detailSections || []).map((section, index) => (
                      <div className="gallery-admin-row" key={index}>
                        <input
                          aria-label={`章节 ${index + 1} 标题`}
                          value={section.title[lang]}
                          onChange={(e) =>
                            change({
                              detailSections: value.detailSections!.map(
                                (s, i) =>
                                  i === index
                                    ? {
                                        ...s,
                                        title: {
                                          ...s.title,
                                          [lang]: e.target.value,
                                        },
                                      }
                                    : s,
                              ),
                            })
                          }
                        />
                        <textarea
                          aria-label={`章节 ${index + 1} 正文`}
                          rows={5}
                          value={section.paragraphs
                            .map((p) => p[lang])
                            .join("\n\n")}
                          onChange={(e) =>
                            change({
                              detailSections: value.detailSections!.map(
                                (s, i) =>
                                  i === index
                                    ? {
                                        ...s,
                                        paragraphs: e.target.value
                                          .split("\n\n")
                                          .map((p) => ({
                                            ...localized(),
                                            [lang]: p,
                                          })),
                                      }
                                    : s,
                              ),
                            })
                          }
                        />
                        <button
                          className="text-link"
                          onClick={() =>
                            change({
                              detailSections: value.detailSections!.filter(
                                (_, i) => i !== index,
                              ),
                            })
                          }
                        >
                          移除章节
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    className="button"
                    onClick={() =>
                      change({
                        detailSections: [
                          ...(value.detailSections || []),
                          {
                            title: localized("新的章节"),
                            paragraphs: [localized()],
                          },
                        ],
                      })
                    }
                  >
                    <Plus size={15} />
                    添加章节
                  </button>
                  <SectionHeading title="真实界面与图注" />
                  <p className="metadata">
                    设计稿请在图注中注明；保存图集修改后，图片会统一排列在项目介绍中。
                  </p>
                  {gallery.map((g, index) => (
                    <div
                      className="gallery-admin-row"
                      key={`${g.image}-${index}`}
                    >
                      <img src={g.image} alt={textFor(g.title, "zh")} />
                      <input
                        aria-label={`图片 ${index + 1} 图注`}
                        value={g.title[lang]}
                        onChange={(e) =>
                          setGallery(
                            gallery.map((x, i) =>
                              i === index
                                ? {
                                    ...x,
                                    title: {
                                      ...x.title,
                                      [lang]: e.target.value,
                                    },
                                  }
                                : x,
                            ),
                          )
                        }
                      />
                      <textarea
                        aria-label={`图片 ${index + 1} 说明`}
                        rows={2}
                        value={g.description[lang]}
                        onChange={(e) =>
                          setGallery(
                            gallery.map((x, i) =>
                              i === index
                                ? {
                                    ...x,
                                    description: {
                                      ...x.description,
                                      [lang]: e.target.value,
                                    },
                                  }
                                : x,
                            ),
                          )
                        }
                      />
                      <button
                        className="text-link"
                        onClick={() =>
                          setGallery(gallery.filter((_, i) => i !== index))
                        }
                      >
                        移除这张图片
                      </button>
                    </div>
                  ))}
                  <button
                    className="button"
                    onClick={() => setPicker("gallery")}
                  >
                    <ImagePlus size={16} />
                    从素材库加入图集
                  </button>
                  <SectionHeading title="演示与源码链接" />
                  {(value.externalLinks || []).map((link, index) => (
                    <div className="gallery-admin-row" key={index}>
                      <input
                        aria-label={`链接 ${index + 1} 名称`}
                        value={link.label.zh}
                        onChange={(e) =>
                          change({
                            externalLinks: value.externalLinks!.map((x, i) =>
                              i === index
                                ? { ...x, label: localized(e.target.value) }
                                : x,
                            ),
                          })
                        }
                      />
                      <input
                        aria-label={`链接 ${index + 1} 地址`}
                        value={link.url}
                        onChange={(e) =>
                          change({
                            externalLinks: value.externalLinks!.map((x, i) =>
                              i === index ? { ...x, url: e.target.value } : x,
                            ),
                          })
                        }
                      />
                      <button
                        className="text-link"
                        onClick={() =>
                          change({
                            externalLinks: value.externalLinks!.filter(
                              (_, i) => i !== index,
                            ),
                          })
                        }
                      >
                        移除链接
                      </button>
                    </div>
                  ))}
                  <button
                    className="button"
                    onClick={() =>
                      change({
                        externalLinks: [
                          ...(value.externalLinks || []),
                          { label: localized("查看项目"), url: "https://" },
                        ],
                      })
                    }
                  >
                    添加链接
                  </button>
                </>
              ) : (
                <>
                  <label>{kind === "books" ? "我的阅读笔记" : "正文"}</label>
                  <div className="writing-tools">
                    <select
                      aria-label="插入写作模板"
                      value=""
                      onChange={(event) => {
                        const template = writingTemplates.find(
                          (item) => item.id === event.target.value,
                        );
                        if (!template) return;
                        setToolUndo(body);
                        localField(
                          "body",
                          `${body.trimEnd()}${body.trim() ? "\n\n" : ""}${template.body}`,
                        );
                      }}
                    >
                      <option value="">＋ 插入写作模板（追加正文）</option>
                      {writingTemplates
                        .filter((template) => template.kinds.includes(kind))
                        .map((template) => (
                          <option value={template.id} key={template.id}>
                            {template.label}
                          </option>
                        ))}
                    </select>
                    <button
                      className="button"
                      aria-pressed={sourceMode}
                      onClick={() => setSourceMode(!sourceMode)}
                    >
                      {sourceMode ? <Eye size={15} /> : <Code2 size={15} />}
                      {sourceMode ? "可视化编辑" : "Markdown 源码"}
                    </button>
                    {toolUndo !== null && (
                      <button
                        className="text-link"
                        onClick={() => {
                          localField("body", toolUndo);
                          setToolUndo(null);
                        }}
                      >
                        撤销插入模板
                      </button>
                    )}
                  </div>
                  {outline.length > 0 && (
                    <details className="writing-outline">
                      <summary>文章结构 · {outline.length} 个标题</summary>
                      <ol>
                        {outline.map((heading) => (
                          <li
                            key={heading.id}
                            className={
                              heading.depth > 2 ? "outline-subheading" : ""
                            }
                          >
                            {heading.text}
                          </li>
                        ))}
                      </ol>
                    </details>
                  )}
                  <WritingTools
                    key={lang}
                    body={body}
                    goal={value.writingGoal}
                    onGoal={(writingGoal) => change({ writingGoal })}
                    onChange={(next) => localField("body", next)}
                  />
                  {sourceMode ? (
                    <textarea
                      className="markdown-source"
                      aria-label="Markdown 源码编辑器"
                      value={body}
                      spellCheck={false}
                      onChange={(event) =>
                        change({
                          body: {
                            ...localized(),
                            ...value.body,
                            [lang]: event.target.value,
                          },
                          bodyDocuments: {
                            ...value.bodyDocuments,
                            [lang]: null,
                          },
                        })
                      }
                    />
                  ) : (
                    <RichEditor
                      key={`${lang}-${restoredEditor}`}
                      value={body}
                      onError={setError}
                      onChange={(markdown, document) =>
                        change({
                          body: {
                            ...localized(),
                            ...value.body,
                            [lang]: markdown,
                          },
                          bodyDocuments: {
                            ...value.bodyDocuments,
                            [lang]: document,
                          },
                        })
                      }
                    />
                  )}
                  <div className="writing-stats">
                    <span>
                      {stats.count} 字 / 词 · 预计阅读 {stats.minutes} 分钟 ·{" "}
                      {stats.images} 张图
                    </span>
                    <span>Ctrl / ⌘ S 保存 · Alt P 预览</span>
                  </div>
                  <div className="editor-footnote">
                    <label>
                      导入 Markdown
                      <input
                        ref={importRef}
                        type="file"
                        hidden
                        accept=".md,.markdown,text/markdown,text/plain"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) localField("body", await file.text());
                          e.target.value = "";
                        }}
                      />
                    </label>
                    <button
                      className="text-link"
                      onClick={() => {
                        const blob = new Blob([body], {
                            type: "text/markdown;charset=utf-8",
                          }),
                          url = URL.createObjectURL(blob),
                          anchor = document.createElement("a");
                        anchor.href = url;
                        anchor.download = `${value.slug || "article"}-${lang}.md`;
                        anchor.click();
                        setTimeout(() => URL.revokeObjectURL(url), 1000);
                      }}
                    >
                      导出 Markdown
                    </button>
                  </div>
                  <div className="ai-toolbar">
                    <span className="metadata">AI 建议</span>
                    {[
                      ["format", "排版"],
                      ["polish", "润色"],
                      ["summarize", "摘要"],
                      ["translate", "翻译"],
                    ].map(([task, label]) => (
                      <button
                        className="button"
                        key={task}
                        disabled={busy}
                        onClick={() => void ai(task)}
                      >
                        {label}
                      </button>
                    ))}
                    <small>先预览，再采用；失败不会改稿。</small>
                    {undo && (
                      <button
                        className="text-link"
                        onClick={() => {
                          change(undo);
                          setUndo(null);
                        }}
                      >
                        撤销上次 AI 修改
                      </button>
                    )}
                  </div>
                  {suggestion && (
                    <section className="suggestion">
                      <p className="eyebrow">建议稿 · 尚未修改原稿</p>
                      <h3>{suggestion.title}</h3>
                      <p>{suggestion.standfirst}</p>
                      <Prose body={suggestion.body} />
                      <div className="button-row">
                        <button
                          className="button primary"
                          onClick={() => {
                            setUndo(structuredClone(value));
                            change({
                              title: {
                                ...localized(),
                                ...value.title,
                                [suggestion.target]: suggestion.title,
                              },
                              standfirst: {
                                ...localized(),
                                ...value.standfirst,
                                [suggestion.target]: suggestion.standfirst,
                              },
                              body: {
                                ...localized(),
                                ...value.body,
                                [suggestion.target]: suggestion.body,
                              },
                              bodyDocuments: {
                                ...value.bodyDocuments,
                                [suggestion.target]: null,
                              },
                              tags: suggestion.tags || value.tags,
                            });
                            setLang(suggestion.target);
                            setSuggestion(null);
                          }}
                        >
                          采用建议
                        </button>
                        <button
                          className="button"
                          onClick={() => setSuggestion(null)}
                        >
                          保留原稿
                        </button>
                      </div>
                    </section>
                  )}
                </>
              )}
            </>
          )}
        </section>
        <aside className="publish-panel">
          <h3>发布设置</h3>
          <p className="metadata">
            {published ? "前台已发布 · 修改先保存为草稿" : "仅你可见的草稿"}
          </p>
          {kind !== "projects" && (
            <div className="writing-checklist">
              <h4>发布前看一眼</h4>
              {[
                [kind === "notes" || !!value.title?.zh?.trim(), "中文标题"],
                [
                  !!body.trim(),
                  kind === "books" ? "书目说明 / 阅读笔记" : "正文内容",
                ],
                [
                  !!value.standfirst?.zh?.trim() || kind !== "posts",
                  "文章摘要",
                ],
                [
                  !!value.coverImage &&
                    (kind !== "books" || value.coverMatch === "confirmed"),
                  kind === "books"
                    ? "已确认的真实书封（发布必填）"
                    : "封面（选填）",
                ],
              ].map(([done, label]) => (
                <p key={String(label)}>
                  {done ? <Check size={15} /> : <Circle size={15} />}
                  {String(label)}
                </p>
              ))}
              <p>引用、数据和项目进展，请在发布前亲自核对。</p>
            </div>
          )}
          <label>
            链接标识
            <input
              aria-label="链接标识"
              readOnly={published}
              value={value.slug || ""}
              onChange={(e) => change({ slug: e.target.value })}
            />
          </label>
          <label>
            日期
            <input
              type="date"
              value={value.date || today()}
              onChange={(e) => change({ date: e.target.value })}
            />
          </label>
          {(kind === "posts" || kind === "projects") && (
            <label>
              分类
              <input
                value={value.category?.[lang] || ""}
                onChange={(e) => localField("category", e.target.value)}
                placeholder="如：项目复盘"
              />
            </label>
          )}
          {kind !== "projects" && (
            <label>
              标签（逗号分隔）
              <input
                key={(value.tags || []).join("|")}
                defaultValue={(value.tags || []).join(", ")}
                onBlur={(e) =>
                  change({
                    tags: e.target.value
                      .split(/[,，]/)
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
              />
            </label>
          )}
          {kind === "posts" && (
            <label className="field-check">
              <input
                type="checkbox"
                checked={!!value.featured}
                onChange={(e) => change({ featured: e.target.checked })}
              />
              精选文章
            </label>
          )}
          {kind === "books" && (
            <>
              <label>
                阅读状态
                <select
                  value={value.readingStatus}
                  onChange={(e) =>
                    change({
                      readingStatus: e.target.value as CmsItem["readingStatus"],
                    })
                  }
                >
                  <option value="reading">在读</option>
                  <option value="read">已读</option>
                  <option value="wish">想读</option>
                </select>
              </label>
              <label>
                阅读进度（%）
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={value.progress || 0}
                  onChange={(e) =>
                    change({
                      progress: Math.min(
                        100,
                        Math.max(0, Number(e.target.value)),
                      ),
                    })
                  }
                />
              </label>
            </>
          )}
          {kind === "projects" && (
            <>
              <label>
                项目状态
                <select
                  value={value.projectStatus || "开发中"}
                  onChange={(e) => change({ projectStatus: e.target.value })}
                >
                  {[
                    "开发中",
                    "已发布",
                    "项目档案",
                    "持续维护",
                    "已完成",
                    "探索中",
                    "已归档",
                  ].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label>
                排序
                <input
                  type="number"
                  value={value.order || 0}
                  onChange={(e) => change({ order: Number(e.target.value) })}
                />
              </label>
              <label className="field-check">
                <input
                  type="checkbox"
                  checked={!!value.homeFeatured}
                  onChange={(e) => change({ homeFeatured: e.target.checked })}
                />
                首页展示
              </label>
              <label className="field-check">
                <input
                  type="checkbox"
                  checked={!!value.commercialFeatured}
                  onChange={(e) =>
                    change({ commercialFeatured: e.target.checked })
                  }
                />
                合作页展示
              </label>
              <label>
                封面来源
                <select
                  value={value.coverType || "concept"}
                  onChange={(e) => change({ coverType: e.target.value })}
                >
                  <option value="screenshot">真实截图</option>
                  <option value="design">设计稿</option>
                  <option value="concept">概念素材</option>
                  <option value="upload">上传素材（待标注）</option>
                </select>
              </label>
            </>
          )}
          {kind !== "notes" && (
            <>
              <label>封面（独立于正文）</label>
              {value.coverImage && (
                <img
                  className="editor-cover"
                  src={value.coverImage}
                  alt="当前封面"
                />
              )}
              <div className="button-row">
                <button
                  className="button"
                  disabled={busy}
                  onClick={() => coverRef.current?.click()}
                >
                  <Upload size={14} />
                  上传
                </button>
                <button className="button" onClick={() => setPicker("cover")}>
                  素材库
                </button>
              </div>
              <input
                hidden
                ref={coverRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void chooseCover(f);
                  e.target.value = "";
                }}
              />
              {value.coverImage && (
                <button
                  className="text-link"
                  onClick={() =>
                    change({
                      coverImage: "",
                      ...(kind === "books"
                        ? {
                            coverOrigin: "manual" as const,
                            coverMatch: "missing" as const,
                          }
                        : {}),
                    })
                  }
                >
                  移除封面
                </button>
              )}
            </>
          )}
          {published && (
            <button
              className="button"
              onClick={() => {
                if (
                  window.confirm("撤回后访客将看不到这条内容，草稿仍会保留。")
                )
                  void save("unpublish").catch(() => {});
              }}
            >
              撤回发布
            </button>
          )}
          <p className="metadata">
            中文即可发布，英文选填。自动保存不会替换已发布的版本。
          </p>
          <button
            className="text-link"
            onClick={async () => {
              if (
                !window.confirm(
                  "删除这条内容？删除后将不再展示；如需保留，请先导出。",
                )
              )
                return;
              setDirty(false);
              try {
                await queue.current.catch(() => {});
                if (id.current)
                  await api(
                    `/api/admin/content/${kind}/${id.current}`,
                    request("DELETE"),
                  );
                localStorage.removeItem(key);
                await onSaved(true);
                onBack();
              } catch (e) {
                setError((e as Error).message);
              }
            }}
          >
            删除这条内容
          </button>
        </aside>
      </div>
      {historyId && (
        <RevisionHistory
          kind={kind}
          id={historyId}
          onClose={() => setHistoryId(null)}
          onRestore={async (revisionId) => {
            await save("draft");
            const restored = await api<CmsItem>(
              `/api/admin/content/${kind}/${historyId}/revisions/${revisionId}/restore`,
              request("POST"),
            );
            latest.current = restored;
            revision.current++;
            setValue(restored);
            setRestoredEditor((n) => n + 1);
            setDirty(false);
            localStorage.removeItem(key);
            setPublished(restored.status === "published");
            setStatus("已恢复为草稿，前台未改变");
            setToolUndo(null);
            setSuggestion(null);
            setUndo(null);
            await onSaved(false);
          }}
        />
      )}
      {picker && (
        <MediaPicker
          onClose={() => setPicker(null)}
          onSelect={(m) => {
            if (picker === "cover")
              change({
                coverImage: m.url,
                coverType: coverTypeForMedia(m.type),
                ...(kind === "books"
                  ? {
                      coverOrigin: "manual" as const,
                      coverMatch: "confirmed" as const,
                      coverSource: "手动选择素材",
                      coverSourceUrl: "",
                      coverEdition: "",
                    }
                  : {}),
              });
            else
              setGallery([
                ...gallery,
                {
                  image: m.url,
                  original: m.original,
                  title: localized(m.caption),
                  description: localized(sourceLabel(m.type)),
                },
              ]);
            setPicker(null);
          }}
        />
      )}
    </>
  );
}
function SectionHeading({ title }: { title: string }) {
  return <h2 style={{ fontSize: 23, marginTop: 15 }}>{title}</h2>;
}
function MediaManager() {
  const [items, setItems] = useState<Media[]>([]),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [query, setQuery] = useState(""),
    [active, setActive] = useState<Media | null>(null);
  const load = useCallback(
    () =>
      api<Media[]>("/api/admin/media")
        .then(setItems)
        .catch((e) => setError(e.message)),
    [],
  );
  useEffect(() => {
    void load();
  }, [load]);
  return (
    <>
      <div className="studio-title">
        <h1>素材库</h1>
        <label className="button primary">
          <Upload size={16} />
          {busy ? "上传中…" : "上传图片"}
          <input
            hidden
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            disabled={busy}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setBusy(true);
              try {
                await uploadImage(file);
                await load();
              } catch (err) {
                setError((err as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          />
        </label>
      </div>
      <p className="intro-text">
        真实截图、设计稿和生成素材分别标记。点击图片可编辑图注和归属项目。
      </p>
      <input
        aria-label="筛选素材"
        placeholder="搜索素材或项目标识…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {error && <p role="alert">{error}</p>}
      {active && (
        <form
          className="gallery-admin-row"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await api(
                `/api/admin/media/${active.id}`,
                request("PUT", active),
              );
              setActive(null);
              await load();
            } catch (err) {
              setError((err as Error).message);
            }
          }}
        >
          <div className="editor-header">
            <h2>素材说明</h2>
            <button
              type="button"
              className="icon-button"
              aria-label="关闭素材说明"
              onClick={() => setActive(null)}
            >
              <X />
            </button>
          </div>
          <label>
            图注／替代文字
            <input
              required
              value={active.caption}
              onChange={(e) =>
                setActive({ ...active, caption: e.target.value })
              }
            />
          </label>
          <label>
            所属项目标识
            <input
              value={active.projectId || ""}
              onChange={(e) =>
                setActive({ ...active, projectId: e.target.value })
              }
            />
          </label>
          <label>
            来源类型
            <select
              value={active.type}
              onChange={(e) => setActive({ ...active, type: e.target.value })}
            >
              {[
                "screenshot",
                "design",
                "generated",
                "illustration",
                "upload",
                "concept",
              ].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <button className="button primary">保存说明</button>
        </form>
      )}
      <div className="media-grid">
        {items
          .filter((m) => `${m.caption} ${m.projectId || ""}`.includes(query))
          .map((m) => (
            <button
              key={m.id}
              className="media-tile"
              onClick={() => setActive(m)}
            >
              <img src={m.url} alt={m.caption} loading="lazy" />
              <p>{m.caption}</p>
              <small>
                {m.type} · {m.width}×{m.height} · {m.projectId || "未分配项目"}
              </small>
            </button>
          ))}
      </div>
    </>
  );
}
function Contacts() {
  const [items, setItems] = useState<Contact[]>([]),
    [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [copied, setCopied] = useState("");
  useEffect(() => {
    void api<Contact[]>("/api/admin/contacts")
      .then(setItems)
      .catch((e) => setError(e.message));
  }, []);
  return (
    <>
      <div className="studio-title">
        <h1>访客留言</h1>
        <span className="tag">
          {items.filter((item) => item.status !== "read").length} 条未读
        </span>
      </div>
      <div className="message-admin-filters">
        <input
          aria-label="搜索留言"
          placeholder="搜索话题、姓名、联系方式或正文…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          aria-label="筛选留言状态"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">全部留言</option>
          <option value="unread">未读</option>
          <option value="read">已读</option>
        </select>
      </div>
      {error && <p role="alert">{error}</p>}
      {!items.length && <p className="empty-state">暂时没有留言。</p>}
      {items
        .filter(
          (item) =>
            (!filter || item.status === filter) &&
            `${item.role} ${item.delivery} ${item.problem} ${item.contact_info}`
              .toLowerCase()
              .includes(query.toLowerCase()),
        )
        .map((m) => (
          <article className="contact-message" key={m.id}>
            <div className="editor-header">
              <div>
                <strong>
                  {m.role} · {m.delivery}
                </strong>
                <p>{m.contact_info}</p>
              </div>
              <span className="tag">
                {m.status === "read" ? "已读" : "未读"}
              </span>
            </div>
            <p>{m.problem}</p>
            <div className="message-details">
              <span>时间安排：{m.timeline}</span>
              {(() => {
                try {
                  const detail = JSON.parse(m.metadata || "{}");
                  return ["project", "budget", "contactMethod"].map(
                    (key, index) =>
                      detail[key] ? (
                        <span key={key}>
                          {["关联项目", "预算情况", "回复方式"][index]}：
                          {String(detail[key])}
                        </span>
                      ) : null,
                  );
                } catch {
                  return null;
                }
              })()}
            </div>
            <small>{m.created_at}</small>
            <div className="button-row">
              <button
                className="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(m.contact_info);
                    setCopied(m.id);
                  } catch {
                    setError("复制受限，可手动选择联系方式复制。");
                  }
                }}
              >
                {copied === m.id ? <Check size={16} /> : <Copy size={16} />}
                {copied === m.id ? "已复制" : "复制联系方式"}
              </button>
              {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.contact_info) && (
                <a
                  className="button"
                  href={`mailto:${encodeURIComponent(m.contact_info)}?subject=${encodeURIComponent(`回复：${m.delivery}`)}`}
                >
                  <Mail size={16} />
                  邮件回复
                </a>
              )}
              <button
                className="text-link"
                onClick={async () => {
                  try {
                    const status = m.status === "read" ? "unread" : "read";
                    await api(
                      `/api/admin/contacts/${m.id}`,
                      request("PATCH", { status }),
                    );
                    setItems(
                      items.map((x) => (x.id === m.id ? { ...x, status } : x)),
                    );
                  } catch (e) {
                    setError((e as Error).message);
                  }
                }}
              >
                标记为{m.status === "read" ? "未读" : "已读"}
              </button>
            </div>
          </article>
        ))}
    </>
  );
}
function SiteSettings() {
  const { data, refresh } = useGarden(),
    [value, setValue] = useState<Settings>(data.settings),
    [model, setModel] = useState<Model | null>(null),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    void api<Settings>("/api/admin/settings")
      .then(setValue)
      .catch((e) => setMessage(e.message));
    void api<Model>("/api/admin/llm/status")
      .then(setModel)
      .catch((e) => setMessage(e.message));
  }, []);
  return (
    <>
      <div className="studio-title">
        <h1>站点设置</h1>
      </div>
      <form
        className="settings-form"
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await api("/api/admin/settings", request("PUT", value));
            await refresh();
            setMessage("站点设置已保存");
          } catch (err) {
            setMessage((err as Error).message);
          }
        }}
      >
        <label>
          站点名称
          <input
            value={value.name}
            onChange={(e) => setValue({ ...value, name: e.target.value })}
          />
        </label>
        <label>
          首页介绍
          <textarea
            rows={3}
            value={value.intro.zh}
            onChange={(e) =>
              setValue({
                ...value,
                intro: { ...value.intro, zh: e.target.value },
              })
            }
          />
        </label>
        <label>
          关于我
          <textarea
            rows={5}
            value={value.about.zh}
            onChange={(e) =>
              setValue({
                ...value,
                about: { ...value.about, zh: e.target.value },
              })
            }
          />
        </label>
        <fieldset>
          <legend>首页展示项目（按选择顺序，最多 8 个）</legend>
          <p className="metadata">项目自身的“首页展示”开关也需要打开。</p>
          {data.projects.map((p) => (
            <label key={p.slug} className="field-check">
              <input
                type="checkbox"
                checked={value.homeProjects.includes(p.slug)}
                onChange={(e) =>
                  setValue({
                    ...value,
                    homeProjects: e.target.checked
                      ? [...value.homeProjects, p.slug].slice(0, 8)
                      : value.homeProjects.filter((s) => s !== p.slug),
                  })
                }
              />
              {p.title.zh}
            </label>
          ))}
        </fieldset>
        <button className="button primary">保存设置</button>
        <p role="status">{message}</p>
        <section className="notice">
          <h2>写作模型</h2>
          <p>
            {model?.configured
              ? `已配置：${model.model}`
              : "未配置。排版、润色、摘要和翻译共用服务端统一提示词。"}
          </p>
          <p>
            在服务器 .env 设置 LLM_BASE_URL、LLM_API_KEY 和 LLM_MODEL
            后重启。密钥不会发送到浏览器，也不保存在内容数据库。
          </p>
          <button
            type="button"
            className="button"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await api("/api/admin/llm/test", request("POST"));
                setMessage("模型连接正常");
              } catch (e) {
                setMessage((e as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? "正在测试…" : "测试模型连接"}
          </button>
        </section>
        <section className="notice">
          <h2>账号与备份</h2>
          <p>
            这是私人写作台，无公众注册。账号密码由服务端
            ADMIN_USERNAME、ADMIN_PASSWORD
            设置；没有配置时，首次启动自动生成并写入
            server/data/admin-secret.txt。
          </p>
          <p>
            定期备份 server/data/personweb.db 和
            public/uploads。首次重构前的备份保存在
            server/data/backups/pre-garden-20261019。
          </p>
        </section>
      </form>
    </>
  );
}
