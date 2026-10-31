---
title: "布林型態 bool"
type: interactive
order: 5
hidden: false
draft: false
---

## 一、資料只有兩種狀態時

是否準備完成、燈是否開啟等狀態，可以使用 `bool`。它有兩個值：`true` 與 `false`。

```cpp
#include <iostream>
using namespace std;

int main() {
    bool ready = true;
    bool lightOn = false;

    cout << ready << endl;
    cout << lightOn << endl;
    return 0;
}
```

輸出結果：

```text
1
0
```

在預設輸出格式中，布林值 `true` 輸出為 `1`，`false` 輸出為 `0`。變數的型態仍然是 `bool`，而 `1`、`0` 是畫面上呈現這兩種狀態的方式。

布林值直接寫成小寫的 `true`、`false`，就像上面的 `bool ready = true;`。加上雙引號的 `"false"` 則是一段文字，可以用 `string` 儲存。

## 二、切換狀態，觀察輸出

勾選或取消下方選項，比較 `ready` 是 `true` 與 `false` 時的輸出結果。

:::interactive 布林值與輸出結果

```game-html
<section>
<h3>true 和 false 會輸出什麼？</h3>
<label class="check"><input id="ready" type="checkbox" checked>ready 設為 true</label>
<p id="state" class="note" aria-live="polite"></p>
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
const ready = document.querySelector('#ready');
function update() {
  const literal = ready.checked ? 'true' : 'false';
  document.querySelector('#state').textContent = 'ready 目前的值是 ' + literal + '，使用 cout 輸出時會顯示 ' + (ready.checked ? '1' : '0') + '。';
  document.querySelector('#program').textContent = '#include <iostream>\nusing namespace std;\n\nint main() {\n    bool ready = ' + literal + ';\n    cout << ready << endl;\n    return 0;\n}';
  document.querySelector('#output').textContent = (ready.checked ? '1' : '0') + '\n';
}
ready.addEventListener('input', update);
update();
```

:::

## 三、之後會用在條件判斷

`bool` 適合表達真、假狀態。後面介紹選擇結構與迴圈時，會再使用它決定哪些敘述要執行。這一篇先認識型態、兩個值，以及輸出方式。

## 四、自己試一試

宣告 `bool finished = false;`，先輸出它，再把它改成 `true` 後輸出，觀察兩次輸出有什麼不同。
