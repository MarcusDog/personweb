import { useState, useEffect, useRef } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  PenLine,
  Mail,
  Rss,
  Link2,
  Check,
  Search,
  ExternalLink,
  X,
} from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { usePageTitle } from "../hooks/usePageTitle";
import { extractMarkdownHeadings } from "../lib/markdown";
import { useGarden } from "./context";
import {
  ArticleRow,
  Empty,
  Gallery,
  PageTitle,
  ProjectCard,
  ProjectCover,
  Prose,
  SectionTitle,
  dateFor,
  moodFor,
  textFor,
} from "./components";
import type { Book, Note, Post, GardenProject } from "./types";
import { Reveal, Depth } from "./Motion";
import { BookCover } from "./BookCover";

function useCopy() {
  const { language } = useLanguage();
  return (zh: string, en: string) => (language === "zh" ? zh : en);
}
function BookTiles({ books }: { books: Book[] }) {
  const { language } = useLanguage();
  return (
    <div className="book-tiles">
      {books.map((b) => (
        <Link to={`/reading?book=${encodeURIComponent(b.slug)}`} key={b.id}>
          <BookCover book={b} />
          <h3>{textFor(b.title, language)}</h3>
          <p className="book-author">{b.author}</p>
          <span className={`book-status ${b.readingStatus}`}>
            {{ reading: "在读", read: "已读", wish: "想读" }[b.readingStatus]}
          </span>
        </Link>
      ))}
    </div>
  );
}
function NoteList({ notes }: { notes: Note[] }) {
  const { language } = useLanguage();
  return (
    <div className="note-list">
      {notes.map((n) => (
        <article key={n.id}>
          <time>{dateFor(n.date).slice(5)}</time>
          <span className="note-dot" />
          <div>
            <Prose body={textFor(n.body, language)} />
            {!!n.images?.length && (
              <Gallery
                items={n.images.map((image) => ({ image, title: "随想图片" }))}
              />
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
export function Home() {
  const { data, username } = useGarden();
  const { language } = useLanguage();
  const t = useCopy();
  usePageTitle("小天Aya｜项目、代码与生活");
  const picked = data.settings.homeProjects
    .map((slug) => data.projects.find((p) => p.slug === slug))
    .filter((p): p is GardenProject => !!p && !!p.homeFeatured)
    .slice(0, 4);
  return (
    <div className="container">
      <section className="home-hero">
        <div className="hero-copy">
          <Reveal>
            <p className="eyebrow">INDEPENDENT DEVELOPER · PERSONAL JOURNAL</p>
          </Reveal>
          <Reveal delay={0.07}>
            <h1>
              {t("你好，", "Hello,")}
              <br />
              {t("我是小天。", "I’m Tian.")}
            </h1>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="hero-intro">
              {textFor(data.settings.intro, language)}
            </p>
          </Reveal>
          <Reveal delay={0.21}>
            <div className="button-row">
              <Link className="button primary" to="/projects">
                {t("看看我在做什么", "Explore my work")}
                <ArrowRight size={16} />
              </Link>
              <Link className="button" to="/journal">
                {t("阅读最新文章", "Read the journal")}
              </Link>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.21}>
          <Depth className="hero-portrait">
            <span className="hero-watermark" aria-hidden="true">
              天
            </span>
            <img
              src="/garden/aya-avatar-choice-960.webp"
              srcSet="/garden/aya-avatar-choice-480.webp 480w, /garden/aya-avatar-choice-960.webp 960w"
              sizes="(max-width: 700px) 210px, 290px"
              alt="小天 Aya 的插画头像"
              width="290"
              height="362"
              fetchPriority="high"
            />
            <span className="handwritten" aria-hidden="true">
              把想法
              <br />
              变成一个
              <br />
              可用的版本。<small>— Aya</small>
            </span>
            <p>在技术、生活与创造之间，找到自己的节奏。</p>
          </Depth>
        </Reveal>
      </section>
      <Reveal>
        <section className="home-section">
          <SectionTitle
            title={t("最近写的", "Recent writing")}
            en="JOURNAL"
            to="/journal"
          />
          <div>
            {data.posts.slice(0, 3).map((p) => (
              <ArticleRow key={p.slug} post={p} />
            ))}
          </div>
          {!data.posts.length && (
            <Empty>
              第一篇文章正在酝酿。
              {username && <Link to="/studio">去写一篇</Link>}
            </Empty>
          )}
        </section>
      </Reveal>
      <Reveal>
        <section className="home-section">
          <SectionTitle
            title={t("正在做的", "Selected projects")}
            en="SELECTED WORK"
            to="/projects"
          />
          <div className="project-grid home-projects">
            {picked.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 2) * 0.07}>
                <ProjectCard project={p} depth />
              </Reveal>
            ))}
          </div>
        </section>
      </Reveal>
      <Reveal>
        <div
          className={`home-columns ${!data.notes.length ? "books-only" : ""}`}
        >
          {!!data.notes.length && (
            <section>
              <SectionTitle title="最近的随想" en="Short Notes" to="/notes" />
              {data.notes.length ? (
                <NoteList notes={data.notes.slice(0, 5)} />
              ) : (
                <Empty>
                  一些零散的念头，会慢慢记在这里。
                  {username && (
                    <Link to="/studio">
                      写一条随想 <ArrowRight size={14} />
                    </Link>
                  )}
                </Empty>
              )}
            </section>
          )}
          <section>
            <SectionTitle title="我的书架" en="READING LIST" to="/reading" />
            {data.books.length ? (
              <BookTiles books={data.books.slice(0, 4)} />
            ) : (
              <Empty>
                <BookOpen size={25} />
                <p>读过的书，留下的思考。书架还在整理中。</p>
                {username && <Link to="/studio">添加第一本书</Link>}
              </Empty>
            )}
          </section>
        </div>
      </Reveal>
      <Reveal>
        <section className="home-about home-section editorial-about">
          <div>
            <p className="eyebrow">A LITTLE ABOUT ME</p>
            <h2>
              我叫小天，一个
              <br className="desktop-break" />
              喜欢把想法变成现实的人。
            </h2>
            <p>{textFor(data.settings.about, language)}</p>
            <div className="button-row">
              <Link className="button primary" to="/about">
                关于我 <ArrowRight size={17} />
              </Link>
              <Link className="text-link" to="/contact">
                联系我 <ArrowRight size={17} />
              </Link>
            </div>
          </div>
          <p className="about-margin-note">
            保持好奇，
            <br />
            也给生活留一点空白。<span>BUILD SLOWLY. THINK CLEARLY.</span>
          </p>
        </section>
      </Reveal>
    </div>
  );
}

function FeaturedArticle({
  post,
  small = false,
}: {
  post: Post;
  small?: boolean;
}) {
  const { language } = useLanguage();
  return (
    <Link
      className={`featured-article ${small ? "small" : ""}`}
      to={`/journal/${post.slug}`}
    >
      <img
        src={post.coverImage || moodFor(post.slug)}
        alt=""
        width="480"
        height="320"
        loading="lazy"
      />
      <div>
        <span className="tag">{textFor(post.category, language)}</span>
        <h2>{textFor(post.title, language)}</h2>
        <p>{textFor(post.standfirst, language)}</p>
        <div className="metadata">
          {dateFor(post.date)} ·{" "}
          {Math.max(1, Math.ceil(textFor(post.body, language).length / 450))}{" "}
          min read <ArrowRight size={15} />
        </div>
      </div>
    </Link>
  );
}
export function Journal() {
  const { data, username } = useGarden();
  const { language } = useLanguage();
  const [params, setParams] = useSearchParams();
  usePageTitle("文章｜小天Aya");
  const q = params.get("q") || "",
    cat = params.get("category") || "",
    tag = params.get("tag") || "",
    year = params.get("year") || "";
  const filter = (key: string, value: string) =>
    setParams((p) => {
      const n = new URLSearchParams(p);
      if (value) n.set(key, value);
      else n.delete(key);
      return n;
    });
  const categories = [
    ...new Set(data.posts.map((p) => textFor(p.category, language))),
  ];
  const tags = [...new Set(data.posts.flatMap((p) => p.tags))];
  const years = [...new Set(data.posts.map((p) => p.date.slice(0, 4)))];
  const shown = data.posts.filter(
    (p) =>
      (!q ||
        [
          textFor(p.title, language),
          textFor(p.standfirst, language),
          textFor(p.body, language),
          p.tags.join(" "),
        ]
          .join(" ")
          .toLowerCase()
          .includes(q.toLowerCase())) &&
      (!cat || textFor(p.category, language) === cat) &&
      (!tag || p.tags.includes(tag)) &&
      (!year || p.date.startsWith(year)),
  );
  const featured = [
    ...data.posts.filter((p) => p.featured),
    ...data.posts.filter((p) => !p.featured),
  ].slice(0, 3);
  return (
    <div className="container">
      <PageTitle
        eyebrow="JOURNAL"
        title="写给时间的笔记。"
        description="技术、创造、生活，以及那些还没想明白的事。"
        action={
          <Link className="button" to="/studio">
            <PenLine size={16} />
            {username ? "写文章" : "登录管理"}
          </Link>
        }
      />
      {featured.length > 0 && !q && !cat && !tag && !year && (
        <section className="journal-featured">
          <SectionTitle title="精选文章" />
          <div
            className={`featured-grid ${featured.length === 1 ? "single" : ""}`}
          >
            <FeaturedArticle post={featured[0]} />
            <div>
              {featured.slice(1).map((p) => (
                <FeaturedArticle key={p.slug} post={p} small />
              ))}
            </div>
          </div>
        </section>
      )}
      <div className="journal-layout">
        <section>
          <SectionTitle title="全部文章" en={`${shown.length} 篇`} />
          {shown.map((p) => (
            <ArticleRow key={p.slug} post={p} />
          ))}
          {!shown.length && (
            <Empty>
              没有匹配的文章。
              <button className="button" onClick={() => setParams({})}>
                清除筛选
              </button>
            </Empty>
          )}
        </section>
        <aside className="journal-sidebar">
          <label className="search-field">
            <Search size={17} />
            <input
              type="search"
              aria-label="搜索文章"
              placeholder="搜索文章、关键词、标签…"
              value={q}
              onChange={(e) => filter("q", e.target.value)}
            />
          </label>
          <section>
            <h3>分类</h3>
            <div className="filter-chips">
              <button
                aria-pressed={!cat}
                onClick={() => filter("category", "")}
              >
                全部 {data.posts.length}
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  aria-pressed={cat === c}
                  onClick={() => filter("category", c)}
                >
                  {c}{" "}
                  <small>
                    {
                      data.posts.filter(
                        (p) => textFor(p.category, language) === c,
                      ).length
                    }
                  </small>
                </button>
              ))}
            </div>
          </section>
          <section>
            <h3>标签</h3>
            <div className="filter-chips">
              {tags.map((t) => (
                <button
                  key={t}
                  aria-pressed={tag === t}
                  onClick={() => filter("tag", tag === t ? "" : t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </section>
          <section>
            <h3>归档</h3>
            {years.map((y) => (
              <button
                className="archive-year"
                key={y}
                aria-pressed={year === y}
                onClick={() => filter("year", year === y ? "" : y)}
              >
                {y}
                <span>
                  {data.posts.filter((p) => p.date.startsWith(y)).length}{" "}
                  <ArrowRight size={14} />
                </span>
              </button>
            ))}
          </section>
          {!!data.notes.length && (
            <section className="sidebar-note">
              <h3>随手记录</h3>
              <NoteList notes={data.notes.slice(0, 3)} />
            </section>
          )}
          {data.books.some((b) => b.readingStatus === "reading") && (
            <section>
              <h3>最近在读</h3>
              <BookTiles
                books={data.books
                  .filter((b) => b.readingStatus === "reading")
                  .slice(0, 1)}
              />
            </section>
          )}
          <Link className="rss-card" to="/subscribe">
            <Rss size={23} />
            <div>
              <h3>订阅更新</h3>
              <p>文章、读书，按你的节奏接收更新。</p>
            </div>
            <ArrowRight size={15} />
          </Link>
        </aside>
      </div>
    </div>
  );
}

export function Article() {
  const { slug } = useParams();
  const { data, username } = useGarden();
  const { language } = useLanguage();
  const [copy, setCopy] = useState(false);
  const [copyError, setCopyError] = useState("");
  const [wide, setWide] = useState(() => window.innerWidth > 800);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 801px)");
    const changed = () => setWide(media.matches);
    media.addEventListener("change", changed);
    return () => media.removeEventListener("change", changed);
  }, []);
  const post = data.posts.find((p) => p.slug === slug);
  usePageTitle(
    post ? `${textFor(post.title, language)}｜小天Aya` : "文章｜小天Aya",
  );
  if (!post) return <Missing />;
  const body = textFor(post.body, language);
  const headings = extractMarkdownHeadings(body);
  return (
    <div className="container article-page">
      <Link className="text-link" to="/journal">
        ← 返回文章
      </Link>
      <header className="article-header">
        <div className="metadata">
          {dateFor(post.date)}
          <span className="tag">{textFor(post.category, language)}</span>
          <span>{Math.max(1, Math.ceil(body.length / 450))} 分钟阅读</span>
        </div>
        <h1>{textFor(post.title, language)}</h1>
        <p className="intro-text">{textFor(post.standfirst, language)}</p>
        <div className="article-byline">
          <img
            src="/garden/aya-avatar-choice-480.webp"
            alt=""
            width="32"
            height="32"
          />
          <span>小天Aya</span>
          <button
            className="text-link"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(
                  `${location.origin}/journal/${post.slug}`,
                );
                setCopy(true);
                window.setTimeout(() => setCopy(false), 1800);
              } catch {
                setCopyError("复制失败，请复制浏览器地址栏链接");
              }
            }}
          >
            {copy ? <Check size={15} /> : <Link2 size={15} />}{" "}
            {copy ? "已复制" : "复制链接"}
          </button>
          {username && (
            <Link
              className="text-link"
              to={`/studio?kind=posts&edit=${post.id}`}
            >
              编辑文章
            </Link>
          )}
        </div>
        {copyError && <p role="status">{copyError}</p>}
      </header>
      <div className="article-layout">
        <article>
          <img
            className="article-cover"
            src={post.coverImage || moodFor(post.slug)}
            alt="文章氛围封面"
            width="960"
            height="600"
          />
          <Prose body={body} />
          <div className="tags article-tags">
            {post.tags.map((t) => (
              <Link
                className="tag"
                to={`/journal?tag=${encodeURIComponent(t)}`}
                key={t}
              >
                {t}
              </Link>
            ))}
          </div>
        </article>
        {!!headings.length && (
          <aside className="article-toc">
            <details open={wide}>
              <summary>目录</summary>
              <nav>
                {headings.map((h, i) => (
                  <a
                    key={`${h.id}-${i}`}
                    href={`#${h.id}`}
                    className={h.depth === 3 ? "nested" : ""}
                  >
                    {h.text}
                  </a>
                ))}
              </nav>
            </details>
          </aside>
        )}
      </div>
      <section className="related-writing">
        <SectionTitle title="接着读" to="/journal" />
        {data.posts
          .filter((p) => p.slug !== slug)
          .slice(0, 2)
          .map((p) => (
            <ArticleRow key={p.slug} post={p} />
          ))}
      </section>
    </div>
  );
}

export function Projects() {
  const { data } = useGarden();
  const [params, setParams] = useSearchParams();
  const { language } = useLanguage();
  usePageTitle("项目｜小天Aya");
  const type = params.get("type") || "";
  const status = params.get("status") || "";
  const types = [
    ...new Set(
      data.projects.map((p) =>
        textFor(p.category, language).split("/")[0].trim(),
      ),
    ),
  ];
  const shown = data.projects.filter(
    (p) =>
      (!type || textFor(p.category, language).startsWith(type)) &&
      (!status || p.projectStatus === status),
  );
  function filter(key: string, value: string) {
    setParams((p) => {
      const n = new URLSearchParams(p);
      if (value) n.set(key, value);
      else n.delete(key);
      return n;
    });
  }
  return (
    <div className="container">
      <PageTitle
        eyebrow="PROJECTS"
        title="把想法做成可以用的东西。"
        description="做过的产品、小工具，以及仍在继续的实验。"
      />
      <div className="project-filters">
        <div className="filter-chips">
          <button aria-pressed={!type} onClick={() => filter("type", "")}>
            全部 {data.projects.length}
          </button>
          {types.map((t) => (
            <button
              key={t}
              aria-pressed={type === t}
              onClick={() => filter("type", t)}
            >
              {t}
            </button>
          ))}
        </div>
        <label>
          状态{" "}
          <select
            value={status}
            onChange={(e) => filter("status", e.target.value)}
          >
            <option value="">全部状态</option>
            {[
              ...new Set(
                data.projects.map((p) => p.projectStatus || "项目档案"),
              ),
            ].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="project-grid all-projects">
        {shown.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
      {!shown.length && <Empty>这个分类还没有项目。</Empty>}
    </div>
  );
}
export function ProjectDetail() {
  const { slug } = useParams();
  const { data, username } = useGarden();
  const { language } = useLanguage();
  const project = data.projects.find((p) => p.slug === slug);
  usePageTitle(
    project ? `${textFor(project.title, language)}｜小天Aya` : "项目｜小天Aya",
  );
  if (!project) return <Missing />;
  const groups = project.showcaseGroups || [];
  const shotGroup = (after: string | number) =>
    groups
      .filter((g) => g.afterSection === after)
      .map((g, i) => (
        <section className="case-section" key={g.title.zh + i}>
          <h2>{textFor(g.title, language)}</h2>
          <p>{textFor(g.description, language)}</p>
          <Gallery
            items={g.items.map((item) => ({
              image: item.image,
              original: item.original,
              title: textFor(item.title, language),
              description: textFor(item.description, language),
            }))}
          />
        </section>
      ));
  return (
    <div className="container case-page">
      <Link className="text-link" to="/projects">
        ← 所有项目
      </Link>
      <PageTitle
        eyebrow={`${project.year} / ${textFor(project.category, language)}`}
        title={textFor(project.title, language)}
        description={textFor(project.subtitle, language)}
      />
      <div className="case-actions">
        <span className="status-dot">
          {project.projectStatus || "项目档案"}
        </span>
        {project.externalLinks?.map((l) => (
          <a
            className="button"
            key={l.url}
            href={l.url}
            target="_blank"
            rel="noreferrer"
          >
            {textFor(l.label, language)}
            <ExternalLink size={15} />
          </a>
        ))}
        {username && (
          <Link
            className="text-link"
            to={`/studio?kind=projects&edit=${project.id}`}
          >
            编辑项目
          </Link>
        )}
      </div>
      <div className="case-cover">
        <ProjectCover project={project} />
      </div>
      <div className="case-summary">
        <div>
          <h2>关于这个项目</h2>
          <p>{textFor(project.summary, language)}</p>
        </div>
        <dl>
          <dt>我的工作</dt>
          <dd>{textFor(project.role, language)}</dd>
          <dt>当前进展</dt>
          <dd>{textFor(project.result, language)}</dd>
          <dt>涉及方向</dt>
          <dd>
            <div className="tags">
              {project.capabilities.map((c) => (
                <span className="tag" key={c.zh}>
                  {textFor(c, language)}
                </span>
              ))}
            </div>
          </dd>
        </dl>
      </div>
      {shotGroup("summary")}
      <section className="case-section prose">
        <h2>为什么做</h2>
        <p>{textFor(project.challenge, language)}</p>
        <h2>怎么实现</h2>
        <p>{textFor(project.approach, language)}</p>
      </section>
      {project.detailSections.map((s, i) => (
        <div key={s.title.zh}>
          <section className="case-section prose">
            <h2>{textFor(s.title, language)}</h2>
            {s.paragraphs.map((p, j) => (
              <p key={j}>{textFor(p, language)}</p>
            ))}
          </section>
          {shotGroup(i)}
          {shotGroup(i + 1).length > 0 &&
          i === project.detailSections.length - 1
            ? shotGroup(i + 1)
            : null}
        </div>
      ))}
      {!groups.length && project.gallery.some((i) => i.image) && (
        <Gallery
          items={project.gallery
            .filter((i) => i.image)
            .map((i) => ({
              image: i.image!,
              original: i.original,
              title: textFor(i.label, language),
              description: textFor(i.description, language),
            }))}
        />
      )}
      <section className="case-section prose">
        <h2>做到哪里了</h2>
        <p>{textFor(project.outcome, language)}</p>
        <p>{textFor(project.nextStep, language)}</p>
      </section>
      {shotGroup("outcome")}
      <section className="case-section">
        <SectionTitle title="其他项目" to="/projects" />
        <div className="project-grid home-projects">
          {data.projects
            .filter((p) => p.slug !== slug)
            .slice(0, 2)
            .map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
        </div>
      </section>
    </div>
  );
}

export function Notes() {
  const { data, username } = useGarden();
  usePageTitle("随想｜小天Aya");
  return (
    <div className="container narrow-page">
      <PageTitle
        eyebrow="SHORT NOTES"
        title="随手记下来的。"
        description="一些念头，生活中的小事，还有没想明白的问题。"
        action={
          username ? (
            <Link className="button" to="/studio?kind=notes">
              写随想
            </Link>
          ) : undefined
        }
      />
      {data.notes.length ? (
        <NoteList notes={data.notes} />
      ) : (
        <Empty>
          <PenLine size={24} />
          <p>这里会收下那些不需要写成长文的记录。</p>
          <Link className="text-link" to="/journal">
            先看看文章 <ArrowRight size={15} />
          </Link>
        </Empty>
      )}
    </div>
  );
}
export function Reading() {
  const { data, username } = useGarden();
  const { language } = useLanguage();
  const [params, setParams] = useSearchParams();
  const state = params.get("status") || "";
  const selectedBook = params.get("book");
  const selected = data.books.find((b) => b.slug === selectedBook);
  const dialog = useRef<HTMLDialogElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!selected) return;
    const panel = dialog.current;
    lastFocus.current = document.activeElement as HTMLElement;
    panel?.showModal();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      panel?.close();
      document.body.style.overflow = oldOverflow;
      lastFocus.current?.focus();
    };
  }, [selected]);
  const closeBook = () =>
    setParams(
      (p) => {
        const next = new URLSearchParams(p);
        next.delete("book");
        return next;
      },
      { replace: true },
    );
  usePageTitle("读书｜小天Aya");
  const shown = data.books.filter((b) => !state || b.readingStatus === state);
  return (
    <div className="container">
      <PageTitle
        eyebrow="READING"
        title="想读的书，值得留的问题。"
        description="科技与人文放在一起读。新增书目先放进想读清单，读到哪里，再留下真实的笔记。"
        action={
          username ? (
            <Link className="button" to="/studio?kind=books">
              添加书籍
            </Link>
          ) : undefined
        }
      />
      <div className="filter-chips reading-filters">
        {[
          ["", "全部"],
          ["reading", "在读"],
          ["read", "已读"],
          ["wish", "想读"],
        ].map(([v, l]) => (
          <button
            key={v}
            aria-pressed={state === v}
            onClick={() =>
              setParams((p) => {
                const next = new URLSearchParams(p);
                if (v) next.set("status", v);
                else next.delete("status");
                return next;
              })
            }
          >
            {l}
          </button>
        ))}
      </div>
      {shown.length ? (
        <div className="reading-shelf">
          {shown.map((b) => (
            <Reveal key={b.id}>
              <button
                className="shelf-book"
                onClick={() =>
                  setParams((p) => {
                    const next = new URLSearchParams(p);
                    next.set("book", b.slug);
                    return next;
                  })
                }
                aria-label={`查看 ${textFor(b.title, language)}`}
              >
                <BookCover book={b} />
                <div className="shelf-book-caption">
                  <span className={`book-status ${b.readingStatus}`}>
                    {
                      { reading: "在读", read: "已读", wish: "想读" }[
                        b.readingStatus
                      ]
                    }
                  </span>
                  <h2>{textFor(b.title, language)}</h2>
                  <p>{b.author}</p>
                  <span className="shelf-book-more">
                    查看书目 <ArrowRight size={16} />
                  </span>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      ) : (
        <Empty>
          <BookOpen size={30} />
          <p>书架还在整理，读到的东西会陆续放上来。</p>
          {username && (
            <Link className="button" to="/studio?kind=books">
              添加第一本书
            </Link>
          )}
        </Empty>
      )}
      <dialog
        ref={dialog}
        className="book-dialog"
        aria-labelledby="book-dialog-title"
        onCancel={(e) => {
          e.preventDefault();
          closeBook();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeBook();
        }}
      >
        {selected && (
          <>
            <button
              className="icon-button book-dialog-close"
              autoFocus
              aria-label="关闭书籍详情"
              onClick={closeBook}
            >
              <X size={22} />
            </button>
            <div className="book-dialog-heading">
              <BookCover book={selected} />
              <div>
                <p className="eyebrow">READING NOTES</p>
                <h2 id="book-dialog-title">
                  {textFor(selected.title, language)}
                </h2>
                <p>{selected.author}</p>
                <p className="book-edition">
                  {selected.coverEdition}
                  {selected.isbn && ` · ISBN ${selected.isbn}`}
                </p>
                <span className={`book-status ${selected.readingStatus}`}>
                  {
                    { reading: "在读", read: "已读", wish: "想读" }[
                      selected.readingStatus
                    ]
                  }
                </span>
              </div>
            </div>
            <Prose body={textFor(selected.body, language)} />
            {selected.readingStatus === "reading" && (
              <label>
                阅读进度 {selected.progress}%
                <progress max={100} value={selected.progress} />
              </label>
            )}
            {selected.relatedSlug && (
              <Link
                className="text-link"
                to={`/journal/${selected.relatedSlug}`}
              >
                延伸阅读 <ArrowRight size={16} />
              </Link>
            )}
            {selected.coverSourceUrl && (
              <a
                className="cover-attribution text-link"
                href={selected.coverSourceUrl}
                target="_blank"
                rel="noreferrer"
              >
                书封来源：{selected.coverSource || "Open Library"}{" "}
                <ExternalLink size={14} />
              </a>
            )}
          </>
        )}
      </dialog>
    </div>
  );
}
export function About() {
  const { data } = useGarden();
  const { language } = useLanguage();
  usePageTitle("关于｜小天Aya");
  return (
    <div className="container about-page">
      <PageTitle
        eyebrow="ABOUT"
        title="我叫小天。"
        description="独立开发者，也是一个还在不断学习的人。"
      />
      <div className="about-intro">
        <div>
          <p className="large-copy">{textFor(data.settings.about, language)}</p>
          <p>
            最近花时间最多的，是把 AI
            接到具体的工具里：做菜时能跟上的菜谱、能回到原音频的转写工作台，以及方便追踪来源的资讯平台。
          </p>
          <p>
            开发之外，我也想把读书、做饭和生活里的观察留在这里。项目会更新，想法也会变，写下来方便以后回头看。
          </p>
          <div className="button-row">
            <Link className="button primary" to="/projects">
              我做过的项目 <ArrowRight size={15} />
            </Link>
            <Link className="button" to="/journal">
              最近写的文章
            </Link>
          </div>
        </div>
        <figure>
          <img
            src="/garden/aya-avatar-choice-960.webp"
            alt="小天的插画头像"
            width="320"
            height="400"
          />
          <figcaption>在技术、生活与创造之间。</figcaption>
        </figure>
      </div>
      <Reveal>
        <section className="editorial-now">
          <div>
            <p className="eyebrow">NOW / EXPLORING</p>
            <h2>现在关注的事</h2>
          </div>
          <div>
            <p className="large-copy">让工具更可靠，也让使用它的人保留判断。</p>
            <p>
              我在琢磨本地优先的 AI
              工具、长任务中断后的恢复，以及能检查、能继续修改的生成结果。比起多加一个功能，我更想弄清楚：它在什么时候真正帮得上忙。
            </p>
            <Link className="text-link" to="/journal">
              这些问题，慢慢写在文章里 <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </Reveal>
      <Reveal>
        <section className="editorial-collaboration">
          <div className="callout-copy">
            <p className="eyebrow">LET’S MAKE SOMETHING USEFUL</p>
            <h2>一起做点什么。</h2>
            <p>
              如果你有一个想做的产品，或一段每天都在重复的流程，可以告诉我具体遇到了什么。
            </p>
            <div className="button-row prominent-actions">
              <Link className="button primary" to="/contact">
                <Mail size={20} /> 聊聊你的想法 <ArrowRight size={19} />
              </Link>
              <Link className="text-link" to="/commercial">
                了解合作方式 <ArrowRight size={19} />
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
export function Commercial() {
  const { data } = useGarden();
  usePageTitle("合作｜小天Aya");
  return (
    <div className="container">
      <PageTitle
        eyebrow="WORK TOGETHER"
        title="从一个具体的问题开始。"
        description="AI 工具、桌面应用、小程序和自动化流程。先聊清楚谁在用、卡在哪里，再确定第一版的范围。"
        action={
          <Link className="button primary" to="/contact">
            聊聊你的想法 <ArrowRight size={15} />
          </Link>
        }
      />
      <section className="home-section">
        <SectionTitle title="不同场景里的实践" en="Selected Work" />
        <p className="section-description">
          这里包含个人产品和自动化项目，用来说明我做过哪些方向。具体合作范围会另行确认。
        </p>
        <div className="project-grid home-projects">
          {data.projects
            .filter((p) => p.commercialFeatured)
            .map((p) => (
              <ProjectCard key={p.slug} project={p} showIdentity />
            ))}
        </div>
      </section>
      <section className="home-section">
        <SectionTitle title="怎么合作" />
        <ol className="process-list">
          {[
            ["聊清楚问题", "从现有流程、使用对象和预期结果开始。"],
            ["确定第一版", "把要做的功能、验收方式和时间写清楚。"],
            ["交付可用版本", "用实际材料测试，留下运行与维护说明。"],
            ["继续迭代", "根据使用反馈决定下一步，而不是先堆功能。"],
          ].map(([h, p], i) => (
            <li key={h}>
              <span>0{i + 1}</span>
              <h3>{h}</h3>
              <p>{p}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
export function Missing() {
  usePageTitle("页面不存在｜小天Aya");
  return (
    <div className="container">
      <PageTitle
        eyebrow="404"
        title="这一页暂时找不到。"
        description="地址可能已经变了，也可以从文章和项目继续逛。"
      />
      <Link className="button primary" to="/">
        回到首页 <ArrowRight size={15} />
      </Link>
    </div>
  );
}
