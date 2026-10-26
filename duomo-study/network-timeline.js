'use strict';
for(const [key,source]of Object.entries(window.NETWORK_ARCHIVE.sources))window.FAMILY_ARCHIVE.sources['net-'+key]=source;
const networkEvents=[
['cosimo-opera',1436,'1435/36・檔案節點','cosimo','art','大教堂工程行政與科西莫','佛羅倫斯・Opera del Duomo','研究引述大教堂檔案中1418及1435/36年的相關記錄，提示其介入公共工程不只始於1434年歸來。尚未核定所讀句子指何項專案或任期；不要編成統管全城的固定「建築委員會」。',['cosimoOpera','opera']],
['tolfa',1461,'1460–1461前後','magnifico','context','托爾法明礬與教廷收益','教廷領地・托爾法','Giovanni di Castro的發現年有異說，但1461年已見開採合約。明礬用於紡織染色；當時羅倫佐尚年幼，並非他發現礦藏。',['castro']],
['medici-alum',1466,'1466','magnifico','context','美第奇加入托爾法明礬合作','羅馬／托爾法','家族商業加入明礬開採與貿易合作。此時美第奇家主是皮耶羅「痛風者」；不要把所有家族銀行業務都寫成少年羅倫佐獨立主持。',['castro']],
['volterra-alum',1472,'1472/6/18','magnifico','crisis','明礬戰爭：沃爾泰拉投降與劫掠','沃爾泰拉','採礦特許、地方派系與佛羅倫斯領土權力衝突，引發羅倫佐支持的軍事干預。費德里科・達・蒙特費爾特羅率軍，圍城後地方投降並遭嚴重劫掠。明礬利益重要，但不是唯一原因。',['volterra','alumStudy']],
['imola-pazzi',1473,'1473','magnifico','politics','伊莫拉交易：美第奇拒貸，帕齊融資','伊莫拉／米蘭／羅馬','西斯篤四世希望為姪子里亞里奧取得伊莫拉。羅倫佐拒由美第奇銀行墊付約4萬杜卡特，帕齊提供主要融資；銀行競爭、領土與教宗親族利益相接。',['lorenzo']],
['vitelli-siege',1474,'1474・6月下旬至夏季','magnifico','crisis','維泰利危機：佛羅倫斯支援卡斯泰洛城','卡斯泰洛城／翁布里亞','西斯篤四世派樞機朱利亞諾・德拉・羅韋雷（後來的儒略二世）恢復教廷統治。佛羅倫斯與米蘭支援維泰利；羅倫佐關注邊境安全。與1472沃爾泰拉、1473伊莫拉是不同事件。',['vitelli','lorenzo']],
['vitelli-settlement',1474,'1474/8/28–9/1','magnifico','politics','費德里科調停，維泰利議和離城','卡斯泰洛城 → 羅馬','8/28費德里科到場斡旋，9/1維泰利離城，赴羅馬談投降及財產安排，後在佛羅倫斯領地流亡。1474不是他獲勝回城的年份。',['vitelli']],
['papal-bank-loss',1474,'1474・危機期間至年底','magnifico','politics','美第奇失去教廷存款官職','羅馬／佛羅倫斯','佛羅倫斯支持維泰利激怒西斯篤四世，羅倫佐與朱利亞諾失去教廷存款官職。帕齊承接教廷業務，是金融與聯盟的一環，不等於帕齊指揮圍城。',['lorenzo','bank1474']],
['league-1474',1474,'1474/11','magnifico','politics','佛羅倫斯、米蘭、威尼斯的新聯盟','佛羅倫斯／米蘭／威尼斯','拿坡里費蘭特不願為援助維泰利而與教宗作戰，舊聯盟出現裂縫；佛羅倫斯改與米蘭、威尼斯締盟。',['lorenzo']],
['petrucci-palace',1478,'1478/4/26','magnifico','crisis','帕齊政變的另一現場：佩特魯奇抵抗奪宮','佛羅倫斯・執政宮','大教堂刺殺同日，薩爾維亞蒂一行試圖奪取執政宮。正義旗手Cesare Petrucci察覺異常並組織抵抗；不可與拿坡里的Antonello或錫耶納的Pandolfo混為一人。',['cesare','salviatiDbi']],
['vitelli-return',1482,'1482・6–7月','magnifico','politics','八年後：維泰利重新控制卡斯泰洛城','卡斯泰洛城','佛羅倫斯支援維泰利回城。此後仍有再戰、議和及離城；不要把1482的復歸誤寫成1474圍城的結局。',['vitelli','vitelliCity']],
['pisa-succession',1475,'1474–1475','magnifico','politics','菲利波死後，比薩總主教任命引爭議','比薩／佛羅倫斯／羅馬','菲利波・德・美第奇1474年去世。薩爾維亞蒂獲任命，但因羅倫佐反對，至1475年底才得以接掌；他後來參與帕齊陰謀。',['pisa']],
['sistine-four',1481,'1481–1482','shared','art','西斯汀牆面：四位主要畫家合作','羅馬・西斯汀禮拜堂','羅塞利、波提切利、基爾蘭達約、佩魯吉諾與助手共同工作。羅倫佐促成和解後佛羅倫斯畫家參與；佩魯吉諾已先在羅馬工作。教廷委託、藝術外交與私人出資需分開辨認。',['vatican','peace']]
];
for(const [id,year,date,person,kind,title,place,text,sources]of networkEvents)if(!window.FAMILY_ARCHIVE.events.some(e=>e.id===id))window.FAMILY_ARCHIVE.events.push({id,year,date,person,kind,title,place,text,sources:sources.map(k=>'net-'+k),order:window.FAMILY_ARCHIVE.events.length});
