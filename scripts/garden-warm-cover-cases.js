async (page) => {
  const origin = "http://localhost:4191",
    slug = "qa-warm-cover-cases";
  let createdId;
  const candidate = {
    title: "How to Do Nothing",
    author: "Jenny Odell",
    coverEdition: "测试候选版本，待确认",
    coverImage:
      "https://covers.openlibrary.org/b/id/8750439-L.jpg?default=false",
    coverSource: "Open Library",
    coverSourceUrl: "https://openlibrary.org/books/OL27258148M",
    coverMatch: "ambiguous",
    coverOrigin: "lookup",
  };
  try {
    await page.goto(origin + "/studio?kind=books");
    await page.getByRole("button", { name: "新增书架", exact: true }).click();
    await page.route("**/api/admin/books/cover-lookup", (route) =>
      route.fulfill({
        json: {
          success: true,
          data: { status: "ambiguous", candidates: [candidate] },
        },
      }),
    );
    await page
      .getByRole("textbox", { name: "链接标识", exact: true })
      .fill(slug);
    await page
      .getByRole("textbox", { name: "内容标题", exact: true })
      .fill(candidate.title);
    await page
      .getByRole("textbox", { name: "作者", exact: true })
      .fill(candidate.author);
    await page.getByRole("button", { name: /确认这个版本/ }).click();
    await page.waitForTimeout(1800);
    let all = (
      await (await page.request.get(origin + "/api/admin/content/books")).json()
    ).data;
    let item = all.find((b) => b.slug === slug);
    createdId = item?.id;
    if (item?.coverOrigin !== "manual" || item.coverMatch !== "confirmed")
      throw Error("Candidate confirmation not saved");
    await page.unroute("**/api/admin/books/cover-lookup");
    await page.route("**/api/admin/books/cover-lookup", (route) =>
      route.fulfill({
        status: 504,
        json: { success: false, error: "测试超时，请重试或上传" },
      }),
    );
    await page.getByRole("button", { name: "重新查找封面" }).click();
    await page.getByRole("status").filter({ hasText: "测试超时" }).waitFor();
    await page.getByRole("button", { name: "保存草稿", exact: true }).click();
    await page.waitForTimeout(600);
    await page.unroute("**/api/admin/books/cover-lookup");
    // A response for an old title is never applied to the renamed book.
    let release;
    const pending = new Promise((r) => (release = r));
    await page.route("**/api/admin/books/cover-lookup", async (route) => {
      if (route.request().postDataJSON().title === "Old title") {
        await pending;
        await route.fulfill({
          json: {
            success: true,
            data: {
              status: "matched",
              candidates: [{ ...candidate, coverMatch: "confirmed" }],
            },
          },
        });
      } else
        await route.fulfill({
          json: { success: true, data: { status: "missing", candidates: [] } },
        });
    });
    await page
      .getByRole("textbox", { name: "内容标题", exact: true })
      .fill("Old title");
    await page.waitForTimeout(1300);
    await page
      .getByRole("textbox", { name: "内容标题", exact: true })
      .fill("Renamed title");
    release();
    await page.waitForTimeout(2000);
    all = (
      await (await page.request.get(origin + "/api/admin/content/books")).json()
    ).data;
    item = all.find((b) => b.slug === slug);
    if (item?.coverImage || item.title.zh !== "Renamed title")
      throw Error("Old lookup overwrote renamed draft");
    return "Ambiguous candidate confirmation, timeout recovery and stale-title race passed.";
  } finally {
    await page.unroute("**/api/admin/books/cover-lookup").catch(() => {});
    const all = (
      await (await page.request.get(origin + "/api/admin/content/books")).json()
    ).data;
    for (const b of all.filter(
      (b) =>
        b.id === createdId ||
        (b.slug === slug &&
          ["Renamed title", candidate.title, "Old title"].includes(b.title.zh)),
    ))
      await page.request.delete(origin + "/api/admin/content/books/" + b.id);
  }
};
