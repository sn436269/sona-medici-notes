'use strict';
Object.assign(window.FAMILY_ARCHIVE.sources,{
royalWives:{label:'Historic Royal Palaces｜亨利八世的六位妻子',url:'https://www.hrp.org.uk/hampton-court-palace/history-and-stories/henry-viii-s-wives-six-queens-six-women/'},
henry8:{label:'Historic Royal Palaces｜亨利八世與其子女',url:'https://www.hrp.org.uk/hampton-court-palace/history-and-stories/henry-viii/'},
aragon:{label:'Historic Royal Palaces｜阿拉貢的凱薩琳',url:'https://www.hrp.org.uk/hampton-court-palace/history-and-stories/katherine-of-aragon/'},
boleyn:{label:'Historic Royal Palaces｜安妮・博林',url:'https://www.hrp.org.uk/tower-of-london/history-and-stories/anne-boleyn/'},
jane:{label:'Historic Royal Palaces｜珍・西摩',url:'https://www.hrp.org.uk/hampton-court-palace/history-and-stories/jane-seymour/'},
cleves:{label:'Historic Royal Palaces｜克里維斯的安妮',url:'https://www.hrp.org.uk/hampton-court-palace/history-and-stories/anne-of-cleves/'},
howard:{label:'Historic Royal Palaces｜凱薩琳・霍華德',url:'https://www.hrp.org.uk/hampton-court-palace/history-and-stories/catherine-howard/'},
parr:{label:'Historic Royal Palaces｜凱薩琳・帕爾及其後來的女兒',url:'https://www.hrp.org.uk/hampton-court-palace/history-and-stories/katherine-parr/'},
mary1:{label:'英國王室｜瑪麗一世及其西班牙婚姻',url:'https://www.royal.uk/mary-i'},
elizabeth1:{label:'Historic Royal Palaces｜伊莉莎白一世',url:'https://www.hrp.org.uk/hampton-court-palace/history-and-stories/elizabeth-i/'},
stuart:{label:'英國王室｜瑪麗・斯圖亞特與英法婚姻',url:'https://www.royal.uk/mary-queen-scots-r1542-1567'},
stuartPortrait:{label:'Royal Collection Trust｜瑪麗・斯圖亞特與詹姆士五世',url:'https://www.rct.uk/collection/stories/mary-queen-of-scots'},
tudorTree:{label:'Historic Royal Palaces｜都鐸王朝家族圖（教學資料）',url:'https://www.hrp.org.uk/media/2935/tudor-dynasty-family-tree-school-resource.pdf'},
pradoValois:{label:'普拉多博物館｜瓦盧瓦的伊莉莎白與腓力二世',url:'https://www.museodelprado.es/actualidad/multimedia/genealogia-del-prado-en-femenino/38945f52-a07f-7eae-0657-64c04f0a463b'},
henri4:{label:'大英博物館｜亨利四世的兩次王室婚姻',url:'https://www.britishmuseum.org/collection/term/BIOG31237'},
marieDBI:{label:'Treccani DBI｜瑪麗的父母與法國婚姻',url:'https://www.treccani.it/enciclopedia/maria-de-medici-regina-di-francia_(Dizionario-Biografico)/'},
reformation:{label:'Historical Association｜亨利八世時期宗教改革時序',url:'https://www.history.org.uk/files/download/31000/1778153137/Timeline_of_the_English_Reformation_during_the_reign_of_Henry_VIII.pdf'},
clementHenry:{label:'梵蒂岡｜克萊孟七世與亨利八世婚姻案',url:'https://www.vatican.va/jubilee_2000/pilgrim/documents/ju_gp_15052000-6_it.html'},
anjouCourtship:{label:'British Art Studies｜伊莉莎白與安茹公爵的議婚',url:'https://britishartstudies.ac.uk/issues/17/negotiating-a-courtship-between-courts'},
infantHenry:{label:'西敏寺｜1511 年早夭的亨利王子',url:'https://www.westminster-abbey.org/abbey-commemorations/royals/henry-son-of-henry-viii'}
});
window.ROYAL_ARCHIVE={people:[],marriages:[],wives:[]};
function addRoyal(id,name,latin,dates,born,died,region,role,parents,note,sources,badge=''){const p={id,name,latin,dates,born,died,region,role,parents,children:[],note,sources,badge,generation:null};window.ROYAL_ARCHIVE.people.push(p);return p;}
addRoyal('eleonora-toledo','艾蕾奧諾拉・托雷多','Eleonora di Toledo','1522–1562',1522,1562,'托斯卡納','科西莫一世之妻・法蘭切斯科一世之母',[],'1539 年與科西莫一世結婚。她是法蘭切斯科一世的母親，不是後來的比安卡・卡佩羅。',['cosimo1'],'duchess');
addRoyal('joanna-austria','奧地利的約翰娜','Joanna / Giovanna of Austria','1547–1578',1547,1578,'托斯卡納／哈布斯堡','法蘭切斯科一世之妻・瑪麗之母',[],'1565 年與法蘭切斯科結婚。瑪麗・德・美第奇的母親是她，不是比安卡・卡佩羅。',['marieDBI'],'duchess');
addRoyal('henri2','法國亨利二世','Henri II de France','1519–1559',1519,1559,'法國・瓦盧瓦','法王 1547–1559',[],'1533 年與凱薩琳・德・美第奇結婚，1547 年繼位。和英格蘭亨利八世是不同的國王。',['catherine','catherineTomb'],'king');
addRoyal('francis2','法蘭索瓦二世','François II de France','1544–1560',1544,1560,'法國・瓦盧瓦','法王 1559–1560',['catherine','henri2'],'凱薩琳與亨利二世的長子。1558 年娶蘇格蘭女王瑪麗・斯圖亞特。不是後來與伊莉莎白議婚的安茹公爵 François。',['catherine','stuart'],'king');
addRoyal('elisabeth-valois','瓦盧瓦的伊莉莎白','Élisabeth de Valois / Isabel de Valois','1545–1568',1545,1568,'法國 → 西班牙','西班牙王后 1559–1568',['catherine','henri2'],'1559 年成為腓力二世第三任妻子。她不是英格蘭伊莉莎白一世；腓力此前的第二任妻子是瑪麗一世。',['pradoValois'],'queen');
addRoyal('claude-valois','克洛德・瓦盧瓦','Claude de France','1547–1575',1547,1575,'法國 → 洛林','洛林公爵夫人',['catherine','henri2'],'凱薩琳與亨利二世的女兒，嫁洛林公爵查理三世。',['catherine']);
addRoyal('louis-valois','路易・瓦盧瓦（早夭）','Louis de France','1549–1550',1549,1550,'法國・瓦盧瓦','幼年去世的王子',['catherine','henri2'],'凱薩琳的孩子之一，沒有成為法國國王。',['catherine']);
addRoyal('charles9','查理九世','Charles IX de France','1550–1574',1550,1574,'法國・瓦盧瓦','法王 1560–1574',['catherine','henri2'],'在哥哥法蘭索瓦二世去世後繼位。妻子是奧地利的伊莉莎白；不是其姐姐瓦盧瓦的伊莉莎白。',['catherine'],'king');
addRoyal('henri3','法國亨利三世','Henri III de France','1551–1589',1551,1589,'法國・瓦盧瓦','法王 1574–1589',['catherine','henri2'],'凱薩琳的另一位兒子。1589 年去世後由波旁支的亨利四世繼位；兩人不是父子。',['catherine','henri4'],'king');
addRoyal('marguerite-valois','瑪格麗特・瓦盧瓦','Marguerite de Valois · Queen Margot','1553–1615',1553,1615,'法國・瓦盧瓦','亨利四世第一任妻子',['catherine','henri2'],'1572 年嫁未來的亨利四世，1599 年婚姻被宣告無效，沒有兩人的子女。她使亨利四世曾是凱薩琳的女婿。',['henri4'],'queen');
addRoyal('francois-anjou','法蘭索瓦・阿朗松／安茹公爵','François, duc d’Alençon puis d’Anjou','1555–1584',1555,1584,'法國・瓦盧瓦','曾與伊莉莎白一世議婚',['catherine','henri2'],'凱薩琳最小的存活兒子；1570–1580 年代與伊莉莎白一世的議婚未成。不可畫成夫妻，也不是法蘭索瓦二世。',['anjouCourtship','catherine'],'duke');
addRoyal('victoire-valois','維克圖瓦（早夭）','Victoire de France','1556–1556',1556,1556,'法國・瓦盧瓦','雙胞胎女兒',['catherine','henri2'],'與 Jeanne 是雙胞胎，出生後不久去世。',['catherine']);
addRoyal('jeanne-valois','讓娜（未存活）','Jeanne de France','1556–1556',1556,1556,'法國・瓦盧瓦','雙胞胎女兒',['catherine','henri2'],'與 Victoire 是雙胞胎，出生時未存活。',['catherine']);
addRoyal('henri4','法國亨利四世','Henri IV de France · Henri de Bourbon','1553–1610',1553,1610,'法國・波旁','法王 1589–1610',[],'先於 1572 年娶凱薩琳之女瑪格麗特，1599 年婚姻被宣告無效；1600 年再娶來自另一支的瑪麗・德・美第奇。',['henri4','france'],'king');
addRoyal('louis13','路易十三','Louis XIII de France','1601–1643',1601,1643,'法國・波旁','法王 1610–1643',['henri4','marie'],'母親是瑪麗・德・美第奇，不是凱薩琳，也不是亨利四世前妻瑪格麗特。父親遇刺後，母親曾攝政。',['france'],'king');
addRoyal('anne-austria','奧地利的安娜','Anne d’Autriche / Anne of Austria','1601–1666',1601,1666,'西班牙／法國','路易十三之妻・路易十四之母',[],'1615 年與路易十三結婚。不要與亨利八世的安妮・博林、克里維斯的安妮混淆。',['france'],'queen');
addRoyal('louis14','路易十四','Louis XIV de France','1638–1715',1638,1715,'法國・波旁','法王 1643–1715',['louis13','anne-austria'],'路易十三與奧地利的安娜之子，也是瑪麗・德・美第奇的孫子。',['france'],'king');
addRoyal('henry7','英格蘭亨利七世','Henry VII of England','1457–1509',1457,1509,'英格蘭・都鐸','英王 1485–1509',[],'與約克的伊莉莎白生下亞瑟、瑪格麗特及亨利八世等子女。本圖節選與英法連結相關者。',['tudorTree'],'king');
addRoyal('elizabeth-york','約克的伊莉莎白','Elizabeth of York','1466–1503',1466,1503,'英格蘭・約克／都鐸','亨利七世之妻・亨利八世之母',[],'不是 1533 年出生、後來成為英國女王的伊莉莎白一世。',['tudorTree'],'queen');
addRoyal('arthur-tudor','亞瑟・都鐸','Arthur Tudor, Prince of Wales','1486–1502',1486,1502,'英格蘭・都鐸','亨利八世的哥哥',['henry7','elizabeth-york'],'1501 年與阿拉貢的凱薩琳結婚，1502 年去世；她後來嫁給他的弟弟亨利八世。',['aragon']);
addRoyal('margaret-tudor','瑪格麗特・都鐸','Margaret Tudor','1489–1541',1489,1541,'英格蘭 → 蘇格蘭','亨利八世的姐姐・蘇格蘭王后',['henry7','elizabeth-york'],'與詹姆士四世的兒子是詹姆士五世，孫女是瑪麗・斯圖亞特。她不是凱薩琳的女兒瑪格麗特・瓦盧瓦。',['tudorTree','stuartPortrait'],'queen');
addRoyal('henry8','英格蘭亨利八世','Henry VIII of England','1491–1547',1491,1547,'英格蘭・都鐸','英王 1509–1547',['henry7','elizabeth-york'],'六次婚姻的丈夫，瑪麗一世、伊莉莎白一世與愛德華六世之父。凱薩琳・德・美第奇嫁的是法國亨利二世；兩人的英法連結見本頁三條跨國關係。',['henry8','royalWives'],'king');
addRoyal('james4','蘇格蘭詹姆士四世','James IV of Scotland','1473–1513',1473,1513,'蘇格蘭・斯圖亞特','蘇格蘭國王',[],'瑪格麗特・都鐸之夫，詹姆士五世之父。',['tudorTree'],'king');
addRoyal('james5','蘇格蘭詹姆士五世','James V of Scotland','1512–1542',1512,1542,'蘇格蘭・斯圖亞特','蘇格蘭國王',['margaret-tudor','james4'],'是亨利八世姐姐的兒子，因此亨利八世是他的舅舅；他的女兒是瑪麗・斯圖亞特。',['stuartPortrait','tudorTree'],'king');
addRoyal('mary-guise','瑪麗・德・吉斯','Mary of Guise','1515–1560',1515,1560,'法國 → 蘇格蘭','詹姆士五世之妻・瑪麗・斯圖亞特之母',[],'女兒幼年赴法國後，她曾在蘇格蘭攝政。不要與女兒、英國瑪麗一世或瑪麗・德・美第奇混淆。',['stuartPortrait'],'queen');
addRoyal('mary-stuart','瑪麗・斯圖亞特','Mary Stuart · Mary, Queen of Scots','1542–1587',1542,1587,'蘇格蘭・斯圖亞特','蘇格蘭女王・法國王后 1559–1560',['james5','mary-guise'],'祖母瑪格麗特・都鐸是亨利八世的姐姐。1558 年嫁法蘭索瓦二世，因此凱薩琳是她的婆婆；法蘭索瓦死後她返蘇格蘭，1565 年再嫁達恩利。',['stuart','stuartPortrait'],'queen');
addRoyal('darnley','亨利・斯圖亞特・達恩利勳爵','Henry Stuart, Lord Darnley','1545–1567',1545,1567,'蘇格蘭・斯圖亞特','瑪麗・斯圖亞特第二任丈夫',[],'1565 年與瑪麗成婚，兒子是詹姆士六世／一世。他不是英王亨利八世或法王亨利二世。',['stuartPortrait']);
addRoyal('james6-1','詹姆士六世／一世','James VI of Scotland / James I of England','1566–1625',1566,1625,'蘇格蘭／英格蘭・斯圖亞特','1603 年繼承英格蘭王位',['mary-stuart','darnley'],'蘇格蘭的稱號是六世，英格蘭的稱號是一世。1603 年伊莉莎白一世去世後，由這條斯圖亞特支承繼。',['stuart','tudorTree'],'king');
addRoyal('catherine-aragon','阿拉貢的凱薩琳','Katherine / Catherine of Aragon','1485–1536',1485,1536,'西班牙 → 英格蘭','亨利八世第 1 任妻子',[],'先嫁亨利的哥哥亞瑟，1509 年再嫁亨利八世。女兒為瑪麗一世；1511 年另生下一位名叫亨利、很快早夭的王子。',['aragon','infantHenry'],'queen');
addRoyal('anne-boleyn','安妮・博林','Anne Boleyn','約 1501／1507–1536',1501,1536,'英格蘭','亨利八世第 2 任妻子',[],'生年有不同說法；1533 年成婚，生下伊莉莎白一世。1536 年被處決。她不是克里維斯的安妮。',['boleyn'],'queen');
addRoyal('jane-seymour','珍・西摩','Jane Seymour','約 1508／09–1537',1508,1537,'英格蘭','亨利八世第 3 任妻子',[],'1536 年成婚，1537 年生下愛德華六世，產後不久去世。',['jane'],'queen');
addRoyal('anne-cleves','克里維斯的安妮','Anne of Cleves','1515–1557',1515,1557,'德意志 → 英格蘭','亨利八世第 4 任妻子',[],'1540/1/6 結婚，同年 7 月婚姻被宣告無效。與亨利八世沒有子女。',['cleves'],'queen');
addRoyal('catherine-howard','凱薩琳・霍華德','Catherine Howard','約 1523–1542',1523,1542,'英格蘭','亨利八世第 5 任妻子',[],'出生年未能精確確定。1540 年成婚，1542 年被處決，與亨利八世沒有子女。',['howard'],'queen');
addRoyal('catherine-parr','凱薩琳・帕爾','Katherine / Catherine Parr','1512–1548',1512,1548,'英格蘭','亨利八世第 6 任妻子',[],'1543 年成婚並活到亨利去世之後。與亨利沒有子女；1547 年再嫁托馬斯・西摩，1548 年生下瑪麗・西摩。',['parr'],'queen');
addRoyal('mary1','英格蘭瑪麗一世','Mary I of England','1516–1558',1516,1558,'英格蘭・都鐸','英格蘭女王 1553–1558',['henry8','catherine-aragon'],'母親是阿拉貢的凱薩琳。1554 年嫁腓力二世，與他沒有子女；不是蘇格蘭的瑪麗・斯圖亞特。',['mary1'],'queen');
addRoyal('elizabeth1','英格蘭伊莉莎白一世','Elizabeth I of England','1533–1603',1533,1603,'英格蘭・都鐸','英格蘭女王 1558–1603',['henry8','anne-boleyn'],'母親是安妮・博林，終身未婚，沒有子女。與凱薩琳兒子的議婚沒有成婚，應畫成虛線。',['elizabeth1','anjouCourtship'],'queen');
addRoyal('edward6','英格蘭愛德華六世','Edward VI of England','1537–1553',1537,1553,'英格蘭・都鐸','英王 1547–1553',['henry8','jane-seymour'],'母親是珍・西摩。曾有與幼年的瑪麗・斯圖亞特的婚約安排，但未成婚；她後來嫁法蘭索瓦二世。',['henry8','stuart'],'king');
addRoyal('henry-infant','亨利王子（1511 早夭）','Henry, Duke of Cornwall','1511–1511',1511,1511,'英格蘭・都鐸','亨利八世與第一任妻子的早夭兒子',['henry8','catherine-aragon'],'1511/1/1 出生，同年 2 月去世。不能把「沒有存活的男性繼承人」說成阿拉貢的凱薩琳從未生過兒子。',['infantHenry']);
addRoyal('philip2','西班牙腓力二世','Philip II / Felipe II of Spain','1527–1598',1527,1598,'西班牙・哈布斯堡','西班牙國王 1556–1598',[],'第二任妻子是英國瑪麗一世（1554–1558）；她去世後，1559 年娶凱薩琳之女瓦盧瓦的伊莉莎白為第三任妻子。這是先後婚姻，不是同時兩位妻子。',['mary1','pradoValois'],'king');
addRoyal('elizabeth-blount','伊莉莎白・布朗特','Elizabeth Blount','約 1498–約 1539',1498,1539,'英格蘭','亨利八世的婚外關係・不是妻子',[],'1519 年與亨利八世生下亨利・菲茨羅伊。她不列入六位王后的婚序。',['henry8']);
addRoyal('henry-fitzroy','亨利・菲茨羅伊','Henry FitzRoy, Duke of Richmond and Somerset','1519–1536',1519,1536,'英格蘭・都鐸','亨利八世承認的非婚生子',['henry8','elizabeth-blount'],'雖被父親承認並授爵，並不是珍・西摩的兒子愛德華六世，也沒有繼承英格蘭王位。',['henry8'],'duke');
addRoyal('thomas-seymour','托馬斯・西摩','Thomas Seymour','約 1508–1549',1508,1549,'英格蘭','珍・西摩的弟弟・帕爾後來的丈夫',[],'亨利八世死後，1547 年與凱薩琳・帕爾結婚，女兒是瑪麗・西摩。',['parr']);
addRoyal('mary-seymour','瑪麗・西摩','Mary Seymour','1548–去世年不詳',1548,null,'英格蘭','帕爾與托馬斯・西摩之女',['catherine-parr','thomas-seymour'],'不是亨利八世的孩子。約 1550 年之後不再見於歷史記錄，不補造確切死年。',['parr']);
for(const p of window.ROYAL_ARCHIVE.people)window.FAMILY_ARCHIVE.people.push(p);
const royalP=Object.fromEntries(window.FAMILY_ARCHIVE.people.map(p=>[p.id,p]));
royalP.francesco1.parents=['cosimo1','eleonora-toledo'];royalP.marie.parents=['francesco1','joanna-austria'];
for(const p of window.FAMILY_ARCHIVE.people)for(const parent of p.parents)if(royalP[parent]&&!royalP[parent].children.includes(p.id))royalP[parent].children.push(p.id);
window.ROYAL_ARCHIVE.marriages=[
['bande-nere','maria-salviati','1517','1526'],['cosimo1','eleonora-toledo','1539','1562'],['francesco1','joanna-austria','1565','1578'],['henri4','marie','1600','1610'],['louis13','anne-austria','1615','1643'],
['catherine','henri2','1533','1559'],['francis2','mary-stuart','1558','1560'],['elisabeth-valois','philip2','1559','1568'],['marguerite-valois','henri4','1572','1599'],
['henry7','elizabeth-york','1486','1503'],['margaret-tudor','james4','1503','1513'],['james5','mary-guise','1538','1542'],['mary-stuart','darnley','1565','1567'],
['arthur-tudor','catherine-aragon','1501','1502'],['henry8','catherine-aragon','1509','1533'],['henry8','anne-boleyn','1533','1536'],['henry8','jane-seymour','1536','1537'],['henry8','anne-cleves','1540/1','1540/7'],['henry8','catherine-howard','1540','1542'],['henry8','catherine-parr','1543','1547'],['mary1','philip2','1554','1558'],['catherine-parr','thomas-seymour','1547','1548']
].map(([a,b,from,to])=>({a,b,from,to}));
window.ROYAL_ARCHIVE.wives=[
{order:1,id:'catherine-aragon',marriage:'1509–1533',outcome:'1533 婚姻被宣告無效',children:['mary1','henry-infant'],note:'瑪麗一世是唯一長大成人的孩子；另有早夭或未存活的妊娠。',source:'aragon'},
{order:2,id:'anne-boleyn',marriage:'1533–1536',outcome:'1536 被處決',children:['elizabeth1'],note:'伊莉莎白一世是唯一長大成人的孩子；不能把其他未存活妊娠忽略成沒有發生。',source:'boleyn'},
{order:3,id:'jane-seymour',marriage:'1536–1537',outcome:'1537 產後去世',children:['edward6'],note:'生下愛德華六世，產後不久去世。',source:'jane'},
{order:4,id:'anne-cleves',marriage:'1540/1–1540/7',outcome:'1540 婚姻被宣告無效',children:[],note:'與亨利八世沒有子女。',source:'cleves'},
{order:5,id:'catherine-howard',marriage:'1540–1542',outcome:'1542 被處決',children:[],note:'與亨利八世沒有子女。',source:'howard'},
{order:6,id:'catherine-parr',marriage:'1543–1547',outcome:'1547 亨利去世，她生還',children:[],note:'與亨利沒有子女；瑪麗・西摩是她日後與托馬斯・西摩的女兒。',source:'parr'}
];
