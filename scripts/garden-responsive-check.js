async (page) => {
  const failures=[],report=[];
  const paths=['/','/journal','/projects','/projects/shizaolu','/projects/voicedesk','/projects/promptball','/about','/commercial','/contact','/reading','/notes','/journal/durable-agent-systems'];
  for(const width of [360,390,768,1024,1440,1920]){
    await page.setViewportSize({width,height:1000});
    for(const path of paths){
      await page.goto(`http://localhost:4191${path}`);
      await page.locator('h1').waitFor();
      await page.evaluate(async()=>{await Promise.all([...document.images].filter(i=>i.loading!=='lazy').map(i=>i.decode().catch(()=>{})))});
      const layout=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,h1:document.querySelector('h1')?.getBoundingClientRect().toJSON(),broken:[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src),text:document.querySelector('h1')?.textContent}));
      if(layout.scroll>width+1||layout.broken.length||layout.text?.includes('找不到'))failures.push({path,width,...layout});
      report.push({path,width,scroll:layout.scroll});
      if((width===1440||width===390)&&['/','/journal','/projects','/projects/shizaolu','/about','/commercial'].includes(path)){
        await page.evaluate(()=>window.scrollTo(0,0));
        await page.screenshot({path:`output/playwright/${path==='/'?'home':path.slice(1).replaceAll('/','-')}-${width}.png`,fullPage:true});
      }
    }
  }
  for(const factor of [1.25,1.5]){
    await page.setViewportSize({width:1440,height:1000});await page.goto('http://localhost:4191/');await page.locator('h1').waitFor();
    const result=await page.evaluate(f=>{document.body.style.zoom=String(f);return {zoom:f,scroll:document.documentElement.scrollWidth,width:innerWidth}},factor);
    if(result.scroll>result.width+1)failures.push(result);
    report.push(result);
    await page.screenshot({path:`output/playwright/home-zoom-${factor}.png`});
  }
  console.log(JSON.stringify({checks:report.length,failures,report}));
  if(failures.length)throw Error(JSON.stringify(failures));
}
