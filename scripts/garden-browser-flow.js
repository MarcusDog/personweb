async (page) => {
  const assert=(condition,message)=>{if(!condition)throw new Error(message)};
  await page.getByRole('textbox',{name:'内容标题',exact:true}).fill('验收：中文写作与插图');
  await page.getByRole('textbox',{name:'链接标识',exact:true}).fill('qa-garden-check');
  await page.getByRole('textbox',{name:'分类',exact:true}).fill('验收草稿');
  await page.getByRole('textbox',{name:'文章摘要',exact:true}).fill('只用于本地验收，完成后清理。');
  await page.locator('input[accept*=".markdown"]').setInputFiles({name:'import-check.md',mimeType:'text/markdown',buffer:Buffer.from('## 导入验收\n\n中文 Markdown 导入。')});
  await page.locator('.tiptap h2').filter({hasText:'导入验收'}).waitFor();
  await page.getByRole('textbox',{name:'正文编辑器',exact:true}).fill('这是一篇中文日志，测试正文保存和发布。');
  await page.locator('input[type=file][accept="image/png,image/jpeg,image/webp,image/gif"]').first().setInputFiles('public/garden/avatar-480.webp');
  await page.locator('.tiptap img').waitFor();
  for(const type of ['paste','drop']){
    const before=await page.locator('.tiptap img').count();
    await page.getByRole('textbox',{name:'正文编辑器',exact:true}).evaluate(async(el,eventType)=>{
      const blob=await fetch('/garden/avatar-480.webp').then(r=>r.blob()),transfer=new DataTransfer();transfer.items.add(new File([blob],`clipboard-${eventType}.webp`,{type:'image/webp'}));
      const rect=el.getBoundingClientRect(),clientX=(rect.left+rect.right)/2,clientY=Math.min(innerHeight-50,Math.max(120,(rect.top+rect.bottom)/2));
      el.dispatchEvent(eventType==='paste'?new ClipboardEvent('paste',{clipboardData:transfer,bubbles:true,cancelable:true}):new DragEvent('drop',{dataTransfer:transfer,bubbles:true,cancelable:true,clientX,clientY}));
    },type);
    await page.waitForFunction(count=>document.querySelectorAll('.tiptap img').length>count,before);
  }
  await page.getByRole('status').filter({hasText:/草稿已自动保存/}).waitFor({timeout:15000});
  const list=await (await page.request.get('http://localhost:4191/api/admin/content/posts')).json();
  const item=list.data.find(p=>p.slug==='qa-garden-check');assert(item,'自动保存没有建立草稿');
  const liveBefore=await (await page.request.get('http://localhost:4191/api/site')).json();
  assert(!liveBefore.data.posts.some(p=>p.slug===item.slug),'草稿泄漏到公开接口');
  await page.getByRole('button',{name:'预览',exact:true}).click();
  assert(await page.locator('.editor-preview img').count()===3,'预览丢失上传／粘贴／拖入图片');
  await page.getByRole('button',{name:'继续编辑',exact:true}).click();
  await page.getByRole('button',{name:'发布',exact:true}).click();
  await page.getByRole('status').filter({hasText:'已发布'}).waitFor();
  const live=await (await page.request.get(`http://localhost:4191/api/journal/${item.slug}`)).json();
  assert(live.data.body.zh.includes('/uploads/'),'发布后丢失图片');
  assert(live.data.bodyDocuments.zh.type==='doc','没有保存结构化文档');
  await page.getByRole('textbox',{name:'内容标题',exact:true}).fill('验收：修改仅在草稿');
  await page.getByRole('status').filter({hasText:/修改已存草稿/}).waitFor({timeout:15000});
  const stillLive=await (await page.request.get(`http://localhost:4191/api/journal/${item.slug}`)).json();
  assert(stillLive.data.title.zh==='验收：中文写作与插图','自动保存改动了已发布版本');
  await page.getByRole('button',{name:'更新发布',exact:true}).click();
  await page.getByRole('status').filter({hasText:'已发布'}).waitFor();
  const updated=await (await page.request.get(`http://localhost:4191/api/journal/${item.slug}`)).json();
  assert(updated.data.title.zh==='验收：修改仅在草稿','更新发布失败');
  const oldBody=await page.getByRole('textbox',{name:'正文编辑器',exact:true}).innerText();
  await page.getByRole('button',{name:'润色',exact:true}).click();
  await page.getByRole('alert').filter({hasText:/未配置|尚未配置/}).waitFor();
  assert(await page.getByRole('textbox',{name:'正文编辑器',exact:true}).innerText()===oldBody,'AI 失败改动了原稿');
  await page.setViewportSize({width:1440,height:1000});
  await page.evaluate(()=>window.scrollTo(0,0));
  await page.screenshot({path:'output/playwright/studio-editor.png',fullPage:true});
  page.once('dialog',dialog=>dialog.accept());
  await page.getByRole('button',{name:'撤回发布',exact:true}).click();
  await page.getByRole('status').filter({hasText:/已撤回/}).waitFor();
  const hidden=await page.request.get(`http://localhost:4191/api/journal/${item.slug}`);
  assert(hidden.status()===404,'撤回后文章仍公开');
  await page.request.delete(`http://localhost:4191/api/admin/content/posts/${item.id}`);
  console.log(JSON.stringify({passed:['中文写作','插图上传','自动保存','草稿不公开','共用预览','结构化文档','发布','修改隔离','更新发布','AI失败保留原稿','撤回'],cleanedTestPost:item.id}));
}
