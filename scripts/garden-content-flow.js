async (page) => {
  const assert=(condition,message)=>{if(!condition)throw Error(message)};
  const created=[];
  for(const [kind,label,title] of [['notes','随想',''],['books','书架','验收用书，不是真实阅读记录'],['projects','项目','验收用项目']]){
    await page.goto(`http://localhost:4191/studio?kind=${kind}`);
    await page.getByRole('button',{name:`新增${label}`,exact:true}).click();
    const slug=`qa-garden-${kind}`;
    await page.getByRole('textbox',{name:'链接标识',exact:true}).fill(slug);
    if(title)await page.getByRole('textbox',{name:'内容标题',exact:true}).fill(title);
    if(kind==='projects'){
      await page.getByRole('textbox',{name:'一句话介绍',exact:true}).fill('只用于验收后台项目编辑流程。');
      await page.getByRole('textbox',{name:'项目概述',exact:true}).fill('这是本地自动化测试内容，完成验收后移除。');
      await page.getByRole('textbox',{name:'技术／功能标签（逗号分隔）',exact:true}).fill('测试一, 测试二');
    }else{
      await page.getByRole('textbox',{name:'正文编辑器',exact:true}).fill('这是本地验收用的内容。只写中文，发布后检查页面是否能读取。');
      await page.getByRole('textbox',{name:'标签（逗号分隔）',exact:true}).fill('测试一, 测试二');
    }
    if(kind==='books'){
      await page.getByRole('textbox',{name:'作者',exact:true}).fill('验收作者');
      await page.getByRole('spinbutton',{name:'阅读进度（%）',exact:true}).fill('37');
    }
    await page.getByRole('button',{name:'发布',exact:true}).click();
    await page.getByRole('status').filter({hasText:'已发布'}).waitFor({timeout:15000});
    const site=await(await page.request.get('http://localhost:4191/api/site')).json();
    const item=site.data[kind].find(x=>x.slug===slug);assert(item,`${kind} 未公开`);
    if(kind!=='projects')assert(item.tags.length===2,'逗号标签输入丢失');
    else assert(item.capabilities.length===2,'项目功能标签丢失');
    created.push({kind,id:item.id,slug});
  }
  await page.goto('http://localhost:4191/notes');await page.getByText('这是本地验收用的内容。只写中文，发布后检查页面是否能读取。',{exact:true}).waitFor();
  await page.goto('http://localhost:4191/reading');await page.getByRole('heading',{name:'验收用书，不是真实阅读记录',exact:true}).waitFor();
  await page.goto('http://localhost:4191/projects/qa-garden-projects');await page.getByRole('heading',{name:'验收用项目',exact:true}).first().waitFor();
  await page.evaluate(records=>localStorage.setItem('aya-qa-records',JSON.stringify(records)),created);
}
