/* Curated paraphrases of SONA's reading notes; citations belong to their authors. */
'use strict';
const MEDICI = {
  categories: {space:'空間與建築', patronage:'贊助與聲望', diplomacy:'外交與交流', evidence:'史料與方法'},
  cases: {
    sanmarco: {
      label:'FLORENCE / SAN MARCO / 1436–1444', title:'誰能走進「公共」圖書館？',
      intro:'老科西莫參與聖馬可的重建與藏書安排，但這個故事也屬於尼科利的遺囑執行人、道明會修士和人文學者。從門、走廊到圖書館，空間本身就提示了不同的使用資格。',
      question:'當時的「公共」，向誰開放？又透過什麼制度運作？',
      diagram:[['SPACE','修道院'],['ACCESS','進入資格'],['READING','藏書與閱讀']],
      known:'1436 年的修道院轉交、重建工程與尼科利藏書的移轉，各有不同時間。1441 年的藏書正式移轉，也不能和建築完工視為同一件事。',
      interpretation:'Terry-Fritsch 將動線、圖像與觀看者一起閱讀，提出修道院也是人文學者實際活動、觀看及閱讀的場所。',
      open:'進入者如何理解圖像，是否因此認同美第奇？空間分析提供線索，仍須其他接受史證據，不能直接等同政治效果。',
      links:['terry','ullman','paoletti']
    },
    sistine: {
      label:'ROME / SISTINE CHAPEL / 1481–1482',title:'畫家去了羅馬，誰促成委託？',
      intro:'波提切利、吉蘭達約、佩魯吉諾與羅塞利參與西斯汀側牆壁畫。這是 1481–1482 年的工程，與米開朗基羅 1508–1512 年的天頂畫分屬不同委託。',
      question:'藝術家移動，可以直接稱為羅倫佐送出的「外交禮物」嗎？',
      diagram:[['PATRON','教廷委託'],['NETWORK','藝術家網絡'],['CONTEXT','佛羅倫斯']],
      known:'教廷工程的契約、付款與管理者提供了正式委託的線索。藝術家的個人經歷和既有羅馬聯繫，也需要分別考察。',
      interpretation:'O’Malley 以藝術家的職業網絡重新討論這次合作，對「羅倫佐派出整批畫家作外交贈禮」的慣常敘事提出質疑。',
      open:'新的解釋不等於已排除羅倫佐所有介入。出資者、正式委託人、推薦者與政治受益者，可能不是同一個人。',
      links:['omalley','horne','kent']
    },
    gifts: {
      label:'FLORENCE ↔ FERRARA ↔ THE MEDITERRANEAN',title:'一件瓷器，如何累積政治價值？',
      intro:'羅倫佐的收藏可以放進更大的地中海交換網絡。與費拉拉公爵夫人艾蕾奧諾拉的收藏對照，重點不只在誰擁有最多，而在物件如何流動、被命名和重新展示。',
      question:'贈禮、貿易、繼承與再收藏，留下的證據有何不同？',
      diagram:[['JOURNEY','物件流動'],['RECEPTION','接受與轉贈'],['VALUE','價值形成']],
      known:'艾蕾奧諾拉 1493 年的財產清冊，與羅倫佐 1492 年、由 1512 年抄本傳下的清冊，具有不同的文本傳承與分類背景。',
      interpretation:'Clark 從交換、外交和接受過程討論瓷器。物件的移動經歷，也是理解收藏價值的一部分。',
      open:'清冊上的名稱能否判定材質與產地？外來物件是否一定是外交禮物？必須核對品名、路徑、贈受雙方及記錄年代。',
      links:['clark','rubin','deroover']
    }
  },
  timeline: [
    {year:'1434',title:'老科西莫返回佛羅倫斯',text:'結束流放、重返城市後，美第奇的政治影響力逐步鞏固。此時仍須放在佛羅倫斯共和制度內理解，不能稱他為托斯卡尼公爵。',note:'閱讀線索：家族、支持者網絡與共和政治。'},
    {year:'1436',title:'聖馬可：機構與空間的轉變',text:'道明會改革派修士進駐，老科西莫參與後續重建。修道院轉交、動工與各部分完成，各有時間，不能只用一個年份概括。',note:'閱讀線索：Terry-Fritsch（2012）；Ullman & Stadter（1972）。'},
    {year:'1441',title:'尼科利藏書的正式移轉',text:'尼科利的遺贈、遺囑執行人的決定、資金安排與修士管理，共同構成聖馬可圖書館的制度背景。',note:'追問：誰保管書籍？哪些讀者能使用？'},
    {year:'1444',title:'美第奇宮：一座城市住宅',text:'美第奇宮約自 1444 年起建。與米開羅佐相關的建築歸屬、營造時序和贊助關係，仍需要建築與文獻證據共同判斷。',note:'閱讀線索：Ferretti 的美第奇宮史學回顧。'},
    {year:'1464',title:'老科西莫去世，皮耶羅承接',text:'家族的延續不是從祖父直接跳到孫子。皮耶羅「痛風者」的角色，讓我們能比較不同世代的收藏、宗教贊助與政治處境。',note:'把中間世代放回家族史。'},
    {year:'1469',title:'羅倫佐逐步走向政治核心',text:'父親皮耶羅去世後，羅倫佐與弟弟朱利亞諾所處的政治與文化環境隨之改變。影響力、公共職務和正式爵位仍要分辨。',note:'閱讀線索：Kent（2004）與贊助制度研究。'},
    {year:'1478',title:'帕齊陰謀與新的外交處境',text:'4 月 26 日，朱利亞諾遇害，羅倫佐倖存。隨後的戰爭與外交，是考察藝術家流動的重要背景，但背景本身不能替代委託證據。',note:'不要把時間上的先後，直接當作因果證明。'},
    {year:'1481',title:'西斯汀側牆壁畫的合作',text:'波提切利等畫家參與教廷工程。契約、付款、推薦與工作網絡，可以幫助我們釐清不同人的角色。這不是米開朗基羅後來的天頂畫。',note:'閱讀線索：O’Malley（2010），尤其頁 30–32。'},
    {year:'1492',title:'羅倫佐去世，故事繼續',text:'羅倫佐在 1492 年去世；家族被逐出佛羅倫斯則在 1494 年。收藏清冊也有原始記錄與後來抄本的差別，日期需要逐一辨認。',note:'1492、1494 與抄本的 1512 年，各指不同事件。'}
  ],
  readings: [
    {id:'terry',author:'Allie Terry-Fritsch',year:'2012',type:'期刊論文',tags:['space','evidence'],title:'聖馬可：被實際使用的空間',original:'Florentine Convent as Practiced Place: Cosimo de’Medici, Fra Angelico, and the Public Library of San Marco',blurb:'從走廊、圖像與進入資格，重新理解修道院中的人文學者和觀看者。',question:'空間配置如何讓特定人群進入、觀看與閱讀？',clue:'把圖書館、走廊和壁畫放回同一個使用情境，並區分修士、人文學者與其他訪客。',boundary:'動線與圖像可用來提出觀看情境，不能直接證明每位觀看者的理解，更不能自動推導政治認同。',citation:'Terry-Fritsch, Allie. 2012. Medieval Encounters 18 (2–3): 230–271. DOI: 10.1163/15700674-12342109.',url:'https://doi.org/10.1163/15700674-12342109',access:'正式論文入口'},
    {id:'omalley',author:'Michelle O’Malley',year:'2010',type:'期刊論文',tags:['diplomacy','patronage','evidence'],title:'畫家赴羅馬：名聲與職業網絡',original:'Finding fame: Painting and the making of careers in Renaissance Italy',blurb:'誰委託、誰推薦、誰付款？從畫家生涯檢視西斯汀壁畫的外交敘事。',question:'1481 年的藝術家合作，是如何形成的？',clue:'尤其閱讀頁 30–32，將教廷的正式委託、管理者及藝術家的既有聯繫，與羅倫佐仲介的說法並列比較。',boundary:'對慣常敘事的質疑，不等於排除羅倫佐所有可能介入。藝術家名聲與政治關係也不是單一因素決定。',citation:'O’Malley, Michelle. 2010. Renaissance Studies 24 (1): 9–32. DOI: 10.1111/j.1477-4658.2009.00640.x.',url:'https://doi.org/10.1111/j.1477-4658.2009.00640.x',access:'正式論文入口'},
    {id:'paoletti',author:'John T. Paoletti',year:'1995',type:'專書章節',tags:['patronage','space'],title:'贊助的策略，也有制度的結構',original:'Strategies and structures of Medici artistic patronage in the 15th century',blurb:'把贊助從「某位富有的人喜歡藝術」，推進到家族、機構與空間的關係。',question:'出資、建造、使用與觀看，是否由同一組人控制？',clue:'以跨世代和跨機構的角度比較案件，分開整理財源、決策者、受益者與紀念方式。',boundary:'贊助活動具有政治含義，不代表每一件作品都能被還原為單一政治宣傳。個案仍須獨立核對。',citation:'Paoletti, John T. 1995. In The Early Medici and Their Artists, edited by Francis Ames-Lewis, 19–36. London: Birkbeck College.',url:'https://search.worldcat.org/search?q=The+Early+Medici+and+Their+Artists',access:'查找書目與館藏'},
    {id:'rubin',author:'Patricia Rubin',year:'1995',type:'專書章節',tags:['patronage','evidence'],title:'「豪華」不只是花很多錢',original:'Magnificence and the Medici',blurb:'Magnificence 是價值判斷、恰當支出的觀念，也是被塑造的公共形象。',question:'人們如何評價規模可觀的支出？',clue:'分辨德性論述、社會稱譽與後世形象。這個概念可以用來討論老科西莫，並不只屬於羅倫佐的別稱。',boundary:'「豪華者」不是公爵爵位，也不能直接譯成單純奢侈。使用概念時，要交代說話的人、語境與時間。',citation:'Rubin, Patricia. 1995. In The Early Medici and Their Artists, edited by Francis Ames-Lewis, 37–49. London: Birkbeck College.',url:'https://search.worldcat.org/search?q=The+Early+Medici+and+Their+Artists',access:'查找書目與館藏'},
    {id:'clark',author:'Leah R. Clark',year:'2020',type:'期刊論文',tags:['diplomacy','evidence'],title:'瓷器的旅程，收藏的比較',original:'The peregrinations of porcelain: The collections of Duchess Eleonora d’Aragona of Ferrara',blurb:'將羅倫佐與艾蕾奧諾拉的收藏並讀，追問物件路徑與清冊的分類。',question:'外交、交換和接受，如何改變物件的價值？',clue:'對照 1493 年費拉拉清冊與美第奇清冊的傳承；注意贈禮方向、物件名稱和記錄層次，而不只比較件數。',boundary:'本文 2019 年先行上線、收於 2020 年期刊。外來物件不一定是外交禮物；舊清冊用語也不能直接等同現代材質分類。',citation:'Clark, Leah R. 2020 [online 2019]. Journal of the History of Collections 32 (2): 275–288. DOI: 10.1093/jhc/fhy063.',url:'https://doi.org/10.1093/jhc/fhy063',access:'正式論文入口'},
    {id:'kent',author:'F. W. Kent',year:'2004',type:'研究專書',tags:['patronage','space'],title:'重讀羅倫佐的「豪華」藝術',original:'Lorenzo de’ Medici and the Art of Magnificence',blurb:'從收藏延伸到建築、公共工程與審美教育，檢查「藝術贊助人」的形象。',question:'羅倫佐對藝術的參與，如何隨生涯與處境變化？',clue:'從不同階段的建築活動與人際關係入手，分別考察收藏、顧問、出資和公共職務。',boundary:'手札以閱讀指南、書評及出版資訊作為入口，並不取代全書閱讀。原版為 2004 年；出版社所列平裝版為 2007 年，與筆記整理年不同。',citation:'Kent, F. W. 2004. Lorenzo de’ Medici and the Art of Magnificence. Baltimore: Johns Hopkins University Press. Paperback edition, 2007.',url:'https://www.press.jhu.edu/books/title/3202/lorenzo-de-medici-and-art-magnificence',access:'出版社書籍頁'},
    {id:'deroover',author:'Raymond de Roover',year:'1963',type:'研究專書',tags:['patronage','evidence'],title:'銀行、宗教與財富的正當性',original:'The Rise and Decline of the Medici Bank, 1397–1494',blurb:'從銀行業務與教會法語境，理解捐贈、償還與商業道德的不同問題。',question:'銀行收益與宗教支出之間，能建立多強的因果關係？',clue:'先分辨借貸、匯兌契約、風險與收益，再討論宗教奉獻；不要用現代「高利貸」的直覺概括所有業務。',boundary:'制度與帳目能說明部分行為，卻不能單獨證明老科西莫的內在動機。傳記中的悔罪敘事，需要交代作者與文類。',citation:'de Roover, Raymond. 1963. The Rise and Decline of the Medici Bank, 1397–1494. Cambridge, MA: Harvard University Press.',url:'https://search.worldcat.org/search?q=The+Rise+and+Decline+of+the+Medici+Bank+1397+1494',access:'查找書目與館藏'},
    {id:'horne',author:'Herbert P. Horne',year:'1908',type:'早期研究專書',tags:['evidence','diplomacy'],title:'波提切利：留意句子裡的「可能」',original:'Alessandro Filipepi, Commonly Called Sandro Botticelli, Painter of Florence',blurb:'回到早期研究的原句，分清文件記載、作者推測和後來的簡化敘事。',question:'一項藝術家與美第奇的關係，是證據還是推論？',clue:'閱讀頁 62–66、74–75。先辨認付款紀錄中的公職機構，再追問是否能歸為羅倫佐個人的贊助。',boundary:'作者用語如「我推測」「或許」應保留不確定程度。1908 年的研究也需要和後來的檔案研究對照。',citation:'Horne, Herbert P. 1908. Alessandro Filipepi, Commonly Called Sandro Botticelli, Painter of Florence. London: G. Bell & Sons.',url:'https://archive.org/details/alessandrofilipe00horn',access:'數位原書入口'},
    {id:'ullman',author:'B. L. Ullman & P. A. Stadter',year:'1972',type:'研究專書',tags:['space','evidence'],title:'圖書館背後的遺贈與管理',original:'The Public Library of Renaissance Florence: Niccolò Niccoli, Cosimo de’ Medici, and the Library of San Marco',blurb:'讓尼科利、遺囑執行人與修士重新回到圖書館的創設故事。',question:'藏書如何從私人收藏，進入特定的公共使用制度？',clue:'追蹤尼科利的遺贈、資金負擔、書籍的保管與讀者資格，避免把所有環節只歸功於一個贊助人。',boundary:'本卡依研究指南及相關書目整理閱讀入口；「公共圖書館」的歷史用法，不等同今日任何人自由進出的圖書館。',citation:'Ullman, Berthold L., and Philip A. Stadter. 1972. The Public Library of Renaissance Florence. Medioevo e Umanesimo 10. Padua: Antenore.',url:'https://search.worldcat.org/search?q=The+Public+Library+of+Renaissance+Florence+Ullman+Stadter',access:'查找書目與館藏'},
    {id:'machiavelli',author:'Niccolò Machiavelli',year:'16 世紀',type:'歷史敘事史料',tags:['evidence'],title:'《佛羅倫斯史》裡的家族形象',original:'History of Florence and of the Affairs of Italy',blurb:'閱讀人物評價的同時，也閱讀作者的位置、書寫時間與敘事目的。',question:'後來的評價，可以直接代表事件當時的所有人嗎？',clue:'對照第七、八卷中美第奇家族的敘事，先核對版本與章節，再追問材料、贊助背景和敘事安排。',boundary:'這是事件之後的歷史書寫，不是透明的民意紀錄。數位版的 2006 年是電子出版年，也不是歷史事件發生年。',citation:'Machiavelli, Niccolò. History of Florence and of the Affairs of Italy. Project Gutenberg, eBook 2464. Digital publication 2006; English print text 1901.',url:'https://www.gutenberg.org/ebooks/2464',access:'數位文本與版本資訊'},
    {id:'ferretti',author:'Emanuela Ferretti',year:'2015',type:'建築史章節',tags:['space','evidence'],title:'美第奇宮：建築歸屬如何成立？',original:'The Medici Palace, Cosimo the Elder, and Michelozzo: A Historiographical Survey',blurb:'從研究史出發，分開建築歸屬、工地時序、工匠聯繫與贊助責任。',question:'一座建築的作者與贊助關係，如何被後世研究確定？',clue:'比較史料、建築形式和研究史的論證方式。工匠曾經合作，是需要查核的線索，不是設計者身份的自動證明。',boundary:'機構典藏與不同版本可能採 2015／2016 年著錄，引用時應以實際使用版本的版權頁核對；本卡保留版本差異。',citation:'Ferretti, Emanuela. The Medici Palace, Cosimo the Elder, and Michelozzo: A Historiographical Survey. In A Renaissance Architecture of Power: Princely Palaces in the Italian Quattrocento, 263–289. See repository for edition details.',url:'https://flore.unifi.it/handle/2158/1039731',access:'佛羅倫斯大學典藏'}
  ],
  questions: [
    {topic:'聖馬可的公共性',question:'讀到聖馬可「公共圖書館」這個稱呼，哪一個判斷最妥當？',answers:['它和今日公共圖書館一樣，任何人都可自由進入。','它只服務老科西莫本人，與其他人沒有關係。','應調查當時的讀者資格、管理制度與實際使用情境。','只要有公共二字，就能證明每位市民都讀過藏書。'],correct:2,explain:'「公共」具有時代與制度條件。需要區分修士、人文學者與其他訪客，查核誰能進入、如何借閱，而非直接套用現代想像。',reading:'ullman'},
    {topic:'證據能走多遠',question:'一筆工程付款紀錄，最直接能支持什麼？',answers:['記錄所載的付款者、受款者、金額與交易情境。','所有觀看者都支持付款人的政治立場。','藝術家的每一項創作決定都由付款人指定。','付款人內心唯一的動機就是宣傳家族。'],correct:0,explain:'付款紀錄首先證明交易層次的事情。觀看者的接受、作者的決策和贊助人的內在動機，都需要不同的材料來補強。',reading:'paoletti'},
    {topic:'西斯汀委託',question:'O’Malley 對「羅倫佐把畫家作為外交禮物送到羅馬」的說法提出質疑。你會如何轉述？',answers:['已經證明羅倫佐與所有藝術家完全沒有關係。','已經證明教皇沒有支付任何費用。','西斯汀側牆與米開朗基羅天頂畫是同一個工程。','應同時考察教廷委託和藝術家網絡，並保留仲介過程的疑問。'],correct:3,explain:'替代解釋擴充了需要調查的角色，並非自動排除一切其他介入。正式委託、出資、推薦、受益及政治後果必須分開。',reading:'omalley'},
    {topic:'清冊的時間層次',question:'一份「1492 年清冊」由 1512 年抄本傳下，引用時應注意什麼？',answers:['把所有物件的取得時間都寫成 1512 年。','區分原始記錄、抄寫時間與文字傳承，再比較品名和分類。','認定原始清冊的每個細節都完整無誤地保存。','只要件數較多，就一定代表外交影響力較強。'],correct:1,explain:'歷史日期可能指事件、記錄或抄寫。文本傳承、漏抄、分類與品名，都可能影響收藏比較；不能只把數字相加。',reading:'clark'},
    {topic:'版本與研究年代',question:'Kent 的書原版為 2004 年，平裝版為 2007 年，你在 2026 年整理筆記。哪一種說法合適？',answers:['這是 2026 年剛發表的新研究。','2004 與 2007 必定是兩本主題完全不同的書。','筆記整理年與著作出版年應分開，並註明實際引用版本。','只寫最近的年份即可，版本不影響查核。'],correct:2,explain:'出版、再版、數位上架與個人筆記的時間，各有意義。引用時應交代使用版本，避免把資料整理日誤認為學術研究的發表日。',reading:'kent'},
    {topic:'保留推測的程度',question:'Horne 在句子裡使用「我推測」「或許」。整理成自己的手札時，該怎麼做？',answers:['保留不確定用語，區分作者推論與直接史料。','為了好讀，全部改成「檔案證明」。','只要作者有名，就可以省略證據。','改寫成比原作者更肯定，才算有自己的看法。'],correct:0,explain:'好的轉述會保留原文的確定程度。你可以提出新的判斷，但需要交代新增的證據，不能在改寫時悄悄把假說升級成事實。',reading:'horne'}
  ]
};
