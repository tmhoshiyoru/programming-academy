# 空白課程、章節與文章範本

課程與章節設定範本複製後分別命名為 `_course.json` 和 `_chapter.json`。文章範本複製到章節資料夾，再將副檔名 `.md.example` 改為 `.md`。

- `course.json.example`：課程名稱、排序和 `hidden` 設定。
- `chapter.json.example`：章節名稱、排序和 `hidden` 設定。
- `knowledge.md.example`：Markdown 圖文知識文章，支援標題、引用、清單、表格、圖片、LaTeX 數學公式；標示程式語言的程式碼區塊會有語法上色、行號和自動換行。
- `exercise.md.example`：OJ 題目欄位範本，輸入與輸出範例各自附有複製按鈕；目前沒有線上送出或判題功能。
- `game.md.example`：HTML、CSS、JavaScript 三段程式碼會組成隔離的互動預覽；讀者只能遊玩，程式碼由開發者維護。

互動預覽會自動配合內容高度，展開或收合內容也會跟著調整。若要指定遊戲尺寸，請在內層容器或 `canvas` 設定高度；`html`、`body` 由預覽自動撐開，內層容器則建議避免使用 `100vh`。

兩門公開課程目前依舊站目錄建立空白內容檔案。既有知識文章可直接填寫 Markdown；既有互動遊戲檔案已預留三個空白程式碼區塊。若要新增項目或改成練習題，可從本資料夾選擇對應範本。來源目錄與檔案對照位於 `docs/course-structure.json`。

隱藏狀態預設為顯示；設定在課程或章節的 `hidden: true` 會連動隱藏其子內容。完整操作流程請看專案根目錄的 README。
