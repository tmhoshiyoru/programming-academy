---
title: "浮點數 float、double 與輸出格式"
type: interactive
order: 3
hidden: false
draft: false
---

## 一、資料包含小數時

身高、長度等資料可能有小數部分，可以使用浮點數型態。常見的兩種是 `float` 與 `double`，宣告方式和前面學過的整數變數相同：

```cpp
#include <iostream>
using namespace std;

int main() {
    float length = 3.5;
    double height = 1.75;

    cout << length << endl;
    cout << height << endl;
    return 0;
}
```

輸出結果：

```text
3.5
1.75
```

兩者都能存放包含小數的數值，例如 `3.5`、`1.75`、`-2.5`。使用 `cout` 時，也都可以直接寫變數名稱。

## 二、float 和 double 有什麼差別？

主要差別是**佔用的空間**與**能保留多少位數字**。以下是常見環境中的情況：

| 型態 | 常見佔用空間 | 大約能保留的有效位數 |
| --- | --- | --- |
| `float` | 4 位元組（32 位元） | 6～7 位 |
| `double` | 8 位元組（64 位元） | 15～16 位 |

「有效位數」是從第一個非零數字開始計算，**把整數部分與小數部分一起計算**。例如 `123.456` 有 6 位有效數字，`0.00123456` 也有 6 位。

`float` 佔用的空間通常較少；`double` 通常能保留更多位數字，數值很大或很小時，能表示的範圍也通常更廣。這裡的位元數與位數是常見情況，不同環境可能不同。

例如，把 `1.23456789` 放進兩種變數後，若輸出小數點後 9 位，常見結果如下：

```text
float ：1.234567881
double：1.234567890
```

`float` 的可用位數較少，儲存時會以接近原始數值的值表示；`double` 能保留更多位數。本課後面的範例會以 `double` 為主，一般需要存小數時，可以先選擇 `double`。

## 三、認識浮點數的精確度與輸出格式

電腦用有限的二進位位數儲存浮點數。像 `3.5` 可以精確表示；像 `0.1` 這類小數，則會儲存成很接近的值。`float` 與 `double` 都有這個特性，而 `double` 通常能保留更多位數。

**輸出的格式**決定畫面如何呈現這個值。例如 `double value = 3.0;`，直接使用 `cout` 時可能輸出 `3`；變數的型態仍然是 `double`。

## 四、固定輸出小數點後幾位

若題目要求小數點後兩位，可以搭配 `fixed` 與 `setprecision(2)`：

```cpp
#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    double length = 3.5;
    cout << fixed << setprecision(2) << length << endl;
    return 0;
}
```

輸出結果：

```text
3.50
```

- `<iomanip>`：提供 `setprecision` 等格式控制工具。
- `fixed`：使用固定小數點格式。
- `setprecision(2)`：搭配 `fixed` 時，指定小數點後兩位。

輸出位數需要補齊時會補 `0`，需要縮短時則依儲存的值捨入。變數保留原本的值，`fixed` 與 `setprecision` 負責安排畫面上的呈現方式。

## 五、setprecision 的兩種用法

**單獨使用 `setprecision` 時，控制的是有效位數；搭配 `fixed` 時，控制的是小數點後的位數。** 例如 `setprecision(2)` 會把 `3.1415926` 輸出為 `3.1`，搭配 `fixed` 則輸出為 `3.14`。單獨設定有效位數時，輸出也可能使用科學記號。

`fixed` 和精度設定會持續影響同一個 `cout` 後面的浮點數輸出，直到你改變設定。

:::interactive 浮點數輸出格式比較

```game-html
<section>
<h3>改的是輸出格式，還是數值？</h3>
<label>資料型態<select id="type"><option value="double">double（64 位元）</option><option value="float">float（32 位元）</option></select></label>
<label>選擇數值<select id="value"><option value="3.5">3.5</option><option value="1.23456789">1.23456789</option><option value="3.1415926">3.1415926</option><option value="18.2764">18.2764</option></select></label>
<label>精度<select id="precision"><option value="1">1</option><option value="2" selected>2</option><option value="3">3</option><option value="4">4</option><option value="6">6</option><option value="9">9</option></select></label>
<label class="check"><input id="fixed" type="checkbox" checked>搭配 fixed（固定小數位數）</label>
<p id="explanation" class="note" aria-live="polite"></p>
<h4>完整程式示意</h4><pre id="program" class="program"></pre>
<h4>輸出結果</h4><pre id="output" class="terminal" aria-live="polite"></pre>
<p class="small">可選擇 1.23456789、精度 9，並勾選 fixed，再切換型態比較結果。本示範採用常見的 32 位元 float 與 64 位元 double。</p>
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
const value = document.querySelector('#value');
const type = document.querySelector('#type');
const precision = document.querySelector('#precision');
const fixed = document.querySelector('#fixed');
function generalFormat(number, digits) {
  const parts = number.toPrecision(digits).split('e');
  if (parts[0].includes('.')) parts[0] = parts[0].replace(/0+$/, '').replace(/\.$/, '');
  if (parts.length === 2) parts[1] = parts[1].replace(/^([+-])(\d+)$/, (_, sign, exponent) => sign + exponent.padStart(2, '0'));
  return parts.join('e');
}
function update() {
  const digits = Number(precision.value);
  const number = type.value === 'float' ? Math.fround(Number(value.value)) : Number(value.value);
  const output = fixed.checked ? number.toFixed(digits) : generalFormat(number, digits);
  document.querySelector('#explanation').textContent = (fixed.checked ? '搭配 fixed：精度 ' + digits + ' 表示小數點後 ' + digits + ' 位。' : '單獨使用 setprecision：精度 ' + digits + ' 表示 ' + digits + ' 位有效數字，可能使用科學記號。') + '目前使用 ' + type.value + ' 儲存 ' + value.value + '；提高輸出位數，可以觀察這個型態實際儲存的值。';
  document.querySelector('#program').textContent = '#include <iostream>\n#include <iomanip>\nusing namespace std;\n\nint main() {\n    ' + type.value + ' value = ' + value.value + ';\n    cout << ' + (fixed.checked ? 'fixed << ' : '') + 'setprecision(' + digits + ') << value << endl;\n    return 0;\n}';
  document.querySelector('#output').textContent = output + '\n';
}
[value, type, precision, fixed].forEach(control => control.addEventListener('input', update));
update();
```

:::

## 六、把小數交給 int，會發生什麼事？

```cpp
#include <iostream>
using namespace std;

int main() {
    int first = 3.9;
    int second = -3.9;
    cout << first << " " << second << endl;
    return 0;
}
```

輸出結果：

```text
3 -3
```

在這些數值都可表示的情況下，小數轉成 `int` 會捨去小數部分，朝 `0` 的方向截斷，**不是四捨五入**。資料需要保留小數時，可以選擇 `float` 或 `double`。

## 七、自己試一試

用 `double` 儲存 `2.75`，分別要求輸出小數點後一位與三位。再取消互動區塊中的 `fixed`，比較同樣精度設定的意義。
