---
title: "Google Apps Script 入門｜從執行程式到試算表紀錄"
type: interactive
order: 1
hidden: false
draft: false
---

## 今天的任務

把第 8 章看到的溫溼度記進 Google 試算表。完成後，你會有一筆測試資料和兩筆觀察紀錄，每筆都有時間、溫度和相對溼度。

## 一、試算表和 Apps Script 各做什麼？

試算表保存資料。底部的每個分頁是一張工作表，可以用來分開存放不同用途的資料，例如「溫溼度紀錄」和「課堂筆記」。

Google Apps Script（GAS）是 Google 提供的程式執行環境。從試算表的「擴充功能 → Apps Script」開啟編輯器時，建立的指令碼會綁定這份試算表。今天要執行的 `recordReading` 是一組已寫好的步驟，可以重複使用。

## 二、按下「執行」後發生什麼事？

1. **啟動程式**。你在編輯器按下「執行」，Google 開始執行目前選取的 `recordReading`。按「儲存」只會保存程式，按「執行」才會寫入資料。
2. **找到寫入的位置**。程式先找到綁定的試算表，再依分頁名稱找到「溫溼度紀錄」。分頁名稱如果對不上，程式會顯示錯誤。
3. **準備這一筆資料**。時間由程式在執行當下取得，溫度和相對溼度則使用你填入的兩個數字。
4. **新增一列**。`appendRow()` 會把三個值依序寫到該工作表資料的下方。連續執行兩次會留下兩列，即使兩次填的是同一組數字。

先猜猜看：如果把溫度從 25 改成 28，儲存後直接回到試算表，會多一列嗎？等第一次寫入成功後，再自己試一次。

## 動手試試｜從編輯器寫入試算表

下方是站內模擬，資料保留在本次頁面操作中。

:::interactive 溫溼度紀錄試算表

```game-html
<main class="practice">
  <h3>溫溼度監測紀錄</h3>
  <ol>
    <li>開啟「擴充功能 → Apps Script」，直接執行預設的 25、60，確認第 2 列出現。</li>
    <li>抄下第 8 章 LCD 的一組讀值，填入編輯器後按「儲存」，回試算表確認列數，再按「執行」比較。</li>
    <li>換一組讀值再做一次。核對第 3、4 列的 B、C 欄。</li>
  </ol>
  <details>
    <summary>擴充功能</summary>
    <button id="open-script" type="button">Apps Script</button>
  </details>
  <section id="editor" hidden aria-label="Apps Script 編輯器">
    <h4>Apps Script · recordReading</h4>
    <p>修改等號右邊的數字。模擬執行會使用上次儲存的值。</p>
    <div class="code">
      <label>const temperature = <input id="temperature" type="number" step="any" value="25" aria-label="溫度（°C）">;</label>
      <label>const humidity = <input id="humidity" type="number" min="0" max="100" step="any" value="60" aria-label="相對溼度（% RH）">;</label>
      <code>sheet.appendRow([new Date(), temperature, humidity]);</code>
    </div>
    <button id="save" type="button">儲存</button>
    <button id="run" type="button">執行</button>
    <button id="show-sheet" type="button">返回試算表</button>
  </section>
  <p id="feedback" role="status">目前 0 筆紀錄。</p>
  <div class="sheet" id="sheet">
    <table aria-label="溫溼度紀錄工作表">
      <thead><tr><th></th><th scope="col">A</th><th scope="col">B</th><th scope="col">C</th></tr></thead>
      <tbody id="rows">
        <tr><th scope="row">1</th><td>時間</td><td>溫度（°C）</td><td>相對溼度（% RH）</td></tr>
      </tbody>
    </table>
    <div class="tab">溫溼度紀錄</div>
  </div>
</main>
```

```game-css
.practice { margin: 1rem auto; max-width: 44rem; padding: 0 .6rem; font: 1rem/1.5 system-ui, sans-serif; color: #202124; }
.practice h3, .practice h4 { margin: .5rem 0; }
.practice button { background: #fff; color: #185abc; border: 1px solid #dadce0; border-radius: .35rem; padding: .35rem .65rem; cursor: pointer; margin: .25rem 0; }
.practice summary { cursor: pointer; }
.practice details, #editor { background: #f1f3f4; border: 1px solid #dadce0; padding: .6rem; }
.code { padding: .5rem; background: #fff; overflow-wrap: anywhere; font: .9rem/1.7 monospace; }
.code label { display: block; }
.code input { width: 5rem; font: inherit; }
.sheet { overflow-x: auto; border: 1px solid #dadce0; }
.sheet table { width: 100%; border-collapse: collapse; font-size: .9rem; }
.sheet th, .sheet td { border: 1px solid #dadce0; padding: .35rem; text-align: left; }
.sheet th { background: #f1f3f4; text-align: center; }
.sheet tbody tr:first-child td { font-weight: 600; background: #e6f4ea; }
.tab { display: inline-block; padding: .4rem .8rem; border-bottom: 3px solid #188038; color: #137333; font-weight: 600; }
```

```game-js
const editor = document.getElementById('editor');
const sheet = document.getElementById('sheet');
const rows = document.getElementById('rows');
const feedback = document.getElementById('feedback');
const temperature = document.getElementById('temperature');
const humidity = document.getElementById('humidity');
let savedReading = [25, 60];

document.getElementById('open-script').addEventListener('click', () => {
  editor.hidden = false;
  sheet.hidden = true;
  temperature.focus();
});

document.getElementById('show-sheet').addEventListener('click', () => {
  editor.hidden = true;
  sheet.hidden = false;
  document.getElementById('open-script').focus();
});

document.getElementById('save').addEventListener('click', () => {
  if (!Number.isFinite(temperature.valueAsNumber) || !Number.isFinite(humidity.valueAsNumber) || !humidity.validity.valid) {
    feedback.textContent = '請輸入溫度和 0 到 100 之間的相對溼度。';
    return;
  }
  savedReading = [temperature.valueAsNumber, humidity.valueAsNumber];
  feedback.textContent = '已儲存程式，工作表仍有 ' + (rows.rows.length - 1) + ' 筆紀錄。';
});

document.getElementById('run').addEventListener('click', () => {
  const row = rows.insertRow();
  const number = document.createElement('th');
  number.scope = 'row';
  number.textContent = rows.rows.length;
  row.append(number);
  for (const value of [new Date().toLocaleString('zh-TW'), ...savedReading]) {
    row.insertCell().textContent = value;
  }
  feedback.textContent = '執行完成，已新增第 ' + rows.rows.length + ' 列。返回試算表核對結果。';
});
```

:::

## 三、用 Google 試算表實作

1. 建立自己的 Google 試算表，把底部工作表分頁命名為 **溫溼度紀錄**。
2. 在 A1、B1、C1 依序填入「時間」、「溫度（°C）」、「相對溼度（% RH）」。
3. 點「擴充功能 → Apps Script」，將編輯器內的預設範例換成下面這段，然後儲存。

```javascript
function recordReading() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName('溫溼度紀錄');

  if (!sheet) {
    throw new Error('請確認工作表分頁名稱是「溫溼度紀錄」');
  }

  // 課堂練習時，只修改下面兩行等號右邊的數字。
  const temperature = 25; // 改成 LCD 第一行的攝氏溫度
  const humidity = 60;    // 改成 LCD 第二行的相對溼度

  sheet.appendRow([new Date(), temperature, humidity]);
}
```

4. 在編輯器上方選擇 `recordReading`，按「執行」。首次執行可能需要授權。確認是自己剛建立的專案，選擇自己的 Google 帳號，再依畫面授權程式存取試算表。若學校帳號限制授權，跟著教師投影完成讀值與核對。
5. 回到試算表，確認標題下方多了一列。A 欄是執行時間，B 欄是 25，C 欄是 60。

## 四、課堂練習｜記錄兩組 LCD 讀值

1. 到第 8 章「溫溼度監測站（模擬器）」調整環境，等 LCD 更新後，記下第一行的溫度和第二行的相對溼度。
2. 回到 Apps Script，把 `temperature` 和 `humidity` 等號右邊的數字換成剛才的讀值。單位已寫在欄名，程式中只填數字。
3. 先儲存，回到試算表看列數。再回編輯器執行一次 `recordReading`，比較執行前後的差異。
4. 取另一組不同的 LCD 讀值，再修改、儲存、執行一次。

### 驗收

- 表頭下方有三筆資料，依序是測試資料和兩筆 LCD 觀察紀錄。
- 兩筆觀察紀錄的 B、C 欄與當時抄下的讀值一致。
- 能指出程式怎麼找到工作表、哪兩處需要修改，以及哪個操作會讓試算表新增一列。

### 卡住時先看哪裡？

- **沒有新增資料**：回到 Apps Script 看執行記錄，確認選的是 `recordReading`，且已按下「執行」。
- **出現找不到工作表的訊息**：檢查底部的分頁是否叫「溫溼度紀錄」。試算表上方的檔名和底部的分頁名稱是兩個不同的位置。
- **新增了舊的數字**：確認執行前已儲存，並查看最後一列。
