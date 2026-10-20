import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import {
  Search,
  Menu,
  X,
  Moon,
  Sun,
  Monitor,
  Code2,
  Mail,
  Rss,
  ArrowUpRight,
  PenLine,
} from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { useGarden } from "./context";
import { textFor } from "./text";

const navigation = [
  ["/", "首页", "Home"],
  ["/journal", "文章", "Journal"],
  ["/notes", "随想", "Notes"],
  ["/projects", "项目", "Projects"],
  ["/reading", "读书", "Reading"],
  ["/about", "关于", "About"],
];
export function Shell() {
  const { language, setLanguage } = useLanguage();
  const { data, username, theme, setTheme } = useGarden();
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  const [query, setQuery] = useState("");
  const search = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        search.current?.showModal();
      }
      if (e.key === "Escape") {
        setMenu(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  const results = [
    ...data.posts.map((p) => ({
      title: textFor(p.title, language),
      body: textFor(p.standfirst, language),
      to: `/journal/${p.slug}`,
      kind: "文章",
    })),
    ...data.projects.map((p) => ({
      title: textFor(p.title, language),
      body: textFor(p.subtitle, language),
      to: `/projects/${p.slug}`,
      kind: "项目",
    })),
    ...data.books.map((p) => ({
      title: textFor(p.title, language),
      body: p.author,
      to: `/reading?book=${encodeURIComponent(p.slug)}`,
      kind: "读书",
    })),
    ...data.notes.map((p) => ({
      title: textFor(p.body, language).slice(0, 60),
      body: p.tags.join(" "),
      to: "/notes",
      kind: "随想",
    })),
  ]
    .filter(
      (r) =>
        query.trim() &&
        `${r.title} ${r.body}`.toLowerCase().includes(query.toLowerCase()),
    )
    .slice(0, 12);
  return (
    <>
      <a className="skip-link" href="#main-content">
        跳到正文
      </a>
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="header-inner">
          <Link to="/" className="site-logo" onClick={() => setMenu(false)}>
            {data.settings.name}
          </Link>
          <nav className="desktop-nav" aria-label="主导航">
            {navigation.map(([to, zh, en]) => (
              <NavLink end={to === "/"} key={to} to={to}>
                {language === "zh" ? zh : en}
              </NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <button
              className="icon-button"
              aria-label="搜索全站"
              title="搜索 Ctrl K"
              onClick={() => search.current?.showModal()}
            >
              <Search size={18} />
            </button>
            <div className="language-control">
              <button
                aria-pressed={language === "zh"}
                onClick={() => setLanguage("zh")}
              >
                zh
              </button>
              <button
                aria-pressed={language === "en"}
                onClick={() => setLanguage("en")}
              >
                en
              </button>
            </div>
            <button
              className="icon-button"
              aria-label={`主题：${theme === "light" ? "浅色" : theme === "dark" ? "深色" : "跟随系统"}，点击切换`}
              onClick={() =>
                setTheme(
                  theme === "light"
                    ? "dark"
                    : theme === "dark"
                      ? "system"
                      : "light",
                )
              }
            >
              {theme === "light" ? (
                <Moon size={17} />
              ) : theme === "dark" ? (
                <Monitor size={17} />
              ) : (
                <Sun size={17} />
              )}
            </button>
            <Link className="admin-entry" to="/studio">
              <PenLine size={15} />
              {username ? "写作台" : "登录管理"}
            </Link>
            <button
              ref={menuButton}
              className="icon-button menu-toggle"
              aria-expanded={menu}
              aria-controls="mobile-navigation"
              aria-label={menu ? "关闭导航" : "打开导航"}
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
        {menu && (
          <nav
            className="mobile-nav"
            id="mobile-navigation"
            aria-label="手机导航"
          >
            {navigation.map(([to, zh, en]) => (
              <NavLink
                end={to === "/"}
                key={to}
                to={to}
                onClick={() => setMenu(false)}
              >
                {language === "zh" ? zh : en}
              </NavLink>
            ))}
            <Link to="/studio" onClick={() => setMenu(false)}>
              {username ? "进入写作台" : "管理员登录"}
            </Link>
          </nav>
        )}
      </header>
      <main id="main-content" className="site-main">
        <Outlet />
      </main>
      <footer className="site-footer editorial-footer">
        <div className="container footer-topline">
          <div className="footer-identity">
            <Link to="/" className="site-logo">
              {data.settings.name}
            </Link>
            <p>项目、代码，以及生活里的小事。</p>
          </div>
          <div className="footer-connect">
            <span className="eyebrow">KEEP IN TOUCH</span>
            <a
              className="footer-email"
              aria-label="发送邮件 2543575812@qq.com"
              href="mailto:2543575812@qq.com"
            >
              <Mail size={21} />
              2543575812@qq.com
            </a>
            <nav aria-label="社交与订阅">
              <Link to="/subscribe">
                <Rss size={17} />
                RSS 订阅
              </Link>
              <a
                href="https://github.com/MarcusDog"
                target="_blank"
                rel="noreferrer"
              >
                <Code2 size={18} />
                GitHub
              </a>
            </nav>
          </div>
        </div>
        <div className="container footer-baseline">
          <nav aria-label="页脚">
            {[
              ["/journal", "文章"],
              ["/projects", "项目"],
              ["/reading", "读书"],
              ["/about", "关于"],
              ["/contact", "留言"],
              ["/studio", "写作台"],
            ].map(([to, label]) => (
              <Link key={to} to={to}>
                {label}
              </Link>
            ))}
          </nav>
          <small>© {new Date().getFullYear()} 小天Aya</small>
        </div>
      </footer>
      <dialog
        ref={search}
        className="search-dialog"
        onClick={(e) => {
          if (e.target === e.currentTarget) search.current?.close();
        }}
      >
        <div className="search-top">
          <Search size={20} />
          <input
            autoFocus
            aria-label="搜索文章、项目、随想和书籍"
            placeholder="搜索文章、项目、随想、书籍…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className="icon-button"
            aria-label="关闭搜索"
            onClick={() => search.current?.close()}
          >
            <X size={18} />
          </button>
        </div>
        <div className="search-results">
          {!query ? (
            <p>输入关键词开始查找。Ctrl / ⌘ K 随时打开搜索。</p>
          ) : results.length ? (
            results.map((r) => (
              <Link
                key={r.to + r.title}
                to={r.to}
                onClick={() => search.current?.close()}
              >
                <span className="tag">{r.kind}</span>
                <span>{r.title}</span>
                <ArrowUpRight size={16} />
              </Link>
            ))
          ) : (
            <p>暂时没有找到，换个关键词试试。</p>
          )}
        </div>
      </dialog>
    </>
  );
}
