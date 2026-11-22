import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root = new URL('../', import.meta.url);
const read = name => fs.readFile(new URL(name, root), 'utf8');
const date = new Intl.DateTimeFormat('en-CA', {
  timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'
}).format(new Date());
const repository = process.env.GITHUB_REPOSITORY;
const token = process.env.GITHUB_TOKEN;
const dryRun = process.argv.includes('--check');
const queue = JSON.parse(await read('scripts/prepared-week.json'));
const manifest = JSON.parse(await read('audio/manifest.json'));
const norm = s => s.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/’/g,"'");
for(const day of queue.days) {
  if(day.words.length!==5 || ![day.it,day.en,day.zh,day.kk,
    ...day.words.flatMap(w=>[w.it,w.en,w.zh,w.kk,w.ipa])].every(Boolean)) {
    throw Error('Incomplete prepared lesson '+day.date);
  }
  for(const text of [day.it,...day.words.map(w=>w.it)]) {
    const entry=manifest.entries[norm(text)];
    if(entry?.provider!=='Lara Translate' || !/^audio\/it-[a-f0-9]{20}\.m4a$/.test(entry.it)) {
      throw Error('Missing Lara audio '+text);
    }
    const data=await fs.readFile(new URL(entry.it,root));
    if(createHash('sha256').update(data).digest('hex')!==entry.sha256) {
      throw Error('Audio hash mismatch '+entry.it);
    }
  }
}
if(dryRun) {
  console.log(JSON.stringify({validatedDays:queue.days.length,preparedThrough:queue.preparedThrough}));
  process.exit(0);
}
if(!repository||!token) throw Error('GitHub workflow context is required');
async function api(path,options={}) {
  const response=await fetch('https://api.github.com/repos/'+repository+path,{
    ...options,headers:{Accept:'application/vnd.github+json',
      Authorization:'Bearer '+token,'X-GitHub-Api-Version':'2022-11-28',
      ...options.headers},signal:AbortSignal.timeout(30000)
  });
  if(!response.ok) throw Error('GitHub API '+path+' returned '+response.status);
  return response.status===204 ? null : response.json();
}
if(date>queue.preparedThrough) throw Error('Prepared lessons exhausted. Refill the coming week.');
let expected;
for(let attempt=0;attempt<4;attempt++) {
  const remote=await api('/contents/language-study/daily.json?ref=main');
  const daily=JSON.parse(Buffer.from(remote.content,'base64').toString('utf8'));
  const have=new Set(daily.days.map(d=>d.date));
  const additions=queue.days.filter(d=>d.date<=date&&!have.has(d.date));
  if(additions.length) {
    daily.days.push(...additions);
    daily.days.sort((a,b)=>b.date.localeCompare(a.date));
    daily.updatedAt=new Date().toISOString();
    expected=JSON.stringify(daily,null,2)+'\n';
    try {
      await api('/contents/language-study/daily.json',{
        method:'PUT',body:JSON.stringify({
          branch:'main',sha:remote.sha,message:'Publish language lessons through '+date,
          content:Buffer.from(expected).toString('base64')
        })
      });
    } catch(error) {
      if(attempt===3) throw error;
      continue;
    }
  } else {
    expected=Buffer.from(remote.content,'base64').toString('utf8');
  }
  break;
}
if(!expected) throw Error('Could not prepare daily publication');
const todayLesson=JSON.parse(expected).days.find(d=>d.date===date);
if(!todayLesson) throw Error('Missing current date '+date);
await api('/pages/builds',{method:'POST'});
const base='https://sn436269.github.io/sona-medici-notes/language-study/';
for(let attempt=0;attempt<60;attempt++) {
  try {
    const response=await fetch(base+'daily.json?verify='+Date.now(),{signal:AbortSignal.timeout(10000)});
    if(!response.ok||await response.text()!==expected) throw Error('Deployment pending');
    for(const text of [todayLesson.it,...todayLesson.words.map(w=>w.it)]) {
      const entry=manifest.entries[norm(text)];
      const audio=await fetch(base+entry.it,{signal:AbortSignal.timeout(10000)});
      if(!audio.ok||createHash('sha256').update(Buffer.from(await audio.arrayBuffer())).digest('hex')!==entry.sha256) {
        throw Error('Live audio mismatch');
      }
    }
    console.log(JSON.stringify({publishedThrough:date,liveVerified:true,preparedThrough:queue.preparedThrough}));
    process.exit(0);
  } catch(error) {
    if(attempt===59) throw error;
    await new Promise(resolve=>setTimeout(resolve,10000));
  }
}
