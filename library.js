'use strict';
(() => {
  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  const escape=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const normalize=v=>String(v).normalize('NFKC').toLowerCase().replace(/科西莫|柯西默|柯西莫/g,'cosimo').replace(/羅倫佐|洛倫佐|倫倫佐/g,'lorenzo').replace(/波提切利|波提且利|波堤切利|坡堤切利/g,'botticelli').replace(/[’‘']/g,'');
  let storageOK=true;
  function load(key,fallback){try{const s=localStorage.getItem(key);return s===null?fallback:JSON.parse(s);}catch{storageOK=false;return fallback;}}
  function save(key,value){try{localStorage.setItem(key,JSON.stringify(value));}catch{storageOK=false;}if(!storageOK)notify('此瀏覽器無法永久儲存，閱讀與作答紀錄只保留於本次頁面。');}
  function notify(text){$('#reader-status').textContent=text;clearTimeout(notify.timer);notify.timer=setTimeout(()=>{$('#reader-status').textContent='';},4500);}
  function arraySet(key,valid){const raw=load(key,[]);return new Set(Array.isArray(raw)?raw.filter(id=>valid.has(id)):[]);}
  let font=load('sona-reading-font-v1',16);if(!Number.isInteger(font)||font<14||font>22)font=16;
  function setFont(){document.body.style.setProperty('--reading-size',font+'px');$('[data-font="down"]').disabled=font===14;$('[data-font="up"]').disabled=font===22;}
  $$('[data-font]').forEach(b=>b.addEventListener('click',()=>{font=Math.max(14,Math.min(22,font+(b.dataset.font==='up'?1:-1)));save('sona-reading-font-v1',font);setFont();}));
  $$('[data-print]').forEach(b=>b.addEventListener('click',()=>window.print()));setFont();

  if(document.body.dataset.reader==='chronology'){
    const articles=$$('.lecture-unit'),ids=new Set(articles.map(a=>a.id)),read=arraySet('sona-chronology-read-v1',ids);
    const searchText=new Map(articles.map(a=>[a.id,normalize(a.textContent)]));
    let active=ids.has(location.hash.slice(1))?location.hash.slice(1):load('sona-chronology-current-v1',articles[0].id);if(!ids.has(active))active=articles[0].id;
    let visible=articles;
    function renderProgress(){
      $('#lecture-read-count').textContent=`已讀 ${read.size} / ${articles.length} 節`;
      $$('[data-read-badge]').forEach(b=>b.textContent=read.has(b.dataset.readBadge)?'✓':'');
      const done=read.has(active),button=$('#mark-lecture-read');button.textContent=done?'✓ 本節已讀 · 取消標記':'標記本節已讀 ✓';button.setAttribute('aria-pressed',String(done));
    }
    function renderCurrent({scroll=false,updateHash=false}={}){
      const full=$('#lecture-mode').value==='full';articles.forEach(a=>a.hidden=!full&&a.id!==active);
      $$('[data-unit-link]').forEach(b=>b.setAttribute('aria-current',String(b.dataset.unitLink===active)));
      const index=articles.findIndex(a=>a.id===active),filtered=visible.findIndex(a=>a.id===active);
      $('#lecture-position').textContent=`閱讀單元 ${index+1} / ${articles.length}${full?' · 全文模式':''}`;
      $('#lecture-prev').disabled=filtered<=0;$('#lecture-next').disabled=filtered<0||filtered===visible.length-1;
      renderProgress();save('sona-chronology-current-v1',active);
      if(updateHash){try{history.replaceState(null,'','#'+active);}catch{}}
      if(scroll){const target=full?document.getElementById(active):$('.reader-content');target.scrollIntoView({block:'start',behavior:'auto'});$('h2',document.getElementById(active)).focus({preventScroll:true});}
    }
    function filter(){
      const query=normalize($('#lecture-search').value.trim()),group=$('#era-filter').value;
      visible=articles.filter(a=>(group==='all'||a.dataset.group===group)&&(!query||searchText.get(a.id).includes(query)));
      const matches=new Set(visible.map(a=>a.id));$$('[data-unit-link]').forEach(b=>b.closest('li').hidden=!matches.has(b.dataset.unitLink));
      $('#lecture-result-count').textContent=`符合 ${visible.length} 節 / 共 ${articles.length} 節`;$('#lecture-empty').hidden=visible.length>0;
      if(visible.length&&!matches.has(active))active=visible[0].id;
      renderCurrent();
    }
    $('#lecture-search').addEventListener('input',filter);$('#era-filter').addEventListener('change',filter);
    $('#lecture-mode').addEventListener('change',()=>renderCurrent());
    $('#lecture-toc').addEventListener('click',e=>{const b=e.target.closest('[data-unit-link]');if(b){active=b.dataset.unitLink;renderCurrent({scroll:true,updateHash:true});}});
    $('#mark-lecture-read').addEventListener('click',()=>{read.has(active)?read.delete(active):read.add(active);save('sona-chronology-read-v1',[...read]);renderProgress();});
    $('#lecture-prev').addEventListener('click',()=>{const i=visible.findIndex(a=>a.id===active);if(i>0){active=visible[i-1].id;renderCurrent({scroll:true,updateHash:true});}});
    $('#lecture-next').addEventListener('click',()=>{const i=visible.findIndex(a=>a.id===active);if(i>=0&&i<visible.length-1){active=visible[i+1].id;renderCurrent({scroll:true,updateHash:true});}});
    window.addEventListener('hashchange',()=>{const id=location.hash.slice(1);if(ids.has(id)){active=id;renderCurrent({scroll:true});}});
    filter();return;
  }

  const articles=$$('.daily-article'),ids=new Set(DAILY_READINGS.map(r=>r.id));
  const read=arraySet('sona-daily-read-v1',ids),byId=id=>DAILY_READINGS.find(r=>r.id===id);
  const articleText=new Map(articles.map(a=>[a.id,normalize(a.textContent)]));
  const storedProgress=load('sona-daily-quiz-progress-v1',{}),storedBest=load('sona-daily-quiz-best-v1',{});
  const progress={},best={};
  for(const r of DAILY_READINGS){
    const qs=DAILY_QUIZZES.filter(q=>q.readingId===r.id),p=storedProgress?.[r.id],b=storedBest?.[r.id];
    if(p?.version==='daily-20261021'&&Array.isArray(p.answers)&&p.answers.length>0&&p.answers.length<=qs.length&&p.answers.every(a=>Number.isInteger(a)&&a>=0&&a<4))progress[r.id]=p;
    if(Number.isInteger(b)&&b>=0&&b<=qs.length)best[r.id]=b;
  }
  let active=ids.has(location.hash.slice(1))?location.hash.slice(1):load('sona-daily-current-v1',DAILY_READINGS[0].id);if(!ids.has(active))active=DAILY_READINGS[0].id;
  let visible=[...DAILY_READINGS];
  const noArticle=document.createElement('p');noArticle.className='reader-empty';noArticle.textContent='沒有符合條件的文獻。請調整左側搜尋條件。';noArticle.hidden=true;$('#daily-articles').append(noArticle);
  function renderReadProgress(){
    $('#daily-read-progress').textContent=`已讀 ${read.size} / ${DAILY_READINGS.length} 篇`;
    $$('[data-daily-read-badge]').forEach(b=>b.textContent=read.has(b.dataset.dailyReadBadge)?'✓':'');
    $$('[data-mark-daily]').forEach(b=>{const done=read.has(b.dataset.markDaily);b.textContent=done?'✓ 本篇已讀 · 取消標記':'標記本篇已讀 ✓';b.setAttribute('aria-pressed',String(done));});
    $$('[data-daily-score]').forEach(el=>{const id=el.dataset.dailyScore,p=progress[id];el.textContent=(Number.isInteger(best[id])?`本瀏覽器最佳成績：${best[id]} / 10 題。`: '本篇 10 題四選一，選答後顯示正解與解析。')+(p&&p.answers.length<10?` 上次已作答 ${p.answers.length} 題，可接續練習。`:'');});
  }
  function renderCurrent({scroll=false,updateHash=false}={}){
    const exists=visible.some(r=>r.id===active);articles.forEach(a=>a.hidden=!exists||a.id!==active);noArticle.hidden=exists;
    $$('[data-reading-link]').forEach(b=>b.setAttribute('aria-current',String(exists&&b.dataset.readingLink===active)));
    const index=visible.findIndex(r=>r.id===active);$('#daily-prev').disabled=index<=0;$('#daily-next').disabled=index<0||index===visible.length-1;
    $('#daily-position').textContent=exists?`${index+1} / ${visible.length} 篇`: '沒有符合的精選';
    $('#daily-reading-label').textContent=exists?`${byId(active).date} · 約 ${byId(active).minutes} 分鐘閱讀`: '請調整搜尋條件';
    renderReadProgress();save('sona-daily-current-v1',active);
    if(updateHash){try{history.replaceState(null,'','#'+active);}catch{}}
    if(scroll&&exists){$('.reader-content').scrollIntoView({block:'start',behavior:'auto'});$('h2',document.getElementById(active)).focus({preventScroll:true});}
  }
  function filter({scroll=false}={}){
    const query=normalize($('#daily-search').value.trim()),date=$('#daily-date').value,topic=$('#daily-topic').value,unread=$('#daily-unread').checked;
    visible=DAILY_READINGS.filter(r=>(date==='all'||r.date===date)&&(topic==='all'||r.topic===topic)&&(!unread||!read.has(r.id))&&(!query||normalize([r.title,r.author,r.topic,r.year,r.summary,articleText.get(r.id)].join(' ')).includes(query)));
    const matches=new Set(visible.map(r=>r.id));$$('[data-reading-link]').forEach(b=>b.closest('li').hidden=!matches.has(b.dataset.readingLink));
    $('#daily-result-count').textContent=`符合 ${visible.length} 篇 / 共 ${DAILY_READINGS.length} 篇`;$('#daily-empty').hidden=visible.length>0;
    if(visible.length&&!matches.has(active))active=visible[0].id;renderCurrent({scroll});
  }
  function selectReading(id){
    if(!ids.has(id))return;$('#daily-search').value='';$('#daily-date').value='all';$('#daily-topic').value='all';$('#daily-unread').checked=false;active=id;filter();renderCurrent({scroll:true,updateHash:true});
  }
  $('#daily-search').addEventListener('input',()=>filter());$('#daily-date').addEventListener('change',()=>filter());$('#daily-topic').addEventListener('change',()=>filter());$('#daily-unread').addEventListener('change',()=>filter());
  $('#daily-list').addEventListener('click',e=>{const b=e.target.closest('[data-reading-link]');if(b){active=b.dataset.readingLink;renderCurrent({scroll:true,updateHash:true});}});
  $('#daily-prev').addEventListener('click',()=>{const i=visible.findIndex(r=>r.id===active);if(i>0){active=visible[i-1].id;renderCurrent({scroll:true,updateHash:true});}});
  $('#daily-next').addEventListener('click',()=>{const i=visible.findIndex(r=>r.id===active);if(i>=0&&i<visible.length-1){active=visible[i+1].id;renderCurrent({scroll:true,updateHash:true});}});
  window.addEventListener('hashchange',()=>{const id=location.hash.slice(1);if(ids.has(id))selectReading(id);});

  const dialog=$('#daily-quiz-dialog');let deck=[],answers=[],index=0,mode='full',readingId=null,answered=false,returnFocus=null;
  function shuffle(array){const copy=[...array];for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}return copy;}
  function openDialog(){returnFocus=document.activeElement;dialog.showModal();document.body.classList.add('modal-open');$('#daily-quiz-title').focus();}
  function persist(){if(mode==='full'&&readingId){progress[readingId]={version:'daily-20261021',answers:[...answers]};save('sona-daily-quiz-progress-v1',progress);renderReadProgress();}}
  function openQuiz(id){
    if(!ids.has(id))return;readingId=id;mode='full';deck=DAILY_QUIZZES.filter(q=>q.readingId===id);const r=byId(id),p=progress[id];$('#daily-quiz-label').textContent='SONA / 每日精選 · 本篇 10 題四選一';
    $('#daily-quiz-content').innerHTML=`<div class="daily-quiz-intro"><p class="eyebrow">DAILY READING / MULTIPLE-CHOICE QUESTIONS</p><div class="reader-big-number">${deck.length}.</div><h2 id="daily-quiz-title" tabindex="-1">${escape(r.title)}</h2><p>依本篇文獻精選整理的四選一。<br>選出最恰當的一項，立即查看正解、解析及對應小節。</p>${p?`<p>上次已作答 ${p.answers.length} / ${deck.length} 題。</p><button class="button green" data-daily-quiz-resume>${p.answers.length===deck.length?'查看上次成績':`繼續第 ${p.answers.length+1} 題`} →</button><button class="daily-quiz-restart" data-daily-quiz-start>重新開始本篇 ${deck.length} 題 ↻</button>`:`<button class="button green" data-daily-quiz-start>開始本篇 ${deck.length} 題 →</button>`}<small>作答進度儲存在目前瀏覽器，可關閉後繼續。<br>題目依精選筆記出題，閱讀範圍與假說限制同原文。</small></div>`;openDialog();
  }
  function renderQuestion(){
    answered=false;const q=deck[index],r=byId(q.readingId),score=answers.filter((a,i)=>a===deck[i].correct).length;
    $('#daily-quiz-content').innerHTML=`<div class="daily-quiz-top"><span>第 ${index+1} / ${deck.length} 題 · 四選一</span><span>已答對 ${score} 題</span></div><p class="daily-quiz-topic">${escape(r.date)} · ${escape(r.author)}<br>${escape(r.title)}</p><h2 id="daily-quiz-title" tabindex="-1">${escape(q.question)}</h2><div class="daily-quiz-options" role="group" aria-label="四個答案選項">${q.answers.map((a,i)=>`<button data-daily-answer="${i}"><b aria-hidden="true">${'ABCD'[i]}</b><span>${escape(a)}</span></button>`).join('')}</div><div id="daily-quiz-feedback" aria-live="polite" hidden></div><div class="daily-quiz-next"></div>${mode==='full'?'<p class="daily-quiz-save-note">作答後自動保存，可暫停後接續。</p>':''}`;
    dialog.scrollTop=0;if(dialog.open)$('#daily-quiz-title').focus();
  }
  function answer(choice){
    if(answered)return;answered=true;const q=deck[index];answers[index]=choice;persist();
    $$('[data-daily-answer]',dialog).forEach(b=>{const i=+b.dataset.dailyAnswer;b.disabled=true;b.classList.toggle('correct',i===q.correct);b.classList.toggle('wrong',i===choice&&i!==q.correct);});
    $('.daily-quiz-top>span:last-child').textContent=`已答對 ${answers.filter((a,i)=>a===deck[i].correct).length} 題`;
    const feedback=$('#daily-quiz-feedback');feedback.hidden=false;feedback.className='daily-quiz-explanation';feedback.innerHTML=`<strong>${choice===q.correct?'✓ 答對了。':`再看一次，正解為 ${'ABCD'[q.correct]}。`}</strong><p>${escape(q.explain)}</p><small>回讀小節：${escape(q.sourceSection)}</small>`;
    $('.daily-quiz-next').innerHTML=`<button class="button green" data-daily-quiz-next>${index===deck.length-1?'查看成績':'下一題'} →</button>`;$('[data-daily-quiz-next]').focus();
  }
  function result(){
    const score=answers.filter((a,i)=>a===deck[i].correct).length,wrong=deck.map((q,i)=>({q,i})).filter(({q,i})=>answers[i]!==q.correct);
    if(mode==='full'&&readingId){best[readingId]=Math.max(best[readingId]??0,score);save('sona-daily-quiz-best-v1',best);renderReadProgress();}
    $('#daily-quiz-content').innerHTML=`<div class="daily-quiz-result"><p class="eyebrow">READING PRACTICE / RESULTS</p><div class="reader-big-number">${score}<span> / ${deck.length}</span></div><h2 id="daily-quiz-title" tabindex="-1">${wrong.length?'把錯題，帶回文獻裡。':'全部答對，繼續累積閱讀。'}</h2><p>答對 ${score} 題，答錯 ${wrong.length} 題。<br>成績依實際選項自動判分。</p>${wrong.length?`<div class="daily-quiz-review">${wrong.map(({q,i})=>`<article><h3>${escape(q.question)}</h3><p>你的選擇：${'ABCD'[answers[i]]} · ${escape(q.answers[answers[i]])}<br>正解：${'ABCD'[q.correct]} · ${escape(q.answers[q.correct])}</p><p>${escape(q.explain)}</p><small>回讀小節：${escape(q.sourceSection)}</small><p><a href="#${q.readingId}" data-daily-review-read="${q.readingId}">回到對應文獻 ↗</a></p></article>`).join('')}</div>`:''}<div class="daily-quiz-result-actions">${wrong.length?'<button class="button green" data-daily-repeat-wrong>重練錯題 ↻</button>':''}<button class="button outline" data-daily-quiz-close>返回閱讀</button></div><p class="daily-quiz-result-credit">SONA / 每日精選 70 題四選一</p></div>`;dialog.scrollTop=0;$('#daily-quiz-title').focus();
  }
  document.addEventListener('click',e=>{
    const mark=e.target.closest('[data-mark-daily]');if(mark){const id=mark.dataset.markDaily;read.has(id)?read.delete(id):read.add(id);save('sona-daily-read-v1',[...read]);filter();}
    const start=e.target.closest('[data-start-daily]');if(start)openQuiz(start.dataset.startDaily);
    if(e.target.closest('[data-daily-quiz-close]'))dialog.close();
  });
  $('#daily-random').addEventListener('click',()=>{mode='random';readingId=null;deck=shuffle(DAILY_QUIZZES).slice(0,10);answers=[];index=0;$('#daily-quiz-label').textContent='SONA / 每日精選 · 隨機 10 題';renderQuestion();openDialog();});
  $('#daily-quiz-content').addEventListener('click',e=>{
    if(e.target.closest('[data-daily-quiz-start]')){answers=[];index=0;persist();renderQuestion();}
    if(e.target.closest('[data-daily-quiz-resume]')){answers=[...progress[readingId].answers];index=answers.length;index===deck.length?result():renderQuestion();}
    const chosen=e.target.closest('[data-daily-answer]');if(chosen)answer(+chosen.dataset.dailyAnswer);
    if(e.target.closest('[data-daily-quiz-next]')){index++;index<deck.length?renderQuestion():result();}
    if(e.target.closest('[data-daily-repeat-wrong]')){deck=deck.filter((q,i)=>answers[i]!==q.correct);mode='review';answers=[];index=0;renderQuestion();}
    const reread=e.target.closest('[data-daily-review-read]');if(reread){e.preventDefault();dialog.close();selectReading(reread.dataset.dailyReviewRead);}
  });
  dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');renderReadProgress();if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});});
  dialog.addEventListener('click',e=>{if(e.target===dialog){const rect=dialog.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)dialog.close();}});
  filter();
})();
