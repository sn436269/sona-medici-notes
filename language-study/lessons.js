/* Day 1 follows SONA's supplied learning conversation. Days 2–30 are authored extensions. */
window.LESSONS = [];
function addDay(topic, title, it, en, zh, pronunciation, rows) {
  const id = window.LESSONS.length + 1;
  window.LESSONS.push({ id, topic, title, it, en, zh, pronunciation, words: rows.map(row => {
    const [it,en,zh,ipa,kk,pos,note,hint] = row.split('|');
    return {it,en,zh,ipa,kk,pos,note,hint:hint||''};
  }) });
}
addDay('餐桌日常','先從一杯水開始',"Vorrei dell'acqua, per favore.",'I would like some water, please.','我想要一些水，麻煩你。','vor-RÈI del-LÀK-kwa per fa-VÓ-re',[
  'Vorrei|I would like|我想要|/vorˈrɛi/|/aɪ wʊd laɪk/|動詞・條件式|來自 volere（想要）的第一人稱單數條件式。提出請求時，用 Vorrei 讓語氣更有禮貌。|vor-RÈI（佛－雷伊）',
  "dell'|some|一些|/del/|/sʌm/|部分冠詞|在這句裡表示不特定的量。acqua 是母音開頭的陰性名詞，所以 della 省音成 dell'，和名詞連寫成 dell'acqua。|del（德爾，與 acqua 連讀）",
  'acqua|water|水|/ˈak.kwa/|/ˈwɔtɚ/|陰性名詞|acqua 是陰性名詞，這裡當不可數物質使用。dell’acqua 就是 some water；雙寫子音的地方稍微停留，再發出 kwa。|ÀK-kwa（阿克－瓜）',
  'per|for|為了、給|/per/|/fɔr/|介系詞|per 常用來表示目的或對象。今天先把它放在 per favore 裡理解，這是提出請求時的固定禮貌用語。|per（佩爾）',
  'favore|favor|幫忙、恩惠|/faˈvo.re/|/ˈfevɚ/|陽性名詞|per favore 整體表示 please（請、麻煩你），不要逐字翻成「為了恩惠」。晚上把整句連起來，練習一次自然、有禮貌的請求。|fa-VÓ-re（法－VO－雷）'
]);
addDay('餐桌日常','一杯不加糖的咖啡','Prendo un caffè senza zucchero.','I will have a coffee without sugar.','我要一杯不加糖的咖啡。','PRÈN-do un kaf-FÈ SÈN-tsa DZÙK-ke-ro',[
  'Prendo|I will have|我要、我點|/ˈprɛn.do/|/aɪ wɪl hæv/|動詞・現在式|prendere 的第一人稱單數。點餐時 prendo 很自然，表示「我點、我要」。',
  'un|a|一個、一杯|/un/|/ə/|陽性不定冠詞|un 放在陽性單數名詞前。這裡的「一杯」是依點咖啡的情境翻譯，原字是冠詞。',
  'caffè|coffee|咖啡|/kafˈfɛ/|/ˈkɔfɪ/|陽性名詞|caffè 的重音在最後，字尾的重音符號要保留。雙寫 ff 要稍作停留。',
  'senza|without|沒有、不加|/ˈsɛn.tsa/|/wɪˈðaʊt/|介系詞|senza 放在不想加入的東西前。senza zucchero 在點餐時就是「不加糖」。',
  'zucchero|sugar|糖|/ˈdzuk.ke.ro/|/ˈʃʊɡɚ/|陽性名詞|重音在第一音節。完整結構是 Prendo ＋ un caffè ＋ senza zucchero，晚上照這三段連讀。'
]);
addDay('餐桌日常','今天喝奶茶','Vorrei un tè con latte.','I would like a tea with milk.','我想要一杯加牛奶的茶。','vor-RÈI un TÈ kon LÀT-te',[
  'Vorrei|I would like|我想要|/vorˈrɛi/|/aɪ wʊd laɪk/|動詞・條件式|複習熟悉的禮貌開頭。這次請求的對象由水換成茶，動詞保持不變。',
  'un|a|一杯、一個|/un/|/ə/|陽性不定冠詞|tè 是陽性單數名詞，所以前面用 un。',
  'tè|tea|茶|/tɛ/|/ti/|陽性名詞|字尾有重音符號；義大利文 tè 與不帶重音的 te 是不同的字。',
  'con|with|和、加上|/kon/|/wɪð/|介系詞|con 表示伴隨或搭配。在飲料裡可以理解成「加上」。',
  'latte|milk|牛奶|/ˈlat.te/|/mɪlk/|陽性名詞|latte 是陽性名詞。雙寫 tt 稍微停留；con latte 是「加牛奶」。把今天這一句完整說一次。'
]);
addDay('餐桌日常','稱讚好吃的麵包','Questo pane è molto buono.','This bread is very good.','這個麵包非常好吃。','KWÈ-sto PÀ-ne È MÓL-to BWÒ-no',[
  'Questo|this|這個|/ˈkwes.to/|/ðɪs/|指示形容詞|questo 修飾陽性單數的 pane，意思是「這個」。',
  'pane|bread|麵包|/ˈpa.ne/|/brɛd/|陽性名詞|雖然以 e 結尾，pane 是陽性名詞。記單字時也一起記性別。',
  'è|is|是|/ɛ/|/ɪz/|動詞・現在式|essere 的第三人稱單數。帶重音的 è 是「是」，不帶重音的 e 是「和」。',
  'molto|very|非常|/ˈmol.to/|/ˈvɛrɪ/|副詞|在這裡修飾 buono，表示「非常」，不用跟著名詞改變性別。',
  'buono|good|好的、好吃的|/ˈbwɔ.no/|/ɡʊd/|形容詞・陽性單數|buono 形容陽性單數 pane。今天整句是「這個麵包＋是＋非常好吃」。'
]);
addDay('餐桌日常','禮貌地結帳','Posso avere il conto, per favore?','May I have the bill, please?','可以給我帳單嗎，麻煩你？','PÒS-so a-VÉ-re il KÓN-to per fa-VÓ-re',[
  'Posso|may I|我可以嗎|/ˈpɔs.so/|/me aɪ/|動詞・現在式|potere 的第一人稱單數。句尾加問號並配合語調，就能禮貌地詢問可不可以。',
  'avere|have|有、取得|/aˈve.re/|/hæv/|動詞・不定式|Posso 後面的動詞保留不定式，所以使用 avere。這裡指「取得、拿到」。',
  'il|the|這個、該|/il/|/ðə/|陽性定冠詞|il 放在 conto 前。中文通常省略冠詞，不必每次都翻出來。',
  'conto|bill|帳單|/ˈkon.to/|/bɪl/|陽性名詞|餐廳裡 il conto 指用餐帳單。重音在第一音節。',
  'per favore|please|請、麻煩你|/per faˈvo.re/|/pliz/|禮貌用語|今天將 per favore 當成完整詞組複習。Posso avere ＋ il conto ＋ per favore，一句就能完成請求。'
]);
addDay('餐桌日常','說出自己的喜歡','Mi piace questa pasta italiana.','I like this Italian pasta.','我喜歡這道義大利麵。','mi PIÀ-che KWÈ-sta PÀ-sta i-ta-LIÀ-na',[
  'Mi|to me|對我、我|/mi/|/tə mi/|間接受詞代名詞|mi 在這裡是「對我」。整個 mi piace 用自然中文翻成「我喜歡」。',
  'piace|is pleasing|令人喜歡|/ˈpja.tʃe/|/ɪz ˈplizɪŋ/|動詞・現在式|piacere 的第三人稱單數，這句真正的文法主詞是 pasta。mi piace 合起來理解比較自然。',
  'questa|this|這個、這道|/ˈkwes.ta/|/ðɪs/|指示形容詞|pasta 是陰性單數，這裡要用 questa。',
  'pasta|pasta|義大利麵、麵食|/ˈpas.ta/|/ˈpɑstə/|陰性名詞|在用餐情境裡 pasta 指義大利麵食。',
  'italiana|Italian|義大利的|/i.taˈlja.na/|/ɪˈtæljən/|形容詞・陰性單數|italiana 配合陰性 pasta；國籍形容詞在義大利文通常不用大寫。整句只練這一道菜的喜歡。'
]);
addDay('餐桌日常','兩個人的餐桌','Vorrei un tavolo per due.','I would like a table for two.','我想要一張兩人桌。','vor-RÈI un TÀ-vo-lo per DÙ-e',[
  'Vorrei|I would like|我想要|/vorˈrɛi/|/aɪ wʊd laɪk/|動詞・條件式|再次使用熟悉的禮貌請求。今天換成訂一張桌子。',
  'un|a|一張、一個|/un/|/ə/|陽性不定冠詞|tavolo 是陽性單數，所以前面用 un。',
  'tavolo|table|桌子|/ˈta.vo.lo/|/ˈtebəl/|陽性名詞|重音在第一音節。在餐廳裡指用餐的桌位。',
  'per|for|供、給|/per/|/fɔr/|介系詞|這次 per 表示「供幾個人使用」，和第 1 天固定片語的用法不同。',
  'due|two|二、兩位|/ˈdu.e/|/tu/|數詞|due 分成兩個音節 du-e。整句的 per due 是「供兩人使用」。'
]);
addDay('生活購物','去買新鮮麵包','Oggi compro il pane fresco.','Today I am buying fresh bread.','今天我要買新鮮麵包。','ÒD-dji KÓM-pro il PÀ-ne FRÈ-sko',[
  'Oggi|today|今天|/ˈɔd.dʒi/|/təˈde/|時間副詞|oggi 的重音在第一音節，ggi 發出較長的 dʒ 音。',
  'compro|I buy|我買|/ˈkom.pro/|/aɪ baɪ/|動詞・現在式|comprare 的第一人稱單數。義大利文常省略主詞 io，動詞本身就標示「我」。',
  'il|the|定冠詞|/il/|/ðə/|陽性定冠詞|pane 是陽性單數，前面使用 il。這句自然中文可以省略冠詞。',
  'pane|bread|麵包|/ˈpa.ne/|/brɛd/|陽性名詞|複習第 4 天的 pane，將它放到購物情境裡。',
  'fresco|fresh|新鮮的|/ˈfre.sko/|/frɛʃ/|形容詞・陽性單數|fresco 放在名詞後，配合陽性單數 pane。完整順序是時間＋動詞＋要買的東西。'
]);
addDay('生活購物','問問這個包的價格','Quanto costa questa borsa rossa?','How much does this red bag cost?','這個紅色包包多少錢？','KWÀN-to KÒ-sta KWÈ-sta BÓR-sa RÓS-sa',[
  'Quanto|how much|多少|/ˈkwan.to/|/haʊ mʌtʃ/|疑問副詞|quanto 在這裡詢問價格，和 costa 一起記成「多少錢」。',
  'costa|costs|售價是|/ˈkɔs.ta/|/kɔsts/|動詞・現在式|costare 的第三人稱單數，配合單數的 borsa。',
  'questa|this|這個|/ˈkwes.ta/|/ðɪs/|指示形容詞|borsa 是陰性單數，所以用 questa。',
  'borsa|bag|包包、袋子|/ˈbor.sa/|/bæɡ/|陰性名詞|borsa 可指手提包或袋子；依實際情境理解。',
  'rossa|red|紅色的|/ˈros.sa/|/rɛd/|形容詞・陰性單數|rossa 配合陰性 borsa。整句的中心是 Quanto costa，後面接你正在指的這個包。'
]);
addDay('生活購物','可以刷卡嗎','Posso pagare con la carta?','Can I pay by card?','我可以用卡付款嗎？','PÒS-so pa-GÀ-re kon la KÀR-ta',[
  'Posso|can I|我可以嗎|/ˈpɔs.so/|/kæn aɪ/|動詞・現在式|複習 potere 的第一人稱單數，用來詢問是否被允許。',
  'pagare|pay|付款|/paˈɡa.re/|/pe/|動詞・不定式|Posso 後面接不定式 pagare。重音在 ga。',
  'con|with|用、以|/kon/|/wɪð/|介系詞|con 在這裡表示付款使用的工具或方式。',
  'la|the|陰性定冠詞|/la/|/ðə/|陰性定冠詞|carta 是陰性單數，所以前面用 la。',
  'carta|card|卡片、支付卡|/ˈkar.ta/|/kɑrd/|陰性名詞|carta 也可指紙；在付款情境中 con la carta 是「用卡付款」。今天記住整句問法。'
]);
addDay('生活購物','找附近的藥局','Cerco una piccola farmacia qui vicino.','I am looking for a small pharmacy nearby.','我在找這附近的一間小藥局。','CHÈR-ko Ù-na PÌK-ko-la far-ma-CHÌ-a kwi vi-CHÌ-no',[
  'Cerco|I am looking for|我在找|/ˈtʃer.ko/|/aɪ æm ˈlʊkɪŋ fɔr/|動詞・現在式|cercare 的第一人稱單數。後面直接接要找的東西。',
  'una|a|一間、一個|/ˈu.na/|/ə/|陰性不定冠詞|farmacia 是陰性名詞，所以用 una。',
  'piccola|small|小的|/ˈpik.ko.la/|/smɔl/|形容詞・陰性單數|piccola 修飾 farmacia，性別和數都要配合。雙寫 cc 發較長的 k。',
  'farmacia|pharmacy|藥局|/far.maˈtʃi.a/|/ˈfɑrməsɪ/|陰性名詞|cia 在這裡發 tʃi-a，重音在 ci，最後的 i-a 分開發音。',
  'qui vicino|nearby|這附近|/kwi viˈtʃi.no/|/ˈnɪrˈbaɪ/|地點詞組|qui 是「這裡」，vicino 是「附近」。整個詞組補充你想尋找的位置。'
]);
addDay('生活購物','說出你需要的東西','Ho bisogno di una borsa.','I need a bag.','我需要一個袋子。','Ò bi-ZÓ-nyo di Ù-na BÓR-sa',[
  'Ho|I have|我有|/ɔ/|/aɪ hæv/|動詞・現在式|avere 的第一人稱單數。開頭的 h 不發音；ho 與 o（或者）的拼寫不同。',
  'bisogno|need|需要、需求|/biˈzoɲ.ɲo/|/nid/|陽性名詞|gn 發出連續的 ɲ 音，像較長的「尼」滑音，不讀成分開的 g 和 n。',
  'di|of|的、關於|/di/|/əv/|介系詞|avere bisogno di 是固定結構，整體表示「需要」。不要照字面逐字翻成中文。',
  'una|a|一個|/ˈu.na/|/ə/|陰性不定冠詞|borsa 是陰性名詞，這裡使用 una。',
  'borsa|bag|袋子、包包|/ˈbor.sa/|/bæɡ/|陰性名詞|複習前面學過的 borsa。把 Ho bisogno di 當成一個語意單位，後接 una borsa。'
]);
addDay('溝通日常','不懂的時候也能說','Non capisco questa parola italiana.','I do not understand this Italian word.','我不懂這個義大利文單字。','non ka-PÌ-sko KWÈ-sta pa-RÒ-la i-ta-LIÀ-na',[
  'Non|not|不|/non/|/nɑt/|否定副詞|non 放在動詞前，就能把這句變成否定。',
  'capisco|I understand|我理解|/kaˈpis.ko/|/aɪ ˌʌndɚˈstænd/|動詞・現在式|capire 的第一人稱單數是 capisco，有 isc 這一段，不是直接改成 capio。',
  'questa|this|這個|/ˈkwes.ta/|/ðɪs/|指示形容詞|parola 是陰性單數，所以使用 questa。',
  'parola|word|單字、字詞|/paˈrɔ.la/|/wɝd/|陰性名詞|重音在 ro。今天可以指著你不理解的字使用這一句。',
  'italiana|Italian|義大利的|/i.taˈlja.na/|/ɪˈtæljən/|形容詞・陰性單數|italiana 修飾 parola，兩個都是陰性單數。先讀 Non capisco，再接你不懂的這個字。'
]);
addDay('溝通日常','請對方慢慢說','Puoi parlare un po’ più lentamente?','Can you speak a little more slowly?','你可以說得再慢一點嗎？','pwòi par-LÀ-re un PÒ pyù len-ta-MÉN-te',[
  'Puoi|can you|你可以嗎|/pwɔi/|/kæn ju/|動詞・現在式|potere 的第二人稱單數，用在熟悉的人或非正式情境；對陌生人的正式稱呼會用 Può。',
  'parlare|speak|說話|/parˈla.re/|/spik/|動詞・不定式|Puoi 後接不定式 parlare。這句是請對方調整說話速度。',
  'un po’|a little|一點點|/un pɔ/|/ə ˈlɪtəl/|數量詞組|po’ 是 poco 的截短形式，末尾寫撇號。它和 un 一起表示「一點」。',
  'più|more|更、比較|/pju/|/mɔr/|比較副詞|più 的重音符號要保留。放在 lentamente 前，表示「更慢地」。',
  'lentamente|slowly|慢慢地|/len.taˈmen.te/|/ˈslolɪ/|副詞|以 mente 結尾的副詞用來修飾動作。整句中 un po’ più lentamente 就是「再慢一點」。'
]);
addDay('城市交通','找到洗手間','Dove si trova il bagno?','Where is the bathroom?','洗手間在哪裡？','DÓ-ve si TRÒ-va il BÀ-nyo',[
  'Dove|where|哪裡|/ˈdo.ve/|/wɛr/|疑問副詞|dove 放在句首，詢問位置。',
  'si|itself|自身（代名詞）|/si/|/ɪtˈsɛlf/|代名詞|si 是 trovarsi 這個代名動詞的一部分，這裡不用單獨翻譯成中文。',
  'trova|is located|位於|/ˈtrɔ.va/|/ɪz ˈloketɪd/|動詞・現在式|si trova 合起來表示「位於、在」。主詞是後面的 il bagno。',
  'il|the|陽性定冠詞|/il/|/ðə/|陽性定冠詞|bagno 是陽性單數，所以用 il。',
  'bagno|bathroom|洗手間、浴室|/ˈbaɲ.ɲo/|/ˈbæθˌrum/|陽性名詞|gn 發 ɲ 音，不分開讀 g 和 n。今天整句詢問的是洗手間的位置。'
]);
addDay('城市交通','車站就在附近','La stazione è molto vicina.','The station is very near.','車站就在很近的地方。','la stat-TSIÓ-ne È MÓL-to vi-CHÌ-na',[
  'La|the|陰性定冠詞|/la/|/ðə/|陰性定冠詞|stazione 是陰性單數，前面使用 la。',
  'stazione|station|車站|/statˈtsjo.ne/|/ˈsteʃən/|陰性名詞|zione 的部分連起來發 tsjo-ne，重音在 zio。',
  'è|is|是、在|/ɛ/|/ɪz/|動詞・現在式|è 連接主詞和形容詞，這裡是「車站是很近的」。',
  'molto|very|很、非常|/ˈmol.to/|/ˈvɛrɪ/|副詞|molto 在這裡是副詞，修飾 vicina，維持原形。',
  'vicina|near|近的|/viˈtʃi.na/|/nɪr/|形容詞・陰性單數|vicina 配合陰性單數 stazione。跟著聲音把整句連起來。'
]);
addDay('城市交通','一張前往佛羅倫斯的票','Vorrei un biglietto per Firenze.','I would like a ticket to Florence.','我想要一張去佛羅倫斯的票。','vor-RÈI un bi-LYÉT-to per fi-RÈN-tse',[
  'Vorrei|I would like|我想要|/vorˈrɛi/|/aɪ wʊd laɪk/|動詞・條件式|把第 1 天熟悉的句首帶到買票情境裡。',
  'un|a|一張、一個|/un/|/ə/|陽性不定冠詞|biglietto 是陽性單數，所以使用 un。',
  'biglietto|ticket|票|/biʎˈʎet.to/|/ˈtɪkɪt/|陽性名詞|gli 發 ʎ 的顎側音，不分開讀成 g-l-i；雙寫 tt 稍微停留。',
  'per|to|往、前往|/per/|/tu/|介系詞|per 在票券情境裡帶出目的地，英文自然譯為 to。',
  'Firenze|Florence|佛羅倫斯|/fiˈrɛn.tse/|/ˈflɔrəns/|城市專有名詞|城市名字首字母大寫。整句先說請求，再說票和目的地。'
]);
addDay('城市交通','問火車幾點出發','A che ora parte il treno?','At what time does the train leave?','火車幾點出發？','a ke Ó-ra PÀR-te il TRÈ-no',[
  'A che|at what|在什麼|/a ke/|/æt wʌt/|疑問詞組的一部分|A che 和 ora 合起來才是完整的「在幾點」。che 裡的 ch 在 e 前發 k。',
  'ora|time|時間、點鐘|/ˈo.ra/|/taɪm/|陰性名詞|A che ora 是詢問時間的固定問法，先一起記住。',
  'parte|leaves|出發|/ˈpar.te/|/livz/|動詞・現在式|partire 的第三人稱單數，配合 il treno。',
  'il|the|陽性定冠詞|/il/|/ðə/|陽性定冠詞|treno 是陽性單數，所以使用 il。',
  'treno|train|火車|/ˈtrɛ.no/|/tren/|陽性名詞|問句裡主詞 il treno 放在 parte 後。整體仍是「火車在幾點出發」。'
]);
addDay('城市交通','這班公車去市中心嗎','Questo autobus va in centro?','Does this bus go to the city center?','這班公車去市中心嗎？','KWÈ-sto ÀU-to-bus va in CHÈN-tro',[
  'Questo|this|這個、這班|/ˈkwes.to/|/ðɪs/|指示形容詞|autobus 是陽性單數，所以使用 questo。',
  'autobus|bus|公車、巴士|/ˈau.to.bus/|/bʌs/|陽性名詞|autobus 的單複數拼寫相同，要從冠詞和上下文判斷數量。',
  'va|goes|去|/va/|/ɡoz/|動詞・現在式|andare 的第三人稱單數是不規則的 va，主詞是這班公車。',
  'in|to|到、往|/in/|/tu/|介系詞|in centro 是慣用搭配，表示「去市中心、在市中心」，依動詞理解。',
  'centro|center|中心、市中心|/ˈtʃɛn.tro/|/ˈsɛntɚ/|陽性名詞|ce 發 tʃe 音。今天用問句語調詢問這班車的方向。'
]);
addDay('住宿旅途','告訴對方你有預約','Ho una prenotazione per stasera.','I have a reservation for this evening.','我有今晚的預約。','Ò Ù-na pre-no-tat-TSIÓ-ne per sta-SÉ-ra',[
  'Ho|I have|我有|/ɔ/|/aɪ hæv/|動詞・現在式|複習 ho；h 不發音，這裡直接表示「我有」。',
  'una|a|一個|/ˈu.na/|/ə/|陰性不定冠詞|prenotazione 是陰性單數，所以使用 una。',
  'prenotazione|reservation|預約、訂位|/pre.no.tatˈtsjo.ne/|/ˌrɛzɚˈveʃən/|陰性名詞|長單字可以慢慢分段 pre-no-ta-zio-ne，重音落在 zio。',
  'per|for|為、供|/per/|/fɔr/|介系詞|per 在這裡引出預約所對應的時間。',
  'stasera|this evening|今晚|/staˈse.ra/|/ðɪs ˈivnɪŋ/|時間副詞|stasera 是一個字，意指今天晚上。整句可用在餐廳或其他預約情境。'
]);
addDay('住宿旅途','安靜的房間','La mia camera è tranquilla.','My room is quiet.','我的房間很安靜。','la MÌ-a KÀ-me-ra È tran-KWÌL-la',[
  'La|the|陰性定冠詞|/la/|/ðə/|陰性定冠詞|義大利文一般名詞前的所有格常搭配定冠詞，所以這裡是 la mia camera。',
  'mia|my|我的|/ˈmi.a/|/maɪ/|所有格形容詞|mia 配合被擁有的東西 camera 的陰性單數，不是依說話者性別決定。',
  'camera|room|房間|/ˈka.me.ra/|/rum/|陰性名詞|義大利文 camera 在這裡是房間，不是英文 camera（相機）。',
  'è|is|是|/ɛ/|/ɪz/|動詞・現在式|è 連接主詞 la mia camera 與形容詞 tranquilla。',
  'tranquilla|quiet|安靜的|/traŋˈkwil.la/|/ˈkwaɪət/|形容詞・陰性單數|tranquilla 配合 camera。重音在 quil，雙寫 ll 要稍作停留。'
]);
addDay('藝術觀光','導覽要多久','Quanto dura la visita guidata?','How long does the guided tour last?','導覽行程持續多久？','KWÀN-to DÙ-ra la VÌ-zi-ta gwi-DÀ-ta',[
  'Quanto|how long|多久|/ˈkwan.to/|/haʊ lɔŋ/|疑問副詞|quanto 搭配 dura 詢問持續時間；這次不是問價格。',
  'dura|lasts|持續|/ˈdu.ra/|/læsts/|動詞・現在式|durare 的第三人稱單數，主詞是 la visita guidata。',
  'la|the|陰性定冠詞|/la/|/ðə/|陰性定冠詞|visita 是陰性單數，使用 la。',
  'visita|visit|參觀、拜訪|/ˈvi.zi.ta/|/ˈvɪzɪt/|陰性名詞|visita 在這裡表示參觀活動，重音在第一音節。',
  'guidata|guided|有導覽的|/ɡwiˈda.ta/|/ˈɡaɪdɪd/|形容詞・陰性單數|guidata 配合 visita。la visita guidata 作為完整名詞組，英文就是 the guided tour。'
]);
addDay('藝術觀光','把明天留給博物館','Vorrei visitare questo museo domani.','I would like to visit this museum tomorrow.','我想明天參觀這間博物館。','vor-RÈI vi-zi-TÀ-re KWÈ-sto mu-ZÈ-o do-MÀ-ni',[
  'Vorrei|I would like|我想要|/vorˈrɛi/|/aɪ wʊd laɪk/|動詞・條件式|Vorrei 後面除了名詞，也可以接動詞不定式，表達想做的事。',
  'visitare|visit|參觀、拜訪|/vi.ziˈta.re/|/ˈvɪzɪt/|動詞・不定式|visitare 保留不定式，接在 Vorrei 後面。',
  'questo|this|這個、這間|/ˈkwes.to/|/ðɪs/|指示形容詞|museo 是陽性單數，所以使用 questo。',
  'museo|museum|博物館|/muˈzɛ.o/|/mjuˈzɪəm/|陽性名詞|museo 的重音在 se，字尾 e-o 分開發音。',
  'domani|tomorrow|明天|/doˈma.ni/|/təˈmɑro/|時間副詞|domani 放在句末，補充想參觀的時間。今晚把請求、行動、地點與時間連起來。'
]);
addDay('藝術觀光','在畫作前停一停','Questo dipinto è molto bello.','This painting is very beautiful.','這幅畫非常美。','KWÈ-sto di-PÌN-to È MÓL-to BÈL-lo',[
  'Questo|this|這個、這幅|/ˈkwes.to/|/ðɪs/|指示形容詞|dipinto 是陽性單數，所以使用 questo。',
  'dipinto|painting|畫作、繪畫作品|/diˈpin.to/|/ˈpentɪŋ/|陽性名詞|dipinto 在這裡當名詞，指一幅畫作。',
  'è|is|是|/ɛ/|/ɪz/|動詞・現在式|用 è 連接畫作和你對它的感受。',
  'molto|very|非常|/ˈmol.to/|/ˈvɛrɪ/|副詞|molto 修飾形容詞 bello。回想第 4 天的 molto buono，句型是一樣的。',
  'bello|beautiful|美的、漂亮的|/ˈbɛl.lo/|/ˈbjutəfəl/|形容詞・陽性單數|bello 配合陽性單數 dipinto。形容詞在 è 後，今天使用完整的 bello。'
]);
addDay('藝術觀光','聊聊你對歷史的興趣','Mi interessa la storia italiana.','I am interested in Italian history.','我對義大利歷史感興趣。','mi in-te-RÈS-sa la STÒ-rya i-ta-LIÀ-na',[
  'Mi|to me|對我|/mi/|/tə mi/|間接受詞代名詞|這裡 mi 是「對我」。整個 mi interessa 自然翻成「我感興趣」。',
  'interessa|interests|使感興趣|/in.teˈrɛs.sa/|/ˈɪntrɪsts/|動詞・現在式|interessare 的第三人稱單數，真正的文法主詞是 la storia italiana。',
  'la|the|陰性定冠詞|/la/|/ðə/|陰性定冠詞|storia 是陰性單數，所以使用 la。',
  'storia|history|歷史、故事|/ˈstɔ.rja/|/ˈhɪstərɪ/|陰性名詞|storia 有歷史與故事兩種常見意思；在這句裡是歷史。',
  'italiana|Italian|義大利的|/i.taˈlja.na/|/ɪˈtæljən/|形容詞・陰性單數|italiana 配合陰性 storia。Mi interessa 的結構和之前的 Mi piace 類似，先整組理解。'
]);
addDay('藝術觀光','走進一座教堂','Oggi voglio vedere questa chiesa.','Today I want to see this church.','今天我想看看這座教堂。','ÒD-dji VÒ-lyo ve-DÉ-re KWÈ-sta KYÈ-za',[
  'Oggi|today|今天|/ˈɔd.dʒi/|/təˈde/|時間副詞|把今天放在句首，先交代時間。',
  'voglio|I want|我想要|/ˈvɔʎ.ʎo/|/aɪ wɑnt/|動詞・現在式|volere 的第一人稱單數現在式。比 Vorrei 直接；這裡是在陳述自己的計畫。',
  'vedere|see|看、看見|/veˈde.re/|/si/|動詞・不定式|voglio 後面的動詞保留不定式，所以使用 vedere。',
  'questa|this|這個、這座|/ˈkwes.ta/|/ðɪs/|指示形容詞|chiesa 是陰性單數，所以使用 questa。',
  'chiesa|church|教堂|/ˈkjɛ.za/|/tʃɝtʃ/|陰性名詞|ch 在 i 前保持 k 音，chie 連成 kjɛ，與英文 church 的起始音不同。'
]);
addDay('藝術觀光','請對方幫忙看地圖','Puoi aiutarmi con questa mappa?','Can you help me with this map?','你可以幫我看看這張地圖嗎？','pwòi a-yu-TÀR-mi kon KWÈ-sta MÀP-pa',[
  'Puoi|can you|你可以嗎|/pwɔi/|/kæn ju/|動詞・現在式|這是對熟悉對象的非正式 tu 問法。正式稱呼可使用 Può。',
  'aiutarmi|help me|幫助我|/a.juˈtar.mi/|/hɛlp mi/|不定式＋代名詞|aiutare 去掉末尾 e，再加 mi，成為 aiutarmi。mi 在這裡是「我」這個受詞。',
  'con|with|在……方面、用|/kon/|/wɪð/|介系詞|con 引出需要協助的事情或物品；這裡是地圖。',
  'questa|this|這個、這張|/ˈkwes.ta/|/ðɪs/|指示形容詞|mappa 是陰性單數，所以使用 questa。',
  'mappa|map|地圖|/ˈmap.pa/|/mæp/|陰性名詞|雙寫 pp 稍微停留。把 Puoi aiutarmi 當成一個請求，再接 con questa mappa。'
]);
addDay('藝術觀光','廣場一直開放著','La piazza è sempre aperta.','The square is always open.','廣場一直開放著。','la PIÀT-tsa È SÈM-pre a-PÈR-ta',[
  'La|the|陰性定冠詞|/la/|/ðə/|陰性定冠詞|piazza 是陰性單數，所以使用 la。',
  'piazza|square|廣場|/ˈpjat.tsa/|/skwɛr/|陰性名詞|雙寫 zz 發較長的 ts 音。不是英文 square 的發音。',
  'è|is|是|/ɛ/|/ɪz/|動詞・現在式|è 連接主詞和開放的狀態。',
  'sempre|always|總是、一直|/ˈsɛm.pre/|/ˈɔlwez/|頻率副詞|sempre 用來描述這個狀態一直持續，在這句裡放在 è 後面。',
  'aperta|open|開放的、開著的|/aˈpɛr.ta/|/ˈopən/|形容詞・陰性單數|aperta 配合陰性 piazza。本句作為語言練習；實際景點是否開放仍以現場資訊為準。'
]);
addDay('藝術觀光','明天搭火車去佛羅倫斯','Domani vado a Firenze in treno.','Tomorrow I am going to Florence by train.','明天我要搭火車去佛羅倫斯。','do-MÀ-ni VÀ-do a fi-RÈN-tse in TRÈ-no',[
  'Domani|tomorrow|明天|/doˈma.ni/|/təˈmɑro/|時間副詞|domani 說明未來時間；日常計畫也常搭配現在式來表達。',
  'vado|I go|我去|/ˈva.do/|/aɪ ɡo/|動詞・現在式|andare 的第一人稱單數是不規則的 vado。英文這裡自然譯成 I am going。',
  'a|to|到、往|/a/|/tu/|介系詞|表示前往城市時常用 a，這裡接城市 Firenze。',
  'Firenze|Florence|佛羅倫斯|/fiˈrɛn.tse/|/ˈflɔrəns/|城市專有名詞|再次複習城市的義大利文名稱與英文名稱。',
  'in treno|by train|搭火車|/in ˈtrɛ.no/|/baɪ tren/|交通方式詞組|in treno 是表達交通方式的搭配，中間不加冠詞。整句依序說時間、行動、目的地與交通方式。'
]);
addDay('藝術觀光','總有一天，再回到這裡','Vorrei tornare qui un giorno.','I would like to come back here one day.','我想有一天再回到這裡。','vor-RÈI tor-NÀ-re kwi un DJÓR-no',[
  'Vorrei|I would like|我想要|/vorˈrɛi/|/aɪ wʊd laɪk/|動詞・條件式|第 30 天回到一開始的 Vorrei，這次用它說出一個願望。',
  'tornare|come back|回來、返回|/torˈna.re/|/kʌm bæk/|動詞・不定式|tornare 保留不定式，接在 Vorrei 後面。',
  'qui|here|這裡|/kwi/|/hɪr/|地點副詞|qui 是一個音節，直接放在 tornare 後面，表示返回的地方。',
  'un|one|一個|/un/|/wʌn/|不定冠詞／數詞|在 un giorno 這個時間詞組裡，un 對應「某一個」。',
  'giorno|day|天、日子|/ˈdʒor.no/|/de/|陽性名詞|un giorno 可以表示未來的「有一天」。將整句慢慢說出來，為第一個月留下一個想再出發的願望。'
]);
