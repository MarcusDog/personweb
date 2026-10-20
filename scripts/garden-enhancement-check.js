async (page) => {
  try {
  const failures = [],
    report = [];
  const paths = [
    "/",
    "/journal",
    "/journal/context-is-a-budget",
    "/projects",
    "/about",
    "/contact",
    "/reading",
    "/subscribe",
  ];
  for (const width of [360, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const path of paths) {
      await page.goto(`http://localhost:4191${path}?v=accent-20261020`);
      await page.locator("h1").waitFor();
      await page.waitForFunction(
        () => !document.querySelector(".loading-state"),
      );
      if (path === "/")
        await page
          .getByRole("heading", {
            name: "本地优先的 AI 工具，应该先把边界说清楚",
            exact: true,
          })
          .waitFor();
      if (path === "/journal")
        await page.waitForFunction(
          () => document.querySelectorAll(".article-row").length === 8,
        );
      if (path === "/reading")
        await page.waitForFunction(
          () => document.querySelectorAll(".reading-book").length === 6,
        );
      await page.evaluate(async () => {
        for (const image of document.images) image.loading = "eager";
        await Promise.all(
          [...document.images].map((image) => image.decode().catch(() => {})),
        );
      });
      const result = await page.evaluate(() => ({
        width: innerWidth,
        scroll: document.documentElement.scrollWidth,
        broken: [...document.images]
          .filter((image) => image.naturalWidth === 0)
          .map((image) => image.src),
        h1: document.querySelector("h1")?.textContent,
      }));
      report.push({ path, width, scroll: result.scroll });
      if (result.scroll > width + 1 || result.broken.length)
        failures.push({ path, ...result });
      if (
        [390, 1440].includes(width) &&
        [
          "/",
          "/about",
          "/contact",
          "/reading",
          "/subscribe",
          "/journal",
        ].includes(path)
      )
        await page.screenshot({
          path: `output/playwright/enhanced-${path === "/" ? "home" : path.slice(1)}-${width}.png`,
          fullPage: true,
        });
    }
  }
  for (const zoom of [1.25, 1.5]) {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("http://localhost:4191/about");
    await page.locator(".focus-card").first().waitFor();
    const result = await page.evaluate((value) => {
      document.body.style.zoom = String(value);
      return {
        zoom: value,
        scroll: document.documentElement.scrollWidth,
        width: innerWidth,
      };
    }, zoom);
    report.push(result);
    if (result.scroll > result.width + 1) failures.push(result);
  }
  await page.goto("http://localhost:4191/subscribe");
  await page.locator(".feed-card").first().waitFor();
  for (const path of [
    "/rss.xml",
    "/feeds/articles.xml",
    "/feeds/reading.xml",
  ]) {
    const result = await page.evaluate(async (url) => {
      const response = await fetch(url);
      const xml = new DOMParser().parseFromString(
        await response.text(),
        "application/xml",
      );
      return {
        status: response.status,
        items: xml.querySelectorAll("item").length,
        invalid: !!xml.querySelector("parsererror"),
        full: xml.getElementsByTagName("content:encoded").length,
      };
    }, path);
    const expected =
      path === "/rss.xml" ? 14 : path.includes("articles") ? 8 : 6;
    if (
      result.status !== 200 ||
      result.invalid ||
      result.items !== expected ||
      result.full !== expected
    )
      failures.push({ path, ...result });
  }
  const summary = { checks: report.length + 3, failures, report };
  await page.evaluate(
    (value) =>
      localStorage.setItem("aya-enhancement-layout-qa", JSON.stringify(value)),
    summary,
  );
  console.log(JSON.stringify(summary));
  if (failures.length) throw Error(JSON.stringify(failures));
  } finally {
    // The runner uses a separate headless browser and closes it after this check.
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('http://localhost:4191/?v=accent-20261020');
  }
};
