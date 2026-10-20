async (page) => {
  const problems = [],
    report = [];
  page.on("pageerror", (error) => problems.push(error.message));
  const origin = "http://localhost:4191";
  for (const width of [360, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const path of [
      "/",
      "/about",
      "/reading",
      "/journal",
      "/projects",
      "/contact",
      "/subscribe",
      "/studio",
    ]) {
      await page.goto(origin + path);
      await page.locator("h1").first().waitFor();
      await page.waitForTimeout(700);
      if (path === "/reading")
        await page.locator(".shelf-book").first().waitFor();
      await page.evaluate(async () => {
        for (const image of document.images) image.loading = "eager";
        await Promise.all(
          [...document.images].map((img) =>
            Promise.race([
              img.decode().catch(() => {}),
              new Promise((r) => setTimeout(r, 10000)),
            ]),
          ),
        );
      });
      const check = await page.evaluate(() => ({
        width: innerWidth,
        scroll: document.documentElement.scrollWidth,
        broken: [...document.images]
          .filter((i) => i.complete && i.naturalWidth < 2)
          .map((i) => i.src),
        books: document.querySelectorAll(".shelf-book").length,
        projects: document.querySelectorAll(".all-projects .project-card")
          .length,
        footerEmails: document.querySelectorAll('footer a[href^="mailto:"]')
          .length,
      }));
      report.push({ width, path, ...check });
      if (check.scroll > width + 1)
        problems.push(`Overflow ${width} ${path}: ${check.scroll}`);
      if (check.broken.length)
        problems.push(`Broken ${width} ${path}: ${check.broken.join(",")}`);
      if (path === "/reading" && check.books !== 6)
        problems.push("Book count changed");
      if (
        path === "/reading" &&
        (await page.locator(".shelf-book img").count()) !== 6
      )
        problems.push(`Missing real book images at ${width}`);
      if (path === "/projects" && check.projects !== 16)
        problems.push("Project count changed");
      if (
        (width === 390 || width === 1440) &&
        ["/", "/about", "/reading"].includes(path)
      ) {
        await page.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += 500) {
            scrollTo({ top: y, behavior: "instant" });
            await new Promise((r) => setTimeout(r, 150));
          }
          scrollTo({ top: 0, behavior: "instant" });
        });
        await page.waitForTimeout(700);
        if (
          await page
            .locator(".motion-reveal")
            .evaluateAll((elements) =>
              elements.some(
                (el) => Number(getComputedStyle(el).opacity) < 0.99,
              ),
            )
        )
          problems.push(`Content hidden after scrolling ${path} ${width}`);
        await page.screenshot({
          path: `output/playwright/warm-${width}-${path === "/" ? "home" : path.slice(1)}.png`,
          fullPage: true,
        });
        if (path === "/about")
          await page
            .locator("footer")
            .screenshot({ path: `output/playwright/warm-${width}-footer.png` });
      }
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const zoom of [1.25, 1.5]) {
    for (const path of ["/", "/about", "/reading", "/studio"]) {
      await page.goto(origin + path);
      await page.locator("h1").first().waitFor();
      await page.waitForTimeout(500);
      await page.evaluate(
        (zoom) => (document.documentElement.style.zoom = zoom),
        zoom,
      );
      if (
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1,
        )
      )
        problems.push(`Zoom overflow ${zoom} ${path}`);
    }
  }
  await page.goto(origin + "/reading?status=wish");
  await page.locator(".shelf-book").first().waitFor();
  await page.locator(".shelf-book").first().click();
  await page.locator(".book-dialog[open]").waitFor();
  if (!page.url().includes("status=wish") || !page.url().includes("book="))
    problems.push("Reading URL state lost");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(100);
  if (page.url().includes("book=") || !page.url().includes("status=wish"))
    problems.push("Close lost filter");
  if (
    !(await page
      .locator(".shelf-book")
      .first()
      .evaluate((el) => el === document.activeElement))
  )
    problems.push("Book focus not restored");
  await page.goto(origin + "/reading?status=wish&book=ai-engineering");
  await page.locator(".book-dialog[open]").waitFor();
  await page.getByRole("button", { name: "关闭书籍详情" }).click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(origin);
  await page.locator("h1").waitFor();
  await page.waitForTimeout(400);
  if (
    await page
      .locator(".hero-portrait")
      .evaluate((el) => getComputedStyle(el).transform !== "none")
  )
    problems.push("Reduced motion still transforms");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  // Record actual native scrolling (not a simulated slideshow of screenshots).
  await page.goto(origin);
  await page.locator("h1").waitFor();
  await page.waitForTimeout(1100);
  for (let i = 0; i < 17; i++) {
    await page.mouse.wheel(0, 210);
    await page.waitForTimeout(270);
  }
  await page.waitForTimeout(800);
  await page.goto(origin + "/about");
  await page.locator("h1").waitFor();
  for (let i = 0; i < 8; i++) {
    await page.mouse.wheel(0, 180);
    await page.waitForTimeout(300);
  }
  await page.goto(origin + "/reading");
  await page.locator(".shelf-book").first().waitFor();
  await page.waitForTimeout(800);
  await page.locator(".shelf-book").first().click();
  await page.waitForTimeout(1300);
  await page.keyboard.press("Escape");
  await page.evaluate(
    (report) => localStorage.setItem("warm-qa", JSON.stringify(report)),
    { report, problems },
  );
  if (problems.length) throw Error(JSON.stringify(problems));
  return `Responsive, zoom, images, modal, reduced-motion: ${report.length} page/viewport checks passed.`;
};
