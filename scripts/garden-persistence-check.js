async (page) => {
  const assert=(condition,message)=>{if(!condition)throw Error(message)};
  const records=await page.evaluate(()=>JSON.parse(localStorage.getItem('aya-qa-records')||'[]'));
  assert(records.length===3,'缺少待检查的三类测试内容');
  const site=await(await page.request.get('http://localhost:4191/api/site')).json();
  for(const r of records)assert(site.data[r.kind].some(x=>x.id===r.id),`${r.kind} 重启后未保留`);
  for(const r of records){
    await page.goto(`http://localhost:4191/studio?kind=${r.kind}&edit=${r.id}`);
    await page.getByRole('button',{name:'更新发布',exact:true}).waitFor();
    if(r.kind==='notes')await page.getByRole('textbox',{name:'正文编辑器',exact:true}).fill('已编辑的验收随想。');
    if(r.kind==='books')await page.getByRole('spinbutton',{name:'阅读进度（%）',exact:true}).fill('52');
    if(r.kind==='projects')await page.getByRole('textbox',{name:'一句话介绍',exact:true}).fill('已编辑的验收项目介绍。');
    await page.getByRole('button',{name:'更新发布',exact:true}).click();
    await page.getByRole('status').filter({hasText:'已发布'}).waitFor();
    const changed=await(await page.request.get(`http://localhost:4191/api/admin/content/${r.kind}`)).json();const item=changed.data.find(x=>x.id===r.id);
    assert(r.kind==='notes'?item.body.zh.includes('已编辑'):r.kind==='books'?item.progress===52:item.subtitle.zh.includes('已编辑'),'编辑内容未保存');
  }
  const invalid=await page.request.post('http://localhost:4191/api/admin/upload',{data:{dataUrl:'data:image/png;base64,bm90LWFuLWltYWdl'}});assert(invalid.status()===400,'无效图片没有被拒绝');
  const rss=await page.request.get('http://localhost:4191/rss.xml'),sitemap=await page.request.get('http://localhost:4191/sitemap.xml');
  assert((await rss.text()).includes('<rss version='),'RSS 不可用');assert((await sitemap.text()).includes('/projects/shizaolu'),'动态 sitemap 缺少项目');
  for(const r of records)await page.request.delete(`http://localhost:4191/api/admin/content/${r.kind}/${r.id}`);
  await page.evaluate(()=>localStorage.removeItem('aya-qa-records'));
  await page.goto('http://localhost:4191/studio');
  await page.locator('.studio-summary').waitFor();await page.evaluate(()=>window.scrollTo(0,0));
  await page.screenshot({path:'output/playwright/studio-overview.png',fullPage:true});
}
