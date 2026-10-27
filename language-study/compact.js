'use strict';
(() => {
const $=(s,e=document)=>e.querySelector(s),$$=(s,e=document)=>[...e.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>String(s).trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/’/g,"'");
const KEY='sona-language-journal-v1',TIMES=['08:00','11:00','14:00','17:00','20:00'];
const today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const fmt=d=>d.replace(/-/g,'/');
const fresh=()=>({version:1,startDate:today(),done:{},savedWords:[],knownWords:[],savedLessons:[],custom:[],notes:{},activity:[],rate:.85,game:{correct:0,attempts:0}});
function validate(v){
 if(!v||v.version!==1||!Array.isArray(v.savedWords)||!Array.isArray(v.knownWords)||!Array.isArray(v.custom)||!Array.isArray(v.savedLessons))throw Error('不是有效的 SONA 語言備份');
 const n={...fresh(),startDate:typeof v.startDate==='string'?v.startDate:today()};
 for(const k of ['savedWords','knownWords'])n[k]=[...new Set(v[k].filter(x=>typeof x==='string'&&x.length<180))].slice(0,10000);
 n.savedLessons=v.savedLessons.filter(x=>Number.isInteger(x)&&x>0&&x<10000);
 const ids=new Set();
 n.custom=v.custom.slice(0,2000).map(w=>{if(!w||!/^custom-[a-zA-Z0-9-]+$/.test(w.id)||ids.has(w.id)||!['it','en','zh'].every(k=>typeof w[k]==='string'&&w[k].trim()))throw Error('自訂單字格式錯誤');ids.add(w.id);return {id:w.id,it:w.it.slice(0,100),en:w.en.slice(0,150),zh:w.zh.slice(0,150),kk:String(w.kk||'').slice(0,150),ipa:String(w.ipa||'').slice(0,150),note:String(w.note||'').slice(0,1000),pos:'自訂單字',custom:true,contexts:[]};});
 for(const [d,a] of Object.entries(v.done||{})){if(/^\d{1,4}$/.test(d)&&Array.isArray(a))n.done[d]=[...new Set(a.filter(i=>Number.isInteger(i)&&i>=0&&i<5))];}
 for(const [d,note] of Object.entries(v.notes||{})){if(/^\d{1,4}$/.test(d)&&typeof note==='string')n.notes[d]=note.slice(0,5000);}
 n.activity=Array.isArray(v.activity)?v.activity.filter(x=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x)):[];
 if(v.game&&Number.isInteger(v.game.correct)&&Number.isInteger(v.game.attempts)&&v.game.correct>=0&&v.game.attempts>=v.game.correct)n.game={correct:v.game.correct,attempts:v.game.attempts};
 return n;
}
let state=fresh(),storageBroken=false;
try{const raw=localStorage.getItem(KEY);if(raw)state=validate(JSON.parse(raw));}catch{storageBroken=true;}
function save(){if(storageBroken){toast('個人紀錄暫時無法保存，請下載備份。');return;}try{localStorage.setItem(KEY,JSON.stringify(state));}catch{storageBroken=true;toast('個人紀錄暫時無法保存，請下載備份。');}}
const base=[],byTerm=new Map();
(window.LESSONS||[]).forEach(l=>l.words.forEach(w=>{let k=norm(w.it),a=byTerm.get(k);if(!a){a={...w,id:'word-'+base.length,contexts:[],custom:false};base.push(a);byTerm.set(k,a);}a.contexts.push({id:l.id,word:w,it:l.it,zh:l.zh});}));
let daily={days:[]},audioManifest={entries:{}},loaded=false,view='today',search='',topic='all',filter='all',limit=35,dayLimit=7,dateFilter='',candidate=null,toastTimer,currentWordId=null;
const words=()=>[...base,...state.custom];
const find=id=>words().find(w=>w.id===id);
const saved=id=>state.savedWords.includes(id),known=id=>state.knownWords.includes(id);
const published=()=>daily.days.filter(d=>d.date<=today()).sort((a,b)=>b.date.localeCompare(a.date));
function toast(t){clearTimeout(toastTimer);$('#toast').textContent=t;$('#toast').classList.add('visible');toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),4200);}
function toggle(a,k){const i=a.indexOf(k);if(i<0)a.push(k);else a.splice(i,1);return i<0;}
function favorite(id,kind='word'){const on=kind==='word'?saved(id):state.savedLessons.includes(Number(id));return `<button class="save-button ${on?'on':''}" data-action="save-${kind}" data-id="${esc(id)}" aria-label="${on?'取消收藏':'收藏'}${kind==='word'?'單字':'句子'}" aria-pressed="${on}">${on?'♥':'♡'}</button>`;}
function audioFile(it){const record=audioManifest.entries[norm(it)];return record&&record.provider==='Lara Translate'&&typeof record.it==='string'&&/^audio\/[a-zA-Z0-9_./-]+\.(mp3|wav|ogg|m4a)$/.test(record.it)&&!record.it.includes('..')?record.it:null;}
function audioButtons(w){const ready=!!audioFile(w.it);return `<div class="row-audio"><button class="audio-button italian ${ready?'':'pending'}" data-action="italian" data-text="${esc(w.it)}" aria-label="義大利文發音：${esc(w.it)}" title="${ready?'Lara 義大利文原音':'Lara 原音待接通'}"><span class="speaker" aria-hidden="true">▷</span>義大利文</button><button class="audio-button" data-action="english" data-text="${esc(w.en)}" aria-label="英文發音：${esc(w.en)}"><span class="speaker" aria-hidden="true">▷</span>英文</button></div>`;}
function head(vocab=false){return `<div class="study-head" aria-hidden="true">${vocab?'':'<span>時間</span>'}<span>中文</span><span>義大利文</span><span>English</span><span>英文 KK</span><span>發音</span><span>♡</span></div>`;}
function row(w,{day=null,index=0}={}){
 const id=w.id||byTerm.get(norm(w.it))?.id;return `<div class="study-row" role="listitem">${day?`<span class="row-time">${TIMES[index]}<b>${index+1}</b></span>`:''}<span class="row-zh" title="${esc(w.zh)}">${esc(w.zh)}</span><button class="row-it" lang="it" title="${esc(w.it)}" data-action="word" data-id="${esc(id)}" ${day?`data-date="${day.date}" data-index="${index}"`:''}>${esc(w.it)}</button><span class="row-en" lang="en" title="${esc(w.en)}">${esc(w.en)}</span><span class="row-kk" title="${esc(w.kk||'尚未填寫 KK')}">${esc(w.kk||'—')}</span>${audioButtons(w)}${favorite(id)}</div>`;
}
function sentenceRow(d){return `<div class="study-row sentence-row" role="listitem"><span class="row-time">今日句子<b>第六行</b></span><button class="row-it" lang="it" data-action="sentence" data-date="${d.date}">${esc(d.it)}</button><span class="row-zh" title="${esc(d.zh)}">${esc(d.zh)}</span><span class="row-en" lang="en" title="${esc(d.en)}">${esc(d.en)}</span><span class="row-kk" title="${esc(d.kk)}">${esc(d.kk)}</span>${audioButtons(d)}${favorite(d.id,'lesson')}</div>`;}
function renderToday(){
 const ds=published().filter(d=>!dateFilter||d.date===dateFilter),shown=ds.slice(0,dayLimit);
 $('#main').innerHTML=`<div class="page-top"><div><h1>每天學習</h1><p>每天五個重點＋一句句子，最新日期在最上面。</p></div><div class="top-actions"><input type="date" id="date-filter" value="${dateFilter}" max="${today()}" aria-label="查看指定日期">${dateFilter?'<button class="plain" data-action="all-dates">全部</button>':''}</div></div>${voiceNotice()}${!loaded?'<p class="loading">正在讀取每日教材……</p>':shown.length?shown.map(d=>`<section class="day-group" aria-labelledby="date-${d.date}"><div class="day-heading"><h2 id="date-${d.date}">${fmt(d.date)}<span>${d.date===today()?'今天 · ':''}${esc(d.title)}</span></h2><small class="${d.date===today()?'today-tag':''}">${esc(d.topic)}</small></div><div class="table-wrap">${head()}<div class="daily-rows" role="list" aria-label="${fmt(d.date)} 五個重點與一句句子">${d.words.map((w,i)=>row(w,{day:d,index:i})).join('')}${sentenceRow(d)}</div></div></section>`).join(''):'<div class="empty">這個日期尚未發布教材。<button class="plain" data-action="all-dates">查看其他日期</button></div>'}${ds.length>dayLimit?'<div class="load-more"><button class="button" data-action="more-days">更早的學習 ↓</button></div>':''}`;
}
function voiceNotice(){return Object.keys(audioManifest.entries).length?'':'<p class="voice-note">義大利文：Lara 原音待接通；英文按鈕可直接播放。</p>';}
function filtered(){return words().filter(w=>{
 if(!norm([w.it,w.en,w.zh,w.note].join(' ')).includes(norm(search)))return false;
 if(topic==='custom'&&!w.custom)return false;
 if(topic!=='all'&&topic!=='custom'&&(w.custom||!w.contexts.some(c=>(window.LESSONS||[]).find(l=>l.id===c.id)?.topic===topic)))return false;
 if(filter==='saved'&&!saved(w.id))return false;if(filter==='known'&&!known(w.id))return false;
 if(filter==='published'&&!w.custom&&!published().some(d=>d.words.some(x=>norm(x.it)===norm(w.it))))return false;
 return true;
});}
function renderVocabulary(){
 const topics=[...new Set((window.LESSONS||[]).map(l=>l.topic))];
 $('#main').innerHTML=`<div class="page-top"><div><h1>單字庫</h1><p>中英義一起查，每個單字最多兩行。</p></div><button class="button dark" data-action="add">＋ 新增單字</button></div><div class="toolbar"><div class="search"><input type="search" id="word-search" aria-label="搜尋三語單字" placeholder="搜尋義大利文 / English / 中文" value="${esc(search)}"></div><select id="topic-filter" aria-label="單字情境"><option value="all">全部情境</option>${topics.map(t=>`<option ${topic===t?'selected':''}>${esc(t)}</option>`).join('')}<option value="custom" ${topic==='custom'?'selected':''}>我的單字</option></select><button class="button" data-action="csv">匯出 ↓</button></div><div class="pills">${[['all','全部'],['published','已發布課程'],['saved','收藏'],['known','熟悉的字']].map(([v,t])=>`<button class="pill ${filter===v?'active':''}" data-action="filter" data-filter="${v}" aria-pressed="${filter===v}">${t}</button>`).join('')}</div><div id="vocabulary-results"></div>`;renderResults();
}
function renderResults(){const ws=filtered();$('#vocabulary-results').innerHTML=`<p class="results-caption">${ws.length} 個單字與詞組 · 點義大利文看用法</p>${ws.length?`<div class="table-wrap vocab-table">${head(true)}<div role="list" aria-label="單字列表">${ws.slice(0,limit).map(w=>row(w)).join('')}</div></div>${ws.length>limit?'<div class="load-more"><button class="button" data-action="more-words">更多單字 ↓</button></div>':''}`:'<div class="empty">沒有符合的單字，試試其他關鍵字。</div>'}`;}
const GAME=[
 ['acqua','水','aquila','acquisto'],['caffè','咖啡','caffetteria','caffettiera'],['zucchero','糖','zucchina','zuccheriera'],['pane','麵包','panna','panni'],['latte','牛奶','latta','lattuga'],['tè','茶','teatro','tetto'],['tavolo','桌子','tavola','tovaglia'],['borsa','包包','borsetta','bosco'],['farmacia','藥局','fabbrica','famiglia'],['parola','單字','parole','parabola'],['bagno','洗手間','banco','bagnino'],['stazione','車站','stagione','situazione'],['biglietto','票','biscotto','bigliettino'],['treno','火車','terreno','trenta'],['autobus','公車','autista','automobile'],['camera','房間','cameriere','cammino'],['museo','博物館','musica','muro'],['dipinto','畫作','dipingo','dipendenza'],['storia','歷史','storico','stoffa'],['chiesa','教堂','chiave','chiusa'],['mappa','地圖','maglia','macchia'],['piazza','廣場','pizza','pezza'],['giorno','一天、日子','giornale','giardino'],['domani','明天','domenica','domanda'],['oggi','今天','ogni','occhi'],['senza','不加、沒有','senso','sedia'],['fresco','新鮮的','freddo','fretta'],['buono','好吃的','buio','bue'],['rossa','紅色的（陰性）','riso','rotto'],['tranquilla','安靜的（陰性）','tranquillo','tranquille']
];
let gameRound=null,gameSeen=[],roundNo=0,gameFilter='published',ignoreClickUntil=0;
function shuffle(a){return [...a].sort(()=>Math.random()-.5);}
function gamePool(){const p=gameFilter==='all'?GAME:GAME.filter(g=>published().some(d=>d.words.some(w=>norm(w.it)===norm(g[0]))));return p.length?p:GAME.slice(0,3);}
function nextGame(){const pool=gamePool();let candidates=pool.filter(g=>!gameSeen.includes(g[0]));if(!candidates.length){gameSeen=[];candidates=pool;}const selected=candidates[Math.floor(Math.random()*candidates.length)];gameSeen.push(selected[0]);roundNo++;gameRound={it:selected[0],zh:selected[1],options:shuffle([selected[0],selected[2],selected[3]]),solved:false,wrong:[],attempted:false};if(view==='game')renderGame();}
function renderGame(){
 if(!gameRound){nextGame();return;}
 const g=gameRound;
 $('#main').innerHTML=`<div class="page-top"><div><h1>單字遊戲</h1><p>看中文，把正確的義大利文拖進去。</p></div><select id="game-filter" aria-label="遊戲範圍"><option value="published" ${gameFilter==='published'?'selected':''}>已發布的生活單字</option><option value="all" ${gameFilter==='all'?'selected':''}>全部生活單字</option></select></div><section class="game-panel"><div class="game-top"><span>第 ${roundNo} 個字</span><span>答對 ${state.game.correct} / ${state.game.attempts} 次</span></div><p class="game-prompt">這個中文，義大利文是哪一個？</p><div id="drop-zone" class="drop-zone ${g.solved?'correct':''}" aria-label="${esc(g.zh)}：把正確單字拖到這裡"><span class="chinese">${esc(g.zh)}</span><small>${g.solved?'✓ '+esc(g.it):'將正確方塊拖到這裡'}</small></div><div class="choices" aria-label="三個義大利文選項">${g.options.map((it,i)=>`<button type="button" class="choice ${g.wrong.includes(i)?'wrong':''} ${g.solved&&it===g.it?'correct':''}" data-choice="${i}" lang="it" ${g.solved?'disabled':''}>${esc(it)}</button>`).join('')}</div><p class="game-feedback" role="status" aria-live="polite">${g.solved?'答對了，'+esc(g.it)+' 是「'+esc(g.zh)+'」。':g.wrong.length?'這個字的意思不同，再試一次。':'三個都是真正的義大利文，留意相似的拼字。'}</p><div class="game-bottom"><small>也可以直接點方塊作答，不用拖曳。</small><div class="actions">${g.solved?`<button class="button small" data-action="italian" data-text="${esc(g.it)}">▷ 義大利文</button>`:''}<button class="button ${g.solved?'dark':''}" data-action="next-game">${g.solved?'下一個字 →':'換一個字'}</button></div></div></section>`;
 bindDrag();
}
function answer(index){const g=gameRound;if(!g||g.solved||index<0||index>=g.options.length)return;state.game.attempts++;if(g.options[index]===g.it){g.solved=true;state.game.correct++;const word=byTerm.get(norm(g.it));if(word&&!state.knownWords.includes(word.id))state.knownWords.push(word.id);}else if(!g.wrong.includes(index))g.wrong.push(index);if(!state.activity.includes(today()))state.activity.push(today());save();renderGame();}
function bindDrag(){
 let drag=null;
 $$('.choice').forEach(button=>{
  button.addEventListener('pointerdown',e=>{if(gameRound.solved||e.button!==0)return;drag={index:Number(button.dataset.choice),x:e.clientX,y:e.clientY,moved:false,button,ghost:null};button.setPointerCapture(e.pointerId);});
  button.addEventListener('pointermove',e=>{if(!drag||drag.button!==button)return;if(!drag.moved&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>7){drag.moved=true;drag.ghost=document.createElement('div');drag.ghost.className='drag-ghost';drag.ghost.textContent=button.textContent;document.body.append(drag.ghost);button.classList.add('drag-source');}if(drag.moved){e.preventDefault();drag.ghost.style.left=e.clientX+'px';drag.ghost.style.top=e.clientY+'px';const r=$('#drop-zone').getBoundingClientRect();$('#drop-zone').classList.toggle('over',e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom);}});
  button.addEventListener('pointerup',e=>{if(!drag||drag.button!==button)return;const d=drag;drag=null;d.ghost?.remove();button.classList.remove('drag-source');const zone=$('#drop-zone');zone.classList.remove('over');if(d.moved){ignoreClickUntil=Date.now()+400;const r=zone.getBoundingClientRect();if(e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom)answer(d.index);}});
  button.addEventListener('pointercancel',()=>{drag?.ghost?.remove();drag=null;button.classList.remove('drag-source');$('#drop-zone')?.classList.remove('over');});
  button.addEventListener('click',()=>{if(Date.now()>ignoreClickUntil)answer(Number(button.dataset.choice));});
  button.addEventListener('dragstart',e=>e.preventDefault());
 });
}
function render(){
 const raw=location.hash.slice(1);view=['today','vocabulary','game'].includes(raw)?raw:'today';
 $$('.navigation nav a').forEach(a=>{const active=a.dataset.view===view;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});$('#word-count').textContent=words().length;
 ({today:renderToday,vocabulary:renderVocabulary,game:renderGame}[view])();
}
function openWord(id,date,index){const baseWord=find(id);if(!baseWord)return;const day=daily.days.find(d=>d.date===date),w=day?.words[Number(index)]||baseWord;currentWordId=id;
 $('#word-title').textContent='單字與用法';$('#word-body').innerHTML=`<h3 class="dialog-word" lang="it">${esc(w.it)}</h3><p class="dialog-subtitle"><span lang="en">${esc(w.en)}</span> · ${esc(w.zh)}</p><dl class="row-details"><div><dt>英文 KK</dt><dd>${esc(w.kk||'尚未填寫')}</dd></div><div><dt>義大利文 IPA</dt><dd>${esc(w.ipa||'尚未填寫')}</dd></div></dl><div class="actions">${audioButtons(w)}${favorite(id)}</div><p class="note">${esc(w.note||baseWord.note||'我的生活單字。')}</p><button class="known-button" data-action="known" data-id="${esc(id)}">${known(id)?'✓ 已熟悉 · 取消標記':'標記為熟悉的字'}</button>${baseWord.custom?`<button class="plain" style="margin-left:15px" data-action="remove-word" data-id="${esc(id)}">刪除自訂單字</button>`:''}${baseWord.contexts?.length?`<div class="contexts">${baseWord.contexts.slice(0,4).map(c=>`<button data-action="lesson-note" data-day="${c.id}" lang="it">${esc(c.it)}<small>${esc(c.zh)}</small></button>`).join('')}</div>`:''}`;
 if(!$('#word-dialog').open)$('#word-dialog').showModal();
}
function openSentence(d){currentWordId=null;$('#word-title').textContent=fmt(d.date)+' · 今日句子';$('#word-body').innerHTML=`<h3 class="dialog-word" style="font-size:24px" lang="it">${esc(d.it)}</h3><p class="dialog-subtitle">${esc(d.zh)}<br><span lang="en">${esc(d.en)}</span></p><dl class="row-details"><div><dt>英文 KK</dt><dd>${esc(d.kk)}</dd></div><div><dt>義大利文發音輔助</dt><dd>${esc(d.pronunciation||'')}</dd></div></dl><div class="actions">${audioButtons(d)}${favorite(d.id,'lesson')}</div><p class="note">${d.words.map(w=>esc(w.it)+' = '+esc(w.zh)).join('<br>')}</p>`;if(!$('#word-dialog').open)$('#word-dialog').showModal();}
let player=$('#italian-player'),utterance=null;
async function italian(text){const src=audioFile(text);if(!src){toast('這個詞句的 Lara 原音尚未備妥，請稍後再試。');return;}player.pause();if('speechSynthesis'in window)window.speechSynthesis.cancel();player.src=src;try{await player.play();}catch{toast('Lara 音檔未能播放，請稍後重試。');}}
function english(text){if(!('speechSynthesis'in window)){toast('此瀏覽器不支援英文語音。');return;}if(player)player.pause();const synth=window.speechSynthesis;synth.cancel();utterance=new SpeechSynthesisUtterance(text);utterance.lang='en-US';utterance.rate=.85;const voices=synth.getVoices(),voice=voices.find(v=>/^en[-_]US$/i.test(v.lang))||voices.find(v=>/^en/i.test(v.lang));if(voice)utterance.voice=voice;utterance.onerror=e=>{if(!['interrupted','canceled'].includes(e.error))toast('英文語音未能播放，請檢查裝置語音設定。');};synth.speak(utterance);}
function download(name,content,type){const a=document.createElement('a'),url=URL.createObjectURL(new Blob([content],{type}));a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);}
function backup(){download('SONA-語言學習備份-'+today()+'.json',JSON.stringify(state,null,2),'application/json');toast('已下載個人學習紀錄。');}
function csv(){const cell=v=>{let s=String(v??'');if(/^[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};const rows=[['義大利文','English','中文','英文 KK','義大利文 IPA','筆記'],...filtered().map(w=>[w.it,w.en,w.zh,w.kk,w.ipa,w.note])];download('SONA-三語單字-'+today()+'.csv','\uFEFF'+rows.map(r=>r.map(cell).join(',')).join('\r\n'),'text/csv;charset=utf-8');}
document.addEventListener('click',e=>{
 const close=e.target.closest('[data-close]');if(close){$('#'+close.dataset.close).close();return;}
 const b=e.target.closest('[data-action]');if(!b)return;const a=b.dataset.action,id=b.dataset.id;
 switch(a){
  case'word':openWord(id,b.dataset.date,b.dataset.index);break;
  case'sentence':{const d=daily.days.find(d=>d.date===b.dataset.date);if(d)openSentence(d);break;}
  case'italian':italian(b.dataset.text);break;case'english':english(b.dataset.text);break;
  case'save-word':toggle(state.savedWords,id);save();if($('#word-dialog').open&&currentWordId)openWord(currentWordId);render();break;
  case'save-lesson':toggle(state.savedLessons,Number(id));save();render();b.setAttribute('aria-pressed',String(state.savedLessons.includes(Number(id))));b.textContent=state.savedLessons.includes(Number(id))?'♥':'♡';break;
  case'known':toggle(state.knownWords,id);save();openWord(id);if(view==='vocabulary')renderResults();break;
  case'add':$('#add-form').reset();$('#add-dialog').showModal();break;
  case'filter':filter=b.dataset.filter;limit=35;renderVocabulary();break;
  case'more-words':limit+=35;renderResults();break;case'more-days':dayLimit+=7;renderToday();break;
  case'all-dates':dateFilter='';dayLimit=7;renderToday();break;case'csv':csv();break;
  case'next-game':nextGame();break;
  case'lesson-note':{const l=(window.LESSONS||[]).find(l=>l.id===Number(b.dataset.day));if(l){$('#word-dialog').close();const d=daily.days.find(d=>d.id===l.id);if(d){dateFilter=d.date;location.hash='today';renderToday();}else toast('這句是尚未發布的預備教材。');}break;}
  case'remove-word':b.outerHTML=`<span class="notice">刪除這個自訂單字？ <button class="plain" data-action="confirm-remove" data-id="${esc(id)}">確認刪除</button> <button class="plain" data-action="word" data-id="${esc(id)}">取消</button></span>`;break;
  case'confirm-remove':state.custom=state.custom.filter(w=>w.id!==id);state.savedWords=state.savedWords.filter(x=>x!==id);state.knownWords=state.knownWords.filter(x=>x!==id);save();$('#word-dialog').close();render();break;
  case'confirm-import':if(candidate){state=candidate;candidate=null;storageBroken=false;save();$('#settings-dialog').close();render();toast('已匯入個人紀錄。');}break;
  case'cancel-import':candidate=null;$('#import-review').hidden=true;break;
 }
});
document.addEventListener('input',e=>{if(e.target.id==='word-search'){search=e.target.value;limit=35;renderResults();}});
document.addEventListener('change',e=>{if(e.target.id==='topic-filter'){topic=e.target.value;renderResults();}if(e.target.id==='date-filter'){dateFilter=e.target.value;renderToday();}if(e.target.id==='game-filter'){gameFilter=e.target.value;gameSeen=[];roundNo=0;nextGame();}});
$('#add-form').addEventListener('submit',e=>{e.preventDefault();const w=Object.fromEntries([...new FormData(e.target)].map(([k,v])=>[k,String(v).trim()]));if(!w.it||!w.en||!w.zh){toast('請填寫三種語言。');return;}const existing=words().find(x=>norm(x.it)===norm(w.it));if(existing){$('#add-dialog').close();openWord(existing.id);toast('這個單字已在單字庫。');return;}state.custom.push({...w,id:'custom-'+(crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)),custom:true,contexts:[],pos:'自訂單字'});save();$('#add-dialog').close();search='';topic='custom';filter='all';location.hash='vocabulary';render();toast('已加入個人單字庫。');});
$('#settings-button').addEventListener('click',()=>{$('#import-review').hidden=true;$('#settings-dialog').showModal();});
$('#about-button').addEventListener('click',()=>$('#about-dialog').showModal());
$('#export-backup').addEventListener('click',backup);
$('#import-backup').addEventListener('change',async e=>{const file=e.target.files[0];e.target.value='';if(!file)return;try{if(file.size>3000000)throw Error('檔案超過 3 MB');candidate=validate(JSON.parse(await file.text()));$('#import-review').innerHTML=`<div class="notice"><p>讀取到 ${candidate.savedWords.length} 個單字收藏與 ${candidate.custom.length} 個自訂單字。匯入會取代目前個人紀錄，請先備份。</p><div class="actions"><button class="button dark" data-action="confirm-import">確認匯入</button><button class="button" data-action="cancel-import">取消</button></div></div>`;$('#import-review').hidden=false;}catch(err){candidate=null;toast('無法匯入：'+err.message);}});
window.addEventListener('hashchange',()=>{render();window.scrollTo(0,0);});
window.addEventListener('pagehide',()=>{player?.pause();if('speechSynthesis'in window)window.speechSynthesis.cancel();});
window.addEventListener('storage',e=>{if(e.key===KEY&&e.newValue){try{state=validate(JSON.parse(e.newValue));render();}catch{}}});
function updateClock(){$('#today-date').textContent=fmt(today());}
async function loadDaily(){try{const response=await fetch('daily.json',{cache:'no-store'});if(!response.ok)throw Error('無法讀取每日教材');const data=await response.json();if(data.version!==2||!Array.isArray(data.days)||!data.days.every(d=>/^\d{4}-\d{2}-\d{2}$/.test(d.date)&&Array.isArray(d.words)&&d.words.length===5&&['it','en','zh','kk'].every(k=>typeof d[k]==='string')))throw Error('教材格式錯誤');daily=data;loaded=true;if(view==='today'||view==='game')render();}catch(e){loaded=false;if(view==='today')$('#main').innerHTML='<div class="empty">每日教材暫時無法載入。<button class="plain" data-action="reload-data">重新讀取</button></div>';toast(e.message);}}
document.addEventListener('click',e=>{if(e.target.closest('[data-action="reload-data"]'))loadDaily();});
async function loadAudio(){try{const r=await fetch('audio/manifest.json',{cache:'no-store'});if(r.ok){const data=await r.json();if(data.version===1&&data.entries&&typeof data.entries==='object'){audioManifest=data;$('#voice-status').textContent=Object.keys(data.entries).length?'義大利文直接播放 Lara 原音，已存成網站音檔，不需跳頁。英文使用裝置的美式英文語音。':'義大利文 Lara 音檔尚未備妥，沒有用其他聲音代替。';render();}}}catch{}}
updateClock();render();loadDaily();loadAudio();setInterval(()=>{updateClock();loadDaily();},60000);
})();
