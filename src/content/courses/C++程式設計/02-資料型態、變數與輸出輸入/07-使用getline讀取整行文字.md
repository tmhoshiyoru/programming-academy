---
title: "使用 getline 讀取整行文字"
type: interactive
order: 7
hidden: true
draft: false
---

## 一、名字中間有空格時

使用 `cin >> name;` 讀取 `string` 時，前面的空白會被略過，讀取會在下一個空白處停止。輸入 `Ada Lovelace`，`name` 只會取得 `Ada`。

如果希望連同中間的空格一起讀取，可以使用 `getline`：

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string name = "";
    getline(cin, name);
    cout << "[" << name << "]" << endl;
    return 0;
}
```

範例輸入：

```text
Ada Lovelace
```

範例輸出：

```text
[Ada Lovelace]
```

這裡把結果包在 `[`、`]` 裡，方便看清楚內容的邊界。括號是這個範例刻意輸出的文字，不是 `getline` 自動加上的。

## 二、getline 讀到哪裡？

`getline(cin, name);` 會讀取目前這一行的內容，直到換行為止。**換行字元會被取走，但不會存進 `name`。**

`getline` 會保留這一行開頭與中間的空格。若下一個字元就是換行，讀到的會是空字串，而不是自動跳到下一行。

## 三、先用 cin 讀數字，再用 getline

下面這個範例**先讀一整數年齡，下一行再讀姓名**，卻容易得到空字串：

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    int age = 0;
    string name = "";

    cin >> age;
    getline(cin, name);

    cout << "[" << name << "]" << endl;
    return 0;
}
```

輸入資料：

```text
16
Ada Lovelace
```

`cin >> age;` 讀走 `16` 後，後面的換行仍留著。接著 `getline` 立刻遇到這個換行，於是 `name` 是空字串，範例會輸出 `[]`。

## 四、結束數字所在的那一行

如果輸入格式規定年齡獨立一行、姓名在下一行，可以先把數字所在行的剩餘內容略過，再讀姓名：

```cpp
#include <iostream>
#include <string>
#include <limits>
using namespace std;

int main() {
    int age = 0;
    string name = "";

    cin >> age;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');
    getline(cin, name);

    cout << "[" << name << "]" << endl;
    return 0;
}
```

同樣輸入：

```text
16
Ada Lovelace
```

輸出結果：

```text
[Ada Lovelace]
```

`cin.ignore(..., '\n')` 在這裡會略過目前這一行的剩餘內容，包含結尾的換行。`numeric_limits<streamsize>::max()` 表示略過數量的上限，因此需要 `<limits>`。

**這不是每個 `getline` 前面都要加的固定步驟。** 如果前面沒有留下那一行資料，無條件使用 `ignore` 反而會丟掉原本要讀取的內容。

這個範例也不適用於把年齡與姓名寫在同一行的輸入格式；那樣姓名也會被一起略過。以上都以前面的整數成功讀入為前提。

:::interactive cin 與 getline 讀取邊界

```game-html
<section>
<h3>同一份資料，不同方式會讀到什麼？</h3>
<label>讀取方式<select id="mode"><option value="word">cin &gt;&gt; name</option><option value="line">getline(cin, name)</option><option value="mixed-bad">先讀 age，再直接 getline</option><option value="mixed-fixed">先讀 age，略過該行，再 getline</option></select></label>
<label>輸入資料<textarea id="input" spellcheck="false">Ada Lovelace
Grace Hopper
</textarea></label>
<p id="explanation" class="status" aria-live="polite"></p>
<h4>完整程式示意</h4><pre id="program" class="program"></pre>
<h4>輸出結果</h4><pre id="output" class="terminal" aria-live="polite"></pre>
<h4>剩餘輸入的示意</h4><pre id="remaining" class="terminal"></pre>
<p class="small">剩餘輸入用引號標示，\n 表示換行；這是讀取邊界的教學示意，不是任意 C++ 程式的編譯器。</p>
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
const mode = document.querySelector('#mode');
const input = document.querySelector('#input');
function readLine(text) {
  const index = text.indexOf('\n');
  return index === -1 ? { value: text, rest: '' } : { value: text.slice(0, index), rest: text.slice(index + 1) };
}
function update() {
  const mixed = mode.value.startsWith('mixed');
  const fixed = mode.value === 'mixed-fixed';
  const reads = mixed ? '    cin >> age;\n' + (fixed ? "    cin.ignore(numeric_limits<streamsize>::max(), '\\n');\n" : '') + '    getline(cin, name);' : (mode.value === 'word' ? '    cin >> name;' : '    getline(cin, name);');
  document.querySelector('#program').textContent = '#include <iostream>\n#include <string>\n' + (fixed ? '#include <limits>\n' : '') + 'using namespace std;\n\nint main() {\n' + (mixed ? '    int age = 0;\n' : '') + '    string name = "";\n' + reads + '\n    cout << "[" << name << "]" << endl;\n    return 0;\n}';
  let text = input.value;
  let name = '';
  let explanation = '';
  let error = false;
  if (!text.length) {
    error = true;
    explanation = '目前沒有輸入資料。若要測試空白行，請在輸入框按一次 Enter。';
  } else if (mode.value === 'word') {
    const match = text.match(/^[ \t\r\n\v\f]*([^ \t\r\n\v\f]+)/);
    if (!match) { error = true; explanation = '沒有可供此範例讀取的非空白文字。'; }
    else { name = match[1]; text = text.slice(match[0].length); explanation = 'cin >> name 在空白前停止，不會讀入後面的整行。'; }
  } else if (!mixed) {
    const line = readLine(text);
    name = line.value; text = line.rest;
    explanation = 'getline 取得這一行的內容，包含空格；結尾換行被取走，不存入字串。';
  } else {
    const match = text.match(/^[ \t\r\n\v\f]*([+-]?\d+)/);
    if (!match || !Number.isInteger(Number(match[1])) || Number(match[1]) < -2147483648 || Number(match[1]) > 2147483647) {
      error = true; explanation = '這個範例需要先提供一個範圍內的整數年齡，再換行輸入姓名。';
    } else {
      text = text.slice(match[0].length);
      if (fixed) {
        const newline = text.indexOf('\n');
        if (newline === -1) { error = true; explanation = '略過目前這一行後，沒有下一行姓名。請把年齡和姓名分成兩行。'; text = ''; }
        else text = text.slice(newline + 1);
      }
      if (!error && !text.length) { error = true; explanation = '目前沒有下一行資料可讀取，請補上姓名或空白行。'; }
      if (!error) {
        const line = readLine(text);
        name = line.value; text = line.rest;
        explanation = fixed ? '先結束年齡所在的那一行，再從下一行讀姓名。' : '年齡後的換行還留著；getline 立刻讀到它，因此 name 是空字串。';
        if (!fixed && name !== '') explanation = '直接從年齡之後的位置 getline；這份輸入在換行前還有其他內容，所以 name 取得了那段內容。';
      }
    }
  }
  const status = document.querySelector('#explanation');
  status.dataset.state = error ? 'error' : 'ok';
  status.textContent = explanation;
  document.querySelector('#output').textContent = error ? '' : '[' + name + ']\n';
  document.querySelector('#remaining').textContent = JSON.stringify(text);
}
mode.addEventListener('change', () => {
  input.value = mode.value.startsWith('mixed') ? '16\nAda Lovelace\n' : 'Ada Lovelace\nGrace Hopper\n';
  update();
});
input.addEventListener('input', update);
update();
```

:::

## 五、自己試一試

先輸入 `C++ Lab 2026`，比較 `cin >> name` 與 `getline` 的結果。再在開頭加兩個空格，或把第一行留空，觀察哪一種方式會保留這些資料。

字串讀取與 `getline` 的規則可參考 [C++ 工作草案：字串輸入與輸出](https://eel.is/c++draft/string.io)。
