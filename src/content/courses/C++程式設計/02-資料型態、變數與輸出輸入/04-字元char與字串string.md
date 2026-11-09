---
title: "字元 char 與字串 string"
type: interactive
order: 7
hidden: true
draft: false
---

## 一、用單引號表示字元，用雙引號表示字串

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    char grade = 'A';
    string name = "Ada";

    cout << grade << endl;
    cout << name << endl;
    return 0;
}
```

輸出結果：

```text
A
Ada
```

| 宣告 | 內容 | 使用的引號 |
| --- | --- | --- |
| `char grade = 'A';` | 一個字元 | 半形單引號 `'` |
| `string name = "Ada";` | 一段文字 | 半形雙引號 `"` |

即使內容都是一個 `A`，也可以依用途選擇型態：`char grade = 'A';` 把它當作一個字元，`string label = "A";` 則把它當作一段文字。宣告時，字元搭配單引號，字串搭配雙引號。

## 二、char 先用來處理英文字母、數字字元與符號

```cpp
char letter = 'B';
char digit = '7';
char symbol = '?';
```

這裡的 `'7'` 是數字字元，適合當作文字的一部分；整數 `7` 則可以拿來計算。兩者直接輸出時，畫面上都會看到 `7`，可以從宣告型態與引號辨認它們各自的用途。

本課先用 `char` 處理單一英文字母、數字字元與常見半形符號。中文文字可以使用 `string`，例如 `string message = "你好！";`。UTF-8 中文通常由多個位元組組成，`string` 能把這些內容一起保存。

## 三、string 可以存一整段文字

使用 `string` 時，請引入 `<string>`。字串可以有空格，也可以是空字串：

```cpp
string course = "C++ Programming";
string message = "你好！";
string empty = "";
```

`""` 表示空字串，長度是 `0`；`" "` 則包含一個空格，長度是 `1`。

寫一整段文字時，使用雙引號包住內容，就像上面的 `"C++ Programming"`。

:::interactive 字元與字串的引號比較

```game-html
<section>
<h3>同一段內容，適合哪個型態？</h3>
<label>資料型態<select id="type"><option value="char">char</option><option value="string">string</option></select></label>
<label>要儲存的內容<input id="value" type="text" value="A" maxlength="40" spellcheck="false"></label>
<p class="small">char 模式可以試一個英文字母、數字或半形符號；string 模式可以試一段文字或中文。</p>
<p id="status" class="status" aria-live="polite"></p>
<h4>完整程式示意</h4><pre id="program" class="program"></pre>
<h4>輸出結果</h4><pre id="output" class="terminal" aria-live="polite"></pre>
</section>
```

```game-css
* { box-sizing: border-box; }
body { margin: 0; padding: 22px; color: #193b2a; background: #f3faf5; font: 17px/1.7 system-ui, sans-serif; }
h3 { margin: 0 0 14px; font-size: 23px; line-height: 1.4; }
h4 { margin: 16px 0 7px; font-size: 17px; }
p { margin: 10px 0; }
label { display: block; margin: 12px 0; font-weight: 650; }
input:not([type="checkbox"]), select, textarea { display: block; width: 100%; min-width: 0; margin-top: 6px; padding: 10px 12px; color: #193b2a; background: #fff; border: 1px solid #8eaf9a; border-radius: 8px; font: inherit; }
textarea { min-height: 110px; resize: vertical; font-family: ui-monospace, Consolas, monospace; }
.check { display: flex; align-items: center; gap: 8px; }
input[type="checkbox"] { width: 18px; height: 18px; accent-color: #276342; }
.actions { display: flex; flex-wrap: wrap; gap: 10px; margin: 14px 0; }
button { padding: 9px 14px; border: 1px solid #7f9f8b; border-radius: 7px; color: #234d34; background: #fff; font: 16px/1.5 system-ui, sans-serif; cursor: pointer; }
button:hover { background: #e1eee5; }
button:disabled { opacity: .45; cursor: default; }
input:focus-visible, select:focus-visible, textarea:focus-visible, button:focus-visible { outline: 3px solid #6eab83; outline-offset: 2px; }
pre { margin: 8px 0 14px; padding: 15px; border-radius: 9px; font: 15px/1.65 ui-monospace, Consolas, monospace; white-space: pre-wrap; overflow-wrap: anywhere; }
.program { background: #182b22; color: #f2f8f4; }
.terminal { min-height: 65px; color: #193b2a; background: #fff; border: 1px solid #b4d1bd; }
.note, .status { padding: 12px 14px; border: 1px solid #b4d1bd; border-radius: 8px; background: #fff; overflow-wrap: anywhere; }
.status[data-state="error"] { color: #793b13; background: #fff0da; border-color: #d8b27d; }
.status[data-state="ok"] { color: #154b2b; background: #dcefe1; }
.memory { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.memory > div { padding: 12px; border: 1px solid #b4d1bd; border-radius: 8px; background: #fff; }
.memory strong { display: block; font: 25px/1.5 ui-monospace, Consolas, monospace; overflow-wrap: anywhere; }
.small { font-size: 14px; color: #3a5946; }
@media (max-width: 480px) { body { padding: 16px; } pre { font-size: 14px; } }
```

```game-js
const type = document.querySelector('#type');
const value = document.querySelector('#value');
function update() {
  const status = document.querySelector('#status');
  const valid = type.value === 'string' || /^[\x20-\x7E]$/.test(value.value);
  status.dataset.state = valid ? 'ok' : 'error';
  status.textContent = valid ? (type.value === 'char' ? 'char 使用單引號，這裡儲存一個字元。' : 'string 使用雙引號，可以是空字串，也可以包含空格與文字。') : '這段內容可以用 string 儲存。切換到 string 就能查看範例；char 模式則可以試 A、7 或 ?。';
  if (!valid) {
    document.querySelector('#program').textContent = '// 選擇 string，或在 char 模式試一個英文字母、數字或半形符號。';
    document.querySelector('#output').textContent = '';
    return;
  }
  const escaped = JSON.stringify(value.value).slice(1, -1).replaceAll("'", "\\'");
  const literal = type.value === 'char' ? "'" + escaped + "'" : JSON.stringify(value.value);
  document.querySelector('#program').textContent = '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    ' + type.value + ' data = ' + literal + ';\n    cout << data << endl;\n    return 0;\n}';
  document.querySelector('#output').textContent = value.value + '\n';
}
[type, value].forEach(control => control.addEventListener('input', update));
update();
```

:::

## 四、用變數名稱取得內容，用引號表示固定文字

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string name = "Ada";
    cout << name << endl;
    cout << "name" << endl;
    return 0;
}
```

輸出結果：

```text
Ada
name
```

`cout << name;` 會取得變數的內容，所以輸出 `Ada`。`cout << "name";` 使用雙引號中的固定文字，所以輸出 `name`。

## 五、用跳脫字元表示換行與特殊符號

在引號裡，反斜線 `\` 可以和後面的符號一起表示一個字元，這種寫法稱為**跳脫字元**。例如 `\n` 寫起來有兩個符號，代表的是一個換行字元。

| 寫法 | 代表的字元或作用 | ASCII 編號 |
| --- | --- | --- |
| `\n` | 換行，讓後面的內容從下一行開始 | 10（LF） |
| `\t` | 水平定位（Tab），移到下一個定位點 | 9（HT） |
| `\'` | 單引號 `'`，例如字元寫成 `'\''` | 39 |
| `\"` | 雙引號 `"`，可以放在字串裡 | 34 |
| `\\` | 反斜線 `\` 本身 | 92 |
| `\0` | 空字元（NUL），字元值為 0 | 0 |
| `\r` | 回到目前這一行的開頭（CR） | 13 |
| `\b` | 退格（BS），游標向前一格移動 | 8 |
| `\a` | 提示鈴聲（BEL） | 7 |
| `\f` | 換頁（FF） | 12 |
| `\v` | 垂直定位（VT） | 11 |

先練習前五種，就能處理常見的換行、Tab、引號與反斜線。其他項目可以在需要時查表；鈴聲、退格、換頁等效果會依使用的終端機而定。

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "A\tB\n";
    cout << "C\tD\n";
    cout << "She said: \"Hi!\"\n";
    cout << "C:\\temp\\note.txt\n";
    cout << '\'' << endl;
    return 0;
}
```

輸出結果（這裡用空格示意 Tab 的間隔）：

```text
A   B
C   D
She said: "Hi!"
C:\temp\note.txt
'
```

`\t` 會前進到下一個定位點，實際間隔取決於目前的位置與終端機設定。`\n` 和前面學過的 `endl` 都能讓輸出換行；`\n` 也能直接寫在字串裡。

## 六、查閱字元總表

字元編碼替字元安排了數字編號。**ASCII 的範圍是 0～127**，例如 `'A'` 對應 `65`、`'a'` 對應 `97`、`'0'` 對應 `48`。字元 `'0'` 和空字元 `\0`，可以透過編號 `48` 與 `0` 分辨。

點選任一格，就能在互動區上方查看它的編號、名稱、可視性與常見跳脫寫法。表內的 `LF`、`HT`、`SP` 等是方便辨認的標記，實際字元的作用會在詳情中說明。

:::interactive ASCII 字元總表

```game-html
<section class="character-explorer">
  <div class="explorer-heading"><h3>ASCII 字元表 · 0～127</h3><span>點格查看詳情，也可用方向鍵選取</span></div>
  <section id="character-detail" class="detail" aria-label="所選字元的詳細屬性">
    <div class="detail-top"><span id="character-symbol" class="large-symbol"></span><div><h4 id="character-name"></h4><p id="character-description"></p></div></div>
    <dl class="properties">
      <div><dt>十進位編號</dt><dd id="character-decimal"></dd></div>
      <div><dt>十六進位</dt><dd id="character-hex"></dd></div>
      <div><dt>二進位（8 位）</dt><dd id="character-binary"></dd></div>
      <div><dt>分類</dt><dd id="character-category"></dd></div>
      <div><dt>常見跳脫寫法</dt><dd id="character-escape"></dd></div>
      <div><dt>C++ 字元寫法</dt><dd id="character-literal"></dd></div>
    </dl>
  </section>
  <p id="selection-status" class="sr-only" role="status" aria-live="polite"></p>
  <div class="legend" aria-label="底色圖例"><span class="visible">可視字元</span><span class="control">不可視：控制字元</span><span class="space">不可視：空白</span></div>
  <div class="table-scroll" role="region" aria-label="每排 16 格的 ASCII 表，小螢幕可左右捲動" tabindex="0"><div id="ascii-grid" class="character-grid" role="group" aria-label="基本 ASCII 字元表，0 到 127"></div></div>
</section>
```

```game-css
* { box-sizing: border-box; }
body { margin: 0; padding: 10px; color: #193b2a; background: #f3faf5; font: 14px/1.4 system-ui, sans-serif; }
.explorer-heading { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 3px 12px; margin-bottom: 7px; }
h3 { margin: 0; font-size: 18px; line-height: 1.4; }
.explorer-heading > span { color: #385444; font-size: 11px; }
.detail { padding: 9px; border: 1px solid #578568; border-radius: 8px; background: #fff; }
.detail-top { display: grid; grid-template-columns: 40px minmax(0, 1fr); gap: 9px; align-items: center; min-height: 40px; }
.detail-top h4 { margin: 0 0 2px; font-size: 16px; line-height: 1.3; }
.detail-top p { margin: 0; font-size: 12px; line-height: 1.4; }
.large-symbol { display: grid; place-items: center; min-height: 40px; padding: 2px; border-radius: 5px; background: #edf5ef; font: 700 21px/1.2 ui-monospace, Consolas, monospace; overflow-wrap: anywhere; }
.properties { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 7px; margin: 7px 0 0; }
.properties div { min-width: 0; }
dt { color: #486252; font-size: 11px; line-height: 1.3; }
dd { margin: 2px 0 0; font: 600 12px/1.3 ui-monospace, Consolas, monospace; overflow-wrap: anywhere; }
.legend { display: flex; flex-wrap: wrap; gap: 5px; margin: 7px 0 5px; font-size: 11px; }
.legend span { padding: 3px 6px; border: 1px solid #97ada0; border-radius: 4px; }
.visible { background: #e3f3e7; color: #163d26; }
.control { background: #fae7d8; color: #623411; }
.space { background: #e1edf9; color: #214c74; }
.table-scroll { overflow-x: auto; padding: 3px; margin: 0 -3px; }
.character-grid { display: grid; grid-template-columns: repeat(16, minmax(0, 1fr)); gap: 2px; min-width: 542px; }
.character-cell { display: grid; grid-template-rows: 11px 16px 11px; align-items: center; justify-items: center; min-width: 0; min-height: 44px; padding: 2px 1px; border: 1px solid #819c89; border-radius: 4px; font: inherit; cursor: pointer; }
.character-cell[aria-pressed="true"] { border-color: #154e33; outline: 3px solid #154e33; outline-offset: -3px; }
.character-cell:hover { box-shadow: inset 0 0 0 2px #577b63; }
.character-cell:focus-visible, .table-scroll:focus-visible { outline: 2px solid #2c68c5; outline-offset: 1px; }
.cell-number { font-size: 9px; line-height: 11px; }
.cell-symbol { font: 650 12px/16px ui-monospace, Consolas, monospace; }
.cell-escape { min-height: 11px; font: 650 10px/11px ui-monospace, Consolas, monospace; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
@media (max-width: 540px) { .properties { grid-template-columns: repeat(3, minmax(0, 1fr)); row-gap: 6px; } }
```

```game-js
// 基本 ASCII 0～127；所有資料隨本頁載入。
const controlNames = [
  ['NUL', '空字元'], ['SOH', '標頭開始'], ['STX', '本文開始'], ['ETX', '本文結束'],
  ['EOT', '傳輸結束'], ['ENQ', '詢問'], ['ACK', '確認'], ['BEL', '提示鈴聲'],
  ['BS', '退格'], ['HT', '水平定位（Tab）'], ['LF', '換行'], ['VT', '垂直定位'],
  ['FF', '換頁'], ['CR', '回到行首'], ['SO', '切出'], ['SI', '切入'],
  ['DLE', '資料連結跳脫'], ['DC1', '裝置控制 1'], ['DC2', '裝置控制 2'], ['DC3', '裝置控制 3'],
  ['DC4', '裝置控制 4'], ['NAK', '否定確認'], ['SYN', '同步閒置'], ['ETB', '傳輸區塊結束'],
  ['CAN', '取消'], ['EM', '媒體結束'], ['SUB', '替代'], ['ESC', '跳脫控制碼'],
  ['FS', '檔案分隔'], ['GS', '群組分隔'], ['RS', '紀錄分隔'], ['US', '單元分隔'],
];
const escapeCodes = { 0: '\\0', 7: '\\a', 8: '\\b', 9: '\\t', 10: '\\n', 11: '\\v', 12: '\\f', 13: '\\r', 34: '\\"', 39: "\\'", 63: '\\?', 92: '\\\\' };
const punctuationNames = {
  33: '驚嘆號', 34: '雙引號', 35: '井字號', 36: '錢字號', 37: '百分號', 38: '和號', 39: '單引號',
  40: '左小括號', 41: '右小括號', 42: '星號', 43: '加號', 44: '逗號', 45: '連字號／減號', 46: '句點', 47: '斜線',
  58: '冒號', 59: '分號', 60: '小於號', 61: '等號', 62: '大於號', 63: '問號', 64: '小老鼠符號',
  91: '左中括號', 92: '反斜線', 93: '右中括號', 94: '插入符號', 95: '底線', 96: '反引號',
  123: '左大括號', 124: '直線符號', 125: '右大括號', 126: '波浪號',
};
const descriptions = {
  0: '字元值為 0 的空字元，常用於表示 C 風格字串的結尾。',
  7: '提示終端機發出鈴聲或其他提醒，實際效果由終端機決定。',
  8: '讓游標向前一格移動，畫面效果由終端機決定。',
  9: '讓游標移到下一個水平定位點，常用於安排欄位。',
  10: '表示換行；在文字輸出中讓後面的內容從下一行開始。',
  11: '垂直定位控制，實際效果由終端機決定。',
  12: '表示換頁控制，實際效果由輸出裝置決定。',
  13: '讓游標回到目前這一行的開頭。',
  27: 'ESC 是一個控制碼；反斜線引導的 C++ 跳脫寫法則是程式語法。',
  32: '一般空格，會佔一個文字位置；表格使用 SP 標記方便辨認。',
  34: '在字串內可以用反斜線搭配雙引號，表示引號本身。',
  39: '在單引號包住的字元內，用反斜線搭配單引號，表示引號本身。',
  48: '這是文字中的數字 0，ASCII 編號是 48；空字元的編號是 0。',
  63: '問號可以直接寫成字元；C++ 也提供對應的跳脫寫法。',
  92: '用兩個反斜線表示一個反斜線，例如在字串中寫入檔案路徑。',
  127: 'DEL 刪除控制碼，表格用名稱標記。',
};
function characterInfo(code) {
  const symbol = String.fromCodePoint(code);
  let category = '可視字元', kind = 'visible', name = '', display = symbol;
  if (code < 32) {
    [display, name] = controlNames[code]; category = '不可視：控制字元'; kind = 'control';
  } else if (code === 127) {
    display = 'DEL'; name = '刪除'; category = '不可視：控制字元'; kind = 'control';
  } else if (code === 32) {
    display = 'SP'; name = '空格'; category = '不可視：空白'; kind = 'space';
  } else if (code >= 48 && code <= 57) name = '數字字元 ' + symbol;
  else if (code >= 65 && code <= 90) name = '大寫英文字母 ' + symbol;
  else if (code >= 97 && code <= 122) name = '小寫英文字母 ' + symbol;
  else name = punctuationNames[code];
  const escape = escapeCodes[code] || '';
  const literal = escape ? "'" + escape + "'" : code === 32 ? "' '" : kind === 'visible' ? "'" + symbol + "'" : '—';
  const description = descriptions[code] || (kind === 'control' ? '控制字元，用來傳遞控制資訊；表格以名稱呈現。' : '可以在文字中顯示的字元。');
  return { code, name, display, kind, category, escape, literal, description };
}
const cells = [];
let selectedCode = 65;
function selectCharacter(code) {
  const info = characterInfo(code);
  selectedCode = code;
  document.querySelector('#character-symbol').textContent = info.display;
  document.querySelector('#character-name').textContent = info.name;
  document.querySelector('#character-description').textContent = info.description;
  document.querySelector('#character-decimal').textContent = String(code);
  document.querySelector('#character-hex').textContent = '0x' + code.toString(16).toUpperCase().padStart(2, '0');
  document.querySelector('#character-binary').textContent = code.toString(2).padStart(8, '0');
  document.querySelector('#character-category').textContent = info.category;
  document.querySelector('#character-escape').textContent = info.escape || '—';
  document.querySelector('#character-literal').textContent = info.literal;
  cells.forEach((cell, index) => { cell.setAttribute('aria-pressed', String(index === code)); cell.tabIndex = index === code ? 0 : -1; });
  document.querySelector('#selection-status').textContent = '已選擇 ' + code + '，' + info.name + '，' + info.category + (info.escape ? '，跳脫寫法 ' + info.escape : '');
}
for (let code = 0; code <= 127; code++) {
  const info = characterInfo(code);
  const button = document.createElement('button');
  button.type = 'button'; button.className = 'character-cell ' + info.kind; button.dataset.code = String(code);
  button.setAttribute('aria-label', code + '，' + info.name + '，' + info.category + (info.escape ? '，' + info.escape : ''));
  for (const [className, text] of [['cell-number', String(code)], ['cell-symbol', info.display], ['cell-escape', info.escape]]) {
    const span = document.createElement('span'); span.className = className; span.textContent = text; button.append(span);
  }
  button.addEventListener('click', () => selectCharacter(code));
  button.addEventListener('keydown', event => {
    const columns = getComputedStyle(button.parentElement).gridTemplateColumns.split(' ').length;
    const offsets = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -columns, ArrowDown: columns };
    let target;
    if (event.key in offsets) target = Math.max(0, Math.min(127, code + offsets[event.key]));
    else if (event.key === 'Home') target = 0;
    else if (event.key === 'End') target = 127;
    else return;
    event.preventDefault(); selectCharacter(target); cells[target].focus();
  });
  cells.push(button);
  document.querySelector('#ascii-grid').append(button);
}
selectCharacter(selectedCode);
```

:::

## 七、自己試一試

先用 `char` 儲存你的英文名字開頭字母，再用 `string` 儲存完整英文名字。接著建立一個空字串，觀察輸出空字串加上 `endl` 時，畫面上會出現什麼。

再用字元表找出 `A`、`a`、`0`、空白、換行、Tab、單引號、雙引號與反斜線，觀察它們的編號和寫法。把範例中的換行改成 Tab，也可以比較畫面上的排列方式。
