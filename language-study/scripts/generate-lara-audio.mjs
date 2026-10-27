/* Cache Lara's own publicly available pronunciation output; never copy signed URLs to disk. */
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {fileURLToPath} from 'node:url';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const norm=s=>s.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/’/g,"'");
const api='https://webapi.laratranslate.com/users/wss';
const source='https://app.laratranslate.com/translate';
const out=path.join(root,'audio');
await fs.mkdir(out,{recursive:true});
let manifest={version:1,provider:'Lara Translate',status:'ready',entries:{}};
try{manifest=JSON.parse(await fs.readFile(path.join(out,'manifest.json'),'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
const context={window:{}};vm.runInNewContext(await fs.readFile(path.join(root,'lessons.js'),'utf8'),context,{timeout:3000});
const daily=JSON.parse(await fs.readFile(path.join(root,'daily.json'),'utf8'));
const texts=new Map();
const content=process.argv.includes('--published-only')?daily.days:context.window.LESSONS;
for(const d of content)for(const w of d.words)texts.set(norm(w.it),w.it);
for(const d of daily.days)texts.set(norm(d.it),d.it);
let signedUrl=null,urlAt=0,urlPromise=null;
async function serviceUrl(){
 if(signedUrl&&Date.now()-urlAt<10*60*1000)return signedUrl;
 if(!urlPromise)urlPromise=(async()=>{const r=await fetch(api,{headers:{'X-Lara-Client':'Webapp','Content-Type':'application/json'},signal:AbortSignal.timeout(20000)});if(!r.ok)throw Error('Lara 語音入口回應 '+r.status+'，停止而不繞過限制。');const d=await r.json();if(typeof d?.content?.url!=='string')throw Error('Lara 語音介面格式已變更');signedUrl=d.content.url;urlAt=Date.now();return signedUrl;})();
 try{return await urlPromise;}finally{urlPromise=null;}
}
async function pcm(text){
 const url=await serviceUrl();
 return new Promise((resolve,reject)=>{
  const ws=new WebSocket(url),chunks=[];ws.binaryType='arraybuffer';let done=false;
  const finish=(error,data)=>{if(done)return;done=true;clearTimeout(timer);ws.close();if(error)reject(error);else resolve(data);};
  const timer=setTimeout(()=>finish(Error('Lara 語音產生逾時')),30000);
  ws.onopen=()=>ws.send(JSON.stringify({type:'tts',text,language:'it-IT',action:'start'}));
  ws.onerror=()=>finish(Error('Lara 語音連線失敗'));
  ws.onmessage=e=>{if(typeof e.data!=='string'){chunks.push(Buffer.from(e.data));return;}let m;try{m=JSON.parse(e.data);}catch{return;}if(m.error){finish(Error('Lara 語音服務回報錯誤'));return;}if(m.type==='tts'&&m.status==='completed'){const b=Buffer.concat(chunks);if(b.length<3200||b.length%2)finish(Error('Lara 回傳音訊不完整'));else finish(null,b);}};
  ws.onclose=()=>{if(!done)finish(Error('Lara 語音連線提前結束'));};
 });
}
function wav(data){const h=Buffer.alloc(44);h.write('RIFF',0);h.writeUInt32LE(36+data.length,4);h.write('WAVEfmt ',8);h.writeUInt32LE(16,16);h.writeUInt16LE(1,20);h.writeUInt16LE(1,22);h.writeUInt32LE(16000,24);h.writeUInt32LE(32000,28);h.writeUInt16LE(2,32);h.writeUInt16LE(16,34);h.write('data',36);h.writeUInt32LE(data.length,40);return Buffer.concat([h,data]);}
const pending=[];
for(const [key,text]of texts){const old=manifest.entries[key];if(old?.provider==='Lara Translate'&&old.it){try{await fs.access(path.join(root,old.it));continue;}catch{}}pending.push([key,text]);}
let index=0,completed=0;
const temp=await fs.mkdtemp(path.join(os.tmpdir(),'sona-lara-'));
try{
 const outcomes=await Promise.allSettled(Array.from({length:Math.min(3,pending.length)},async()=>{
  while(index<pending.length){const [key,text]=pending[index++],hash=createHash('sha256').update('it-IT:'+key).digest('hex').slice(0,20),raw=await pcm(text),input=path.join(temp,hash+'.wav'),file='it-'+hash+'.m4a';await fs.writeFile(input,wav(raw));await promisify(execFile)('/usr/bin/afconvert',[input,path.join(out,file),'-f','m4af','-d','aac','-b','48000']);await fs.unlink(input);manifest.entries[key]={provider:'Lara Translate',it:'audio/'+file,text,language:'it-IT',source,generatedAt:new Date().toISOString(),seconds:raw.length/32000,sha256:createHash('sha256').update(await fs.readFile(path.join(out,file))).digest('hex')};completed++;if(completed%10===0)console.log(JSON.stringify({generated:completed,total:pending.length}));}
 }));
 const failed=outcomes.find(result=>result.status==='rejected');
 if(failed)throw failed.reason;
}finally{
 manifest.status=pending.length===completed?'ready':'partial';manifest.updatedAt=new Date().toISOString();await fs.writeFile(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');await fs.rm(temp,{recursive:true,force:true});
}
console.log(JSON.stringify({provider:'Lara Translate',generated:completed,available:Object.keys(manifest.entries).length,status:manifest.status}));
