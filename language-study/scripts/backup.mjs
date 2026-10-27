import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const date=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const time=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Taipei',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).format(new Date()).replace(/:/g,'');
const destination=path.join(root,'備份',date,time+'-'+Date.now().toString(36));
const files=['index.html','compact.html','compact.css','compact.js','lessons.js','daily.json','sentence-kk.json','README.md','MAINTENANCE.md','assets','audio','scripts'];
await fs.mkdir(destination,{recursive:true});
for(const name of files){try{await fs.cp(path.join(root,name),path.join(destination,name),{recursive:true,errorOnExist:true,force:false});}catch(e){if(e.code!=='ENOENT')throw e;}}
const hashes={};
async function walk(dir,relative=''){for(const d of await fs.readdir(dir,{withFileTypes:true})){const rel=path.join(relative,d.name),file=path.join(dir,d.name);if(d.isDirectory())await walk(file,rel);else hashes[rel]=createHash('sha256').update(await fs.readFile(file)).digest('hex');}}
await walk(destination);
const manifest={createdAt:new Date().toISOString(),timezone:'Asia/Taipei',root:destination,files:hashes};
await fs.writeFile(path.join(destination,'backup-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
await fs.writeFile(path.join(root,'備份','latest.json'),JSON.stringify({path:destination,createdAt:manifest.createdAt},null,2)+'\n');
console.log(JSON.stringify({backup:destination,files:Object.keys(hashes).length}));
