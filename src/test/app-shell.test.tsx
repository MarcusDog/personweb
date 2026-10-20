import { afterEach, describe, expect, it, vi } from "vitest";
import { createRoot } from "react-dom/client";
import { act } from "react";
import App from "../App";
import seed from "../data/project-snapshot.json";
import { getJournalEntries } from "../lib/content";

const roots: ReturnType<typeof createRoot>[] = [];
afterEach(() => {
  roots.forEach((root) => act(() => root.unmount()));
  roots.length = 0;
  document.body.innerHTML = "";
  localStorage.clear();
  vi.unstubAllGlobals();
});
async function route(path: string) {
  window.history.pushState({}, "", path);
  localStorage.setItem("personweb-language", "zh");
  vi.stubGlobal(
    "fetch",
    vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            success: true,
            data: { authenticated: false, username: null },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
    ),
  );
  const element = document.createElement("div");
  document.body.appendChild(element);
  const root = createRoot(element);
  roots.push(root);
  await act(async () => {
    root.render(<App />);
    await new Promise((resolve) => setTimeout(resolve, 5));
  });
  for (let i = 0; i < 50 && element.textContent === "正在打开…"; i++)
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 20));
    });
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 20));
  });
  return element;
}
describe("editorial garden", () => {
  it("uses the selected personal introduction and real featured projects", async () => {
    const el = await route("/");
    expect(el.querySelector("h1")?.textContent).toBe("你好，我是小天。");
    for (const name of [
      "最近写的",
      "正在做的",
      "我的书架",
      "食灶录",
      "VoiceDesk",
      "Ainews",
      "Flow Socket",
    ])
      expect(el.textContent).toContain(name);
    expect(el.querySelectorAll(".home-projects .project-card")).toHaveLength(4);
    expect(el.textContent).not.toContain('最近的随想');
    expect(el.querySelector('a[href="/studio"]')).toBeTruthy();
  });
  it("retains every project and uses image or explicit concept covers", async () => {
    const el = await route("/projects");
    expect(el.querySelectorAll(".project-card")).toHaveLength(seed.length);
    for (const p of seed) expect(el.textContent).toContain(p.title.zh);
    expect(el.textContent).toContain("概念封面");
  });
  it("shows featured articles and persistent query filters", async () => {
    const el = await route("/journal");
    expect(el.querySelector("h1")?.textContent).toBe("写给时间的笔记。");
    expect(el.querySelectorAll(".featured-article")).toHaveLength(3);
    expect(el.querySelectorAll(".article-row")).toHaveLength(
      getJournalEntries().length,
    );
    const filtered = await route("/journal?q=没有这篇文章");
    expect(filtered.textContent).toContain("没有匹配的文章");
  });
  it("keeps about personal without a screenshot wall", async () => {
    const el = await route("/about");
    expect(el.textContent).toContain("我叫小天。");
    expect(el.querySelectorAll("img")).toHaveLength(1);
    expect(el.textContent).toContain("现在关注的事");
  });
  it("provides honest empty states instead of invented reading records", async () => {
    const el = await route("/reading");
    expect(el.textContent).toContain("书架还在整理");
    expect(el.querySelectorAll(".reading-book")).toHaveLength(0);
  });
  it("simplifies contact while preserving required message fields", async () => {
    const el = await route("/contact");
    expect(el.querySelector('input[name="contact"][required]')).toBeTruthy();
    expect(el.querySelector('textarea[name="problem"][required]')).toBeTruthy();
  });
  it("protects all management functions behind login", async () => {
    const el = await route("/studio");
    expect(el.textContent).toContain("登录写作台");
    expect(el.querySelector('input[type="password"]')).toBeTruthy();
    expect(el.querySelector(".studio-nav")).toBeNull();
  });
  it("renders a deliberate not-found page", async () => {
    const el = await route("/missing-route");
    expect(el.textContent).toContain("这一页暂时找不到");
  });
  it('uses the supplied original avatar and readable, labelled footer links', async () => {
    const el = await route('/about');
    expect(el.querySelector('.about-intro img')?.getAttribute('src')).toContain('aya-avatar-choice');
    expect(el.querySelectorAll('.focus-card')).toHaveLength(0);
    expect(el.querySelector('.editorial-now')).toBeTruthy();
    expect(el.querySelector('.prominent-actions')?.textContent).toContain('聊聊你的想法');
    const footer = el.querySelector('footer');
    expect(footer?.textContent).toContain('GitHub');
    expect(footer?.querySelectorAll('a[href^="mailto:"]')).toHaveLength(1);
    expect(footer?.querySelector('a[href="/subscribe"]')).toBeTruthy();
  });
  it('explains the three available subscription feeds', async () => {
    const el = await route('/subscribe');
    expect(el.querySelectorAll('.feed-card')).toHaveLength(3);
    expect(el.textContent).toContain('读书与书目');
    expect(el.querySelector('a[href="/feeds/reading.xml"]')).toBeTruthy();
  });
  it('offers six private message topics and optional project context', async () => {
    const el = await route('/contact');
    expect(el.querySelectorAll('input[name="purpose"]')).toHaveLength(6);
    expect(el.textContent).toContain('书籍推荐');
    expect(el.querySelectorAll('select[name="project"] option')).toHaveLength(seed.length + 1);
    expect(el.textContent).toContain('不会公开展示');
  });
});
