async (page) => {
  if (page.viewportSize() !== null) throw Error('This is a fixed-size QA browser. Open garden-preview.config.json for a native, resizable user preview.');
  await page.goto('http://localhost:4191/?v=warm-gold-20261020');
  await page.locator('h1').waitFor();
  await page.evaluate(() => { document.body.style.removeProperty('zoom'); window.scrollTo(0, 0); });
  const metrics = await page.evaluate(() => ({ innerWidth, outerWidth, width: document.documentElement.clientWidth, root: document.getElementById('root').getBoundingClientRect().width, url: location.href }));
  // Windows may report a tiny outerWidth for a minimized native window. The
  // null Playwright viewport above is the authoritative no-emulation check.
  if (Math.abs(metrics.root - metrics.width) > 1) throw Error(`Preview root does not fill its native viewport: ${JSON.stringify(metrics)}`);
  console.log(JSON.stringify(metrics));
}
