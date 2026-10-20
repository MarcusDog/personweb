async (page) => {
  const origin = "http://localhost:4191",
    created = [];
  const check = (value, message) => {
    if (!value) throw Error(message);
  };
  try {
    const publicBefore = (
      await (await page.request.get(origin + "/api/site")).json()
    ).data;
    check(
      publicBefore.books.every(
        (b) => b.readingStatus === "wish" && b.progress === 0,
      ),
      "Seed reading state altered",
    );
    check(
      (
        await page.request.post(origin + "/api/admin/books/cover-lookup", {
          data: { isbn: "9781449373321" },
        })
      ).status() === 400,
      "Invalid ISBN accepted",
    );
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(origin + "/studio?kind=books");
    await page.getByRole("button", { name: "新增书架", exact: true }).click();
    await page
      .getByRole("textbox", { name: "内容标题", exact: true })
      .fill("QA 真实书封流程");
    await page
      .getByRole("textbox", { name: "作者", exact: true })
      .fill("Chip Huyen");
    await page
      .getByRole("textbox", { name: "链接标识", exact: true })
      .fill("qa-warm-cover-flow");
    await page
      .getByRole("textbox", { name: "ISBN（可选，优先精确匹配）", exact: true })
      .fill("9781098166304");
    await page.locator(".lookup-current img").waitFor({ timeout: 30000 });
    await page.waitForTimeout(2200);
    let all = (
      await (await page.request.get(origin + "/api/admin/content/books")).json()
    ).data;
    let draft = all.find((b) => b.slug === "qa-warm-cover-flow");
    check(draft?.id, "Automatic draft not persisted");
    created.push(draft.id);
    check(
      draft.coverMatch === "confirmed" && draft.coverOrigin === "lookup",
      "ISBN cover not auto-confirmed",
    );
    check(
      !(
        await (await page.request.get(origin + "/api/site")).json()
      ).data.books.some((b) => b.slug === draft.slug),
      "Draft leaked before publishing",
    );
    await page.getByRole("button", { name: "发布", exact: true }).click();
    await page
      .getByRole("status")
      .filter({ hasText: "已发布" })
      .first()
      .waitFor();
    let published = (
      await (await page.request.get(origin + "/api/site")).json()
    ).data.books.find((b) => b.slug === draft.slug);
    check(published?.coverImage, "Published book missing");
    await page.goto(origin + "/reading?status=wish&book=qa-warm-cover-flow");
    await page.locator(".book-dialog[open]").waitFor();
    await page.getByRole("button", { name: "关闭书籍详情" }).click();
    check(
      page.url().includes("status=wish") && !page.url().includes("book="),
      "Book close lost filter",
    );
    // Manual uploads always win, including a lookup response already in flight.
    await page.goto(origin + `/studio?kind=books&edit=${draft.id}`);
    await page.locator(".cover-lookup").waitFor();
    let resolveLookup;
    const waiting = new Promise((r) => (resolveLookup = r));
    await page.route("**/api/admin/books/cover-lookup", async (route) => {
      await waiting;
      await route.fulfill({
        json: {
          success: true,
          data: {
            status: "matched",
            candidates: [
              {
                title: "Late",
                author: "Late",
                coverImage:
                  "https://covers.openlibrary.org/b/id/8750439-L.jpg?default=false",
                coverMatch: "confirmed",
                coverSource: "Open Library",
                coverOrigin: "lookup",
              },
            ],
          },
        },
      });
    });
    await page
      .getByRole("textbox", { name: "内容标题", exact: true })
      .fill("QA 改名后的草稿");
    await page.waitForTimeout(1200);
    const file = page
      .locator(".publish-panel")
      .locator(
        'input[type=file][accept="image/png,image/jpeg,image/webp,image/gif"]',
      );
    const uploadBytes = await (
      await page.request.get(origin + "/garden/aya-avatar-choice-480.webp")
    ).body();
    await file.setInputFiles({
      name: `qa-warm-cover-flow-${Date.now()}.webp`,
      mimeType: "image/webp",
      buffer: uploadBytes,
    });
    await page.waitForFunction(() =>
      document
        .querySelector(".lookup-current img")
        ?.getAttribute("src")
        ?.startsWith("/uploads/"),
    );
    resolveLookup();
    await page.waitForTimeout(1800);
    all = (
      await (await page.request.get(origin + "/api/admin/content/books")).json()
    ).data;
    draft = all.find((b) => b.id === draft.id);
    check(
      draft.coverOrigin === "manual" &&
        draft.coverImage.startsWith("/uploads/"),
      "Late lookup replaced manual cover",
    );
    published = (
      await (await page.request.get(origin + "/api/site")).json()
    ).data.books.find((b) => b.id === draft.id);
    check(
      published.title.zh === "QA 真实书封流程" &&
        published.coverOrigin === "lookup",
      "Draft cover changed public book",
    );
    await page.unroute("**/api/admin/books/cover-lookup");
    // Check a quota failure is surfaced and the current document remains editable.
    await page.route("**/api/admin/books/cover-lookup", (route) =>
      route.fulfill({
        status: 429,
        json: { success: false, error: "测试限流：稍后重试" },
      }),
    );
    await page.getByRole("button", { name: "重新查找封面" }).click();
    await page.getByRole("status").filter({ hasText: "测试限流" }).waitFor();
    await page.getByRole("button", { name: "保存草稿", exact: true }).click();
    await page.waitForTimeout(500);
    check(
      (await page
        .getByRole("textbox", { name: "内容标题", exact: true })
        .inputValue()) === "QA 改名后的草稿",
      "Lookup failure damaged draft",
    );
    await page.screenshot({
      path: "output/playwright/warm-studio-cover.png",
      fullPage: true,
    });
    await page.unroute("**/api/admin/books/cover-lookup");
    return "ISBN lookup → autosaved draft → publish → reading dialog → manual override → quota recovery passed.";
  } finally {
    await page.unroute("**/api/admin/books/cover-lookup").catch(() => {});
    const all = (
      await (await page.request.get(origin + "/api/admin/content/books")).json()
    ).data;
    for (const item of all.filter(
      (b) =>
        b.slug === "qa-warm-cover-flow" &&
        b.id &&
        (created.includes(b.id) || b.title.zh.startsWith("QA ")),
    ))
      await page.request.delete(origin + "/api/admin/content/books/" + item.id);
  }
};
