/* eslint-disable react-refresh/only-export-components -- Shared presentational primitives and pure text helpers. */
import { useEffect, useId, useState, useRef } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
  Code2,
  Users,
  Network,
  Sparkles,
  History,
  RefreshCw,
  Search,
  GitBranch,
  BookOpen,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useLanguage } from "../hooks/useLanguage";
import { makeHeadingId } from "../lib/markdown";
import assetManifest from "../../public/garden/manifest.json";
import { textFor } from "./text";
import { sourceLabel } from "./media";
import { Depth } from "./Motion";
import type { GardenProject, Post, Media } from "./types";

export { textFor } from "./text";
const imageSourceSet = (url: string) =>
  /^\/garden\/.*-(480|960|1600)\.webp$/.test(url)
    ? [480, 960, 1600]
        .map(
          (w) => `${url.replace(/-(480|960|1600)\.webp$/, `-${w}.webp`)} ${w}w`,
        )
        .join(", ")
    : undefined;
const originalFor = (url: string) =>
  assetManifest.find((m) => m.url === url)?.original || url;
const dimensionsFor = (url: string) => {
  const asset = assetManifest.find((m) => m.url === url || m.original === url);
  return asset ? { width: asset.width, height: asset.height } : {};
};
export const dateFor = (date: string) =>
  new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date));
export const moodFor = (slug: string) =>
  `/garden/${slug === "durable-agent-systems" || slug === "research-as-interface" ? "mountains" : "still-life"}-960.webp`;
export function SectionTitle({
  title,
  en,
  to,
  action = "查看全部",
}: {
  title: string;
  en?: string;
  to?: string;
  action?: string;
}) {
  return (
    <div className="section-heading">
      <h2>
        {title} {en && <small>{en}</small>}
      </h2>
      {to && (
        <Link className="text-link" to={to}>
          {action}
          <ArrowRight size={15} />
        </Link>
      )}
    </div>
  );
}
export function PageTitle({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <section className="page-title">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="intro-text">{description}</p>}
      </div>
      {action}
    </section>
  );
}
export function ArticleRow({ post }: { post: Post }) {
  const { language } = useLanguage();
  return (
    <Link
      className="article-row editorial-article-row"
      to={`/journal/${post.slug}`}
    >
      <div>
        <div className="metadata">
          <time dateTime={post.date}>{dateFor(post.date)}</time>
          <span className="tag">{textFor(post.category, language)}</span>
        </div>
        <h3>{textFor(post.title, language)}</h3>
        <p>{textFor(post.standfirst, language)}</p>
      </div>
      <span className="circle-arrow">
        <ArrowRight size={16} />
      </span>
    </Link>
  );
}
export function ProjectCover({ project }: { project: GardenProject }) {
  const id = useId().replace(/:/g, "");
  const n = [...project.slug].reduce((a, c) => a + c.charCodeAt(0), 0);
  const palettes = [
    ["#e7ecec", "#557580"],
    ["#eee8df", "#a08c6e"],
    ["#e5e9e2", "#708372"],
  ];
  const colors = palettes[n % 3];
  const ConceptIcon =
    (
      {
        "codex-switch": Users,
        "ayanews-skill": Network,
        promptball: Sparkles,
        "qzone-history": History,
        "code-loop": RefreshCw,
        "skill-locator": Search,
        "idea-create-everything": GitBranch,
        personweb: BookOpen,
      } as Record<string, typeof Code2>
    )[project.slug] || Code2;
  if (project.coverImage)
    return (
      <div
        className={`project-cover ${project.coverType === "design" ? "design-cover" : ""} ${project.slug === "shizaolu" ? "portrait-cover" : ""}`}
      >
        {project.slug === "shizaolu" &&
        project.coverImage === "/garden/shizaolu-960.webp" ? (
          <div className="phone-collage">
            <img
              src="/garden/shizaolu-recommend-480.webp"
              alt="食灶录推荐菜谱真实界面"
              width="220"
              height="476"
              loading="lazy"
            />
            <img
              src="/garden/shizaolu-480.webp"
              alt="食灶录我的冰箱真实界面"
              width="220"
              height="476"
              loading="lazy"
            />
            <img
              src="/garden/shizaolu-diary-480.webp"
              alt="食灶录饮食记录真实界面"
              width="220"
              height="476"
              loading="lazy"
            />
          </div>
        ) : (
          <img
            src={project.coverImage}
            srcSet={imageSourceSet(project.coverImage)}
            sizes="(max-width: 560px) 90vw, (max-width: 1050px) 45vw, 540px"
            alt={`${project.title.zh} · ${sourceLabel(project.coverType)}`}
            width="640"
            height="400"
            loading="lazy"
          />
        )}
        {project.coverType !== "screenshot" && (
          <span className="image-credit">{sourceLabel(project.coverType)}</span>
        )}
      </div>
    );
  return (
    <div
      className="project-cover concept-cover"
      aria-label={`${project.title.zh} · 概念封面`}
    >
      <svg viewBox="0 0 640 400" role="img" aria-label="概念封面">
        <defs>
          <linearGradient id={id}>
            <stop stopColor={colors[0]} />
            <stop offset="1" stopColor="#f8f7f3" />
          </linearGradient>
        </defs>
        <rect width="640" height="400" fill={`url(#${id})`} />
        <g fill="none" stroke={colors[1]} opacity=".3" strokeWidth="1.5">
          <circle cx={n % 2 ? 430 : 200} cy="190" r="116" />
          <circle cx="350" cy="230" r="82" />
          <path d={`M80 280 Q${200 + (n % 80)} 80 540 240`} />
          <rect
            x="225"
            y="102"
            width="190"
            height="190"
            rx="20"
            transform={`rotate(${(n % 30) - 15} 320 200)`}
          />
        </g>
      </svg>
      <div className="concept-label">
        <ConceptIcon size={34} />
        <strong>{project.title.zh}</strong>
        <small>概念封面 · {project.category.zh.split("/")[0]}</small>
      </div>
    </div>
  );
}
export function ProjectCard({
  project,
  showIdentity = false,
  depth = false,
}: {
  project: GardenProject;
  showIdentity?: boolean;
  depth?: boolean;
}) {
  const { language } = useLanguage();
  return (
    <Link className="project-card" to={`/projects/${project.slug}`}>
      {depth ? (
        <Depth className="project-depth">
          <ProjectCover project={project} />
        </Depth>
      ) : (
        <ProjectCover project={project} />
      )}
      <div className="project-card-body">
        <div className="card-title-line">
          <h3>{textFor(project.title, language)}</h3>
          <span className="circle-arrow">
            <ArrowRight size={16} />
          </span>
        </div>
        <p>{textFor(project.subtitle, language)}</p>
        <div className="tags">
          {showIdentity && (
            <span className="tag">
              {project.slug === "wechat-auto" ? "商业交付" : "个人作品"}
            </span>
          )}
          <span className="status-dot">
            {project.projectStatus || "项目档案"}
          </span>
          {project.capabilities.slice(0, 2).map((t) => (
            <span className="tag" key={t.zh}>
              {textFor(t, language)}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
function nodeText(value: ReactNode): string {
  if (typeof value === "string" || typeof value === "number")
    return String(value);
  if (Array.isArray(value)) return value.map(nodeText).join("");
  if (value && typeof value === "object" && "props" in value)
    return nodeText(
      (value as { props: { children?: ReactNode } }).props.children,
    );
  return "";
}
export function Prose({ body }: { body: string }) {
  const ids = new Map<string, number>();
  const headingId = (children: ReactNode) => {
    const base = makeHeadingId(nodeText(children));
    const count = ids.get(base) || 0;
    ids.set(base, count + 1);
    return count ? `${base}-${count}` : base;
  };
  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children, ...props }) => (
            <h2 {...props} id={headingId(children)}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 {...props} id={headingId(children)}>
              {children}
            </h3>
          ),
          img: ({ src, alt }) => (
            <a
              className="prose-image"
              href={src}
              target="_blank"
              rel="noreferrer"
            >
              <img
                {...dimensionsFor(src || "")}
                src={src}
                alt={alt || ""}
                loading="lazy"
              />
            </a>
          ),
          table: ({ children }) => (
            <div className="table-scroll">
              <table>{children}</table>
            </div>
          ),
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}
export function Gallery({
  items,
}: {
  items: Array<{
    image: string;
    original?: string;
    title: string;
    description?: string;
  }>;
}) {
  const [active, setActive] = useState<number | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (active === null) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActive(null);
        trigger.current?.focus();
      }
      if (e.key === "Tab") {
        const buttons = Array.from(
          document.querySelectorAll<HTMLButtonElement>(".lightbox button"),
        );
        const current = buttons.indexOf(
          document.activeElement as HTMLButtonElement,
        );
        e.preventDefault();
        buttons[
          (current + (e.shiftKey ? -1 : 1) + buttons.length) % buttons.length
        ]?.focus();
      }
      if (e.key === "ArrowRight")
        setActive((v) => (v === null ? null : (v + 1) % items.length));
      if (e.key === "ArrowLeft")
        setActive((v) =>
          v === null ? null : (v + items.length - 1) % items.length,
        );
    };
    window.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = old;
      window.removeEventListener("keydown", key);
    };
  }, [active, items.length]);
  return (
    <>
      <div className="gallery-grid">
        {items.map((item, index) => (
          <figure key={`${item.image}-${index}`}>
            <button
              className="gallery-image"
              onClick={(e) => {
                trigger.current = e.currentTarget;
                setActive(index);
              }}
              aria-label={`放大查看：${item.title}`}
            >
              <img
                src={item.image}
                {...dimensionsFor(item.image)}
                srcSet={imageSourceSet(item.image)}
                sizes="(max-width: 560px) 90vw, 540px"
                alt={item.title}
                loading="lazy"
              />
            </button>
            <figcaption>
              <strong>{item.title}</strong>
              {item.description && <p>{item.description}</p>}
            </figcaption>
          </figure>
        ))}
      </div>
      {active !== null && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={items[active].title}
          onClick={() => setActive(null)}
        >
          <button
            autoFocus
            className="lightbox-close icon-button"
            onClick={() => {
              setActive(null);
              trigger.current?.focus();
            }}
            aria-label="关闭图片"
          >
            <X />
          </button>
          <button
            className="icon-button"
            onClick={(e) => {
              e.stopPropagation();
              setActive((active + items.length - 1) % items.length);
            }}
            aria-label="上一张"
          >
            <ChevronLeft />
          </button>
          <figure onClick={(e) => e.stopPropagation()}>
            <img
              src={items[active].original || originalFor(items[active].image)}
              alt={items[active].title}
            />
            <figcaption>
              {items[active].title} · {active + 1}/{items.length}
            </figcaption>
          </figure>
          <button
            className="icon-button"
            onClick={(e) => {
              e.stopPropagation();
              setActive((active + 1) % items.length);
            }}
            aria-label="下一张"
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </>
  );
}
export function Empty({
  children,
  action,
}: {
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <div className="empty-copy">{children}</div>
      {action}
    </div>
  );
}
export async function uploadImage(file: File): Promise<Media> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(Error("图片读取失败"));
    reader.readAsDataURL(file);
  });
  const response = await fetch("/api/admin/upload", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dataUrl, caption: file.name }),
  });
  const result = await response.json();
  if (!response.ok) throw Error(result.error || "上传失败");
  return result.data;
}
