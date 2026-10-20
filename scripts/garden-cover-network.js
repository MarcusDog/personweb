async(page)=>{
 const log=[];
 page.on('requestfailed',r=>log.push({url:r.url(),error:r.failure()?.errorText}));
 page.on('response',r=>{if(r.url().includes('covers.openlibrary'))log.push({url:r.url(),status:r.status()});});
 await page.goto('http://localhost:4191/reading');await page.locator('.shelf-book').first().waitFor();
 await page.evaluate(()=>{for(const img of document.images)img.loading='eager';});
 await page.waitForTimeout(18000);
 return JSON.stringify({log,images:await page.locator('.shelf-book img').count()});
}
