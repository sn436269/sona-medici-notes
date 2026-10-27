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
6. 保留簡潔主頁：每個日期六橫排，最新在上；單字最多兩行，手機與電腦都不得左右拉。只有每天學習、單字庫、單字遊戲三個主分頁。
7. 檢查日期、三語、KK、每日五個重點與一句句子的結構，以及 JS 語法。確認後以 GitHub connector 或既有授權發布。只上傳網站 whitelist，不上傳 `備份/`、個人紀錄 JSON、credentials 或預覽測試檔。
8. 等 GitHub Pages 成功，確認正式網址與遠端 daily.json；再執行備份，將日期、commit SHA、部署結果記入當天本地備份。若當日內容已發布且無變更，不建立無意義的重複提交。
9. 對相同、非可行狀態保持安靜；有實際失敗、缺少教材、語音授權可接通或需要使用者處理時才通知。不要每次執行都留下例行狀態訊息。

Node 路徑：`/Users/sona/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node`。

原版個人紀錄 key `sona-language-journal-v1` 已保留；個人收藏、熟悉標記、自訂單字、歷史完成與筆記不可因版面更新被清空。
