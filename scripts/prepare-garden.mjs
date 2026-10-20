import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import Database from 'better-sqlite3'
import { projects } from '../src/data/projects.ts'

const root = process.cwd()
const backup = path.join(root, 'server/data/backups/pre-garden-20261019')
fs.mkdirSync(backup, { recursive: true })
if (!fs.existsSync(path.join(backup, 'personweb.db'))) {
  const db = new Database(path.join(root, 'server/data/personweb.db'))
  await db.backup(path.join(backup, 'personweb.db'))
  db.close()
  fs.cpSync(path.join(root, 'public/uploads'), path.join(backup, 'uploads'), { recursive: true })
}
const out = path.join(root, 'public/garden')
fs.mkdirSync(out, { recursive: true })
const sources = [
  ['still-life', 'public/garden/still-life-original.png', 'generated', '晨光与阅读 · 文章氛围图'],
  ['mountains', 'public/garden/mountains-original.png', 'generated', '山与湖 · 文章氛围图'],
  ['avatar', 'public/garden/avatar-original.png', 'illustration', '个人插画头像'],
  ['flow-socket', 'public/garden/flow-socket-original.png', 'screenshot', 'Flow Socket 实际界面'],
  ['ai-closet', 'public/garden/ai-closet-original.png', 'design', 'AI Closet 首页设计稿'],
  ['shizaolu', 'public/project-images/shizaolu/fridge.png', 'screenshot', '食灶录 · 我的冰箱'],
  ['shizaolu-recommend', 'public/project-images/shizaolu/recommend.png', 'screenshot', '食灶录 · 推荐菜谱'],
  ['shizaolu-diary', 'public/project-images/shizaolu/diary.png', 'screenshot', '食灶录 · 饮食记录'],
  ['voicedesk', 'public/project-images/voicedesk/home.png', 'screenshot', 'VoiceDesk 首页'],
  ['ainews-platform', 'public/project-images/ainews/1.png', 'screenshot', 'Ainews 实际界面'],
  ['learningbydoing-ai-studio', 'public/project-images/learningbydoing/8.png', 'screenshot', 'LearningByDoing 工作台'],
  ['wechat-auto', 'public/project-images/wechatauto/1.png', 'design', 'WeChat Auto 项目说明图'],
]
const manifest=[]
for (const [name, source, type, caption] of sources) {
  if (!fs.existsSync(source)) continue
  const meta=await sharp(source).metadata()
  for (const width of [480, 960, 1600]) {
    await sharp(source).resize({width,withoutEnlargement:true}).webp({quality:86}).toFile(path.join(out, `${name}-${width}.webp`))
  }
  const original=`${name}-original${path.extname(source)}`
  if(path.resolve(source)!==path.resolve(out,original))fs.copyFileSync(source,path.join(out,original))
  manifest.push({id:name,url:`/garden/${name}-960.webp`,original:`/garden/${original}`,type,caption,width:meta.width,height:meta.height,source,projectId:name.startsWith('shizaolu')?'shizaolu':['avatar','mountains','still-life'].includes(name)?'':name})
}
const L=(zh,en=zh)=>({zh,en})
const extra=(slug,title,subtitle,summary)=>({slug,year:'2026',title:L(title),category:L('应用与自动化','Applications & automation'),subtitle:L(subtitle),summary:L(summary),role:L('产品设计与开发','Product design & development'),capabilities:[L('产品设计'),L('应用开发')],challenge:L('把日常使用中的重复操作收进清晰的流程。'),approach:L('围绕实际任务组织界面，并持续验证输入、处理和结果。'),outcome:L('项目资料与界面按实际进展持续整理。'),result:L('查看项目介绍与现有界面。'),nextStep:L('继续根据实际使用完善。'),accent:'',detailSections:[],gallery:[],externalLinks:[]})
const all=[...projects,extra('wechat-auto','WeChat Auto','微信群运营自动化','把重复的内容发送、任务调度与运行记录整理为自动化流程。'),extra('ai-closet','AI Closet · 衣橱','用已有衣物整理穿搭','围绕衣物录入、分类、搭配与个人档案设计的微信小程序。当前展示素材为项目设计稿。')]
const seed=all.map((p,index)=>({...p,id:p.slug,status:'published',order:index,projectStatus:'持续维护',homeFeatured:['shizaolu','voicedesk','ainews-platform','flow-socket'].includes(p.slug),commercialFeatured:['shizaolu','voicedesk','ainews-platform','wechat-auto'].includes(p.slug),coverImage:manifest.find(m=>m.id===p.slug)?.url,coverType:manifest.find(m=>m.id===p.slug)?.type||'concept'}))
fs.writeFileSync(path.join(root,'server/project-seed.json'),JSON.stringify(seed,null,2))
fs.writeFileSync(path.join(root,'src/data/project-snapshot.json'),JSON.stringify(seed,null,2))
fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2))
console.log(`Prepared ${seed.length} projects and ${manifest.length} asset families. Backup: ${backup}`)
