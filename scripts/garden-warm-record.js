async (page) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("http://localhost:4191/");
  await page.locator(".home-projects .project-card").first().waitFor();
  await page.waitForTimeout(1200);
  for (let n = 0; n < 18; n++) {
    await page.mouse.wheel(0, 185);
    await page.waitForTimeout(300);
  }
  await page.waitForTimeout(700);
  await page.goto("http://localhost:4191/about");
  await page.locator(".about-intro").waitFor();
  await page.waitForTimeout(500);
  for (let n = 0; n < 7; n++) {
    await page.mouse.wheel(0, 190);
    await page.waitForTimeout(300);
  }
  await page.goto("http://localhost:4191/reading");
  await page.locator(".shelf-book").first().waitFor();
  await page.waitForTimeout(1200);
  await page.locator(".shelf-book").first().click();
  await page.waitForTimeout(1300);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);
  return "Native wheel scroll recording complete: home → about → reading details.";
};
