---
title: "整數型態：int 與 long long"
type: interactive
order: 2
hidden: false
draft: false
---

## 一、用整數記錄人數、年齡與題號

人數、年齡、題號等資料，通常可以使用整數型態。這一篇先認識 `int` 與 `long long`。

```cpp
#include <iostream>
using namespace std;

int main() {
    int age = 16;
    int temperature = -5;
    long long population = 8100000000;

    cout << age << endl;
    cout << temperature << endl;
    cout << population << endl;
    return 0;
}
```

輸出結果：

```text
16
-5
8100000000
```

`int`、`long long` 都能存正整數、`0` 和負整數。`long long` 是一個型態名稱，中間有空格。宣告變數時，把原本的 `int` 換成 `long long`，就能存放範圍更大的整數。

## 二、型態決定可以存多大的數

以下是常見環境中，32 位元 `int` 與 64 位元 `long long` 的範圍：

<div role="region" aria-label="整數型態範圍表" tabindex="0" style="max-width: 100%; overflow-x: auto;">

| 型態與示例寬度 | 最小值 | 最大值 |
| --- | --- | --- |
| `int`（32 位元） | -2147483648 | 2147483647 |
| `long long`（64 位元） | -9223372036854775808 | 9223372036854775807 |

</div>

這些範圍和 **2 的次方**有關。電腦中的每個位元只能是 `0` 或 `1`，所以每多一個位元，可以表示的組合數就變成原來的 2 倍。

- 32 個位元共有 $2^{32}$ 種組合。要同時表示正數、`0` 和負數時，範圍是 $-2^{31}$ 到 $2^{31}-1$。
- 64 個位元共有 $2^{64}$ 種組合，範圍則是 $-2^{63}$ 到 $2^{63}-1$。

例如，$2^{31}=2147483648$，因此 32 位元 `int` 的最小值是 `-2147483648`，最大值是 `2147483647`。從 `0` 開始往正數排列，共有 $2^{31}$ 個值，所以最大值會比 $2^{31}$ 少 1。

現在先記住 `int` 大約能存到正負 21 億，`long long` 的範圍大得多；需要精確範圍時，可以回來查表。以下示範都採用上表的位元數，實際型態大小則由使用的環境決定。

像 `3000000000` 這樣的數值，超出上表中 `int` 的範圍，卻仍在 `long long` 的範圍內。看到題目資料很大時，應先確認範圍，再選擇型態。

:::interactive 整數範圍比較

```game-html
<section>
<h3>這個整數放得下嗎？</h3>
<p class="small">本練習採用 32 位元 int、64 位元 long long，超出範圍時以「繞回」模擬儲存結果。這是本示範的規則，不代表所有 C++ 超出範圍的情況都會如此。</p>
<label>資料型態<select id="type"><option value="int">int（32 位元）</option><option value="longlong">long long（64 位元）</option></select></label>
<label>整數<input id="value" type="text" inputmode="text" value="42" maxlength="24" spellcheck="false"></label>
<div class="actions"><button id="large" type="button">帶入 30 億</button></div>
<p id="range" class="note"></p><p id="status" class="status" aria-live="polite"></p>
<h4>程式示意</h4><pre id="program" class="program"></pre>
<h4>模擬儲存後的值</h4><pre id="output" class="terminal" aria-live="polite"></pre>
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
const input = document.querySelector('#value');
const bounds = {
  int: { name: 'int', bits: 32, min: -2147483648n, max: 2147483647n },
  longlong: { name: 'long long', bits: 64, min: -9223372036854775808n, max: 9223372036854775807n },
};
function update() {
  const selected = bounds[type.value];
  const status = document.querySelector('#status');
  document.querySelector('#range').textContent = '範圍：' + selected.min + ' 到 ' + selected.max;
  if (!/^[+-]?\d+$/.test(input.value.trim())) {
    status.dataset.state = 'error';
    status.textContent = '請輸入完整的十進位整數，例如 42、0 或 -7。';
    document.querySelector('#program').textContent = '// 尚未產生有效的宣告示意。';
    document.querySelector('#output').textContent = '';
    return;
  }
  const number = BigInt(input.value.trim());
  const fits = number >= selected.min && number <= selected.max;
  const stored = BigInt.asIntN(selected.bits, number);
  status.dataset.state = fits ? 'ok' : 'error';
  status.textContent = fits ? '在 ' + selected.name + ' 的範圍內，儲存後的值是 ' + stored + '。' : '超出 ' + selected.name + ' 的範圍；依本示範的繞回規則，儲存後的值是 ' + stored + '。';
  // 宣告使用模擬後的有效數值，避免產生超出整數常值範圍的 C++ 範例。
  let literal = stored.toString();
  if (type.value === 'longlong' && stored === selected.min) literal = '(-9223372036854775807 - 1)';
  const explanation = fits ? '' : '    // 原始數值：' + number + '\n    // 以下使用本示範繞回後的值\n';
  document.querySelector('#program').textContent = '#include <iostream>\nusing namespace std;\n\nint main() {\n' + explanation + '    ' + selected.name + ' count = ' + literal + ';\n    cout << count << endl;\n    return 0;\n}';
  document.querySelector('#output').textContent = stored.toString();
}
[type, input].forEach(control => control.addEventListener('input', update));
document.querySelector('#large').addEventListener('click', () => { input.value = '3000000000'; update(); });
update();
```

:::

## 三、自己試一試

在互動區塊選擇 `int`，先輸入 `2147483647`，再輸入 `2147483648`。依照示範的規則，數值超過最大值後，會從最小值繼續。

接著按「帶入 30 億」，比較 `int` 和 `long long` 儲存後的值。選擇容得下原始資料的型態，才能保留原本想存的數值。
