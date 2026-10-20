'use strict';
(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const escape = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const byId = id => MEDICI.readings.find(r=>r.id===id);
  let storageOK = true;
  const readLocal = (key, fallback) => {
    try { const raw=localStorage.getItem(key); return raw===null?fallback:JSON.parse(raw); }
    catch { storageOK=false; return fallback; }
  };
  const writeLocal = (key, value) => { try { localStorage.setItem(key,JSON.stringify(value)); } catch { storageOK=false; } };
  const initialSaved = readLocal('sona-medici-notes-v1',[]);
  let saved = new Set(Array.isArray(initialSaved)?initialSaved.filter(id=>byId(id)):[]);
  let best = readLocal('sona-medici-best-v2',null);
  if (!Number.isInteger(best)||best<0||best>MEDICI.questions.length) best=null;
  let filter='all',onlySaved=false,activeNote=null,returnFocus=null,toastTimer;
  const toast = message => { $('#toast').textContent=message; $('#toast').classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2800); };
  const readingLink = id => `<a href="#reading" data-open-note="${id}">${escape(byId(id).author)} · ${escape(byId(id).year)} ↗</a>`;
  function renderCase(id) {
    const c=MEDICI.cases[id]; if(!c)return;
    $$('[data-case]').forEach(b=>{const active=b.dataset.case===id;b.setAttribute('aria-selected',active);b.tabIndex=active?0:-1;});
    $('#case-panel').setAttribute('aria-labelledby','tab-'+id);
    $('#case-panel').innerHTML=`<div class="case-top"><div class="case-visual ${id}"><div class="diagram-arch" aria-hidden="true"></div><div class="diagram">${c.diagram.map(([en,zh],i)=>`${i?'<i aria-hidden="true">→</i>':''}<span><em>${en}</em>${zh}</span>`).join('')}</div><small>研究問題的概念示意 · 非歷史平面圖</small></div><div class="case-detail"><p class="eyebrow">${c.label}</p><h3>${c.title}</h3><p>${c.intro}</p><p class="case-question">${c.question}</p></div></div><div class="evidence-grid"><div><h4>已知的證據</h4><p>${c.known}</p></div><div><h4>學者的解釋</h4><p>${c.interpretation}</p></div><div><h4>保留的問題</h4><p>${c.open}</p></div></div><div class="case-links"><span>延伸閱讀</span>${c.links.map(readingLink).join('')}</div>`;
  }
  function setupTabs(selector, render) {
    const buttons=$$(selector);
    buttons.forEach((b,i)=>b.addEventListener('keydown',e=>{
      let next;
      if(e.key==='ArrowRight')next=(i+1)%buttons.length;
      if(e.key==='ArrowLeft')next=(i-1+buttons.length)%buttons.length;
      if(e.key==='Home')next=0;if(e.key==='End')next=buttons.length-1;
      if(next!==undefined){e.preventDefault();buttons[next].focus();render(buttons[next],next);}
    }));
  }
  $$('[data-case]').forEach(b=>b.addEventListener('click',()=>renderCase(b.dataset.case)));
  $$('[data-select-case]').forEach(a=>a.addEventListener('click',()=>renderCase(a.dataset.selectCase)));
  setupTabs('[data-case]',b=>renderCase(b.dataset.case));renderCase('sanmarco');
  $('.timeline-buttons').innerHTML=MEDICI.timeline.map((t,i)=>`<button id="event-${i}" role="tab" aria-selected="${i===0}" aria-controls="timeline-panel" tabindex="${i===0?0:-1}" data-event="${i}" aria-label="${t.year} 年：${t.title}">${t.year}</button>`).join('');
  function renderEvent(i) {
    const t=MEDICI.timeline[i];
    $$('[data-event]').forEach(b=>{const active=+b.dataset.event===i;b.setAttribute('aria-selected',active);b.tabIndex=active?0:-1;});
    $('#timeline-panel').setAttribute('aria-labelledby','event-'+i);
    $('#timeline-panel').innerHTML=`<span class="event-year">${t.year}</span><div class="event-copy"><h3>${t.title}</h3><p>${t.text}</p><small>${t.note}</small></div>`;
  }
  $$('[data-event]').forEach(b=>b.addEventListener('click',()=>renderEvent(+b.dataset.event)));
  setupTabs('[data-event]',(_,i)=>renderEvent(i));renderEvent(0);
  function renderReadings() {
    const query=$('#reading-search').value.trim().toLocaleLowerCase();
    const list=MEDICI.readings.filter(r=>(filter==='all'||r.tags.includes(filter))&&(!onlySaved||saved.has(r.id))&&[r.title,r.original,r.author,r.blurb,r.question,r.clue,r.boundary,r.year].join(' ').toLocaleLowerCase().includes(query));
    $('#saved-count').textContent=saved.size;
    $('#reading-count').textContent=`${onlySaved?'我的收藏':'文獻閱讀室'} · 顯示 ${list.length} / ${MEDICI.readings.length} 份手札${filter!=='all'?' · '+MEDICI.categories[filter]:''}`;
    $('#empty-state').hidden=list.length!==0;
    $('#reading-grid').innerHTML=list.map(r=>`<article class="reading-card"><div class="card-top"><span class="card-type">${escape(MEDICI.categories[r.tags[0]])} / ${escape(r.type)}</span><button class="save-note" data-save="${r.id}" aria-pressed="${saved.has(r.id)}" aria-label="${saved.has(r.id)?'取消收藏':'收藏'}：${escape(r.title)}">${saved.has(r.id)?'♥':'♡'}</button></div><p class="card-author">${escape(r.author)}</p><h3>${escape(r.title)}</h3><p>${escape(r.blurb)}</p><div class="card-bottom"><span>${escape(r.year)} / ${escape(r.type)}</span><button data-open-note="${r.id}" aria-label="打開手札：${escape(r.title)}">打開手札 ↗</button></div></article>`).join('');
  }
  function toggleSave(id) {
    if(!byId(id))return;
    saved.has(id)?saved.delete(id):saved.add(id);
    writeLocal('sona-medici-notes-v1',[...saved]);renderReadings();
    if(activeNote===id&&$('#note-dialog').open)renderNote(id);
    toast((saved.has(id)?'已加入收藏':'已取消收藏')+(storageOK?'':' · 此瀏覽器無法永久儲存，收藏僅保留於本次頁面'));
  }
  function renderNote(id) {
    const r=byId(id);if(!r)return;
    $('#note-content').innerHTML=`<p class="eyebrow">SONA / READING NOTE / ${escape(r.year)}</p><h2 class="note-title" id="note-title" tabindex="-1">${escape(r.title)}</h2><p class="note-english">${escape(r.original)}</p><p class="note-meta">${escape(r.author)} · ${escape(r.type)} · ${r.tags.map(t=>escape(MEDICI.categories[t])).join(' / ')}</p><div class="note-sections"><div class="note-section"><h3>從這個問題開始</h3><p>${escape(r.question)}</p></div><div class="note-section"><h3>閱讀時，留意這些線索</h3><p>${escape(r.clue)}</p></div><div class="note-section"><h3>保留證據的界線</h3><p>${escape(r.boundary)}</p></div></div><p class="note-citation">${escape(r.citation)}</p><div class="note-actions"><a class="button green" href="${escape(r.url)}" target="_blank" rel="noopener noreferrer">${escape(r.access)} <span>↗</span></a><button class="underlink save-text" data-save="${id}" aria-pressed="${saved.has(id)}">${saved.has(id)?'♥ 已收藏 · 取消':'♡ 加入我的收藏'}</button></div>`;
  }
  function openDialog(dialog) { returnFocus=document.activeElement;dialog.showModal();document.body.classList.add('modal-open'); }
  function openNote(id) {if(!byId(id))return;activeNote=id;renderNote(id);openDialog($('#note-dialog'));$('#note-title').focus();}
  document.addEventListener('click',e=>{
    const note=e.target.closest('[data-open-note]');if(note){e.preventDefault();openNote(note.dataset.openNote);return;}
    const save=e.target.closest('[data-save]');if(save){e.preventDefault();const id=save.dataset.save;const wasModal=$('#note-dialog').open;toggleSave(id);const replacement=wasModal?$('#note-content [data-save]'):$(`[data-save="${id}"]`);if(replacement)replacement.focus({preventScroll:true});return;}
    const close=e.target.closest('[data-close]');if(close)document.getElementById(close.dataset.close).close();
  });
  $$('dialog').forEach(dialog=>{
    dialog.addEventListener('click',e=>{if(e.target===dialog){const b=dialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)dialog.close();}});
    dialog.addEventListener('close',()=>{document.body.classList.toggle('modal-open',$$('dialog[open]').length>0);activeNote=null;const focusTarget=returnFocus?.isConnected?returnFocus:$('#reading-search');focusTarget?.focus({preventScroll:true});});
  });
  $('#reading-search').addEventListener('input',renderReadings);
  $$('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;$$('[data-filter]').forEach(f=>f.setAttribute('aria-pressed',f===b));renderReadings();}));
  $('#saved-toggle').addEventListener('click',()=>{onlySaved=!onlySaved;$('#saved-toggle').setAttribute('aria-pressed',onlySaved);renderReadings();});
  $('#reset-search').addEventListener('click',()=>{filter='all';onlySaved=false;$('#reading-search').value='';$('#saved-toggle').setAttribute('aria-pressed','false');$$('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.filter==='all'));renderReadings();$('#reading-search').focus();});
  const menu=$('.menu');
  function closeMenu(){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','開啟導覽');$('#nav').classList.remove('open');}
  menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',open);menu.setAttribute('aria-label',open?'關閉導覽':'開啟導覽');$('#nav').classList.toggle('open',open);});
  $$('#nav a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
  let answers=[],questionIndex=0,answered=false;
  const quizVersion='medici-100-20261020';
  function savedQuiz(){
    const saved=readLocal('sona-medici-progress-v2',null);
    return saved?.version===quizVersion&&Array.isArray(saved.answers)&&saved.answers.length>0&&saved.answers.length<=MEDICI.questions.length&&saved.answers.every(a=>Number.isInteger(a)&&a>=0&&a<4)?saved.answers:null;
  }
  function saveQuiz(){writeLocal('sona-medici-progress-v2',{version:quizVersion,answers:[...answers]});}
  function renderBest(){ $('#workshop-best').textContent=best===null?'100 題自測，可暫停後繼續。':`本瀏覽器最佳紀錄：${best} / ${MEDICI.questions.length} 題`; }
  function quizIntro(){
    const saved=savedQuiz(),total=MEDICI.questions.length;
    $('#quiz-content').innerHTML=`<div class="quiz-intro"><p class="eyebrow">RESEARCH & LITERATURE / ${total} QUESTIONS</p><div class="quiz-number">${total}.</div><h2 id="quiz-title" tabindex="-1">把理解，變成自己的答案。</h2><p>${total} 題四選一，涵蓋研究計畫、案例與文獻。<br>每題附解析和來源；關閉或重新整理後可繼續。</p>${saved?`<p class="quiz-saved">上次已作答 ${saved.length} / ${total} 題。</p><button class="button green" data-quiz-resume>${saved.length===total?'查看上次結果':`繼續第 ${saved.length+1} 題`} <span>→</span></button><button class="underlink quiz-restart" data-quiz-start>重新開始 100 題 ↻</button>`:`<button class="button green" data-quiz-start>開始 100 題 <span>→</span></button>`}<small>另有下方「教授口試選擇題」100 題。兩組共 200 題四選一。</small></div>`;
  }
  $('#start-workshop').addEventListener('click',()=>{quizIntro();openDialog($('#quiz-dialog'));$('#quiz-title').focus();});
  function quizStart(){answers=[];questionIndex=0;saveQuiz();renderQuestion();}
  function resumeQuiz(){answers=savedQuiz()||[];questionIndex=answers.length;questionIndex===MEDICI.questions.length?quizResult():renderQuestion();}
  function renderQuestion(){
    answered=false;const q=MEDICI.questions[questionIndex];
    $('#quiz-content').innerHTML=`<div class="quiz-question"><div class="quiz-progress"><span>問題 ${questionIndex+1} / ${MEDICI.questions.length}</span><span>已答對 ${answers.filter((a,i)=>a===MEDICI.questions[i].correct).length} 題</span></div><p class="eyebrow">${escape(q.topic)}</p><h2 id="quiz-title" tabindex="-1">${escape(q.question)}</h2><div class="quiz-answers">${q.answers.map((a,i)=>`<button data-answer="${i}"><b aria-hidden="true">${'ABCD'[i]}</b><span>${escape(a)}</span></button>`).join('')}</div><div id="quiz-feedback" aria-live="polite"></div><div class="quiz-next"></div><p class="quiz-autosave">已自動儲存作答進度，可隨時關閉後繼續。</p></div>`;
    $('#quiz-dialog').scrollTop=0;$('#quiz-title').focus();
  }
  function answerQuestion(choice){
    if(answered)return;answered=true;answers[questionIndex]=choice;saveQuiz();const q=MEDICI.questions[questionIndex];
    document.dispatchEvent(new CustomEvent('sona-mcq-answer',{detail:{id:q.id,choice}}));
    $$('[data-answer]').forEach(b=>{const i=+b.dataset.answer;b.disabled=true;if(i===q.correct)b.classList.add('correct');if(i===choice&&i!==q.correct)b.classList.add('wrong');});
    $('.quiz-progress span:last-child').textContent=`已答對 ${answers.filter((a,i)=>a===MEDICI.questions[i].correct).length} 題`;
    $('#quiz-feedback').className='quiz-feedback';$('#quiz-feedback').innerHTML=`<strong>${choice===q.correct?'答對了，繼續累積理解。':`再看一次。合適的答案是 ${'ABCD'[q.correct]}。`}</strong><p>${escape(q.explain)}</p><small>整理依據：${escape(q.sourceNote)}</small>`;
    $('.quiz-next').innerHTML=`<button class="button green" data-quiz-next>${questionIndex===MEDICI.questions.length-1?'查看回顧':'繼續下一題'} <span>→</span></button>`;
    $('[data-quiz-next]').focus();
    if(!storageOK)$('.quiz-autosave').textContent='此瀏覽器無法永久儲存，關閉頁面前請完成本輪。';
  }
  function quizResult(){
    const score=answers.filter((a,i)=>a===MEDICI.questions[i].correct).length;best=Math.max(best??0,score);writeLocal('sona-medici-best-v2',best);renderBest();
    const wrong=MEDICI.questions.map((q,i)=>({...q,index:i})).filter(q=>answers[q.index]!==q.correct);
    $('#quiz-content').innerHTML=`<div class="quiz-result"><p class="eyebrow">READING IS AN ONGOING CONVERSATION</p><div class="quiz-number">${score}<span style="font-size:32px"> / ${MEDICI.questions.length}</span></div><h2 id="quiz-title" tabindex="-1">${score===MEDICI.questions.length?'100 題，全數答對。':'每個疑問，都是下一次閱讀的起點。'}</h2><p>已完成 ${MEDICI.questions.length} 題研究與文獻自測。${wrong.length?`以下 ${wrong.length} 題值得再讀一次。`:'繼續練習教授口試提問，試著用自己的話說明。'}</p><div class="result-actions"><button class="button green" data-quiz-retry>重新開始 100 題 ↻</button><button class="button outline" data-quiz-bank>查看 100 題解析總覽 ↗</button><button class="button outline" data-quiz-oral>前往教授口試 100 題 ↗</button></div>${wrong.length?`<div class="quiz-review">${wrong.map(q=>`<article><h3>${q.index+1}. ${escape(q.question)}</h3><p>你的選擇：${escape(q.answers[answers[q.index]])}<br>合適答案：${escape(q.answers[q.correct])}</p><p>${escape(q.explain)}</p><p class="review-source">${escape(q.sourceNote)}</p></article>`).join('')}</div>`:''}<p class="result-credit">SONA / 美第奇研究手札</p></div>`;
    $('#quiz-dialog').scrollTop=0;$('#quiz-title').focus();
    if(!storageOK)toast('成績已結算；此瀏覽器無法永久儲存紀錄。');
  }
  $('#quiz-content').addEventListener('click',e=>{
    if(e.target.closest('[data-quiz-start],[data-quiz-retry]'))quizStart();
    if(e.target.closest('[data-quiz-resume]'))resumeQuiz();
    const answer=e.target.closest('[data-answer]');if(answer)answerQuestion(+answer.dataset.answer);
    if(e.target.closest('[data-quiz-next]')){questionIndex++;questionIndex<MEDICI.questions.length?renderQuestion():quizResult();}
    const destination=e.target.closest('[data-quiz-bank]')?'study-bank':e.target.closest('[data-quiz-oral]')?'oral-bank':null;
    if(destination){$('#quiz-dialog').close();document.getElementById(destination).scrollIntoView();$('[data-bank-search]',document.getElementById(destination)).focus({preventScroll:true});}
  });
  renderReadings();renderBest();
})();
