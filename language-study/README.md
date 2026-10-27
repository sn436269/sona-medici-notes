# 慢慢說義大利文｜SONA 語言手札

網址：https://sn436269.github.io/sona-medici-notes/language-study/

本地網站原始檔：`/Users/sona/Desktop/Medici/語言`。GitHub 發布目錄：`language-study/`。

直接以靜態網頁部署，不需要建置或伺服器 API。

- 每天一句，共 30 天；每日 08:00、11:00、14:00、17:00、20:00，拆解同一句的五個重點。
- 三語句子、單字、發音、義大利文 IPA、英文 KK／美式音標、用法與文法。
- 可搜尋的單字庫、收藏、熟悉標記、自訂三語單字、學習紀錄與每日筆記。
- JSON 備份與匯入、篩選單字 CSV 匯出，資料保存在瀏覽器 localStorage。
- 沒有測驗。語音使用瀏覽器 SpeechSynthesis，需裝置提供對應語言的語音。
- 日期採 Asia/Taipei，開始日期可在設定調整。
- 網頁沒有背景提醒或與 ChatGPT 排程同步。30 天教材預先編寫；第 1 天源於提供的學習對話，第 2–30 天為延伸教材。

參考資料：

- https://chatgpt.com/share/6ae095a3-39f0-83e8-bdc1-4581c057fee3
- 「確認義大利文學習排程」聊天：01a17d41-d7e9-71c3-915a-c5100839aaa8
- 視覺參考：https://sn436269.github.io/sona-medici-notes/duomo-study/

`lessons.js` 內的 `addDay` 依序加入每日課程；每列單字欄位順序為：義大利文、英文、繁體中文、義大利文 IPA、英文 KK／美式音標、詞性、說明、選填發音輔助，以 `|` 分隔。每一天維持五個重點。
