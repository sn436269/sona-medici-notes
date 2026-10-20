'use strict';
(() => {
  const $ = (selector,root=document)=>root.querySelector(selector);
  const $$ = (selector,root=document)=>[...root.querySelectorAll(selector)];
  const esc = value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const titles={study:'研究計畫與文獻熟悉',oral:'教授口試模擬提問'};
  const normalized = value=>String(value).normalize('NFKC').toLowerCase().replace(/[’‘']/g,'').replace(/科西莫|柯西默|柯西莫/g,'cosimo').replace(/羅倫佐|洛倫佐|倫倫佐/g,'lorenzo').replace(/波提切利|波堤切利|坡堤切利/g,'botticelli');
  let durable=true;
  function getProgress(){try{const value=JSON.parse(localStorage.getItem('sona-medici-mastery-v1')||'[]');return new Set(Array.isArray(value)?value.filter(id=>allIds.has(id)):[]);}catch{durable=false;return new Set();}}
  const allIds=new Set(Object.values(QUESTION_BANKS).flat().map(q=>q.id));
  let mastered=getProgress();
  const state={study:{category:'all',query:'',pending:false,page:1,size:10},oral:{category:'all',query:'',pending:false,page:1,size:10}};
  function notify(message){const status=$('#bank-status');status.textContent=message;clearTimeout(notify.timer);notify.timer=setTimeout(()=>{status.textContent='';},4000);}
  function persist(){try{localStorage.setItem('sona-medici-mastery-v1',JSON.stringify([...mastered]));}catch{durable=false;}}
  function matches(bank){const s=state[bank],query=normalized(s.query.trim());return QUESTION_BANKS[bank].filter(q=>(s.category==='all'||q.category===s.category)&&(!s.pending||!mastered.has(q.id))&&(!query||normalized([q.question,q.category,q.answer,q.intent,q.followUp,q.sourceNote,...q.points].join(' ')).includes(query)));}
  function sources(q){const links=q.sourceIds.map(id=>{const r=MEDICI.readings.find(r=>r.id===id);return r?`<a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${esc(r.author)}（${esc(r.year)}）↗</a>`:id==='plan'?'<span>SONA 研究計畫</span>':id==='guide'?'<span>10/20 口試閱讀指南</span>':'';}).filter(Boolean);return `<div class="bank-sources"><p>${esc(q.sourceNote)}</p>${links.length?`<div>${links.join('')}</div>`:''}</div>`;}
  function answerContent(q){return `${q.answers?`<ol class="reference-options" type="A">${q.answers.map((a,i)=>`<li${i===q.correct?' class="reference-correct"':''}>${esc(a)}${i===q.correct?' <b>✓ 合適答案</b>':''}</li>`).join('')}</ol>`:''}${q.intent?`<div class="bank-intent"><b>教授想確認</b><p>${esc(q.intent)}</p></div>`:''}<h4>${q.id.startsWith('oral')?'參考答法':'理解與解析'}</h4><p>${esc(q.answer)}</p><h4>回答時抓住三個重點</h4><ol>${q.points.map(point=>`<li>${esc(point)}</li>`).join('')}</ol>${q.followUp?`<div class="bank-follow"><b>再追問一步</b><p>${esc(q.followUp)}</p></div>`:''}${sources(q)}`;}
  function markLabel(q){return mastered.has(q.id)?'✓ 已熟悉 · 改為待加強':'＋ 標記為已熟悉';}
  function render(bank){
    const root=$(`[data-question-bank="${bank}"]`),s=state[bank],list=matches(bank);
    const openIds=new Set($$('details[open]',root).map(d=>d.dataset.question));
    const pageCount=Math.max(1,Math.ceil(list.length/s.size));s.page=Math.min(s.page,pageCount);
    const start=(s.page-1)*s.size,page=list.slice(start,start+s.size),count=QUESTION_BANKS[bank].filter(q=>mastered.has(q.id)).length;
    $('[data-bank-progress]',root).textContent=`已熟悉 ${count} / ${QUESTION_BANKS[bank].length}`;
    $('[data-bank-meter]',root).value=count;
    $('[data-bank-count]',root).textContent=`符合 ${list.length} 題 / 共 ${QUESTION_BANKS[bank].length} 題${page.length?` · 本頁 ${start+1}–${start+page.length}`:''}`;
    $('[data-bank-list]',root).innerHTML=page.length?page.map(q=>`<details class="bank-question" data-question="${q.id}"${openIds.has(q.id)?' open':''}><summary><span class="question-serial">${q.id.split('-')[1]}</span><div><span class="question-meta">${esc(q.category)} <i>·</i> ${esc(q.level)}${mastered.has(q.id)?' <b>已熟悉</b>':''}</span><h3>${esc(q.question)}</h3></div><span class="question-plus" aria-hidden="true">＋</span></summary><div class="bank-answer">${answerContent(q)}<button class="mastery-button" data-mark-question="${q.id}" aria-pressed="${mastered.has(q.id)}">${markLabel(q)}</button></div></details>`).join(''):'<div class="bank-empty"><h3>沒有符合的題目。</h3><p>請更換關鍵字或分類，或顯示全部題目。</p><button class="button outline" data-bank-reset>顯示全部題目</button></div>';
    $('[data-page-label]',root).textContent=`${s.page} / ${pageCount}`;
    $('[data-page-prev]',root).disabled=s.page===1;
    $('[data-page-next]',root).disabled=s.page===pageCount;
    $('[data-bank-draw]',root).disabled=list.length===0;
  }
  $$('[data-question-bank]').forEach(root=>{
    const bank=root.dataset.questionBank,categories=[...new Set(QUESTION_BANKS[bank].map(q=>q.category))];
    $('[data-bank-category]',root).innerHTML='<option value="all">全部分類 · 100 題</option>'+categories.map(category=>`<option value="${esc(category)}">${esc(category)} · ${QUESTION_BANKS[bank].filter(q=>q.category===category).length} 題</option>`).join('');
    $('[data-bank-search]',root).addEventListener('input',e=>{state[bank].query=e.target.value;state[bank].page=1;render(bank);});
    $('[data-bank-category]',root).addEventListener('change',e=>{state[bank].category=e.target.value;state[bank].page=1;render(bank);});
    $('[data-bank-pending]',root).addEventListener('change',e=>{state[bank].pending=e.target.checked;state[bank].page=1;render(bank);});
    $('[data-page-size]',root).addEventListener('change',e=>{state[bank].size=+e.target.value;state[bank].page=1;render(bank);});
    root.addEventListener('click',e=>{
      const mark=e.target.closest('[data-mark-question]');if(mark){toggle(mark.dataset.markQuestion);render(bank);const next=$(`[data-mark-question="${mark.dataset.markQuestion}"]`,root);(next||$('[data-bank-count]',root)).focus({preventScroll:true});}
      if(e.target.closest('[data-bank-reset]')){state[bank]={category:'all',query:'',pending:false,page:1,size:10};$('[data-bank-search]',root).value='';$('[data-bank-category]',root).value='all';$('[data-bank-pending]',root).checked=false;$('[data-page-size]',root).value='10';render(bank);$('[data-bank-search]',root).focus();}
      if(e.target.closest('[data-page-prev],[data-page-next]')){state[bank].page+=e.target.closest('[data-page-prev]')?-1:1;render(bank);$('[data-bank-count]',root).scrollIntoView({block:'start'});$('[data-bank-count]',root).focus({preventScroll:true});}
      if(e.target.closest('[data-bank-draw]'))startPractice(bank);
    });render(bank);
  });
  function toggle(id){mastered.has(id)?mastered.delete(id):mastered.add(id);persist();notify((mastered.has(id)?'已標記為熟悉':'已放回待加強')+(durable?'':'；此瀏覽器無法永久儲存，僅保留本次頁面紀錄。'));}
  const dialog=$('#bank-dialog');let deck=[],index=0,practiceBank='study',focusBack=null,revealed=false;
  function shuffle(items){const output=[...items];for(let i=output.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[output[i],output[j]]=[output[j],output[i]];}return output;}
  function startPractice(bank){
    const eligible=matches(bank);if(!eligible.length)return;
    practiceBank=bank;const size=bank==='oral'?5:10;deck=shuffle(eligible).slice(0,size);index=0;focusBack=document.activeElement;
    $('#bank-dialog-label').textContent=`SONA / ${titles[bank]}`;renderPractice();dialog.showModal();document.body.classList.add('modal-open');$('#bank-practice-title').focus();
  }
  function renderPractice(){
    revealed=false;const q=deck[index];
    $('#bank-practice').innerHTML=`<div class="practice-top"><span>${practiceBank==='oral'?'口試模擬':'自我測驗'} · 第 ${index+1} / ${deck.length} 題</span><span>${esc(q.category)}</span></div><p class="eyebrow">${q.id.startsWith('oral')?'SPEAK FIRST, THEN REVIEW':'RECALL BEFORE READING'}</p><h2 id="bank-practice-title" tabindex="-1">${esc(q.question)}</h2><p class="practice-instruction">${practiceBank==='oral'?'先試著口頭回答 1–2 分鐘，再打開答題思路。':'先用自己的話回答，再看解析，誠實檢查熟悉程度。'}</p><button class="button green" data-reveal-answer>${practiceBank==='oral'?'查看答題思路':'查看參考解析'} <span>↓</span></button><div id="practice-answer" hidden class="bank-answer">${answerContent(q)}<div class="practice-decisions"><button class="button green" data-practice-assess="yes">我已熟悉 →</button><button class="button outline" data-practice-assess="no">還要再練 →</button></div></div><button class="practice-skip" data-practice-skip>先跳過這題 →</button>`;
    dialog.scrollTop=0;if(dialog.open)$('#bank-practice-title').focus();
  }
  function nextPractice(){index++;if(index<deck.length)renderPractice();else renderSummary();}
  function renderSummary(){
    const learned=deck.filter(q=>mastered.has(q.id)).length,pending=deck.filter(q=>!mastered.has(q.id));
    $('#bank-practice').innerHTML=`<div class="bank-practice-result"><p class="eyebrow">ANOTHER PAGE IN YOUR RESEARCH NOTEBOOK</p><div class="quiz-number">${learned}<span> / ${deck.length}</span></div><h2 id="bank-practice-title" tabindex="-1">這一組，練習完成。</h2><p>這是你自評的熟悉程度。${pending.length?`有 ${pending.length} 題值得再複習。`:'這一組已全部標記熟悉，試試別的分類。'}</p>${pending.length?`<ul>${pending.map(q=>`<li>${esc(q.question)}</li>`).join('')}</ul>`:''}<div class="result-actions">${pending.length?'<button class="button green" data-repeat-pending>重練這組未熟題 ↻</button>':''}<button class="button outline" data-close="bank-dialog">回到題庫</button></div><p class="result-credit">SONA / 研究計畫與口試練習</p></div>`;
    dialog.scrollTop=0;$('#bank-practice-title').focus();render(practiceBank);
  }
  $('#bank-practice').addEventListener('click',e=>{
    if(e.target.closest('[data-reveal-answer]')){revealed=true;$('#practice-answer').hidden=false;$('[data-reveal-answer]').hidden=true;$('[data-practice-assess="yes"]').focus();}
    const assess=e.target.closest('[data-practice-assess]');if(assess&&revealed){const q=deck[index];assess.dataset.practiceAssess==='yes'?mastered.add(q.id):mastered.delete(q.id);persist();render(practiceBank);if(!durable)notify('此瀏覽器無法永久儲存，練習僅保留本次頁面紀錄。');nextPractice();}
    if(e.target.closest('[data-practice-skip]'))nextPractice();
    if(e.target.closest('[data-repeat-pending]')){deck=deck.filter(q=>!mastered.has(q.id));index=0;renderPractice();}
  });
  dialog.addEventListener('close',()=>{document.body.classList.toggle('modal-open',$$('dialog[open]').length>0);focusBack?.isConnected&&focusBack.focus({preventScroll:true});render(practiceBank);});
})();
