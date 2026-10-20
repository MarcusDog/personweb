import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  Code2,
  Copy,
  Handshake,
  Lightbulb,
  Mail,
  MessageCircle,
  MessageSquare,
  Rss,
  Send,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";
import { PageTitle } from "./components";
import { useGarden } from "./context";

const purposes = [
  ["产品与开发合作", Handshake, "从想法到可用版本"],
  ["项目反馈", MessageSquare, "问题、建议与使用感受"],
  ["技术交流", Code2, "AI、工具与开发方法"],
  ["书籍推荐", BookOpen, "科技与人文都欢迎"],
  ["分享一个想法", Lightbulb, "还没成型也可以"],
  ["打个招呼", MessageCircle, "很高兴在这里遇见你"],
] as const;
const prompts: Record<string, string> = {
  产品与开发合作:
    "我想做的产品 / 流程：\n目前卡住的地方：\n第一版最希望解决的问题：",
  项目反馈:
    "使用的项目与版本：\n我遇到的问题 / 想提的建议：\n复现步骤（如果有）：",
  技术交流: "想讨论的问题：\n我目前的理解：\n相关资料或链接：",
  书籍推荐: "书名与作者：\n推荐的理由：\n想一起讨论的问题：",
  分享一个想法: "一个还没想清楚的念头：\n它可能帮到谁：",
  打个招呼: "你好小天，我是……",
};

export function Contact() {
  usePageTitle("联系与留言｜小天Aya");
  const { data } = useGarden();
  const [draft, setDraft] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("aya-contact-draft") || "null",
      );
      return {
        purpose:
          typeof saved?.purpose === "string" && prompts[saved.purpose]
            ? saved.purpose
            : (purposes[0][0] as string),
        problem:
          typeof saved?.problem === "string"
            ? saved.problem.slice(0, 5000)
            : "",
      };
    } catch {
      return { purpose: purposes[0][0] as string, problem: "" };
    }
  });
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const submitLock = useRef(false);
  useEffect(() => {
    try {
      if (draft.problem)
        localStorage.setItem("aya-contact-draft", JSON.stringify(draft));
      else localStorage.removeItem("aya-contact-draft");
    } catch {
      /* A disabled storage must not prevent sending. */
    }
  }, [draft]);
  return (
    <div className="container contact-page">
      <PageTitle
        eyebrow="SAY HELLO"
        title="从一句你好开始。"
        description="想做点东西、聊聊技术，或者推荐一本书，都欢迎。留言只会发给我，不会公开展示。"
      />
      <div className="contact-layout">
        <aside className="contact-aside">
          <h2>也可以直接找到我</h2>
          <a className="contact-method" href="mailto:2543575812@qq.com">
            <span className="accent-icon">
              <Mail size={23} />
            </span>
            <span>
              <strong>发一封邮件</strong>
              <small>2543575812@qq.com</small>
            </span>
            <ArrowRight size={18} />
          </a>
          <a
            className="contact-method"
            href="https://github.com/MarcusDog"
            target="_blank"
            rel="noreferrer"
          >
            <span className="accent-icon">
              <Code2 size={23} />
            </span>
            <span>
              <strong>在 GitHub 交流</strong>
              <small>代码问题也可以开 Issue</small>
            </span>
            <ArrowRight size={18} />
          </a>
          <button
            className="contact-method"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText("TT_Bems");
                setCopied(true);
              } catch {
                setMessage("微信号：TT_Bems，可手动复制。");
              }
            }}
          >
            <span className="accent-icon accent-red">
              <MessageCircle size={23} />
            </span>
            <span>
              <strong>{copied ? "微信号已复制" : "微信：TT_Bems"}</strong>
              <small>点击复制，添加时请说明来意</small>
            </span>
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
          <div className="contact-privacy">
            <ShieldCheck size={24} />
            <h3>放心写，慢慢说。</h3>
            <p>
              联系方式仅用于回复。正文草稿暂存在当前浏览器，不保存你的联系方式；发送成功后自动清除。
            </p>
            <Link to="/subscribe">
              只想看看更新？订阅 RSS <ArrowRight size={16} />
            </Link>
          </div>
        </aside>
        <form
          className="contact-form enhanced-form"
          onSubmit={async (e) => {
            e.preventDefault();
            if (submitLock.current) return;
            const form = e.currentTarget;
            const values = new FormData(form);
            if (!draft.problem.trim() || draft.problem.trim().length < 5) {
              setMessage("请至少写下 5 个字，方便我理解你的问题。");
              return;
            }
            submitLock.current = true;
            setBusy(true);
            setMessage("");
            setSent(false);
            try {
              const response = await fetch("/api/contact/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  role: values.get("name") || "网站访客",
                  delivery: draft.purpose,
                  problem: draft.problem.trim(),
                  contact: values.get("contact"),
                  timeline: values.get("timeline") || "不着急",
                  language: "zh",
                  website: values.get("website"),
                  metadata: {
                    project: values.get("project") || "",
                    budget: values.get("budget") || "",
                    contactMethod: values.get("contactMethod") || "邮箱或微信",
                  },
                }),
              });
              const result = await response.json();
              if (!response.ok || !result.success)
                throw Error(result.error || "发送失败，请稍后重试。");
              setMessage(
                "留言已送达。谢谢你认真写下来，我会通过你留下的方式回复。",
              );
              setSent(true);
              setDraft({ purpose: purposes[0][0], problem: "" });
              form.reset();
            } catch (error) {
              setMessage(
                error instanceof Error
                  ? error.message
                  : "暂时没发出去，正文仍保留着。也可以直接给我发邮件。",
              );
            } finally {
              submitLock.current = false;
              setBusy(false);
            }
          }}
        >
          <div className="form-heading">
            <span className="accent-icon">
              <Send size={23} />
            </span>
            <div>
              <h2>留个言</h2>
              <p>先选个话题，再说说你想到的事。</p>
            </div>
          </div>
          <fieldset className="purpose-field">
            <legend>想聊什么</legend>
            <div className="purpose-grid">
              {purposes.map(([title, Icon, hint]) => (
                <label
                  className={`purpose-option ${draft.purpose === title ? "selected" : ""}`}
                  key={title}
                >
                  <input
                    type="radio"
                    name="purpose"
                    value={title}
                    checked={draft.purpose === title}
                    onChange={() => setDraft({ ...draft, purpose: title })}
                  />
                  <Icon size={21} />
                  <span>
                    <strong>{title}</strong>
                    <small>{hint}</small>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="form-grid">
            <label>
              怎么称呼你
              <input
                name="name"
                maxLength={80}
                placeholder="你的名字（选填）"
                autoComplete="name"
              />
            </label>
            <label>
              联系方式 · 必填
              <input
                name="contact"
                required
                maxLength={200}
                placeholder="邮箱或微信"
                autoComplete="email"
              />
            </label>
          </div>
          <div className="form-grid">
            <label>
              关联项目
              <select name="project">
                <option value="">不限定项目</option>
                {data.projects.map((project) => (
                  <option value={project.slug} key={project.slug}>
                    {project.title.zh}
                  </option>
                ))}
              </select>
            </label>
            <label>
              方便的联系方式
              <select name="contactMethod">
                <option>邮箱或微信</option>
                <option>优先邮件</option>
                <option>优先微信</option>
              </select>
            </label>
          </div>
          {draft.purpose === "产品与开发合作" && (
            <div className="form-grid">
              <label>
                时间安排
                <select name="timeline">
                  <option>不着急，先交流</option>
                  <option>希望一个月内开始</option>
                  <option>已有时间计划，可进一步沟通</option>
                </select>
              </label>
              <label>
                预算情况
                <select name="budget">
                  <option>尚未确定，先评估范围</option>
                  <option>已有预算，沟通时说明</option>
                  <option>开源 / 非商业交流</option>
                </select>
              </label>
            </div>
          )}
          <div className="message-label">
            <label htmlFor="contact-problem">具体说说 · 必填</label>
            <button
              className="text-link"
              type="button"
              onClick={() => {
                if (
                  !draft.problem.trim() ||
                  window.confirm("用话题提纲替换当前正文？当前正文不会发送。")
                )
                  setDraft({ ...draft, problem: prompts[draft.purpose] });
              }}
            >
              用提纲帮我开个头 <Lightbulb size={16} />
            </button>
          </div>
          <textarea
            id="contact-problem"
            name="problem"
            required
            minLength={5}
            maxLength={5000}
            rows={8}
            value={draft.problem}
            onChange={(e) => {
              setDraft({ ...draft, problem: e.target.value });
              setSent(false);
            }}
            placeholder="一个具体的问题、一段使用感受，或者一个还没成型的念头。"
          />
          <div className="message-counter">
            <span>正文草稿仅保留在本机</span>
            <span>{draft.problem.length} / 5000</span>
          </div>
          <label className="form-honeypot" aria-hidden="true">
            请留空
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
          <div className="form-bottom">
            <span className="privacy-inline">
              <ShieldCheck size={17} /> 私信，不会公开
            </span>
            <button className="button primary" disabled={busy}>
              {busy ? "正在送达…" : "发送留言"}
              <Send size={18} />
            </button>
          </div>
          {message && (
            <p
              className={`notice ${sent ? "success-notice" : ""}`}
              role="status"
            >
              {sent && <Check size={19} />}
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export function Subscribe() {
  usePageTitle("RSS 订阅｜小天Aya");
  const [copied, setCopied] = useState("");
  const [error, setError] = useState("");
  const feeds = [
    {
      path: "/rss.xml",
      title: "全部更新",
      description: "文章与书架更新，放进同一个阅读列表。",
      icon: Rss,
      color: "red",
    },
    {
      path: "/feeds/articles.xml",
      title: "只看文章",
      description: "AI、工具、产品判断，以及开发过程中的思考。",
      icon: Code2,
      color: "blue",
    },
    {
      path: "/feeds/reading.xml",
      title: "读书与书目",
      description: "想读清单、阅读状态和后续留下的笔记。",
      icon: BookOpen,
      color: "blue",
    },
  ];
  return (
    <div className="container subscribe-page">
      <PageTitle
        eyebrow="FOLLOW AT YOUR OWN PACE"
        title="把更新带回你的阅读器。"
        description="不用注册，也不需要留下邮箱。复制订阅地址，添加到你喜欢的 RSS 阅读器里。"
      />
      <div className="feed-grid">
        {feeds.map((feed) => (
          <article className={`feed-card accent-${feed.color}`} key={feed.path}>
            <span className="accent-icon">
              <feed.icon size={27} />
            </span>
            <h2>{feed.title}</h2>
            <p>{feed.description}</p>
            <code>{feed.path}</code>
            <div className="button-row">
              <button
                className="button primary"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(
                      new URL(feed.path, window.location.origin).href,
                    );
                    setCopied(feed.path);
                    setError("");
                  } catch {
                    setError("复制受限，请打开订阅源后复制浏览器地址。");
                  }
                }}
              >
                {copied === feed.path ? (
                  <Check size={18} />
                ) : (
                  <Copy size={18} />
                )}
                {copied === feed.path ? "已复制地址" : "复制订阅地址"}
              </button>
              <a className="text-link" href={feed.path}>
                查看订阅源 <ArrowRight size={17} />
              </a>
            </div>
          </article>
        ))}
      </div>
      <p className="notice" role="status">
        {error ||
          (copied
            ? "订阅地址已复制。粘贴到阅读器的“添加订阅”中即可。"
            : "RSS 会包含公开内容；草稿、私人留言和联系方式不会进入订阅源。")}
      </p>
      <section className="rss-explanation">
        <h2>RSS 是什么？</h2>
        <p>
          它把网站的新内容送到你的阅读器。你决定何时阅读，不需要反复打开网站，也没有算法替你安排顺序。
        </p>
        <p>
          书目里的“想读”表示待阅读清单，不代表已经读完。之后写下的阅读笔记也会随书架更新进入订阅。
        </p>
      </section>
    </div>
  );
}
