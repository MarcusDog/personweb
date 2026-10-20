async (page)=>{
 const site=await(await page.request.get('http://localhost:4191/api/site')).json();
 const post=site.data.posts[0];
 await page.setViewportSize({width:390,height:900});
 await page.goto(`http://localhost:4191/studio?kind=posts&edit=${post.id}`);
 await page.getByRole('group',{name:'编辑面板',exact:true}).waitFor();
 await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:'output/playwright/studio-editor-mobile.png'});
 await page.getByRole('button',{name:'发布设置',exact:true}).click();
 await page.getByRole('textbox',{name:'链接标识',exact:true}).waitFor();await page.screenshot({path:'output/playwright/studio-settings-mobile.png'});
 await page.getByRole('button',{name:'正文编辑',exact:true}).click();
 await page.setViewportSize({width:1440,height:1000});await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:'output/playwright/studio-editor-desktop.png',fullPage:true});
 await page.request.post('http://localhost:4191/api/admin/logout');
 for(const width of [390,1440]){
   await page.setViewportSize({width,height:1000});
   for(const path of ['/','/journal','/projects','/about','/commercial','/projects/shizaolu','/projects/voicedesk']){
     await page.goto(`http://localhost:4191${path}?v=garden-20261019`);await page.locator('h1').waitFor();
     await page.evaluate(async()=>{await Promise.all([...document.images].map(img=>{img.loading='eager';return img.decode().catch(()=>{})}))});
     await page.screenshot({path:`output/playwright/${path==='/'?'home':path.slice(1).replaceAll('/','-')}-${width}.png`,fullPage:true});
     if(path==='/')await page.screenshot({path:`output/playwright/home-viewport-${width}.png`});
     if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))throw Error(`最终截图发现溢出: ${path} ${width}`);
   }
 }
 await page.goto('http://localhost:4191/?v=garden-20261019');
}
