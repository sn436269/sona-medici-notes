# 固定英式英文女聲

網站英文採用 Kokoro-82M 的 `bf_emma`（British English female），正常語速。音檔預先在本地產生，GitHub Pages 直接播放同源 AAC，不呼叫瀏覽器的裝置語音，不提供聲線選單。只產生教材文字，私人自訂詞句不會上傳。

來源與使用權：
- 模型：https://huggingface.co/hexgrad/Kokoro-82M （Apache-2.0）
- 女聲資料：https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md
- ONNX runtime：https://github.com/thewh1teagle/kokoro-onnx （MIT）
- 模型檔：https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.1
- 模型授權全文：`audio/LICENSE-KOKORO.txt`。

固定本地環境 `/Users/sona/.cache/sona-british-voice/venv`，使用 PyPI，已驗證的版本固定在 `scripts/english-audio-requirements.txt`。模型 `kokoro-v1.0.int8.onnx` 及 `voices-v1.0.bin` 存在同一 cache 資料夾，產生前驗證 SHA256。模型和 venv 不公開到網站，也不納入網站備份。

每日維護執行：

```sh
/Users/sona/.cache/sona-british-voice/venv/bin/python scripts/generate-english-audio.py
```

腳本涵蓋 lessons.js 的預備教材和 daily.json 的完整歷史，不重複產生有效快取。新增學習內容後，發布新增的 `audio/en-gb-emma-*.m4a` 與 `audio/english-manifest.json`。清單保留來源、語言、聲線、授權與音檔雜湊。

義大利文仍只播放 Lara 原音，此英文腳本不得套用到義大利文。

極短詞句使用同一聲線做上下文合成，再根據模型匯出的音素時間，切出單次完整的詞句。播放檔沒有重複朗讀，也不改變音高或速度。這避免模型在極短輸入上的不穩定；每個輸出都必須通過有限值、長度、音量和雜湊檢查。
