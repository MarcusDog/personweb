import fs from 'node:fs'
import path from 'node:path'
import Database from 'better-sqlite3'
const root=process.cwd(),uploads=path.resolve(root,'public/uploads'),db=new Database(path.join(root,'server/data/personweb.db'))
let removed=0
db.transaction(()=>{
 const contents=db.prepare('SELECT published,draft FROM garden_content').all()
 for(const row of db.prepare('SELECT id,data FROM garden_media').all()){
  const media=JSON.parse(row.data)
  if(media.type!=='upload'||!['avatar-480.webp','clipboard-paste.webp','clipboard-drop.webp'].includes(media.caption))continue
  if(contents.some(item=>`${item.published||''}${item.draft||''}`.includes(row.id)))continue
  const files=[media.url,media.original].filter(Boolean).map(url=>{
   if(!/^\/uploads\/[a-f0-9-]+(?:-original)?\.(?:webp|png|jpg|jpeg|gif)$/.test(url))throw Error('Unexpected QA upload path')
   const file=path.resolve(root,'public',url.slice(1));if(path.dirname(file)!==uploads)throw Error('QA target escaped uploads directory');return file
  })
  for(const file of files)if(fs.existsSync(file))fs.unlinkSync(file)
  db.prepare('DELETE FROM garden_media WHERE id=?').run(row.id);removed++
 }
})()
db.close()
console.log(`Removed ${removed} unreferenced QA uploads; project assets and referenced media were preserved.`)
