'use strict';
(() => {
const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];
const esc = v => String(v ?? '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize = s => s.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/’/g,"'").trim();
const paths = {
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18m-14 4h2m3 0h2m3 0h1m-11 3h2m3 0h2"/>',
  book:'<path d="M12 5C9 3 5 3 2 4v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-4-1-7-1-10 1v15"/>',
  feather:'<path d="M20 3c-7-2-14 4-14 10v4h4c7 0 12-8 10-14ZM3 21 16 8M6 13h5m1-6v5"/>',
  heart:'<path class="heart" d="M20.5 5.5a5 5 0 0 0-7 0L12 7l-1.5-1.5a5 5 0 0 0-7 7L12 21l8.5-8.5a5 5 0 0 0 0-7Z"/>',
  chart:'<path d="M4 3v18h17M8 16v-4m5 4V7m5 9V4"/>',
  settings:'<path d="m9 3-1 3-3 1v3l-2 2 2 2v3l3 1 1 3h6l1-3 3-1v-3l2-2-2-2V7l-3-1-1-3Z"/><circle cx="12" cy="12" r="3"/>',
  menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
  help:'<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 4m0 3h.01"/>',
  close:'<path d="m6 6 12 12M6 18 18 6"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  sound:'<path d="m11 4-6 5H2v6h3l6 5V4Zm4 4a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
  search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  left:'<path d="m14 5-7 7 7 7"/>',right:'<path d="m10 5 7 7-7 7"/>',
  check:'<path d="m5 12 4 4L19 6"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
  arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',trash:'<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>'
};
const icon = n => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${paths[n]||paths.book}</svg>`;
function hydrate(el=document){$$('[data-icon]',el).forEach(e=>{e.outerHTML=icon(e.dataset.icon);});}
hydrate();
const lessons=window.LESSONS;
const TIMES=['08:00','11:00','14:00','17:00','20:00'];
const KEY='sona-language-journal-v1';
function taipeiDate(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
function dateMs(d){return Date.parse(d+'T00:00:00Z');}
function datePlus(d,n){return new Date(dateMs(d)+n*86400000).toISOString().slice(0,10);}
function validDate(d){return typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&Number.isFinite(dateMs(d))&&datePlus(d,0)===d;}
const fresh=()=>({version:1,startDate:taipeiDate(),done:{},savedWords:[],knownWords:[],savedLessons:[],custom:[],notes:{},activity:[],rate:.85});
function validateState(v){
  if(!v||v.version!==1||!validDate(v.startDate))throw Error('備份格式不符');
  const n=fresh();n.startDate=v.startDate;
  for(const k of ['savedWords','knownWords']){if(!Array.isArray(v[k]))throw Error('缺少單字紀錄');n[k]=[...new Set(v[k].filter(x=>typeof x==='string'&&x.length<180))].slice(0,10000);}
  if(!Array.isArray(v.savedLessons)||!Array.isArray(v.custom)||!v.done||typeof v.done!=='object'||!v.notes||typeof v.notes!=='object')throw Error('備份資料不完整');
  n.savedLessons=[...new Set(v.savedLessons.filter(x=>Number.isInteger(x)&&x>=1&&x<=30))];
  const ids=new Set();
  n.custom=v.custom.filter(w=>w&&typeof w.id==='string'&&/^custom-[a-zA-Z0-9-]+$/.test(w.id)&&typeof w.it==='string'&&w.it.trim()&&typeof w.en==='string'&&w.en.trim()&&typeof w.zh==='string'&&w.zh.trim()).slice(0,2000).map(w=>{
    if(ids.has(w.id))throw Error('自訂單字 ID 重複');ids.add(w.id);
    return {id:w.id,it:w.it.slice(0,100),en:w.en.slice(0,150),zh:w.zh.slice(0,150),ipa:String(w.ipa||'').slice(0,150),kk:String(w.kk||'').slice(0,150),pos:'自訂單字',note:String(w.note||'').slice(0,1000),hint:'',custom:true,contexts:[]};
  });
  for(let d=1;d<=30;d++){
    if(Array.isArray(v.done[d]))n.done[d]=[...new Set(v.done[d].filter(i=>Number.isInteger(i)&&i>=0&&i<5))];
    if(typeof v.notes[d]==='string')n.notes[d]=v.notes[d].slice(0,5000);
  }
  n.activity=Array.isArray(v.activity)?[...new Set(v.activity.filter(validDate))].sort():[];
  n.rate=[.65,.85,1].includes(v.rate)?v.rate:.85;
  return n;
}
let state=fresh(), storageAvailable=true, corrupt=false;
try{const saved=localStorage.getItem(KEY);if(saved)state=validateState(JSON.parse(saved));}catch(e){storageAvailable=false;corrupt=true;}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));storageAvailable=true;}catch(e){storageAvailable=false;toast('瀏覽器無法儲存，請下載備份保留紀錄。');}}
function activeDay(){return Math.max(1,Math.min(30,Math.floor((dateMs(taipeiDate())-dateMs(state.startDate))/86400000)+1));}
function currentSlot(){const h=Number(new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Taipei',hour:'2-digit',hourCycle:'h23'}).format(new Date()));return Math.max(0,Math.min(4,Math.floor((h-8)/3)));}
let selectedDay=activeDay(),step=0,view='today',search='',topic='all',wordFilter='all',wordLimit=24;
let noteTimer,toastTimer, importCandidate=null;
const baseWords=[];const wordMap=new Map();
lessons.forEach(l=>l.words.forEach(w=>{
  const key=normalize(w.it);let entry=wordMap.get(key);
  if(!entry){entry={...w,id:'word-'+baseWords.length,contexts:[],custom:false};wordMap.set(key,entry);baseWords.push(entry);}
  entry.contexts.push({day:l.id,word:w});w.id=entry.id;
}));
const allWords=()=>[...baseWords,...state.custom];
const findWord=id=>allWords().find(w=>w.id===id);
const done=d=>state.done[d]||[];
const isSaved=id=>state.savedWords.includes(id);
const isKnown=id=>state.knownWords.includes(id);
function toast(msg){clearTimeout(toastTimer);$('#toast').textContent=msg;$('#toast').classList.add('visible');toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),3200);}
function activity(){const date=taipeiDate();if(!state.activity.includes(date))state.activity.push(date);}
function toggleIn(arr,id){const i=arr.indexOf(id);if(i<0)arr.push(id);else arr.splice(i,1);return i<0;}
function heartButton(id,kind='word'){const on=kind==='word'?isSaved(id):state.savedLessons.includes(Number(id));return `<button class="icon-button ${on?'on':''}" data-action="save-${kind}" data-id="${esc(id)}" aria-label="${on?'取消收藏':'收藏'}${kind==='word'?'單字':'句子'}" aria-pressed="${on}">${icon('heart')}</button>`;}
function speakButton(text,lang='it-IT',label='義大利文',small=false){return `<button class="button ${small?'outline small':'primary'}" data-action="speak" data-text="${esc(text)}" data-lang="${lang}">${icon('sound')}${label}</button>`;}
const heading=(label,title,desc,action='')=>`<div class="page-heading"><div><p class="eyebrow">${label}</p><h1>${title}</h1><p>${desc}</p></div>${action}</div>`;
const heroArt=`<svg class="hero-art" viewBox="0 0 340 340" aria-hidden="true"><defs><pattern id="stones" width="60" height="35" patternUnits="userSpaceOnUse"><path d="M0 0h60v35H0z" fill="#e2d1c5"/><path d="M0 0h60M0 35h60M30 0v35" stroke="#b59f8a" stroke-width=".5"/></pattern></defs><circle cx="190" cy="170" r="157" fill="#ded1c3"/><path d="M92 335V156a98 98 0 0 1 196 0v179" fill="url(#stones)" stroke="#b99e87" stroke-width="1.5"/><path d="M109 335V158a81 81 0 0 1 162 0v177" fill="#eee4d5" stroke="#af947f"/><path d="M124 335V160a66 66 0 0 1 132 0v175" fill="#bdc3af" stroke="#ae9783"/><path d="M130 335V160a60 60 0 0 1 120 0v175" fill="#d9d8c2"/><path d="M138 246c23-33 45-40 65-21s37-2 47-12v122H130v-70Z" fill="#a8b1a0"/><path d="M130 281c28-25 45-10 69-28s35 5 51-1v83H130Z" fill="#8d9d8a"/><path d="M169 335 192 260h12l20 75" fill="#c7b69c"/><path d="M119 164h140M190 99v236M130 225h120" fill="none" stroke="#a5917c" stroke-width="4"/><path d="M86 335h208M82 327h216M86 173h22m164 0h21M84 164h26m161 0h24" stroke="#b1957e" stroke-width="4"/><path d="M94 151 76 144m26-16-16-12m31-5-11-19m30 8-6-22m30 14-2-21m31 17 1-22m27 29 8-22m17 35 13-20m10 39 18-16m-3 39 19-8" stroke="#af947f"/><path d="M280 329c-5-31-2-70 22-101m-15 68c-14-7-21-15-22-28m29 10c12-2 20-11 24-21m-21 10c-9-8-10-17-8-28m-8 75c11 0 22-5 27-14" fill="none" stroke="#768a70" stroke-width="2"/><path d="M278 330h18l5 10h-28z" fill="#ad8270"/></svg>`;
function renderToday(){
 const l=lessons[selectedDay-1],w=l.words[step],completed=done(l.id),pct=completed.length;
 const dayOptions=lessons.map(x=>`<option value="${x.id}" ${x.id===l.id?'selected':''}>DAY ${String(x.id).padStart(2,'0')} · ${esc(x.title)}</option>`).join('');
 $('#main').innerHTML=heading('IL MIO PICCOLO ITALIANO','今天，慢慢學一句。','不用急，每三小時，留一點時間給義大利文。','<span class="lang-mark">IT / EN / 中</span>')+
 `<section class="hero"><div class="hero-copy"><p class="eyebrow">PIANO PIANO, OGNI GIORNO.</p><h2>把義大利文，<br><em>慢慢說成日常。</em></h2><p>一天只學一句，聽懂每個字，也讀懂它的溫柔。</p><div class="hero-line"><span>每天一句</span><span>五次小小練習</span><span>三種語言一起讀</span></div></div>${heroArt}</section>
 <div class="section-heading"><h2>每日一句 <small>UNA FRASE AL GIORNO</small></h2><div class="day-select-row"><button class="icon-button" data-action="prev-day" aria-label="前一天" ${l.id===1?'disabled':''}>${icon('left')}</button><select id="day-select" aria-label="選擇學習日">${dayOptions}</select><button class="icon-button" data-action="next-day" aria-label="後一天" ${l.id===30?'disabled':''}>${icon('right')}</button></div></div>
 <div class="study-grid"><article class="card sentence-card"><div class="sentence-top"><span class="tag rose">DAY ${String(l.id).padStart(2,'0')} / ${esc(l.topic)}</span>${heartButton(l.id,'lesson')}</div><h2 class="sentence" lang="it">${esc(l.it)}</h2><p class="pronunciation">${esc(l.pronunciation)}</p><p class="translation" lang="en"><span class="label">EN</span>${esc(l.en)}</p><p class="translation" lang="zh-Hant"><span class="label">中</span>${esc(l.zh)}</p><div class="sentence-actions">${speakButton(l.it,'it-IT','聽完整句子')}${speakButton(l.en,'en-US','聽英文',true)}${speakButton(l.zh,'zh-TW','聽中文',true)}</div><div class="speech-options"><label for="speech-rate" style="margin:0">義大利文語速</label><select id="speech-rate"><option value="0.65" ${state.rate===.65?'selected':''}>慢慢說 · 0.65×</option><option value="0.85" ${state.rate===.85?'selected':''}>稍慢 · 0.85×</option><option value="1" ${state.rate===1?'selected':''}>自然 · 1×</option></select></div><p class="sentence-note">今天只有這一句。先聽整句，再用右側五個時段慢慢拆解。</p></article>
 <section class="card schedule"><div class="schedule-title"><h3>今日的五個小步驟</h3><span>${pct} / 5</span></div><p class="schedule-caption">台北時間 · 每三小時，專心一個重點</p><div class="slots">${l.words.map((x,i)=>`<button class="slot ${i===step?'active':''} ${completed.includes(i)?'complete':''}" data-action="step" data-index="${i}" aria-pressed="${i===step}"><span class="slot-number">${completed.includes(i)?'✓':String(i+1).padStart(2,'0')}</span><span><span class="slot-time">${TIMES[i]}${i===4?' · 總複習':''}</span><span class="slot-word" lang="it">${esc(x.it)}</span></span>${selectedDay===activeDay()&&i===currentSlot()?'<span class="slot-current">本時段</span>':''}</button>`).join('')}</div></section></div>
 <section class="card step-card" id="step-card"><div class="step-top"><div><p class="step-kicker">${TIMES[step]} / 第 ${step+1} 個學習重點</p><h2 class="step-word" lang="it">${esc(w.it)}</h2><p class="step-meaning"><span lang="en">${esc(w.en)}</span> &nbsp;·&nbsp; ${esc(w.zh)}</p></div><div class="step-nav">${heartButton(w.id)}<button class="icon-button" data-action="word" data-id="${esc(w.id)}" aria-label="開啟單字手札">${icon('book')}</button></div></div><div class="step-grid"><div><div class="sound-table">${soundRows(w)}</div><div class="button-row" style="margin-top:17px">${speakButton(w.it,'it-IT','聽單字',true)}${speakButton(w.en,'en-US','聽英文',true)}</div></div><div class="grammar-note"><h4>一點點文法 / GRAMMATICA</h4><p>${esc(w.note)}</p><span class="tag">${esc(w.pos)}</span></div></div><div class="step-bottom"><span>${completed.includes(step)?'這個小步驟已完成，可以再聽一次。':'聽一聽、讀一讀，理解後再記下這一步。'}</span><div class="button-row"><button class="button ${completed.includes(step)?'outline':'primary'}" data-action="complete-step">${icon('check')}${completed.includes(step)?'已完成 · 取消標記':'我學會這一步了'}</button><button class="button outline" data-action="next-step">${step===4?'回到第一步':'下一個重點'}${icon('right')}</button></div></div></section>
 ${step===4?`<section class="review-card"><p class="eyebrow">20:00 / RIPASSO DELLA GIORNATA</p><h3>今晚，把同一句話連起來。</h3><p class="small muted">回顧今天的五個重點，再聽一次完整句子，試著跟著聲音慢慢說。</p><div class="review-flow">${l.words.map((x,i)=>`<button data-action="step" data-index="${i}" lang="it">${esc(x.it)}</button>`).join('')}</div><div class="button-row" style="margin-top:17px">${speakButton(l.it,'it-IT','再聽一次完整句子',true)}</div></section>`:''}
 <details class="note-panel"><summary>給今天留一點筆記 <span lang="it">/ I miei appunti</span></summary><label for="lesson-note" class="small muted">今天想記住的發音、用法，或小小的發現。</label><textarea id="lesson-note" rows="4" maxlength="5000" placeholder="只留下屬於你的學習痕跡……">${esc(state.notes[l.id]||'')}</textarea><p class="small muted" id="note-status">筆記會自動保存在目前瀏覽器。</p></details><p class="source-label">${l.id===1?'第 1 天依原始學習對話整理。':'第 '+l.id+' 天為網站預先編排的延伸教材。'}</p>`;
}
function soundRows(w){return `<div class="sound-row"><span>義大利文 IPA</span><strong>${esc(w.ipa||'尚未填寫')}</strong></div><div class="sound-row"><span>英文 KK / 美式</span><strong>${esc(w.kk||'尚未填寫')}</strong></div>${w.hint?`<div class="sound-row"><span>發音輔助</span><strong>${esc(w.hint)}</strong></div>`:''}<div class="sound-row"><span>詞性 / 用法</span><strong>${esc(w.pos)}</strong></div>`;}
function lessonDate(id){const d=datePlus(state.startDate,id-1);return `${Number(d.slice(5,7))}/${Number(d.slice(8))}`;}
function renderCalendar(){
 $('#main').innerHTML=heading('TRENTA PICCOLI PASSI','30 天，一句一句走。','先走進生活，再慢慢走向義大利的城市與藝術。')+
 `<div class="plan-intro"><p>每天 <strong>08:00 · 11:00 · 14:00 · 17:00 · 20:00</strong><br>同一句話分五次拆解。點選任一天即可閱讀；完成紀錄由你親手標記。</p><button class="button outline small" data-action="settings">調整開始日期</button></div><div class="toolbar"><label class="search" style="margin:0">${icon('search')}<input id="lesson-search" type="search" aria-label="搜尋每日句子" placeholder="搜尋情境、義大利文、英文或中文"></label></div><div class="month-grid" id="calendar-results">${calendarCards('')}</div><p class="source-label">第 1 天依原對話整理；第 2–30 天為網站預先編排的延伸教材。</p>`;
}
function calendarCards(q){const ls=lessons.filter(l=>normalize([l.title,l.it,l.en,l.zh,l.topic].join(' ')).includes(normalize(q)));return ls.length?ls.map(l=>`<button class="day-card ${l.id===activeDay()?'selected':''}" data-action="open-day" data-day="${l.id}"><span class="day-number">DAY ${String(l.id).padStart(2,'0')}</span><span class="day-date">${lessonDate(l.id)}</span><h3>${esc(l.title)}</h3><p lang="it">${esc(l.it)}</p><small>${esc(l.topic)}</small><span class="completion">${done(l.id).length===5?'✓ 已完成這一天':done(l.id).length?`${done(l.id).length} / 5 步已完成`:'留一點時間，慢慢開始。'}</span></button>`).join(''):'<div class="empty"><p>還沒有找到符合的句子，試試其他關鍵字。</p></div>';}
function wordCard(w){return `<article class="word-card ${isKnown(w.id)?'learned':''}"><div class="word-card-top"><span class="tag">${w.custom?'我的單字':esc(lessons[w.contexts[0].day-1].topic)}</span>${heartButton(w.id)}</div><button class="word-title" data-action="word" data-id="${esc(w.id)}" lang="it">${esc(w.it)}</button><p class="word-en" lang="en">${esc(w.en)}</p><p class="word-zh">${esc(w.zh)}</p><p class="word-phonetic">IT ${esc(w.ipa||'—')}</p><p class="word-phonetic">EN ${esc(w.kk||'—')}</p><div class="word-card-bottom"><div><button class="icon-button" data-action="speak" data-text="${esc(w.it)}" data-lang="it-IT" aria-label="聆聽 ${esc(w.it)}">${icon('sound')}</button><button class="icon-button" data-action="speak" data-text="${esc(w.en)}" data-lang="en-US" aria-label="聆聽英文 ${esc(w.en)}"><span style="font-size:8px">EN</span></button></div><button class="text-button ${isKnown(w.id)?'learned-label':''}" data-action="known" data-id="${esc(w.id)}" aria-pressed="${isKnown(w.id)}">${isKnown(w.id)?'✓ 已熟悉':'標記熟悉'}</button></div></article>`;}
function filteredWords(){return allWords().filter(w=>{
 const q=normalize(search);if(!normalize([w.it,w.en,w.zh,w.note,...(w.contexts||[]).flatMap(c=>[c.word.en,c.word.zh])].join(' ')).includes(q))return false;
 if(topic==='我的單字'&&!w.custom)return false;
 if(topic!=='all'&&topic!=='我的單字'&&(w.custom||!w.contexts.some(c=>lessons[c.day-1].topic===topic)))return false;
 if(wordFilter==='saved'&&!isSaved(w.id))return false;
 if(wordFilter==='known'&&!isKnown(w.id))return false;
 if(wordFilter==='new'&&isKnown(w.id))return false;
 if(wordFilter==='today'&&!lessons[selectedDay-1].words.some(x=>x.id===w.id))return false;
 return true;
});}
function renderWords(){
 const topics=[...new Set(lessons.map(l=>l.topic)),'我的單字'];
 $('#main').innerHTML=heading('IL MIO VOCABOLARIO','把單字，收進自己的口袋。','義大利文、英文、繁體中文，放在一起慢慢記。',`<button class="button primary" data-action="add-word">${icon('plus')}新增單字</button>`)+
 `<div class="toolbar"><label class="search" style="margin:0">${icon('search')}<input id="word-search" type="search" aria-label="搜尋三語單字" placeholder="搜尋義大利文 / English / 中文" value="${esc(search)}"></label><select id="topic-filter" aria-label="依情境篩選"><option value="all">所有情境</option>${topics.map(t=>`<option ${topic===t?'selected':''}>${esc(t)}</option>`).join('')}</select><button class="button outline" data-action="export-csv">匯出單字 ↓</button></div><div class="filter-pills">${[['all','全部單字'],['today','這一天的 5 個重點'],['saved','我的收藏'],['new','慢慢熟悉中'],['known','已經熟悉']].map(([id,label])=>`<button class="filter-pill ${wordFilter===id?'active':''}" data-action="word-filter" data-filter="${id}">${label}</button>`).join('')}</div><div id="word-results"></div>`;
 renderWordResults();
}
function renderWordResults(){const words=filteredWords();$('#word-results').innerHTML=`<div class="results-line"><span>找到 ${words.length} 個單字與詞組</span><span>全庫 ${allWords().length} 個 · 點單字看完整手札</span></div>${words.length?`<div class="vocabulary-grid">${words.slice(0,wordLimit).map(wordCard).join('')}</div>${words.length>wordLimit?'<div class="load-more"><button class="button outline" data-action="more-words">再看一些單字 ↓</button></div>':''}`:'<div class="empty"><h3>在這裡，留一個新的開始。</h3><p>試試其他關鍵字，或加入你自己的三語單字。</p><button class="button outline" data-action="add-word">新增我的單字</button></div>'}`;}
const grammarGroups=[
 ['禮貌地表達想要','Vorrei','Vorrei 是 volere 的第一人稱單數條件式，比直接陳述想要更委婉。後面可以接名詞，也可以接動詞不定式。',[1,7,23,30]],
 ['部分冠詞與省音',"dell’acqua",'第 1 天的 dell’ 用來表示不特定的量，相當於英文 some。陰性名詞 acqua 以母音開頭，della 省音成 dell’，兩者要連寫。這不是所有 di ＋名詞用法的通則。',[1]],
 ['名詞性別與冠詞','un / una · il / la','義大利文名詞有文法性別。冠詞要跟名詞的性別與單複數配合：un、il 用在這些課程中的陽性單數名詞，una、la 用在陰性單數名詞。不能只憑字尾判斷所有名詞。',[2,3,10,11]],
 ['動詞後接不定式','Posso / Puoi','Posso 是「我可以」，Puoi 是非正式的「你可以」。後面的動作保留不定式，例如今天句子裡的 avere、pagare、parlare。Puoi 適用 tu 稱呼，正式稱呼使用 Può。',[5,10,14,27]],
 ['形容詞跟名詞配合','buono / italiana','形容詞一般要配合它修飾的名詞。pane 是陽性單數，搭配 buono；pasta、parola、storia 是陰性單數，搭配 italiana。molto 修飾形容詞時是副詞，這些句子裡不改變。',[4,6,9,16,24]],
 ['不要逐字翻的固定搭配','mi piace / bisogno di','mi piace 自然翻成「我喜歡」，但文法上是某物令人喜歡。Ho bisogno di 整組表示「我需要」；per favore 整組表示「請」。先理解整個意思，再觀察組成。',[1,6,12,25]],
 ['否定與位置問句','Non / Dove','non 放在動詞前表示否定。dove 用來問位置；si trova 是 trovarsi 的一個形式，在第 15 天整組表示「位於」，不需要單獨翻出 si。',[13,15]],
 ['時間、地點與交通','oggi / domani','oggi 是今天，domani 是明天。描述行程時常用現在式搭配時間副詞。前往城市常用 a；交通方式 in treno 作為整組使用，省略冠詞。',[8,18,20,29]],
 ['所有格要配合物品','la mia camera','一般名詞前的所有格常搭配定冠詞。mia 的陰性單數取決於 camera，而不是說話者的性別。形容詞 tranquilla 也配合 camera。',[21]],
 ['留意聽起來不同的字母','ch / gn / gli','ch 在 e、i 前保持 k 音；gn 是 ɲ 音；gli 在 biglietto 中是顎側音 ʎ。雙寫子音通常要稍作停留。發音提示只作輔助，請多聽義大利文語音。',[11,12,15,17,26]]
];
function renderGrammar(){
 $('#main').innerHTML=heading('PICCOLE NOTE DI GRAMMATICA','文法，從讀懂一句開始。','把課程裡遇見的用法，留成隨時能回看的小手札。')+`<div class="grammar-list">${grammarGroups.map(([title,term,note,ids])=>`<details class="grammar-entry"><summary><b>${esc(term)}</b><small>${esc(title)}</small></summary><div class="grammar-body"><p>${esc(note)}</p><div class="grammar-examples">${ids.map(id=>`<button data-action="open-day" data-day="${id}" lang="it">${esc(lessons[id-1].it)}<small>DAY ${id} · ${esc(lessons[id-1].zh)} ↗</small></button>`).join('')}</div></div></details>`).join('')}</div>`;
}
function renderFavorites(){
 const words=allWords().filter(w=>isSaved(w.id)),ls=lessons.filter(l=>state.savedLessons.includes(l.id));
 $('#main').innerHTML=heading('LE PAROLE CHE RESTANO','留住，想再讀一次的字句。','收藏一個單字，也收藏它慢慢變熟悉的過程。')+`<h2 class="favorites-heading">收藏的句子 <small class="muted">${ls.length}</small></h2>${ls.length?`<div class="favorite-sentences">${ls.map(l=>`<article class="card saved-sentence"><div><span class="eyebrow">DAY ${l.id} / ${esc(l.topic)}</span><p lang="it">${esc(l.it)}</p><small>${esc(l.zh)}</small></div><button class="button outline small" data-action="open-day" data-day="${l.id}">回看課程 ${icon('right')}</button>${heartButton(l.id,'lesson')}</article>`).join('')}</div>`:'<div class="empty"><p>在每日一句點愛心，喜歡的句子就會留在這裡。</p></div>'}<h2 class="favorites-heading">收藏的單字 <small class="muted">${words.length}</small></h2>${words.length?`<div class="vocabulary-grid">${words.map(wordCard).join('')}</div>`:'<div class="empty"><p>在單字旁點愛心，建立自己的三語收藏。</p><button class="button outline" data-action="go-words">去看看單字庫</button></div>'}`;
}
function streak(){let d=taipeiDate(),n=0;if(!state.activity.includes(d))d=datePlus(d,-1);while(state.activity.includes(d)){n++;d=datePlus(d,-1);}return n;}
function renderProgress(){
 const steps=Object.values(state.done).reduce((n,a)=>n+a.length,0),days=lessons.filter(l=>done(l.id).length===5).length,pct=Math.round(steps/150*100);
 $('#main').innerHTML=heading('IL MIO PERCORSO','每一步，都算數。','留下理解過的句子、熟悉的單字，與自己的學習節奏。',`<button class="button outline" data-action="export-backup">下載學習備份 ↓</button>`)+
 `<div class="stats-grid"><div class="stat"><b>${days}<small> / 30</small></b><span>完整學過的句子</span></div><div class="stat"><b>${steps}<small> / 150</small></b><span>完成的小步驟</span></div><div class="stat"><b>${state.knownWords.filter(id=>findWord(id)).length}</b><span>已標記熟悉的單字</span></div><div class="stat"><b>${streak()}<small> 天</small></b><span>連續留下學習紀錄</span></div></div><section class="card progress-overview"><div class="section-heading"><h2>第一個月，走到這裡。</h2><span class="tag rose">${pct}%</span></div><div class="progress-track" role="progressbar" aria-label="30 天課程完成度" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><span style="width:${pct}%"></span></div><p>開始日期：${esc(state.startDate)} · 紀錄 ${state.activity.length} 個學習日。點日期方格可以回到課程。</p><div class="progress-days">${lessons.map(l=>`<button class="progress-day ${done(l.id).length===5?'complete':done(l.id).length?'partial':''}" data-action="open-day" data-day="${l.id}" aria-label="第 ${l.id} 天，完成 ${done(l.id).length} 個步驟">${String(l.id).padStart(2,'0')}<small>${done(l.id).length}/5</small></button>`).join('')}</div></section><div class="plan-intro"><p>你的學習紀錄留在目前瀏覽器。<br>定期下載備份，就能把進度、收藏、筆記與自訂單字一起帶走。</p><button class="button outline small" data-action="settings">備份與設定</button></div>`;
}
const labels={today:'今日一句',calendar:'30 天學習計畫',vocabulary:'三語單字庫',grammar:'文法手札',favorites:'我的收藏',progress:'學習足跡'};
function render(){
 clearTimeout(noteTimer);closeNav();
 $$('.sidebar nav a').forEach(a=>{a.classList.toggle('active',a.dataset.view===view);if(a.dataset.view===view)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 $('#page-label').textContent=labels[view];$('#word-count').textContent=allWords().length;
 ({today:renderToday,calendar:renderCalendar,vocabulary:renderWords,grammar:renderGrammar,favorites:renderFavorites,progress:renderProgress}[view]||renderToday)();
}
function route(){view=location.hash.slice(1).split('?')[0];if(!labels[view])view='today';render();}
function go(v){if(location.hash==='#'+v){view=v;render();}else location.hash=v;}
function openDay(d){if(!Number.isInteger(d)||d<1||d>30)return;selectedDay=d;step=lessons[d-1].words.findIndex((w,i)=>!done(d).includes(i));if(step<0)step=4;go('today');window.scrollTo({top:0,behavior:'smooth'});}
function closeNav(){$('#sidebar').classList.remove('open');$('#nav-shade').classList.remove('open');$('#menu-button').setAttribute('aria-expanded','false');}
function updateDate(){
 const date=new Intl.DateTimeFormat('zh-TW',{timeZone:'Asia/Taipei',month:'long',day:'numeric',weekday:'short'}).format(new Date());$('#today-date').textContent=date;
 if(view==='today'){$$('.slot-current').forEach(e=>e.remove());if(selectedDay===activeDay()){const slot=$$('.slot')[currentSlot()];if(slot){const marker=document.createElement('span');marker.className='slot-current';marker.textContent='本時段';slot.append(marker);}}}
}
function openDialog(id){$('#'+id).showModal();}
function openSettings(){$('#start-date').value=state.startDate;$('#import-review').hidden=true;openDialog('settings-dialog');}
function wordDetail(id){
 const w=findWord(id);if(!w)return;
 $('#word-detail').innerHTML=`<div class="step-top"><div><p class="eyebrow">${w.custom?'MY OWN WORD':'PAROLA / 單字與詞組'}</p><h2 class="step-word" id="word-dialog-title" lang="it">${esc(w.it)}</h2><p class="step-meaning"><span lang="en">${esc(w.en)}</span> · ${esc(w.zh)}</p></div>${heartButton(id)}</div><div class="sound-table">${soundRows(w)}</div><div class="button-row">${speakButton(w.it,'it-IT','聽義大利文')}${speakButton(w.en,'en-US','聽英文',true)}${speakButton(w.zh,'zh-TW','聽中文',true)}</div><div class="grammar-note" style="margin-top:22px"><h4>用法筆記 / UNA PICCOLA NOTA</h4><p>${esc(w.note||'在生活裡遇見的新單字。')}</p></div><div class="button-row"><button class="button outline" data-action="known" data-id="${esc(id)}">${isKnown(id)?'✓ 已熟悉 · 取消標記':'標記為已熟悉'}</button>${w.custom?`<button class="button outline" data-action="delete-word" data-id="${esc(id)}">${icon('trash')}刪除自訂單字</button>`:''}</div>${w.contexts.length?`<div class="word-context"><h3>回到它所在的句子</h3><p class="word-detail-note">同一個字在不同情境裡，中文與英文對譯可能不同。</p>${w.contexts.map(c=>`<button class="context-link" data-action="context-day" data-day="${c.day}"><span lang="it">${esc(lessons[c.day-1].it)}</span><small>DAY ${c.day} · ${esc(c.word.en)} / ${esc(c.word.zh)}</small></button>`).join('')}</div>`:''}`;
 if(!$('#word-dialog').open)openDialog('word-dialog');
}
let utterance;
function speak(text,lang){
 if(!('speechSynthesis' in window)){toast('此瀏覽器不支援語音，請使用 Chrome、Safari 或 Edge。');return;}
 const synth=window.speechSynthesis;const voices=synth.getVoices();const prefix=lang.split('-')[0];const voice=voices.find(v=>v.lang.toLowerCase()===lang.toLowerCase())||voices.find(v=>v.lang.toLowerCase().startsWith(prefix));
 if(voices.length&&!voice){toast(`裝置尚未提供${lang==='it-IT'?'義大利文':lang==='en-US'?'英文':'中文'}語音，請在系統加入此語音後再試。`);return;}
 synth.cancel();utterance=new SpeechSynthesisUtterance(text);utterance.lang=lang;utterance.rate=lang==='it-IT'?state.rate:.9;if(voice)utterance.voice=voice;
 utterance.onerror=e=>{if(!['interrupted','canceled'].includes(e.error))toast('語音無法播放，請檢查裝置語音設定後再試。');};
 synth.speak(utterance);
}
function download(name,content,type){const a=document.createElement('a'),url=URL.createObjectURL(new Blob([content],{type}));a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);}
function backup(){download('SONA-語言學習備份-'+taipeiDate()+'.json',JSON.stringify(state,null,2),'application/json');toast('已下載包含進度、收藏、筆記與單字的備份。');}
function exportCsv(){const rows=[['義大利文','English','繁體中文','義大利文 IPA','英文 KK / 美式','詞性','用法','已收藏','已熟悉'],...filteredWords().map(w=>[w.it,w.en,w.zh,w.ipa,w.kk,w.pos,w.note,isSaved(w.id)?'是':'否',isKnown(w.id)?'是':'否'])];const cell=x=>{let s=String(x??'');if(/^[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};download('SONA-三語單字庫-'+taipeiDate()+'.csv','\uFEFF'+rows.map(r=>r.map(cell).join(',')).join('\r\n'),'text/csv;charset=utf-8');toast('已匯出目前篩選的三語單字。');}
document.addEventListener('click',e=>{
 const close=e.target.closest('[data-close]');if(close){$('#'+close.dataset.close).close();return;}
 const b=e.target.closest('[data-action]');if(!b||b.disabled)return;const a=b.dataset.action,id=b.dataset.id;
 switch(a){
  case 'speak':speak(b.dataset.text,b.dataset.lang);break;
  case 'step':step=Number(b.dataset.index);renderToday();break;
  case 'next-step':step=(step+1)%5;renderToday();$('#step-card').scrollIntoView({behavior:'smooth',block:'start'});break;
  case 'prev-day':openDay(selectedDay-1);break;
  case 'next-day':openDay(selectedDay+1);break;
  case 'open-day':openDay(Number(b.dataset.day));break;
  case 'context-day':$('#word-dialog').close();openDay(Number(b.dataset.day));break;
  case 'word':wordDetail(id);break;
  case 'save-word':{const yes=toggleIn(state.savedWords,id);save();if($('#word-dialog').open)wordDetail(id);render();toast(yes?'已把單字收進收藏。':'已取消單字收藏。');break;}
  case 'save-lesson':{const yes=toggleIn(state.savedLessons,Number(id));save();render();toast(yes?'已收藏這一句。':'已取消句子收藏。');break;}
  case 'known':{const yes=toggleIn(state.knownWords,id);if(yes)activity();save();if($('#word-dialog').open)wordDetail(id);if(view==='vocabulary')renderWordResults();else render();toast(yes?'又熟悉一個單字了。':'已取消熟悉標記。');break;}
  case 'complete-step':{const list=state.done[selectedDay]||(state.done[selectedDay]=[]);const yes=toggleIn(list,step);if(yes)activity();save();renderToday();toast(yes?(list.length===5?'今天的五個小步驟，都完成了。':'已記下這一小步。'):'已取消完成標記。');break;}
  case 'word-filter':wordFilter=b.dataset.filter;wordLimit=24;renderWords();break;
  case 'more-words':wordLimit+=24;renderWordResults();break;
  case 'add-word':$('#add-form').reset();openDialog('add-dialog');break;
  case 'go-words':go('vocabulary');break;
  case 'export-csv':exportCsv();break;
  case 'export-backup':backup();break;
  case 'settings':openSettings();break;
  case 'delete-word':{const w=findWord(id);if(!w?.custom)return;const note=document.createElement('div');note.className='notice';note.innerHTML='<p>要從個人單字庫刪除這個單字嗎？</p><div class="button-row"><button class="button rose small" data-action="confirm-delete" data-id="'+esc(id)+'">確認刪除</button><button class="button outline small" data-action="word" data-id="'+esc(id)+'">保留單字</button></div>';b.parentElement.replaceWith(note);break;}
  case 'confirm-delete':state.custom=state.custom.filter(w=>w.id!==id);state.savedWords=state.savedWords.filter(x=>x!==id);state.knownWords=state.knownWords.filter(x=>x!==id);save();$('#word-dialog').close();render();toast('已刪除自訂單字。');break;
  case 'confirm-import':if(importCandidate){state=importCandidate;importCandidate=null;save();selectedDay=activeDay();step=currentSlot();$('#settings-dialog').close();render();toast('已匯入學習備份。');}break;
  case 'cancel-import':importCandidate=null;$('#import-review').hidden=true;break;
 }
});
document.addEventListener('change',e=>{
 const t=e.target;
 if(t.id==='day-select')openDay(Number(t.value));
 if(t.id==='speech-rate'){state.rate=Number(t.value);save();}
 if(t.id==='topic-filter'){topic=t.value;wordLimit=24;renderWordResults();}
});
document.addEventListener('input',e=>{
 if(e.target.id==='word-search'){search=e.target.value;wordLimit=24;renderWordResults();}
 if(e.target.id==='lesson-search')$('#calendar-results').innerHTML=calendarCards(e.target.value);
 if(e.target.id==='lesson-note'){state.notes[selectedDay]=e.target.value;save();if($('#note-status'))$('#note-status').textContent=storageAvailable?'筆記已儲存。':'瀏覽器無法儲存，請下載備份。';}
});
$('#add-form').addEventListener('submit',e=>{
 e.preventDefault();const data=new FormData(e.target);const fields=Object.fromEntries([...data].map(([k,v])=>[k,String(v).trim()]));
 if(!fields.it||!fields.en||!fields.zh){toast('請填寫義大利文、英文與中文。');return;}
 const existing=allWords().find(w=>normalize(w.it)===normalize(fields.it));if(existing){toast('這個字已經在單字庫，為你打開它。');$('#add-dialog').close();wordDetail(existing.id);return;}
 state.custom.push({...fields,id:'custom-'+(crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)),custom:true,pos:'自訂單字',contexts:[],hint:''});save();$('#add-dialog').close();topic='all';search='';wordFilter='all';go('vocabulary');toast('已加入你的三語單字庫。');
});
$('#menu-button').addEventListener('click',()=>{const open=!$('#sidebar').classList.contains('open');$('#sidebar').classList.toggle('open',open);$('#nav-shade').classList.toggle('open',open);$('#menu-button').setAttribute('aria-expanded',String(open));});
$('#nav-shade').addEventListener('click',closeNav);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeNav();});
$('#settings-button').addEventListener('click',openSettings);
$('#about-button').addEventListener('click',()=>openDialog('about-dialog'));
$('#source-button').addEventListener('click',()=>openDialog('about-dialog'));
$('#export-backup').addEventListener('click',backup);
$('#save-start').addEventListener('click',()=>{const date=$('#start-date').value;if(!validDate(date)){toast('請選擇有效的開始日期。');return;}state.startDate=date;save();selectedDay=activeDay();step=currentSlot();render();toast('已更新開始日期。');});
$('#import-backup').addEventListener('change',async e=>{
 const file=e.target.files[0];e.target.value='';if(!file)return;
 try{if(file.size>3000000)throw Error('備份檔案超過 3 MB');importCandidate=validateState(JSON.parse(await file.text()));$('#import-review').innerHTML=`<p>讀取到 ${Object.values(importCandidate.done).reduce((s,a)=>s+a.length,0)} 個完成步驟、${importCandidate.savedWords.length} 個單字收藏、${importCandidate.custom.length} 個自訂單字。</p><p>確認後會取代目前瀏覽器的學習紀錄。可先下載目前備份。</p><div class="button-row"><button class="button rose small" data-action="confirm-import">確認匯入</button><button class="button outline small" data-action="cancel-import">取消</button></div>`;$('#import-review').hidden=false;}catch(err){importCandidate=null;toast('無法匯入：'+err.message);}
});
window.addEventListener('hashchange',()=>{route();window.scrollTo(0,0);});
window.addEventListener('pagehide',()=>{clearTimeout(noteTimer);save();if('speechSynthesis' in window)window.speechSynthesis.cancel();});
window.addEventListener('storage',e=>{if(e.key===KEY&&e.newValue){try{state=validateState(JSON.parse(e.newValue));render();toast('已更新另一個分頁的學習紀錄。');}catch{}}});
updateDate();route();setInterval(updateDate,60000);
if(!corrupt)save();else toast('原有紀錄無法讀取，請先檢查備份；目前暫時使用新紀錄。');
})();
