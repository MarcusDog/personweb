import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
const directory=fs.mkdtempSync(path.join(os.tmpdir(),'aya-clean-start-'));
const port='4192',origin=`http://127.0.0.1:${port}`,password=crypto.randomBytes(24).toString('base64url');
let child,logs='';
async function start(){
 child=spawn(process.execPath,['server/index.cjs'],{env:{...process.env,PERSONWEB_DATA_DIR:directory,PORT:port,ADMIN_USERNAME:'qa-clean-start',ADMIN_PASSWORD:password},stdio:['ignore','pipe','pipe'],windowsHide:true});
 child.stdout.on('data',data=>logs+=data);child.stderr.on('data',data=>logs+=data);
 for(let n=0;n<80;n++){if(child.exitCode!==null)throw Error('Clean startup failed: '+logs);try{const response=await fetch(origin+'/health');if(response.ok)return;}catch{/* Wait only for this owned test server. */}await new Promise(r=>setTimeout(r,100));}
 throw Error('Clean startup timed out');
}
async function stop(){if(child&&child.exitCode===null){const done=new Promise(r=>child.once('exit',r));child.kill();await done;}}
async function login(){const response=await fetch(origin+'/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'qa-clean-start',password})});assert.equal(response.status,200);return response.headers.get('set-cookie').split(';')[0];}
try{
 await start();let site=(await(await fetch(origin+'/api/site')).json()).data;
 assert.equal(site.posts.length,8);assert.equal(site.projects.length,16);assert.equal(site.books.length,6);
 assert(site.books.every(b=>b.coverMatch==='confirmed'&&b.readingStatus==='wish'));
 let cookie=await login();
 const response=await fetch(origin+'/api/admin/content/posts',{method:'POST',headers:{Cookie:cookie,'Content-Type':'application/json'},body:JSON.stringify({title:{zh:'重启验收',en:''},slug:'qa-restart',body:{zh:'初始草稿',en:''},action:'draft'})});
 assert(response.ok);const item=(await response.json()).data;
 await stop();await start();cookie=await login();
 const content=(await(await fetch(origin+'/api/admin/content/posts',{headers:{Cookie:cookie}})).json()).data;
 assert(content.some(x=>x.id===item.id&&x.body.zh==='初始草稿'));
 const revisions=(await(await fetch(origin+`/api/admin/content/posts/${item.id}/revisions`,{headers:{Cookie:cookie}})).json()).data;
 assert(revisions.length>=1);
 assert.equal((await fetch(origin+'/api/admin/export')).status,401);
 console.log('Clean-start check passed: seeded 8 articles / 16 projects / 6 covered books, authenticated admin, draft and history survived restart, anonymous export denied.');
}finally{
 await stop();
 const resolved=path.resolve(directory),temporary=path.resolve(os.tmpdir());
 if(path.dirname(resolved)!==temporary||!path.basename(resolved).startsWith('aya-clean-start-'))throw Error('Refusing cleanup outside owned temporary directory');
 fs.rmSync(resolved,{recursive:true,force:true});
}
