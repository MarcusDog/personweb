async (page) => {
  const origin = "http://localhost:4191",
    owned = [];
  page.on("dialog", (dialog) => dialog.accept());
  const assert = (value, message) => {
    if (!value) throw Error(message);
  };
  try {
    for (const path of [
      "/api/admin/export",
      "/api/admin/content/posts/no-id/revisions",
    ]) {
      const response = await page.request.get(origin + path, {
        headers: { Cookie: "" },
      });
      // A fresh unauthenticated context must not expose drafts or versions.
      if (response.status() !== 401) {
        const anon = await page.context().browser().newContext();
        const r = await anon.request.get(origin + path);
        assert(r.status() === 401, "Unprotected admin endpoint");
        await anon.close();
      }
    }
    const created = (
      await (
        await page.request.post(origin + "/api/admin/content/posts", {
          data: {
            slug: "qa-studio-upgrade",
            title: { zh: "写作台验收文章", en: "" },
            body: { zh: "## 第一版\n\nAI 工具，AI 记录。", en: "" },
            category: { zh: "测试", en: "" },
            tags: [],
            action: "publish",
          },
        })
      ).json()
    ).data;
    assert(created?.id, "QA article was not created");
    owned.push(created.id);
    await page.goto(origin + `/studio?kind=posts&edit=${created.id}`);
    await page.locator(".studio-writing-tools").waitFor();
    await page.getByText("查找替换与写作目标", { exact: false }).click();
    await page
      .getByRole("textbox", { name: "查找文字", exact: true })
      .fill("AI");
    await page
      .getByRole("textbox", { name: "替换为", exact: true })
      .fill("人工智能");
    await page.getByRole("button", { name: "全部替换", exact: true }).click();
    assert(
      (await page.locator(".tiptap").innerText()).includes("人工智能 工具"),
      "Replace failed",
    );
    await page.getByRole("button", { name: "撤销替换", exact: true }).click();
    assert(
      (await page.locator(".tiptap").innerText()).includes("AI 工具"),
      "Undo failed",
    );
    await page
      .getByRole("spinbutton", { name: "本篇目标（字 / 词）", exact: false })
      .fill("1000");
    await page
      .getByRole("textbox", { name: "正文编辑器", exact: true })
      .fill("## 第二版\n\n这是准备恢复之前的一段新正文。");
    await page.getByRole("button", { name: "保存草稿", exact: true }).click();
    await page.waitForTimeout(1700);
    let current = (
      await (await page.request.get(origin + "/api/admin/content/posts")).json()
    ).data.find((x) => x.id === created.id);
    assert(current.writingGoal === 1000, "Goal did not persist");
    assert(
      (await (await page.request.get(origin + "/api/site")).json()).data.posts
        .find((x) => x.id === created.id)
        .body.zh.includes("AI 工具"),
      "Draft leaked",
    );
    await page.getByRole("button", { name: "版本历史", exact: true }).click();
    await page.locator(".revision-dialog[open]").waitFor();
    const revisions = (
      await (
        await page.request.get(
          origin + `/api/admin/content/posts/${created.id}/revisions`,
        )
      ).json()
    ).data;
    const published = revisions.find((x) => x.action === "publish");
    assert(published, "Published version not archived");
    await page
      .locator(".revision-layout nav button")
      .filter({ hasText: "发布版本" })
      .last()
      .click();
    await page
      .locator(".revision-preview")
      .getByRole("heading", { name: "第一版", exact: true })
      .waitFor();
    await page.screenshot({
      path: "output/playwright/studio-upgrade-history-1440.png",
    });
    await page
      .getByRole("button", { name: "恢复这个版本", exact: true })
      .click();
    await page
      .getByRole("button", { name: "确认恢复为草稿", exact: true })
      .click();
    await page.waitForFunction(
      () => !document.querySelector(".revision-dialog[open]"),
    );
    await page
      .getByRole("status")
      .filter({ hasText: "已恢复为草稿，前台未改变" })
      .waitFor();
    current = (
      await (await page.request.get(origin + "/api/admin/content/posts")).json()
    ).data.find((x) => x.id === created.id);
    assert(
      current.hasDraft && current.body.zh.includes("AI 工具"),
      "Restore did not create draft",
    );
    await page.goto(origin + "/studio?kind=posts");
    await page
      .getByRole("button", { name: "复制成草稿：写作台验收文章", exact: true })
      .click();
    await page
      .getByRole("textbox", { name: "内容标题", exact: true })
      .waitFor();
    let all = (
      await (await page.request.get(origin + "/api/admin/content/posts")).json()
    ).data;
    const copy = all.find((x) => x.slug.startsWith("qa-studio-upgrade-copy-"));
    assert(copy && copy.status === "draft", "Duplicate was not a draft");
    owned.push(copy.id);
    await page.waitForTimeout(1800);
    const exportResult = await page.request.get(origin + "/api/admin/export"),
      backup = (await exportResult.json()).data;
    assert(
      exportResult.headers()["cache-control"].includes("no-store"),
      "Export can be cached",
    );
    assert(
      backup.contents.posts.find((x) => x.id === created.id).published &&
        backup.contents.posts.find((x) => x.id === created.id).draft,
      "Backup lost one snapshot",
    );
    assert(
      !("contacts" in backup) &&
        !JSON.stringify(backup).includes("admin-secret"),
      "Backup includes private credentials/messages",
    );
    await page.goto(origin + "/studio");
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "导出内容备份" }).click();
    const download = await downloadPromise;
    assert(
      download.suggestedFilename().startsWith("aya-content-backup-"),
      "Backup download failed",
    );
    await page.goto(origin + `/studio?kind=posts&edit=${copy.id}`);
    await page.locator(".studio-writing-tools").waitFor();
    await page.keyboard.press("Control+Shift+F");
    await page
      .getByRole("textbox", { name: "查找文字", exact: true })
      .waitFor();
    for (const width of [360, 390, 768, 1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: 1000 });
      assert(
        !(await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1,
        )),
        `Editor overflow ${width}`,
      );
      await page.getByRole("button", { name: "版本历史", exact: true }).click();
      await page.locator(".revision-dialog[open]").waitFor();
      assert(
        !(await page
          .locator(".revision-dialog")
          .evaluate((el) => el.scrollWidth > el.clientWidth + 1)),
        `History overflow ${width}`,
      );
      await page.keyboard.press("Escape");
      await page.waitForTimeout(1600);
      if (width === 390 || width === 1440)
        await page.screenshot({
          path: `output/playwright/studio-upgrade-editor-${width}.png`,
          fullPage: true,
        });
    }
    await page.evaluate(() =>
      localStorage.setItem("aya-studio-upgrade-passed", "true"),
    );
    return "Studio: find/replace/undo, writing goal, revisions/restore draft isolation, duplicate, backup download, authorization and six viewport widths passed.";
  } finally {
    const all = (
      await (await page.request.get(origin + "/api/admin/content/posts")).json()
    ).data;
    for (const item of all.filter(
      (x) =>
        owned.includes(x.id) ||
        (x.slug.startsWith("qa-studio-upgrade") &&
          x.title.zh.startsWith("写作台验收文章")),
    ))
      await page.request.delete(origin + "/api/admin/content/posts/" + item.id);
  }
};
