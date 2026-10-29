# 小綠綠程式學苑（新版骨架）

以靜態輸出為主的課程網站。課程內容放在 `src/content/courses/`，依資料夾組織；每篇文章是一個 Markdown 檔，透過 `type` 欄位選擇知識點、練習題或互動遊戲版型。

目前建立三門課程：C++程式設計、機器人專題、APCS練習網互動平台。C++程式設計保持隱藏；另外兩門課程已依舊站的公開目錄建立空白內容架構，正文和遊戲程式碼由你後續填寫。

## 開始使用

1. 安裝 Node.js LTS。
2. 在專案資料夾執行 `npm install`。
3. 執行 `npm run dev` 開啟本機預覽。
4. 執行 `npm run build` 產生靜態網站到 `dist/`。

目前不包含登入或資料庫。舊站只匯入目錄結構、標題與類型，沒有匯入正文、圖片或遊戲程式碼。加入或修改 Markdown 後，重新建置並部署即可更新網站。
已備妥 GitHub Pages 專案子路徑部署，儲存庫名稱為 `programming-academy`，詳細步驟見下節。本機開發仍使用網站根路徑，不影響原本的預覽網址。

## GitHub 與免費網站部署

預定使用 `tmhoshiyoru/programming-academy` 公開儲存庫，網站網址為：

<https://tmhoshiyoru.github.io/programming-academy/>

此方案使用公開儲存庫和 GitHub Pages，不需要 GitHub Pro。公開儲存庫的所有教材原始檔（包括 `hidden`、`draft` 內容）都能被讀取；請勿提交密碼、金鑰或學生個資。專案的 `package.json` 中 `private: true` 只防止誤發布成 npm 套件，不代表 GitHub 儲存庫是私人的。

### 第一次上傳

1. 在 GitHub 使用 `tmhoshiyoru` 帳號建立名為 `programming-academy` 的 **Public** 儲存庫。建立時不要額外勾選 README、`.gitignore` 或 License，這些內容以本機專案為準。
2. 如果本機尚未初始化 Git，依序執行 `git init -b main`、`git add .`、`git commit -m "Prepare static academy for GitHub Pages"`。若已初始化或已有提交，不必重複這一步。
3. 加入遠端：`git remote add origin https://github.com/tmhoshiyoru/programming-academy.git`。若已有相同遠端，不必重複加入。
4. 用正確的 GitHub 帳號登入後，執行 `git push -u origin main`。
5. 在儲存庫 **Settings → Pages → Build and deployment → Source** 選擇 **GitHub Actions**。
6. 在 **Actions → Deploy to GitHub Pages → Run workflow** 執行一次。之後每次推送到 `main` 都會自動更新網站。

`.github/workflows/deploy.yml` 會安裝鎖定的依賴、測試路徑處理、建置靜態網站、檢查站內連結與圖片是否存在，通過後才部署。這份設定檔備妥不代表已經上傳或上線，請以 GitHub 上實際的 Actions 執行結果為準。

### 平常更新

1. 編輯 Markdown、遊戲程式碼或圖片，透過 `npm run dev` 確認畫面。
2. 執行 `git add .`、`git commit -m "更新教材"`、`git push`。
3. 等待 GitHub 的 Actions 顯示成功，正式網站即更新。不用手動上傳 `dist/` 或 `node_modules/`，這些資料夾已排除。

### 圖片和連結不用加 repo 名稱

文章繼續使用原本的語法即可：

```markdown
![接線圖](/images/courses/機器人專題/ultrawave.jpg)
```

HTML 圖片也支援，例如 `<img src="/images/courses/機器人專題/ultrawave.jpg" width="600" alt="接線圖">`。建置時會自動補成 `/programming-academy/images/...`；站內連結、課程導覽、favicon 和互動遊戲預覽載入路徑也會配合更新。外部網址、頁內 `#錨點` 和程式碼範例中的文字不會被改寫。檔名大小寫必須完全一致，因為正式主機區分大小寫。

互動遊戲和網頁模擬器仍採用原本的隔離限制：HTML、CSS、JS 請填在對應區塊，圖片可內嵌 data URL；不會因這次部署開放遊戲對外連線或載入外部程式。

### 在本機測試正式網址結構

依序執行：

```sh
npm test
npm run build:pages
npm run check:pages
npm run preview:pages
```

開啟終端機顯示的網址，路徑為 `/programming-academy/`。平常使用 `npm run dev` 時仍開啟 `http://localhost:4321/`。本機修改後預覽會自動更新；正式網站則必須推送後，等部署完成才會更新。

之後若更換帳號或 repo 名稱，修改 `scripts/build-pages.mjs` 裡的 `SITE_URL` 和 `SITE_BASE` 預設值，並同步調整 `package.json` 的 `preview:pages` 路徑及本段網址即可；文章內的 `/images/...` 不需要改。若改用自訂網域根路徑，將 `SITE_BASE` 設為 `/`。完整 Git 專案也請定期備份到另一個硬碟或雲端，避免只保留單一平台副本。

## 資料夾結構

```text
src/content/courses/
  C++程式設計/
    _course.json
    01-章節名稱/
      _chapter.json
      01-文章名稱.md
  機器人專題/
    _course.json
    01-開發板-ESP32-S3-N16R8/
      _chapter.json
      01-Arduino-IDE設定步驟.md
      02-腳位介紹.md
    02-LED控制與摩斯密碼/
      _chapter.json
      ...
    ...
  APCS練習網互動平台/
    _course.json
    01-前測/
      _chapter.json
      01-空氣盒子.md
      02-成績排名.md
    ...
```

課程與章節資料夾用 `_course.json`、`_chapter.json` 設定名稱、排序和隱藏狀態；每篇文章則以 Markdown frontmatter 設定標題、類型、排序及隱藏狀態。

網站瀏覽順序為「課程 → 章節 → 單篇內容」。課程頁只列出第一層章節；點進章節後才會看到該章節的文章、練習題和互動小遊戲。章節底下再放子資料夾時，會自動建立可點選的小節頁面。左側目錄中的章節名稱也可以直接開啟該章節頁，旁邊的箭頭用來展開或收合。

每篇文章、練習題與互動小遊戲上方都有「課程／章節／小節」路徑，可點選返回上層。底部的「前一節／後一節」會顯示相鄰內容的標題，依左側目錄相同的章節與內容排序跨章節接續；隱藏或草稿項目會略過。第一篇的前一節、最後一篇的後一節會改為「回到課程」。只有一篇內容時，兩側都會連回課程。

內容類型由文章的 `type` 自動決定：`knowledge` 使用書本圖示與淡藍底色、`exercise` 使用題目清單圖示與淡黃底色、`game` 使用遊戲手把圖示與淡紫底色。章節內的內容卡片和左側目錄會同步套用，不需要另外設定圖片或顏色。

2026-10-29 依照[舊網站的公開課程目錄](https://programming-lab-six.vercel.app/home)建立了 12 個章節、43 個空白項目：機器人專題有 7 個章節、27 個項目；舊站「進階程式設計互動平台」對應到新版「APCS練習網互動平台」，有 5 個章節、16 個項目。原本的範例章節及三篇範例文章已移除。

章節名稱、順序與類型依舊站保留；部分標題雖含「練習」，舊站類型仍為知識點或互動小遊戲，本次沿用原分類。43 個項目包含 22 篇知識文章與 21 個互動遊戲，均預設顯示。每個來源網址、標題及對應檔案記錄於 `docs/course-structure.json`，方便比對與查找。

編輯文章時直接打開對應的 `.md`，在最上方 `---` 設定區結束後填入 Markdown。互動遊戲檔案只預留空白的 `game-html`、`game-css`、`game-js` 區塊，請分別填入 HTML、CSS、JavaScript。沒有填寫內容的文章正文和遊戲預覽會保持空白。三種類型的通用範本仍保留在 `templates/`，使用方式見 `templates/README.md`。

互動遊戲的 iframe 會隨內容自動調整高度，包括動態展開、收合、文字換行及圖片載入；不必自行加入調整 iframe 的程式。預覽會將 `html`、`body` 的高度改為依內容撐開；若遊戲需要固定尺寸，請將高度設定在內層遊戲容器或 `canvas`。避免用 `100vh` 撐開內層容器，因為 `vh` 取決於 iframe 本身的高度，無法代表內容的自然高度。

## 新增課程、章節與文章

1. 在 `src/content/courses/` 建立課程資料夾，從 `templates/course.json.example` 複製範本為 `_course.json`。
2. 在課程資料夾中建立章節資料夾，從 `templates/chapter.json.example` 複製範本為 `_chapter.json`。
3. 從 `templates/` 複製 `knowledge.md.example`、`exercise.md.example` 或 `game.md.example` 到章節資料夾，改成 `.md` 並填寫內容。
4. 文章 frontmatter 的 `title`、`type`、`order`、`hidden` 控制頁面標題、版型、排序和顯示狀態。
5. 圖片放到 `public/images/courses/` 的對應路徑，再於 Markdown 內引用。互動遊戲使用 `game-html`、`game-css`、`game-js` 三個程式碼區塊。

## 程式碼語法上色、行號與複製

在程式碼區塊的三個反引號後面標示語言即可。支援一般 Markdown 寫法 `cpp`、`c`，也相容 HackMD 常見的 `cpp=`、`c=`；末尾的等號可以省略，網站會自動顯示行號。空白行與縮排都會保留，長行會自動換行。

````markdown
```cpp=
#include <iostream>

int main() {
  std::cout << "Hello!";
}
```
````

每個程式碼區塊右上方都有「複製」按鈕，會複製整段原始程式碼，保留空白行、縮排與換行，不會把行號或按鈕文字一起複製。練習題中的範例輸入、輸出也使用相同按鈕。

常用語言標籤：C 用 `c`；C++／Arduino 程式用 `cpp`；Python 用 `python` 或 `py`；Java 用 `java`；JavaScript 用 `javascript` 或 `js`；TypeScript 用 `typescript` 或 `ts`；C# 用 `csharp`；網頁與資料格式可用 `html`、`css`、`json`、`yaml`、`sql`、`markdown`。以上語言標籤末尾都可以加 `=`。純文字則使用 `text`，不做語法上色，也不顯示行號。

目前安裝的 Shiki 支援 242 種語言；更多語言與別名可查閱 [Shiki 語言清單](https://shiki.style/languages)。

## 網站圖示（favicon）

全站已設定使用 `public/favicon.png` 作為瀏覽器分頁圖示，目前先放置暫用的書本圖示。

1. 將你的圖片另存為 PNG 格式，建議使用正方形，例如 64 × 64 或 128 × 128 像素。
2. 檔名改成 `favicon.png`，放進 `public/`，覆蓋現有的暫用圖片。只更改副檔名不會轉換圖片格式，請使用「另存為 PNG」。
3. 重新整理網站即可看到；如果瀏覽器仍保留舊圖示，按 `Ctrl + F5` 或重新開啟分頁。
4. 正式網站更換圖示後，依原本流程重新建置與部署。

只要替換這個檔案即可，所有頁面都會共用這張圖片，不需要逐頁設定。

## Markdown 檢查清單

每一項都要以清單符號 `- ` 開頭，接著使用 `[ ]`（內含一個空白）或 `[x]`。清單與上一段之間空一行：

```markdown
請完成以下檢查：

- [ ] 第一個待確認項目
- [ ] 第二個待確認項目
- [x] 已完成的項目
```

單獨寫 `[ ]` 或 `[  ]` 會被當成一般文字。方框的勾選狀態由 Markdown 檔中的 `[ ]`、`[x]` 決定。

## 課程圖片資料夾

圖片資料夾依課程名稱建立在 `public/images/courses/`：

```text
public/images/courses/
  C++程式設計/
  機器人專題/
  APCS練習網互動平台/
```

可以把同一門課的所有圖片直接放進該課程資料夾，不必再按章節或文章分資料夾。同一資料夾內的檔名不可重複；檔名可以使用中文，例如「超音波感測器-接線圖.png」。Markdown 引用時省略 `public`，寫成：

```markdown
![超音波感測器接線圖](/images/courses/機器人專題/超音波感測器-接線圖.png)
```

已存在的圖片不會被覆寫。課程圖片資料夾內的 `.gitkeep` 是保留空資料夾用的小檔案，不用修改。圖片路徑以實際資料夾與檔名為準，課程顯示名稱日後改動時，既有圖片資料夾不必跟著改名。

## 隱藏課程、章節或文章

這是靜態網站，沒有線上管理後台。請用文字編輯器修改對應的 JSON 或 Markdown 設定；`hidden` 省略時預設為 `false`。

### 隱藏整門課程

開啟課程資料夾的 `_course.json`，將 `hidden` 設為 `true`：

```json
{
  "title": "C++程式設計",
  "order": 1,
  "hidden": true
}
```

### 隱藏一個章節

在章節資料夾的 `_chapter.json` 將 `hidden` 設為 `true`。如果還沒有這個檔案，從 `templates/chapter.json.example` 複製後修改：

```json
{
  "title": "章節名稱",
  "order": 1,
  "hidden": true
}
```

### 隱藏單篇文章

在文章 Markdown 最上方的 frontmatter 設定：

```yaml
---
title: 文章名稱
type: knowledge
hidden: true
---
```

### 上層隱藏的連動方式

- 課程 `hidden: true` 時，整門課的章節和文章都不會產生頁面或出現在課程清單、切換選單和側欄。
- 章節 `hidden: true` 時，該章節及其子資料夾、文章都會隱藏，即使子項目自己的 `hidden` 是 `false`。
- 文章 `hidden: true` 只隱藏該文章。
- 重新顯示上層後，仍會依各章節和文章自己的 `hidden` 值決定是否顯示。

`hidden` 是網站顯示控制，不是保密或權限控管。請勿用它存放學生個資、金鑰、答案或其他不應公開的內容；若原始碼放在公開 GitHub 儲存庫，檔案仍可被讀取。修改後在本機預覽會自動更新；正式靜態網站需重新建置和部署。

## 網頁模擬器

在任一課程頁面展開左側欄，點選底部的「網頁模擬器」。

1. 預設在「完整 HTML」模式，將含 CSS 和 JavaScript 的整份 HTML 貼入編輯區。
2. 按「進階」切換為分開輸入 HTML、CSS、JavaScript 的模式；兩種模式擇一產生預覽。
3. 按「預覽網頁」或切到「預覽結果」頁籤查看輸出；回到「程式碼」可繼續編輯。

預覽使用隔離的 iframe 執行，不能存取主網站的資料或向外部服務送出網路要求。需要的圖片、樣式和程式碼請直接放進預覽內容。

