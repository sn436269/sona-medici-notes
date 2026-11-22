# 語言網站固定維護流程

正式網站：https://sn436269.github.io/sona-medici-notes/language-study/

GitHub：`sn436269/sona-medici-notes`，`main` 分支的 `language-study/`。只更新這個子目錄，保留其他網站的所有檔案。先讀取遠端最新分支，使用目前遠端 tree 作為 base tree，更新 ref 時帶 expected head，不可覆寫其他聊天的提交。

本地原始檔：`/Users/sona/Desktop/Medici/語言`。

固定備份父資料夾：`/Users/sona/Desktop/Medici/語言/備份`。

每天 08:00 Asia/Taipei 檢查並發布當天內容。使用者已授權每天更新到同一 GitHub Pages 網址並在固定本地資料夾備份，不需再次詢問。若當日已發布完整六行，應保留原資料，不重複新增。

1. 先讀取遠端最新 `language-study/daily.json` 與必要來源，避免本地舊檔蓋掉已發布的修正。更新前執行 `scripts/backup.mjs`。
2. 執行 `scripts/update-daily.mjs`，補齊台北今天及漏掉日期的教材。它從 2026/10/27 起按日期發布，每天五個單字／詞組／文法重點加一個唯一生活句子，不新增第二個句子。
3. 第 1–30 天預備教材在 `lessons.js`，句子的英文 KK 在 `sentence-kk.json`。若需要更多天，依零基礎→生活→交通→觀光的順序撰寫新課程並附完整三語、英文 KK、義大利文 IPA、詞性、用法；不可用舊日輪播冒充每日更新。每日主頁使用 `daily.json` 的完整歷史快照，不能只在前端切換日期。
4. 執行 `scripts/generate-lara-audio.mjs`，只產生還缺少的 Lara 義大利文原音。此腳本使用 Lara 自身網頁的公開語音服務，短期語音連線網址只保留在執行記憶體，沒有使用或儲存帳號、Cookies、API 金鑰。產生的 PCM 原音以 AAC 保存到 audio/，不在網站跨網域呼叫 Lara。不得偷偷改用 SpeechSynthesis、Google、其他供應商或擅自模仿聲音。若 Lara 服務調整、回應限制或要求新的授權，立即停止產生並明確回報，不繞過限制。現有快取仍保留播放；教材與其他功能繼續正常發布。不能把短期憑證、Cookies 或 API 金鑰放入 GitHub。
5. 合法取得音檔後，放到 `audio/`，`audio/manifest.json` 的 entries 以正規化義大利文為 key；value 範例 `{ "provider": "Lara Translate", "it": "audio/acqua.mp3" }`。保留音檔來源與授權資訊在本地備份。前端用同源檔案直接播放，沒有其他聲音回退。不要使用臨時簽名網址冒充長期可用的播放來源。
6. 保留簡潔主頁：每個日期六橫排，最新在上；單字最多兩行，手機與電腦都不得左右拉。主分頁為每天學習、單字庫、單字遊戲，右側增加英文句子入口。
7. 檢查日期、三語、KK、每日五個重點與一句句子的結構，以及 JS 語法。確認後以 GitHub connector 或既有授權發布。只上傳網站 whitelist，不上傳 `備份/`、個人紀錄 JSON、credentials 或預覽測試檔。
8. 等 GitHub Pages 成功，確認正式網址與遠端 daily.json；再執行備份，將日期、commit SHA、部署結果記入當天本地備份。若當日內容已發布且無變更，不建立無意義的重複提交。
9. 對相同、非可行狀態保持安靜；有實際失敗、缺少教材、語音授權可接通或需要使用者處理時才通知。不要每次執行都留下例行狀態訊息。

Node 路徑：`/Users/sona/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node`。

原版個人紀錄 key `sona-language-journal-v1` 已保留；個人收藏、熟悉標記、自訂單字、歷史完成與筆記不可因版面更新被清空。

英文語音要求：使用者要求全部英文都正常、英國英式的年輕女生聲線，不要選單或設定。因短詞品質問題，已停用 Kokoro 離線英文生成器。英文改用 Lara Translate 公開語音服務，固定 language=en-GB，同源快取到 audio/en-gb-lara-*.m4a，profile=lara-gb-v1。不可回退到 Kokoro、裝置語音、美式或男聲，也不可裁切重複朗讀片段。
每日維護執行 Node scripts/generate-english-audio.mjs，補足 lessons.js 與 daily.json 的全部英文原音，並驗證 audio/english-manifest.json。一次只朗讀一個原文；只補句末標點，不加入額外詞句、不修剪發音、不調音高。短期 WSS 網址僅存記憶體，不公開憑證或 Cookies。若服務限制或格式變更就停止並回報，不繞過限制。私人自訂詞句不會上傳或公開。
舊 scripts/generate-english-audio.py 只作為 Node 腳本的相容入口，不再載入模型。英文不再需要 Python 套件或模型權重。
音質檢查：檔案可播放、HTTP 成功及雜湊一致只代表檔案驗證，不能宣稱已聽辨所有發音正常。使用者若回報怪音，須檢查原文、供應商來源和短詞樣本；沒有音訊聽辨能力時明說，不以剪音或換一批模型音檔冒充音質驗收。

待發布英文改稿：先檢查本地 `備份/英文語音待確認.json`。若 status 是 awaiting_listener_feedback，代表本次 Lara 英文替換尚待使用者對「I buy」樣本的聽感回饋；不要把這批英文改稿直接發布，也不要用遠端舊英文檔覆蓋本地原音。例行日更仍可只更新 daily.json、義大利文 manifest 與新增 Lara 義大利文音檔，並保留遠端其他檔案。使用者確認新樣本正常後，才更新狀態並發布已備好的整批英文改稿。

英文句子專區：入口在「單字遊戲」右邊，頁面位於 `assets/english-coach/index.html`。使用者指定匯入聊天時，將英文句子與中文語意、用法、情境整理到這裡。有對應原圖時，把原圖放在同一個資料夾，使用相對路徑插入對應筆記並加上替代文字。沒有圖的筆記可先發布。發布時將新增圖片納入網站檔案清單，並透過既有 `assets` 備份。

英文筆記每日同步（2026/11/20 使用者要求）：每天台北時間 08:00 檢查「（codex）Native Camp notes」（01a1f8f6-be16-7341-9200-97966a2ba11c）與「(codex) I rest my case」（6af107de-b154-83ec-99b9-c4fadbf75bf6），以及之後使用者明確指定的英文學習聊天。將新增的英文句子、比較用法、中文意思與單字匯入 assets/english-coach/index.html，有對應可存取原圖時一併放進 assets/english-coach/。以正式網站現有內容和本地處理記錄去重，保留所有筆記。只整理學習內容，不發布私人聯絡資訊。沿用發布前後備份和遠端最新 main 檢查。此 Codex 排程需本機可執行，關機期間不能保證觸發。

雲端發布（2026/11/22 已實跑通過）：.github/workflows/language-daily.yml 每天 UTC 00:00／00:30 在 GitHub 執行，更新正式 daily.json、請求 Pages 建置並驗證線上文字和當天 Lara 音檔。scripts/prepared-week.json 已備妥 2026/11/23～11/29 七天。每次本機維護都需補足未來七天教材與原音；雲端工作不產生新聲音、不讀私人聊天。GitHub 排程可能延遲，補跑會補齊已到日期，保留歷史。超過 preparedThrough 會明確失敗，必須補寫新教材，不得輪播。開機維護先執行 scripts/sync-cloud.mjs，按遠端固定 commit 補同步 daily.json、lessons.js、KK、預備週與義大利文原音，備份前後皆執行 backup.mjs。保留本地待確認英文稿。新增指定英文來源依 Codex 排程 prompt 內的聊天 ID 讀取，閱讀內容保留詳細原文段落、原始手寫圖、原例句與補充說明。原考卷姓名保存在私人備份，公開頁使用學習訂正內容。
