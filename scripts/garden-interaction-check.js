async (page) => {
 const assert=(condition,message)=>{if(!condition)throw Error(message)};
 await page.setViewportSize({width:1440,height:1000});
 await page.goto('http://localhost:4191/journal');
 await page.getByRole('searchbox',{name:'搜索文章',exact:true}).fill('Agent');
 await page.waitForURL('**/journal?q=Agent');
 assert(new URL(page.url()).searchParams.get('q')==='Agent','搜索未写入 URL');
 await page.reload();assert(await page.getByRole('searchbox',{name:'搜索文章',exact:true}).inputValue()==='Agent','刷新丢失搜索状态');
 await page.getByRole('searchbox',{name:'搜索文章',exact:true}).fill('不存在的验收词');
 await page.waitForURL(url=>url.searchParams.get('q')==='不存在的验收词');
 await page.locator('.empty-state').filter({hasText:'没有匹配的文章。'}).waitFor();
 await page.goBack();assert(new URL(page.url()).searchParams.get('q')==='Agent','浏览器返回丢失状态');
 await page.keyboard.press('Control+k');await page.getByRole('textbox',{name:'搜索文章、项目、随想和书籍',exact:true}).fill('VoiceDesk');
 await page.locator('.search-results a').filter({hasText:'VoiceDesk'}).first().waitFor();
 await page.keyboard.press('Escape');assert(!await page.locator('.search-dialog').isVisible(),'搜索不能用 Escape 关闭');
 await page.getByRole('button',{name:'主题：浅色，点击切换',exact:true}).click();
 await page.locator('html[data-theme=dark]').waitFor();
 assert(await page.locator('html').getAttribute('data-theme')==='dark','深色主题未应用');
 await page.reload();assert(await page.locator('html').getAttribute('data-theme')==='dark','主题没有持久化');
 await page.goto('http://localhost:4191/');await page.locator('h1').waitFor();await page.screenshot({path:'output/playwright/home-dark-1440.png'});
 await page.getByRole('button',{name:'主题：深色，点击切换',exact:true}).click();
 await page.getByRole('button',{name:'主题：跟随系统，点击切换',exact:true}).click();
 await page.setViewportSize({width:390,height:900});
 await page.getByRole('button',{name:'打开导航',exact:true}).click();await page.getByRole('navigation',{name:'手机导航',exact:true}).waitFor();
 await page.keyboard.press('Escape');await page.getByRole('navigation',{name:'手机导航',exact:true}).waitFor({state:'hidden'});assert(!await page.getByRole('navigation',{name:'手机导航',exact:true}).isVisible(),'手机菜单不能关闭');
 await page.goto('http://localhost:4191/projects/shizaolu');
 const trigger=page.getByRole('button',{name:/放大查看/}).first();await trigger.click();await page.getByRole('dialog').waitFor();
 await page.keyboard.press('Tab');assert(await page.evaluate(()=>!!document.activeElement?.closest('.lightbox')),'图集焦点跑到了遮罩外');
 await page.keyboard.press('ArrowRight');await page.keyboard.press('Escape');assert(!await page.getByRole('dialog').isVisible(),'图集不能关闭');
 await page.goto('http://localhost:4191/journal/durable-agent-systems');await page.locator('.article-toc').waitFor();assert(await page.locator('.article-toc details').getAttribute('open')===null,'手机目录未默认折叠');
 await page.setViewportSize({width:1440,height:1000});await page.locator('.article-toc details[open]').waitFor();
 const site=await(await page.request.get('http://localhost:4191/api/site')).json();
 const checked=[];
 for(const width of [390,1440]){
  await page.setViewportSize({width,height:1000});
  for(const project of site.data.projects){
   await page.goto(`http://localhost:4191/projects/${project.slug}`);await page.getByRole('heading',{name:project.title.zh,exact:true}).first().waitFor();
   await page.evaluate(async()=>{await Promise.all([...document.images].map(img=>{img.loading='eager';return img.decode().catch(()=>{})}))});
   const bad=await page.evaluate(()=>[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src));assert(!bad.length,`图片失效 ${project.slug}: ${bad}`);
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);assert(!overflow,`${project.slug} 横向溢出`);
   checked.push(`${width}:${project.slug}`);
  }
 }
 await page.evaluate(result=>localStorage.setItem('aya-qa-interactions',JSON.stringify(result)),{passed:true,projectChecks:checked.length,checked});
}
