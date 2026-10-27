import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const index=process.argv.indexOf('--date');
const date=index>=0?process.argv[index+1]:new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const start='2026-10-27';
const ms=d=>Date.parse(d+'T00:00:00Z');
if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(ms(date))||new Date(ms(date)).toISOString().slice(0,10)!==date||date<start)throw Error('請使用有效日期，且不可早於 2026-10-27。');
const context={window:{}};
vm.runInNewContext(await fs.readFile(path.join(root,'lessons.js'),'utf8'),context,{timeout:3000});
const kk=JSON.parse(await fs.readFile(path.join(root,'sentence-kk.json'),'utf8'));
let data={version:2,curriculumStart:start,updatedAt:null,days:[]};
try{data=JSON.parse(await fs.readFile(path.join(root,'daily.json'),'utf8'));if(data.version!==2||!Array.isArray(data.days))throw Error('教材格式錯誤');}catch(e){if(e.code!=='ENOENT')throw e;}
const count=Math.floor((ms(date)-ms(start))/86400000)+1;
let added=[];
for(let id=1;id<=count;id++){
 const dayDate=new Date(ms(start)+(id-1)*86400000).toISOString().slice(0,10);
 if(data.days.some(d=>d.date===dayDate))continue;
 const lesson=context.window.LESSONS.find(l=>l.id===id);
 if(!lesson||!kk[id-1])throw Error(`尚缺 ${dayDate} 的第 ${id} 天教材與句子 KK。請先新增完整的五個學習重點和一句生活句子，不可重複舊日或假裝已發布。`);
 if(lesson.words.length!==5||!lesson.words.every(w=>['it','en','zh','kk','ipa'].every(k=>typeof w[k]==='string'&&w[k].length>0)))throw Error(`第 ${id} 天不是完整的五個三語重點。`);
 data.days.push({...JSON.parse(JSON.stringify(lesson)),date:dayDate,kk:kk[id-1]});added.push(dayDate);
}
if(added.length){data.days.sort((a,b)=>b.date.localeCompare(a.date));data.updatedAt=new Date().toISOString();const target=path.join(root,'daily.json');await fs.writeFile(target+'.tmp',JSON.stringify(data,null,2)+'\n');await fs.rename(target+'.tmp',target);}
console.log(JSON.stringify({changed:added.length>0,added,publishedDays:data.days.length,latest:data.days.map(d=>d.date).sort().at(-1)}));
