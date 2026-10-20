import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import Database from 'better-sqlite3'
const root=process.cwd(),L=(zh,en=zh)=>({zh,en})
const projectFile=path.join(root,'server/project-seed.json')
const projects=JSON.parse(fs.readFileSync(projectFile,'utf8'))
const manifestFile=path.join(root,'public/garden/manifest.json')
const manifest=JSON.parse(fs.readFileSync(manifestFile,'utf8'))
const replacements=new Map()
fs.mkdirSync(path.join(root,'public/garden/screens'),{recursive:true})
async function optimize(source,id,type,caption,projectId,original){
  const metadata=await sharp(source).metadata()
  for(const width of [480,960,1600])await sharp(source).resize({width,withoutEnlargement:true}).webp({quality:86}).toFile(path.join(root,`public/garden/screens/${id}-${width}.webp`))
  const url=`/garden/screens/${id}-1600.webp`
  manifest.push({id:`shot-${id}`,url,original,type,caption,projectId,width:metadata.width,height:metadata.height,source:path.relative(root,source).replaceAll('\\','/')})
  return url
}
for(const p of projects){
  const images=[...(p.gallery||[]).map(g=>g.image),...(p.showcaseGroups||[]).flatMap(g=>g.items.map(i=>i.image))].filter(Boolean)
  for(const image of new Set(images)){
    if(!image.startsWith('/project-images/')||replacements.has(image))continue
    const source=path.join(root,'public',image),id=image.replace('/project-images/','').replace(/\.[^.]+$/,'').replaceAll('/','-')
    if(fs.existsSync(source))replacements.set(image,await optimize(source,id,'screenshot',`${p.title.zh} · 项目界面`,p.slug,image))
  }
}
const wechat=projects.find(p=>p.slug==='wechat-auto')
Object.assign(wechat,{
  summary:L('这是一个微信群运营自动化项目。把准备好的文字和图片发到指定群，是其中最直接的一段工作；更需要照顾的是发送前的目标确认、定时任务和运行记录。这里展示的是项目说明设计图，不是微信接口的运行截图。'),
  role:L('自动化流程设计与实现'),category:L('自动化服务 / 商业交付'),capabilities:[L('Python'),L('OCR 识别'),L('macOS 自动化'),L('定时任务')],
  challenge:L('微信群没有适用于这套流程的群发接口。只靠固定坐标点击，窗口位置或界面状态变化后就容易点错，内容发送也需要留下能回看的记录。'),
  approach:L('用 OCR 辅助识别界面，再执行对应的自动化操作。任务由定时调度触发，围绕准备内容、定位群聊和发送结果组织流程。'),
  outcome:L('现有项目资料覆盖内容发送、任务调度和后续运营能力。页面不引用未核实的节省时长、用户规模或稳定运行统计。'),
  result:L('微信群运营自动化；展示素材为项目说明设计图。'),nextStep:L('继续完善异常检测与人工接管，避免界面变化后仍盲目执行。'),
  detailSections:[{title:L('从重复操作开始'),paragraphs:[L('自动化的对象是已经明确的运营动作，而不是让模型自由决定发什么。先准备内容和目标，再让程序处理重复的界面操作。')]},{title:L('保留人能检查的环节'),paragraphs:[L('涉及群聊发送时，目标确认比点击速度更重要。任务记录和失败提示应当能帮助人判断这次操作是否需要重试，而不是只显示一个成功图标。')]}],
  gallery:[],showcaseGroups:[],coverType:'design'
})
for(const [i,name] of ['1.png','2.png','3.png'].entries()){
 const source=path.join(root,'public/project-images/wechatauto',name)
 if(fs.existsSync(source)){const image=await optimize(source,`wechat-auto-${i+1}`,'design',`WeChat Auto · 项目说明设计图 ${i+1}`,'wechat-auto',`/project-images/wechatauto/${name}`);wechat.gallery.push({image,label:L(`项目说明设计图 ${i+1}`),description:L('项目能力说明图，不作为实际运行截图或成果统计。')})}
}
const closet=projects.find(p=>p.slug==='ai-closet')
Object.assign(closet,{
 summary:L('AI Closet 是一个微信小程序衣橱项目。衣服录入后，可以按类型、颜色和归属整理；后端负责识别、生成图片、保存上传任务和用户会话。现有资料包括小程序源码、Node.js 后端和部署说明，以下界面统一标为设计稿。'),
 role:L('小程序、服务端与部署'),category:L('微信小程序 / AI 衣橱'),capabilities:[L('微信小程序'),L('Node.js / Express'),L('MySQL'),L('图像识别与生成')],
 challenge:L('衣服录入不只是一张照片。分类、归属、上传状态和生成结果需要能持续保存；图片处理失败时，也不能让一条衣物记录悄悄消失。'),
 approach:L('前端通过 wx.request 和 wx.uploadFile 调用同域 API；Ubuntu 上的 Express 服务处理微信登录、文件上传和模型请求，MySQL 保存用户、衣物、任务和会话。Nginx 提供 API 与图片访问。'),
 outcome:L('仓库已有小程序前端、MySQL 建表脚本、PM2 和 Nginx 配置，以及查看用户、衣物和上传任务的管理接口。线上运行状态不在本页作未经核实的承诺。'),
 result:L('已有前后端与部署资料；当前展示设计稿。'),nextStep:L('继续核对真机录入、识别失败后的恢复，以及生成图片与衣物记录的对应关系。'),
 detailSections:[{title:L('把衣物整理成可以找回的记录'),paragraphs:[L('首页把上传、全部衣服和分类入口分开。类型、颜色与归属是检索线索，不必每次翻完相册才能找到一件衣服。')]},{title:L('图片任务留在服务端'),paragraphs:[L('识别和图片生成由服务端调用模型，密钥不放在小程序里。上传任务单独记录，方便在生成较慢或失败后继续检查。')]}],
 gallery:[],showcaseGroups:[],projectStatus:'开发中',coverType:'design'
})
for(const name of ['首页','筛选','收纳','选中']){
 const source=path.join(process.env.AYA_CLOSET_SOURCE_DIR || 'public/garden',`${name}.png`)
 if(fs.existsSync(source)){const original=`/garden/ai-closet-${name}-original.png`;fs.copyFileSync(source,path.join(root,'public',original));const image=await optimize(source,`ai-closet-${name}`,'design',`AI Closet · ${name}设计稿`,'ai-closet',original);closet.gallery.push({image,label:L(`${name} · 设计稿`),description:L('来自本地 AI Closet 项目设计资料，非线上运行截图。')})}
}
const claw=projects.find(p=>p.slug==='openclaw-auto-deploy')
if(claw){const source=process.env.AYA_OPENCLAW_SOURCE || 'public/garden/openclaw-menu-original.png';if(fs.existsSync(source)){const original='/garden/openclaw-menu-original.png';if(path.resolve(source)!==path.resolve(root,'public',original))fs.copyFileSync(source,path.join(root,'public',original));claw.coverImage=await optimize(source,'openclaw-menu','screenshot','OpenClaw 配置中心 · 仓库内截图',claw.slug,original);claw.coverType='screenshot';claw.gallery=[...(claw.gallery||[]),{image:claw.coverImage,label:L('命令行配置中心'),description:L('来自 OpenClawInstaller 仓库 photo/menu.png。')}];}}
const ownSite=projects.find(p=>p.slug==='personal-publication'),ownSiteShot=path.join(root,'output/playwright/home-viewport-1440.png')
if(ownSite&&fs.existsSync(ownSiteShot)){
 const original='/garden/personal-publication-original.png';fs.copyFileSync(ownSiteShot,path.join(root,'public',original));ownSite.coverImage=await optimize(ownSiteShot,'personal-publication','screenshot','个人网站 · 本次重构后的实际首页',ownSite.slug,original);ownSite.coverType='screenshot';ownSite.gallery=[...(ownSite.gallery||[]),{image:ownSite.coverImage,label:L('重构后的首页'),description:L('本次本地完整服务的真实界面，包含个人介绍和最近文章。')}]
}
const transform=value=>JSON.parse(JSON.stringify(value,(_key,v)=>typeof v==='string'&&replacements.has(v)?replacements.get(v):v))
const verifiedStatuses={'shizaolu':'开发中','voicedesk':'已发布','learningbydoing-ai-studio':'开发中','ai-closet':'开发中'}
const result=projects.map(transform).map(p=>({...p,projectStatus:verifiedStatuses[p.slug]||'项目档案',gallery:(p.gallery||[]).filter((g,i,a)=>!g.image||a.findIndex(x=>x.image===g.image)===i)}))
fs.writeFileSync(projectFile,JSON.stringify(result,null,2));fs.writeFileSync(path.join(root,'src/data/project-snapshot.json'),JSON.stringify(result,null,2))
fs.writeFileSync(manifestFile,JSON.stringify([...new Map(manifest.map(m=>[m.id,m])).values()],null,2))
const db=new Database(path.join(root,'server/data/personweb.db'))
db.transaction(()=>{
 for(const row of db.prepare("SELECT * FROM garden_content WHERE kind='projects'").all()){
  let published=row.published?transform(JSON.parse(row.published)):null,draft=row.draft?transform(JSON.parse(row.draft)):null
  const seed=result.find(p=>p.id===row.id)
  if(seed&&published?.projectStatus==='持续维护')published={...published,projectStatus:seed.projectStatus}
  if(seed&&published&&!draft){
   if(['wechat-auto','ai-closet'].includes(row.id)&&published.detailSections?.length===0&&published.role?.zh==='产品设计与开发')published={...published,...seed}
   if(['openclaw-auto-deploy','personal-publication'].includes(row.id)&&!published.coverImage)published={...published,coverImage:seed.coverImage,coverType:seed.coverType,gallery:seed.gallery}
  }
  db.prepare('UPDATE garden_content SET published=?,draft=? WHERE id=?').run(published?JSON.stringify(published):null,draft?JSON.stringify(draft):null,row.id)
 }
})()
db.close()
console.log(`Optimized ${replacements.size} screenshot URLs; preserved content edits and all project IDs.`)
