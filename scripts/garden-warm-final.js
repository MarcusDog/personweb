async (page) => {
  const origin = "http://localhost:4191",
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const path of ["/", "/about", "/reading"]) {
      await page.goto(origin + path);
      await page.locator("h1").waitFor();
      await page.waitForTimeout(600);
      await page.evaluate(async () => {
        for (const img of document.images) img.loading = "eager";
        await Promise.all(
          [...document.images].map((img) => img.decode().catch(() => {})),
        );
        for (let y = 0; y < document.body.scrollHeight; y += 400) {
          scrollTo({ top: y, behavior: "instant" });
          await new Promise((r) => setTimeout(r, 140));
        }
      });
      await page.waitForTimeout(650);
      if (
        await page
          .locator(".motion-reveal")
          .evaluateAll((nodes) =>
            nodes.some((n) => Number(getComputedStyle(n).opacity) < 0.99),
          )
      )
        throw Error("Reveal remained hidden");
      await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForTimeout(300);
      await page.screenshot({
        path: `output/playwright/warm-${width}-${path === "/" ? "home" : path.slice(1)}.png`,
        fullPage: true,
      });
      if (path === "/")
        await page.screenshot({
          path: `output/playwright/warm-${width}-hero.png`,
        });
      if (path === "/about")
        await page
          .locator("footer")
          .screenshot({ path: `output/playwright/warm-${width}-footer.png` });
      if (
        path === "/reading" &&
        ((await page.locator(".shelf-book img").count()) !== 6 ||
          (await page.locator(".cover-unavailable").count()))
      )
        throw Error("Not all six real book covers loaded");
    }
  }
  const site = (await (await page.request.get(origin + "/api/site")).json())
    .data;
  for (const width of [360, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(origin + `/studio?kind=books&edit=${site.books[0].id}`);
    await page.locator(".cover-lookup").waitFor();
    for (const panel of width <= 800
      ? ["正文编辑", "发布设置"]
      : ["正文编辑"]) {
      if (width <= 800)
        await page.getByRole("button", { name: panel, exact: true }).click();
      if (
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1,
        )
      )
        throw Error("Editor overflow " + width + " " + panel);
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(origin + "/about");
  await page.locator("h1").waitFor();
  const before = await page
    .locator(".site-header")
    .evaluate((el) => el.getBoundingClientRect().height);
  await page.mouse.wheel(0, 650);
  await page.waitForTimeout(500);
  if (
    Math.abs(
      (await page
        .locator(".site-header")
        .evaluate((el) => el.getBoundingClientRect().height)) - before,
    ) > 1
  )
    throw Error("Navbar height shifts on scrolling");
  await page.getByRole("button", { name: /主题：浅色/ }).click();
  if (
    (await page.evaluate(() => document.documentElement.dataset.theme)) !==
    "dark"
  )
    throw Error("Dark mode did not apply");
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 140));
    }
    scrollTo({ top: 0, behavior: "instant" });
  });
  await page.waitForTimeout(800);
  await page.screenshot({
    path: "output/playwright/warm-dark-about.png",
    fullPage: true,
  });
  await page.goto(origin + "/reading");
  await page.locator(".shelf-book").first().waitFor();
  await page.evaluate(async () => {
    for (const img of document.images) img.loading = "eager";
    await Promise.all(
      [...document.images].map((img) => img.decode().catch(() => {})),
    );
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 140));
    }
    scrollTo({ top: 0, behavior: "instant" });
  });
  await page.waitForTimeout(800);
  await page.screenshot({
    path: "output/playwright/warm-dark-reading.png",
    fullPage: true,
  });
  if (
    site.posts.length !== 8 ||
    site.projects.length !== 16 ||
    site.books.length !== 6
  )
    throw Error("Content count changed");
  if (
    (await (await page.request.get(origin + "/rss.xml")).text()).match(
      /<item>/g,
    )?.length !== 14
  )
    throw Error("RSS count changed");
  if (errors.length) throw Error(errors.join(";"));
  return "Final screenshots, six real covers, editor at six widths, dark theme, stable navbar, RSS and content preservation passed.";
};
