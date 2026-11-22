import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=new URL('../',import.meta.url);
const repository='sn436269/sona-medici-notes';
async function get(url) {
  const r=await fetch(url,{signal:AbortSignal.timeout(30000)});
  if(!r.ok) throw Error('Sync request failed '+r.status);
  return r;
}
const head=await (await get('https://api.github.com/repos/'+repository+'/branches/main')).json();
const base='https://raw.githubusercontent.com/'+repository+'/'+head.commit.sha+'/language-study/';
const paths=['daily.json','lessons.js','sentence-kk.json','scripts/prepared-week.json','audio/manifest.json'];
const incoming=new Map();
for(const path of paths) incoming.set(path,await (await get(base+path)).text());
const daily=JSON.parse(incoming.get('daily.json'));
const queue=JSON.parse(incoming.get('scripts/prepared-week.json'));
const manifest=JSON.parse(incoming.get('audio/manifest.json'));
if(daily.version!==2||!Array.isArray(daily.days)||queue.version!==1||manifest.provider!=='Lara Translate') {
  throw Error('Unexpected sync data');
}
for(const entry of Object.values(manifest.entries)) {
  if(!/^audio\/it-[a-f0-9]{20}\.m4a$/.test(entry.it)||!entry.sha256) throw Error('Unexpected audio path');
  let bytes;
  try { bytes=await fs.readFile(new URL(entry.it,root)); } catch {}
  if(bytes&&createHash('sha256').update(bytes).digest('hex')===entry.sha256) continue;
  const response=await get(base+entry.it);
  bytes=Buffer.from(await response.arrayBuffer());
  if(createHash('sha256').update(bytes).digest('hex')!==entry.sha256) throw Error('Audio hash mismatch');
  incoming.set(entry.it,bytes);
}
let changed=false;
for(const [path,bytes] of incoming) {
  const previous=await fs.readFile(new URL(path,root)).catch(()=>Buffer.alloc(0));
  if(!previous.equals(Buffer.from(bytes))) changed=true;
}
if(!changed) { console.log('Cloud source already backed up locally'); process.exit(0); }
const backup=()=>execFileSync(process.execPath,[fileURLToPath(new URL('scripts/backup.mjs',root))],{stdio:'inherit'});
backup();
for(const [path,bytes] of incoming) {
  const target=new URL(path,root);
  await fs.mkdir(new URL('./',target),{recursive:true});
  await fs.writeFile(new URL(path+'.sync-tmp',root),bytes);
  await fs.rename(new URL(path+'.sync-tmp',root),target);
}
backup();
console.log('Synced published lessons from '+head.commit.sha);
