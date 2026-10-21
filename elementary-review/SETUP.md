# 明湖學習手札：家長使用與雲端設定

本機網站檔案：`D:\Users\Sona_Wang\Desktop\教\www`。

網站可直接由 GitHub Pages 提供。GitHub 儲存網站程式與題庫；學生的答案、點數與錯題不會寫進公開 GitHub 儲存庫。

## 日常使用

1. 用 iPad Safari 開啟網站，選擇「開始今日練習」或單元練習。
2. 每題選擇答案，全部作答後交卷。交卷前可回到前題修改。
3. 完成後顯示分數、解析與這次點數，也能下載 PNG 完成卡。
4. 80% 以上得 1 點，90% 以上得 2 點；兩者不相加。依原始正確率判定，顯示分數取小數一位。
5. 「錯題筆記」可下載含答案、解析的 HTML 複習檔，用瀏覽器列印可另存 PDF。
6. 「我的點數」可查每筆日期、獲得與兌換紀錄，也能下載 CSV。
7. 首次開啟「家長設定」請由家長建立 4–8 位數字 PIN。設定暱稱、五科每日各 6–10 題，預設各 8 題。
8. 兌換扣點需家長 PIN，並填寫點數與原因。已完成紀錄沒有自動到期或每週歸零。

每日完成題數計算當天已完成交卷中的不同題目數；同一題反覆作答不會重複增加當日題數。週一至週五顯示本週進度，週末自由練習。日期使用臺北時區。未交卷草稿只保存在原裝置，完成交卷後的紀錄才可同步。

## 跨裝置同步目前的必要條件

**看到「雲端待設定」表示還沒有雲端連線。此時只有目前瀏覽器保存，換裝置不會自動出現紀錄。**

本網站已提供 Firebase 電子郵件登入、Firestore 事件同步與交易扣點程式，但必須先建立自己的 Firebase 專案並啟用服務。請由家長操作帳號、密碼、服務條款及權限設定。

## 建立免費 Firebase 專案

1. 開啟 [Firebase Console](https://console.firebase.google.com/)，用家長 Google 帳號建立專案。可先使用 Spark 方案；不必為本站啟用 Analytics。免費配額與方案以 Firebase 當時公告為準。
2. 在專案設定加入一個「網頁應用程式」，取得 `firebaseConfig`。只要公開網頁設定，**不要使用服務帳戶 JSON 或 private_key**。
3. 進入 Authentication，啟用「Email/Password／電子郵件與密碼」。在 Users 由家長新增一個家庭帳號，密碼請自己設定並保管。本站不提供公開註冊頁。
4. 在 Authentication 的 Settings／Authorized domains 加入 `sn436269.github.io`（若網址改用其他網域，也需加入該網域）。
5. 建立 Cloud Firestore 資料庫，選擇適合的地區。將本資料夾 `firestore.rules` 的完整內容貼入 Firestore Rules 並發布；不要使用允許所有人讀寫的測試規則。
6. 把網頁應用程式的公開 config 物件填入 `config.js`，取代 `window.FIREBASE_CONFIG = null;`，例如：

```js
window.FIREBASE_CONFIG = {
  apiKey: "你的網頁公開 API key",
  authDomain: "你的專案.firebaseapp.com",
  projectId: "你的專案ID",
  storageBucket: "你的 storageBucket",
  messagingSenderId: "你的 messagingSenderId",
  appId: "你的 appId"
};
```

7. 將更新後的 `config.js` 上傳到同一個 GitHub 網站目錄。若尚未更新檔案，也可從網站「雲端登入」貼入 **JSON 格式**（雙引號）設定，但每台裝置都要貼一次。
8. 在 iPad 和家長電腦登入**同一個家庭帳號**。登入後資料依 Firebase 帳號 UID 分開儲存。
9. 如果登入前已有本機練習，點「同步狀態 → 合併本機訪客紀錄」，經家長 PIN 確認後合併到帳號。
10. 在 iPad 完成一回練習，連線同步後，再用電腦登入確認完成紀錄、點數與錯題都出現。完成這項實際測試，才算此家庭的跨裝置同步啟用成功。

離線作答先存本機，回到網站且恢復網路後會自動重試上傳。同步失敗會顯示狀態；請先排除錯誤再清除裝置資料。雲端模式兌換必須連線，使用 Firestore transaction 核對餘額，避免多台裝置同時兌換造成負數。

## 備份與還原

- 在家長區定期下載「完整備份」，將 JSON 存入 iCloud 雲碟或其他安全位置。
- 還原會合併事件 ID，相同紀錄不重複計點；請只匯入自己家庭的備份。
- 登入時匯入的紀錄會加入目前帳號；未登入時則加入本機訪客紀錄。
- Safari 清除網站資料、無痕模式結束或裝置故障可能移除本機資料。已成功同步到雲端的紀錄可重新登入取回；任何儲存服務都不保證永遠不遺失，因此仍需備份。
- 完整備份含家長 PIN 的雜湊，請妥善保存。PIN 是避免誤操作的便利鎖，不是能阻止具程式能力者修改資料的安全機制。

## 忘記 PIN

若有其他仍解鎖的裝置，可在家長區變更 PIN。否則請由網站維護者協助：在已登入的自有裝置上保留完整紀錄，建立新的 settings 事件替換 PIN 雜湊，請勿清空整個資料庫或刪除點數紀錄。不要把孩子資料與 PIN 備份公開到 GitHub。

## 題庫

共 20 個單元、600 題原創選擇題：國語 240、數學 180、英語 60、自然 60、社會 60，每單元 30 題。

國語按家長提供的六課與兩個統整活動編排，屬相應文體、詞語及閱讀能力練習，尚未逐字核對課本生字表和課文細節。數學包含康軒五上前四單元、整數四則提前練習與綜合應用；其他三科依官方五上前兩單元主題編寫。各科實際考試範圍依班級老師通知。

- [校方 115 學年度課程計畫](https://tten.tp.edu.tw/Login/SchoolDownloadFile?SPID=625c176d-8a1e-4d65-b845-b548c4f84e06)
- [教材版本一覽表](https://tten.tp.edu.tw/Login/DownloadOSchoolPlan?SPID=625c176d-8a1e-4d65-b845-b548c4f84e06&item=item5_1)
- 另見 `sources-other.md` 的逐科來源與文件限制。

## 發布位置

複習站位於既有 `sn436269/sona-medici-notes` GitHub Pages 儲存庫的 `elementary-review/` 獨立子目錄。站內使用相對路徑，原站檔案無須修改。

若之後建立獨立儲存庫，例如 `minghu-elementary-review`，可把本資料夾檔案放入該儲存庫根目錄，再於 Settings → Pages 選擇 main 分支與根目錄，或使用隨附的 GitHub Actions workflow。新的 Pages URL 會是 `https://sn436269.github.io/minghu-elementary-review/`，請以 GitHub 顯示的實際發布結果為準。
