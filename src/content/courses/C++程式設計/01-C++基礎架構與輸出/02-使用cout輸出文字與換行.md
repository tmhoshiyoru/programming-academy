---
title: 使用 cout 輸出文字與換行
type: interactive
order: 2
hidden: false
draft: false
---

## 一、使用 `cout` 輸出內容

`cout` 是標準輸出串流。在一般主控台程式中，我們用它把內容輸出到畫面上。

基本寫法是：

```cpp
cout << 要輸出的內容;
```

這一行是語法示意；「要輸出的內容」要換成實際的字串、數字或運算式。

其中 `<<` 是輸出時使用的串流插入運算子。現在可以先理解成：**把右邊的內容送給左邊的 `cout`。**

### 1. 文字要放在半形雙引號裡

```cpp
cout << "開始學習 C++！";
```

雙引號內的內容稱為**字串**。雙引號用來標示字串的開始與結束，不會被一起輸出。

請使用鍵盤上的半形雙引號 `"`，不要使用中文的 `「」` 或彎引號。

### 2. 數字與運算式可以直接輸出

```cpp
cout << 123;
cout << 3 + 4;
cout << "3 + 4";
```

這三行分別輸出 `123`、`7`、`3 + 4`。第三行有雙引號，所以裡面的內容會被當成文字，不會進行加法。

先留意：`cout` **不會自動補上空格或換行**。如果把這三行直接連續執行，結果也會連在一起。

### 3. 用多個 `<<` 接續輸出

同一個輸出敘述可以接上多段內容：

```cpp
cout << "Hello," << " " << "C++!";
```

輸出結果是：

```text
Hello, C++!
```

中間的 `" "` 是包含一個空格的字串。刪掉它，結果就會變成 `Hello,C++!`。


### 4. 先用 `endl` 換行

`endl` 是常見的換行寫法。把它接在 `<<` 後面，後續內容就會從下一行開始輸出。

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "第一行" << endl;
    cout << "第二行" << endl;
    return 0;
}
```

輸出結果：

```text
第一行
第二行
```

**`endl` 不加雙引號。** 如果寫成 `"endl"`，那是一段普通字串，會輸出 `endl` 這四個字母，而不是換行。

第一篇已說明 `main` 結尾的 `return 0;` 可以省略；本篇的完整範例先保留它，方便你對照原本的架構。

### 5. 再認識字串中的 `\n`

除了 `endl`，也可以在字串中使用 `\n` 代表換行：

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "第一行" << "\n";
    cout << "第二行" << "\n";
    return 0;
}
```

也可以寫 `cout << "第一行\n第二行\n";`，把換行放在同一個字串裡。這裡的 `\n` 要放在引號內，使用的是**反斜線 `\`**，不是斜線 `/`。

`endl` 和 `\n` 都能讓畫面換行；`endl` 還會將輸出緩衝內容送出。這一篇先以 `endl` 練習，再比較字串中的 `\n` 寫法。

### 動手試試：空格與換行會出現在哪裡？

調整兩段文字和中間的分隔方式，觀察程式示意及輸出結果。這是針對 `cout` 範例的教學模擬，不是可以執行任意 C++ 程式的編譯器。

:::interactive cout 文字與換行實驗

```game-html
<section aria-labelledby="demo-title">
  <p class="tag">動手探索 02</p>
  <h3 id="demo-title">把文字送到畫面上</h3>
  <div class="fields">
    <label>第一段文字<input id="first" type="text" value="Hello," maxlength="40"></label>
    <label>第二段文字<input id="second" type="text" value="C++!" maxlength="40"></label>
  </div>
  <label class="separator-label">兩段文字中間放什麼？
    <select id="separator">
      <option value="none">不放任何東西</option>
      <option value="space" selected>一個空格</option>
      <option value="newline">換行</option>
    </select>
  </label>
  <label class="separator-label">換行的寫法
    <select id="newline-style">
      <option value="endl" selected>endl（不加雙引號）</option>
      <option value="escape">"\n"（放在字串裡）</option>
    </select>
  </label>
  <label class="check"><input id="trailing-newline" type="checkbox" checked>輸出結束後再換行</label>
  <div class="caption"><h4>完整程式示意</h4><button id="reset" type="button">還原範例</button></div>
  <pre id="program" class="program"></pre>
  <h4>輸出結果</h4>
  <pre id="output" class="terminal" aria-live="polite"></pre>
  <p id="observation" class="observation" aria-live="polite"></p>
</section>
```

```game-css
* { box-sizing: border-box; }
body { margin: 0; padding: 22px; background: #f3faf5; color: #193b2a; font: 17px/1.7 system-ui, sans-serif; }
.tag { margin: 0 0 4px; color: #356448; font-size: 13px; font-weight: 800; letter-spacing: .08em; }
h3 { margin: 0 0 18px; font-size: 24px; line-height: 1.4; }
h4 { margin: 18px 0 8px; font-size: 17px; }
.fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
label { display: block; font-weight: 650; }
input[type="text"], select { display: block; width: 100%; min-width: 0; margin-top: 5px; padding: 10px 12px; border: 1px solid #8eaf9a; border-radius: 8px; background: #fff; color: #193b2a; font: inherit; }
.separator-label { margin-top: 14px; }
.check { display: flex; align-items: center; gap: 8px; margin-top: 14px; font-size: 15px; }
.check input { flex: 0 0 auto; width: 18px; height: 18px; accent-color: #276342; }
.caption { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 18px; }
.caption h4 { margin: 0; }
button { padding: 7px 12px; border: 1px solid #87ac94; border-radius: 7px; color: #234d34; background: #fff; font: 14px/1.5 system-ui, sans-serif; cursor: pointer; }
button:hover { background: #e4f1e8; }
input:focus-visible, select:focus-visible, button:focus-visible { outline: 3px solid #6eab83; outline-offset: 2px; }
pre { margin: 10px 0 0; padding: 16px; border-radius: 10px; font: 15px/1.65 ui-monospace, Consolas, monospace; white-space: pre-wrap; overflow-wrap: anywhere; }
.program { background: #182b22; color: #f2f8f4; }
.terminal { min-height: 80px; background: #fff; color: #193b2a; border: 1px solid #b4d1bd; }
.observation { margin: 10px 0 0; font-size: 14px; color: #365843; }
@media (max-width: 480px) { body { padding: 16px; } .fields { grid-template-columns: 1fr; } pre { font-size: 14px; } }
```

```game-js
const first = document.querySelector('#first');
const second = document.querySelector('#second');
const separator = document.querySelector('#separator');
const newlineStyle = document.querySelector('#newline-style');
const trailingNewline = document.querySelector('#trailing-newline');
function updateOutput() {
  const between = { none: '', space: ' ', newline: '\n' }[separator.value];
  const newlineCode = newlineStyle.value === 'endl' ? 'endl' : '"\\n"';
  const pieces = [JSON.stringify(first.value)];
  if (between) pieces.push(between === '\n' ? newlineCode : JSON.stringify(between));
  pieces.push(JSON.stringify(second.value));
  if (trailingNewline.checked) pieces.push(newlineCode);
  document.querySelector('#program').textContent = `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << ${pieces.join(' << ')};\n    return 0;\n}`;
  document.querySelector('#output').textContent = first.value + between + second.value + (trailingNewline.checked ? '\n' : '');
  const explanation = { none: '沒有分隔字元，兩段文字會緊接在一起。', space: '中間的 " " 會輸出一個空格。', newline: `中間的 ${newlineCode} 讓第二段文字從下一行開始。` }[separator.value];
  document.querySelector('#observation').textContent = explanation + (trailingNewline.checked ? ` 最後使用 ${newlineCode} 再換行一次。` : ' 最後不會自動換行。');
}
[first, second, separator, newlineStyle, trailingNewline].forEach(control => control.addEventListener('input', updateOutput));
document.querySelector('#reset').addEventListener('click', () => {
  first.value = 'Hello,';
  second.value = 'C++!';
  separator.value = 'space';
  newlineStyle.value = 'endl';
  trailingNewline.checked = true;
  updateOutput();
});
updateOutput();
```

:::


## 二、自己試一試

把上面的完整程式複製到你的 C++ 開發環境，再依序練習：

1. 用兩個 `cout` 敘述輸出兩句話，先不加 `endl`，觀察它們會不會自動分行。
2. 加上 `endl`，讓兩句話分別輸出在不同的行。
3. 把其中一個 `endl` 改成 `"\n"`，比較畫面上的輸出結果。

重點是：程式碼本身的換行，不會自動變成輸出內容的換行；空格和換行都要透過輸出內容指定。
