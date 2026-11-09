---
title: "使用 cin 讀取資料"
type: interactive
order: 3
hidden: false
draft: false
---

## 一、讓資料從輸入進入程式

前面的值都直接寫在原始碼中。使用 `cin`，就能在程式執行時讀取輸入資料。

```cpp
#include <iostream>
using namespace std;

int main() {
    int age = 0;
    cin >> age;
    cout << age << endl;
    return 0;
}
```

範例輸入：

```text
16
```

範例輸出：

```text
16
```

先用 `int age = 0;` 建立變數，再寫 `cin >> age;`，就能把讀到的整數存進 `age`。`>>` 後面直接寫接收資料的變數名稱。

## 二、分清楚輸入與輸出的方向

| 用途 | 寫法 |
| --- | --- |
| 輸入資料到變數 | `cin >> age;` |
| 輸出變數的內容 | `cout << age << endl;` |

可以把箭頭方向想成資料流動的方向：資料由 `cin` 流向變數，輸出時則把資料送到 `cout`。

要讓輸出換行時，把 `endl` 放在 `cout` 敘述中，例如 `cout << age << endl;`。

## 三、一次讀取多個資料

```cpp
#include <iostream>
using namespace std;

int main() {
    int age = 0;
    double height = 0.0;

    cin >> age >> height;
    cout << age << endl;
    cout << height << endl;
    return 0;
}
```

範例輸入：

```text
16 170.5
```

範例輸出：

```text
16
170.5
```

`cin >> age >> height;` 先讀 `age`，再讀 `height`，順序由左到右。也可以拆成兩個敘述：

```cpp
cin >> age;
cin >> height;
```

讀取這些數值時，前面的空白、Tab 和換行會被略過。因此，把 `16` 與 `170.5` 分成兩行輸入，也能得到相同結果。

讀入資料時，`cin` 會依序取得數值；呈現結果時，則由 `cout` 敘述安排空格與換行。

:::interactive cin 讀取順序追蹤

```game-html
<section>
<h3>資料先進入哪個變數？</h3>
<label>輸入資料<textarea id="input" spellcheck="false">12 34 56</textarea></label>
<div class="actions"><button id="next" type="button">讀入 a</button><button id="reset" type="button">重新開始</button><button id="lines" type="button">換成分行輸入</button></div>
<div class="memory"><div>a<strong id="a">0</strong></div><div>b<strong id="b">0</strong></div></div>
<p id="status" class="status" aria-live="polite"></p>
<h4>尚未對應的資料項目</h4><pre id="pending" class="terminal"></pre>
<h4>完整程式示意</h4><pre id="program" class="program" aria-label="程式碼，目前執行的指令會以亮色標示"></pre>
<h4>輸出結果</h4><pre id="output" class="terminal" aria-live="polite"></pre>
<p class="small">本練習採 32 位元 int，可以用空格或換行分隔整數，觀察資料依序存進變數的過程。</p>
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
.program { padding: 10px 0; font-size: 0; line-height: 0; }
.code-line { position: relative; display: block; min-height: 1.65em; padding: 2px 14px 2px 3.5em; border-left: 4px solid transparent; font-size: 15px; line-height: 1.65; white-space: pre-wrap; overflow-wrap: anywhere; }
.code-line::before { position: absolute; left: .4em; width: 2em; color: #aac2b3; content: attr(data-line); text-align: right; }
.code-line.is-current { color: #fff; background: #365f47; border-left-color: #ffe38a; }
.code-line.is-current::before { color: #ffe38a; font-weight: 800; }
.terminal { min-height: 65px; color: #193b2a; background: #fff; border: 1px solid #b4d1bd; }
.note, .status { padding: 12px 14px; border: 1px solid #b4d1bd; border-radius: 8px; background: #fff; overflow-wrap: anywhere; }
.status[data-state="error"] { color: #793b13; background: #fff0da; border-color: #d8b27d; }
.status[data-state="ok"] { color: #154b2b; background: #dcefe1; }
.memory { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.memory > div { padding: 12px; border: 1px solid #b4d1bd; border-radius: 8px; background: #fff; }
.memory strong { display: block; font: 25px/1.5 ui-monospace, Consolas, monospace; overflow-wrap: anywhere; }
.small { font-size: 14px; color: #3a5946; }
@media (max-width: 480px) { body { padding: 16px; } pre, .code-line { font-size: 14px; } .program { font-size: 0; } }
```

```game-js
const input = document.querySelector('#input');
const next = document.querySelector('#next');
const status = document.querySelector('#status');
let step = 0;
let values = [0, 0];
const program = '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a = 0;\n    int b = 0;\n    cin >> a;\n    cin >> b;\n    cout << a << " " << b << endl;\n    return 0;\n}';
const programElement = document.querySelector('#program');
const codeLines = program.split('\n').map((text, index) => {
  const line = document.createElement('span');
  line.className = 'code-line';
  line.dataset.line = String(index + 1);
  line.textContent = text;
  programElement.append(line);
  if (index < program.split('\n').length - 1) programElement.append(document.createTextNode('\n'));
  return line;
});
function tokens() {
  const text = input.value.replace(/^[ \t\r\n\v\f]+|[ \t\r\n\v\f]+$/g, '');
  return text ? text.split(/[ \t\r\n\v\f]+/) : [];
}
function render() {
  const currentLine = [null, 7, 8, 9][step];
  codeLines.forEach(line => {
    const current = Number(line.dataset.line) === currentLine;
    line.classList.toggle('is-current', current);
    if (current) line.setAttribute('aria-current', 'step');
    else line.removeAttribute('aria-current');
  });
  document.querySelector('#a').textContent = String(values[0]);
  document.querySelector('#b').textContent = String(values[1]);
  document.querySelector('#pending').textContent = tokens().slice(Math.min(step, 2)).join(' ') || '（沒有剩餘的資料項目）';
  document.querySelector('#output').textContent = step === 3 ? values.join(' ') + '\n' : '';
  next.textContent = ['讀入 a', '讀入 b', '執行 cout', '已完成'][step];
  next.disabled = step === 3;
}
function reset() {
  step = 0;
  values = [0, 0];
  status.dataset.state = '';
  status.textContent = 'a 和 b 已初始化為 0，準備依序讀取資料。';
  render();
}
next.addEventListener('click', () => {
  if (step < 2) {
    const token = tokens()[step];
    if (token === undefined) {
      status.dataset.state = 'error';
      status.textContent = '在輸入區補上下一個整數，就能繼續這一步。';
      return;
    }
    const number = Number(token);
    if (!/^[+-]?\d+$/.test(token) || !Number.isInteger(number) || number < -2147483648 || number > 2147483647) {
      status.dataset.state = 'error';
      status.textContent = '可以試 12、0 或 -7 這樣的完整整數；本練習的範圍是 -2147483648 到 2147483647。';
      return;
    }
    values[step] = number;
    status.textContent = token + ' 存進 ' + (step === 0 ? 'a' : 'b') + '，接著處理下一步。';
  } else {
    status.textContent = 'cout 輸出 a、空格、b，再換行。兩次 cin 已完成讀取，第三個整數留在輸入中。';
  }
  status.dataset.state = 'ok';
  step++;
  render();
});
input.addEventListener('input', reset);
document.querySelector('#reset').addEventListener('click', reset);
document.querySelector('#lines').addEventListener('click', () => { input.value = '12\n34\n56'; reset(); });
reset();
```

:::

## 四、輸入格式要對應型態

準備輸入資料時，可以先看接收它的變數型態：`int` 接收整數，例如 `16`；`double` 可以接收小數，例如 `170.5`；`char` 接收一個字元，例如 `A`；`string` 則可以接收一段以空白分隔的文字，例如 `Ada`。

先讓資料的格式、數值範圍與變數相符，再按照 `cin` 的順序排列，就能練習把每一筆資料送到對應的位置。其他輸入情況與讀取失敗的處理，會留到後面的內容再介紹。

若是 OJ 題目，輸出內容以題目指定的答案為準。例如題目要求一個數字，就用 `cout` 輸出該數字；「請輸入年齡」這類提示文字，適合放在題目有要求或自己設計的互動程式中。

## 五、自己試一試

讀入兩個整數，先按照輸入順序輸出，再改成相反順序輸出。保留 `cin` 的讀取順序，調整 `cout` 裡的變數順序，觀察輸出結果。
