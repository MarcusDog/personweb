async (page) => {
  try {
  const assert = (value, message) => {
    if (!value) throw Error(message);
  };
  const checks = [];
  const session = await (
    await page.request.get("http://localhost:4191/api/admin/session")
  ).json();
  assert(
    session.data.authenticated,
    "Authenticate the local writing studio before running this check",
  );
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("http://localhost:4191/contact");
  await page.getByLabel("书籍推荐", { exact: false }).check();
  await page.getByRole("button", { name: "用提纲帮我开个头" }).click();
  assert(
    (await page.locator("[name=problem]").inputValue()).includes("书名与作者"),
    "Topic outline was not inserted",
  );
  await page.locator("[name=name]").fill("本地功能验收");
  await page.locator("[name=contact]").fill("qa-local-only@example.test");
  await page.locator("[name=project]").selectOption("voicedesk");
  await page
    .locator("[name=problem]")
    .fill("QA_ENHANCEMENT_PRIVATE：仅用于本地留言功能验收，请忽略。");
  const messageResponse = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/contact/submit") &&
      response.request().method() === "POST",
  );
  await page.getByRole("button", { name: "发送留言", exact: true }).click();
  const sent = await (await messageResponse).json();
  assert(sent.success && sent.id, "Contact form did not save");
  await page.locator(".success-notice").waitFor();
  assert(
    (await page.locator("[name=problem]").inputValue()) === "",
    "Successful submission did not clear body",
  );
  assert(
    (await page.evaluate(() => localStorage.getItem("aya-contact-draft"))) ===
      null,
    "Successful submission did not clear local draft",
  );
  checks.push("contact outline / submit / local-draft cleanup");
  const contacts = await (
    await page.request.get("http://localhost:4191/api/admin/contacts")
  ).json();
  const message = contacts.data.find((item) => item.id === sent.id);
  assert(
    message.delivery === "书籍推荐" &&
      JSON.parse(message.metadata).project === "voicedesk",
    "Message context was not retained",
  );
  const publicSite = await (
    await page.request.get("http://localhost:4191/api/site")
  ).text();
  const publicFeed = await (
    await page.request.get("http://localhost:4191/rss.xml")
  ).text();
  assert(
    !publicSite.includes("QA_ENHANCEMENT_PRIVATE") &&
      !publicFeed.includes("qa-local-only"),
    "Private message leaked",
  );
  await page.goto("http://localhost:4191/studio");
  await page
    .locator(".studio-nav")
    .getByRole("button", { name: "留言", exact: true })
    .click();
  await page.getByRole("textbox", { name: "搜索留言" }).fill("qa-local-only");
  assert(
    (await page.locator(".contact-message").count()) === 1,
    "Admin message search failed",
  );
  await page.getByRole("button", { name: "标记为已读" }).click();
  await page
    .locator(".contact-message .tag")
    .filter({ hasText: "已读" })
    .waitFor();
  checks.push("private contact context / admin search / read status");
  await page
    .locator(".studio-nav")
    .getByRole("button", { name: "文章", exact: true })
    .click();
  await page.getByRole("button", { name: "新增文章", exact: true }).click();
  await page
    .getByRole("textbox", { name: "内容标题", exact: true })
    .fill("QA 写作增强流程");
  await page
    .getByRole("textbox", { name: "链接标识", exact: true })
    .fill("qa-writing-enhancement");
  await page
    .getByRole("textbox", { name: "文章摘要", exact: true })
    .fill("只用于本地验收，测试结束后清理。");
  await page
    .getByRole("combobox", { name: "插入写作模板" })
    .selectOption("technical");
  await page
    .locator(".tiptap h2")
    .filter({ hasText: "我想弄清楚的问题" })
    .waitFor();
  await page
    .getByRole("button", { name: "Markdown 源码", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Markdown 源码编辑器" })
    .fill(
      "## 源码写作验收\n\n正文保留 **重点**。\n\n![头像](/garden/aya-avatar-choice-480.webp)",
    );
  await page.keyboard.press("Control+s");
  await page
    .getByRole("status")
    .filter({ hasText: "草稿已自动保存" })
    .waitFor({ timeout: 15000 });
  const articles = await (
    await page.request.get("http://localhost:4191/api/admin/content/posts")
  ).json();
  const draft = articles.data.find(
    (item) => item.slug === "qa-writing-enhancement",
  );
  assert(
    draft.bodyDocuments.zh.type === "doc" &&
      draft.body.zh.includes("源码写作验收"),
    "Source edits did not save as structured documents",
  );
  assert(
    !(
      await (await page.request.get("http://localhost:4191/rss.xml")).text()
    ).includes("QA 写作增强流程"),
    "Draft leaked into RSS",
  );
  checks.push(
    "template append / Markdown source / Ctrl S / structured document / private draft",
  );
  await page.getByRole("button", { name: "可视化编辑", exact: true }).click();
  await page
    .locator(".tiptap h2")
    .filter({ hasText: "源码写作验收" })
    .waitFor();
  await page.getByRole("button", { name: "专注写作", exact: true }).click();
  assert(
    await page
      .locator("body")
      .evaluate((element) => element.classList.contains("writing-focus")),
    "Focus mode did not start",
  );
  await page.keyboard.press("Escape");
  assert(
    !(await page
      .locator("body")
      .evaluate((element) => element.classList.contains("writing-focus"))),
    "Escape did not leave focus mode",
  );
  await page.getByRole("button", { name: "预览", exact: true }).click();
  assert(
    (await page.locator(".editor-preview img").count()) === 1,
    "Preview lost source image",
  );
  await page.getByRole("button", { name: "继续编辑", exact: true }).click();
  await page.getByRole("button", { name: "发布", exact: true }).click();
  await page.getByRole("status").filter({ hasText: "已发布" }).waitFor();
  assert(
    (
      await (
        await page.request.get("http://localhost:4191/feeds/articles.xml")
      ).text()
    ).includes("QA 写作增强流程"),
    "Published article absent from RSS",
  );
  checks.push(
    "visual round-trip / focus Escape / preview / publish RSS update",
  );
  await page.screenshot({
    path: "output/playwright/enhanced-studio-1440.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.screenshot({
    path: "output/playwright/enhanced-studio-390.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "发布设置", exact: true }).click();
  await page.screenshot({
    path: "output/playwright/enhanced-studio-settings-390.png",
    fullPage: true,
  });
  const removed = await page.request.delete(
    `http://localhost:4191/api/admin/content/posts/${draft.id}`,
  );
  assert(removed.ok(), "Could not clean up QA article");
  await page.evaluate((id) => {
    localStorage.removeItem(`aya-draft-posts-${id}`);
    localStorage.removeItem("aya-draft-posts-new");
  }, draft.id);
  await page.request.post("http://localhost:4191/api/admin/logout");
  const summary = { passed: true, checks, cleanupContactId: sent.id };
  await page.evaluate(
    (value) =>
      localStorage.setItem(
        "aya-enhancement-interaction-qa",
        JSON.stringify(value),
      ),
    summary,
  );
  console.log(JSON.stringify(summary));
  } finally {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('http://localhost:4191/?v=accent-20261020');
  }
};
