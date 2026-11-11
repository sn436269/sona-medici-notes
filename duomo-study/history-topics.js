'use strict';

const historyTopics = window.HISTORY_TOPICS;
let topicSelection = null;
let topicGraphMode = 0;

function renderHistoryTopicsNav(active) {
  return `<nav class="history-topic-nav" aria-label="世界史專題">
    <a href="#history" ${!active ? 'aria-current="page"' : ''}>原圖文講義</a>
    ${Object.entries(historyTopics).map(([id, topic]) =>
      `<a href="#history?topic=${id}" ${id === active ? 'aria-current="page"' : ''}>${esc(topic.title)}</a>`
    ).join('')}
  </nav>`;
}

function historyTopicFromHash() {
  const query = new URLSearchParams(location.hash.split('?')[1]);
  const id = query.get('topic');
  return Object.hasOwn(historyTopics, id) ? id : null;
}

function topicText(value) {
  return esc(value).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

function renderTopicParagraph(value) {
  if (value.startsWith('### ')) return `<h4>${topicText(value.slice(4))}</h4>`;
  return `<p>${topicText(value).replace(/\n/g, '<br>')}</p>`;
}

function renderTopicSections(sections) {
  return `<div class="history-topic-reading">${sections.map(([title, body]) =>
    `<details><summary>${topicText(title)}</summary><div class="history-topic-body">${body.map(renderTopicParagraph).join('')}</div></details>`
  ).join('')}</div>`;
}

function renderTopicNode(nodes, id) {
  const node = nodes[id];
  return `<button type="button" data-topic-node="${id}" aria-pressed="false" title="${esc(node.detail)}">
    <strong>${esc(node.name)}</strong><small>${esc(node.date)}</small>
  </button>`;
}

function renderTopicEdges(topic, mode) {
  const nodes = Object.fromEntries(topic.nodes.map(node => [node.id, node]));
  const group = (ids) => ids.split('+').map(id => renderTopicNode(nodes, id)).join('');
  return topic.graphs[mode][1].map(([left, label, right]) =>
    `<div class="history-topic-edge"><div>${group(left)}</div>
      <span><span aria-hidden="true">↓</span> ${esc(label)}</span><div>${group(right)}</div></div>`
  ).join('');
}

function renderTopicTree(topic, tree) {
  const nodes = Object.fromEntries(topic.nodes.map(node => [node.id, node]));
  function branch([ids, label, children]) {
    return `<li>${label ? `<span class="history-tree-label">${esc(label)}</span>` : ''}
      <div class="history-tree-nodes">${ids.split('+').map(id => renderTopicNode(nodes, id)).join('')}</div>
      ${children?.length ? `<ul>${children.map(branch).join('')}</ul>` : ''}</li>`;
  }
  return `<ul class="history-topic-tree">${tree.map(branch).join('')}</ul>`;
}

function topicBranch(ids, label, ...children) {
  return [ids, label, children];
}

const xuanzongBranch = topicBranch('xuan', '睿宗之子',
  topicBranch('shou', '與武惠妃之子'),
  topicBranch('su', '與楊氏之子'));
const gaozongBranch = topicBranch('gao-zong+wu', '高宗與武后',
  topicBranch('zhong', '高宗與武后之子', topicBranch('anle', '與韋后之女'), topicBranch('chongmao', '中宗之子')),
  topicBranch('rui', '高宗與武后之子', xuanzongBranch),
  topicBranch('taiping', '高宗與武后之女'));
const churchBranches = topicBranch('rome', '傳入羅馬帝國',
  topicBranch('church-east', '5 世紀東敘利亞傳統'),
  topicBranch('oriental', '451 年迦克墩公會議之後'),
  topicBranch('schism', '1054 年為分裂標誌',
    topicBranch('catholic', '西方拉丁傳統', topicBranch('reform', '1517 年起', topicBranch('protestant', '多個宗派'))),
    topicBranch('orthodox', '東方拜占庭傳統')));

const topicTrees = {
  tang: [topicBranch('gao-zu', '', topicBranch('tai-zong', '高祖之子', gaozongBranch))],
  religion: [topicBranch('israel', '',
    topicBranch('judaism', '延續至今'),
    topicBranch('jesus', '公元 1 世紀猶太社會', topicBranch('apostles', '早期信徒與宣教', churchBranches)))]
};

function renderTopicGraph(id, topic) {
  return `<section class="history-topic-panel" aria-labelledby="topic-graph-heading">
    <h2 id="topic-graph-heading">${id === 'tang' ? '唐代皇室關係圖' : '宗教演變與經典關係圖'}</h2>
    <p>選一種關係，再點卡片看人物或分支解說。</p>
    <div class="history-topic-controls" role="group" aria-label="切換關係圖">
      ${topic.graphs.map(([label], i) => `<button type="button" data-topic-mode="${i}" aria-pressed="${i === 0}">${esc(label)}</button>`).join('')}
    </div>
    <div class="history-topic-selection" id="history-topic-selection" aria-live="polite">
      <p>點任一卡片查看解說。</p>
    </div>
    <div class="history-topic-diagram">
      <div id="history-topic-diagram-body">${renderTopicTree(topic, topicTrees[id])}</div>
      ${id === 'religion' ? `<aside id="history-scriptures"><h3>《塔納赫》與《聖經》</h3>${renderTopicEdges(topic, 1)}</aside>` : ''}
    </div>
  </section>`;
}

function renderTopicTimeline(topic) {
  return `<details class="history-topic-panel"><summary>歷史時間線（${topic.timeline.length} 個節點）</summary>
    <ol class="history-topic-timeline">${topic.timeline.map(([date, event, detail]) =>
      `<li><span>${esc(date)}</span><div><strong>${esc(event)}</strong>${detail ? `<small>${esc(detail)}</small>` : ''}</div></li>`
    ).join('')}</ol>
  </details>`;
}

function renderTopicComparison(topic) {
  if (!topic.comparison) return '';
  const [head, ...rows] = topic.comparison;
  return `<details class="history-topic-panel"><summary>天主教、東正教與基督新教對照</summary>
    <div class="history-topic-table-wrap" role="region" tabindex="0" aria-label="教會傳統比較">
      <table class="history-topic-table"><thead><tr>${head.map(label => `<th scope="col">${esc(label)}</th>`).join('')}</tr></thead>
      <tbody>${rows.map(([label, ...values]) => `<tr><th scope="row">${esc(label)}</th>${values.map(value => `<td>${esc(value)}</td>`).join('')}</tr>`).join('')}</tbody></table>
    </div>
  </details>`;
}

function renderTopicArt(topic) {
  if (!topic.art?.length) return '';
  return `<details class="history-topic-panel history-topic-art" open><summary>專題插圖（點圖放大）</summary>
    <div>${topic.art.map(({src, alt, caption}) => `<figure><a href="${esc(src)}" target="_blank" rel="noopener"><img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async"></a><figcaption>${esc(caption)}</figcaption></figure>`).join('')}</div>
  </details>`;
}

function renderTopicSources(topic) {
  return `<div class="history-topic-panel history-topic-sources"><h2>資料來源</h2>
    ${sourceLinks(topic.sources.map(([label, url]) => ({label, url})))}
  </div>`;
}

function renderHistoryTopic(id) {
  const topic = historyTopics[id];
  topicSelection = null;
  topicGraphMode = 0;
  const top = heading(topic.eyebrow, topic.title, topic.description) + renderHistoryTopicsNav(id);
  if (id === 'dao') {
    return top + `<section class="history-topic-panel history-dao"><blockquote>${esc(topic.quote)}</blockquote>
      <div class="history-dao-cards">${topic.ideas.map(([phrase, title, detail, example]) =>
        `<details><summary><strong>${esc(phrase)}</strong><span>${esc(title)}</span></summary><p>${esc(detail)}</p><p>${esc(example)}</p></details>`
      ).join('')}</div></section>` + renderTopicArt(topic) + renderTopicSources(topic);
  }
  return top + `<article class="history-topic-page" aria-label="${esc(topic.title)}">
    ${renderTopicGraph(id, topic)}
    ${renderTopicArt(topic)}
    ${topic.storyExtra ? `<section class="history-topic-panel"><h2>${esc(topic.storyExtra.title)}</h2>
      <ol class="history-topic-sequence">${topic.sequence.map(([date, label]) => `<li><small>${esc(date)}</small><strong>${esc(label)}</strong></li>`).join('')}</ol>
      ${renderTopicSections(topic.storyExtra.sections)}</section>` : ''}
    ${renderTopicTimeline(topic)}
    <section class="history-topic-panel"><h2>完整歷史解說</h2>${renderTopicSections(topic.story)}</section>
    ${renderTopicComparison(topic)}
    ${topic.places ? `<details class="history-topic-panel"><summary>地理與教會中心</summary>${renderTopicSections(topic.places.map(([name, text]) => [name, [text]]))}</details>` : ''}
    <section class="history-topic-panel"><h2>常見問題</h2>
      <div class="history-topic-reading">${topic.faq.map(([question, body], i) =>
        `<details><summary>${esc(question.replace(/^Q\d+：/, ''))}</summary>
          <div class="history-topic-body">${body.map(renderTopicParagraph).join('')}
          <button type="button" class="text-btn" data-topic-faq="${i}">在關係圖標出相關卡片 ↑</button></div></details>`
      ).join('')}</div>
    </section>
    ${renderTopicSources(topic)}
  </article>`;
}

function updateHistoryTopicSelection(topic, ids) {
  const nodes = Object.fromEntries(topic.nodes.map(node => [node.id, node]));
  const related = new Set(ids);
  for (const [from, , to] of topic.graphs[topicGraphMode][1]) {
    const endpoints = [...from.split('+'), ...to.split('+')];
    if (endpoints.some(id => ids.includes(id))) endpoints.forEach(id => related.add(id));
  }
  topicSelection = {ids, related};
  for (const button of document.querySelectorAll('[data-topic-node]')) {
    button.setAttribute('aria-pressed', ids.includes(button.dataset.topicNode));
    button.classList.toggle('related', related.has(button.dataset.topicNode));
  }
  document.querySelector('#history-topic-selection').innerHTML = ids.map(id => {
    const node = nodes[id];
    return `<section><h3>${esc(node.name)}</h3><p>${esc(node.detail)}</p></section>`;
  }).join('');
}

function setHistoryTopicMode(id, topic, mode) {
  topicGraphMode = mode;
  for (const button of document.querySelectorAll('[data-topic-mode]')) {
    button.setAttribute('aria-pressed', Number(button.dataset.topicMode) === mode);
  }
  const diagram = document.querySelector('#history-topic-diagram-body');
  diagram.innerHTML = mode === 0 ? renderTopicTree(topic, topicTrees[id]) : renderTopicEdges(topic, mode);
  if (topicSelection) updateHistoryTopicSelection(topic, topicSelection.ids);
}

document.addEventListener('click', event => {
  const button = event.target.closest('button');
  const id = historyTopicFromHash();
  if (!button || !id || !historyTopics[id].nodes) return;
  const topic = historyTopics[id];
  const {topicMode, topicNode, topicFaq} = button.dataset;
  if (topicMode !== undefined) setHistoryTopicMode(id, topic, Number(topicMode));
  if (topicNode) updateHistoryTopicSelection(topic, [topicNode]);
  if (topicFaq !== undefined) {
    const ids = topic.faqNodes[Number(topicFaq)];
    const bestMode = id === 'tang' ? [1, 0, 3, 1, 1, 1, 3][Number(topicFaq)] : 0;
    setHistoryTopicMode(id, topic, bestMode);
    updateHistoryTopicSelection(topic, ids);
    document.querySelector('#topic-graph-heading').scrollIntoView({block: 'start'});
  }
});
