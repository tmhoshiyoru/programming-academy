---
title: "用 while 依條件重複"
type: interactive
order: 2
hidden: false
draft: false
---

## 一、條件成立就繼續

`while` 的意思可以讀成「當條件成立時」。它先檢查條件，再決定要不要執行區塊。

```cpp
#include <iostream>
using namespace std;

int main() {
    int remaining = 3;
    while (remaining > 0) {
        cout << remaining << endl;
        remaining--;
    }
    cout << "Done" << endl;
    return 0;
}
```

輸出結果：

```text
3
2
1
Done
```

從 3 開始，每輪先輸出，再執行 `remaining--`。當 remaining 變成 0，下一次檢查得到 false，就接著輸出 Done。

## 二、把改變條件的指令放進迴圈

這個例子的三件事分開寫：迴圈前設定 remaining、括號裡檢查條件、區塊裡更新 remaining。它和上一節的 for 一樣，都需要讓狀態隨著每輪推進。

**倒數時要記得更新 remaining。** 如果它一直停在 3，`remaining > 0` 就一直成立，程式也會一直重複；這種停不下來的情況叫作**無窮迴圈**。測試自己的程式時，可以使用執行環境的停止按鈕結束它。

## 三、for 和 while 怎麼選？

按照固定起點、終點及步長走過一串數字時，for 可以把規則排在同一行。主要依據某個狀態決定是否繼續時，while 很好讀。兩者常能互相改寫。

~~~cpp
int i = 1;
while (i <= 3) {
    cout << i << endl;
    i++;
}
~~~

這段和上一節從 1 輸出到 3 的 for 有相同輸出。


:::interactive 用 while 依條件重複：逐步追蹤

```game-html
<section><h3>用 while 依條件重複：逐步追蹤</h3><label>選擇一組資料<select id="scenario"></select></label><p id="input-data" class="note" hidden></p><div class="controls"><button id="previous" type="button">上一步</button><button id="next" type="button">下一步</button><button id="last" type="button">最後一步</button><button id="reset" type="button">重新開始</button></div><p id="status" class="note" aria-live="polite"></p><h4>目前的變數</h4><div id="memory" class="memory"></div><h4>程式碼</h4><pre id="program" class="program" aria-label="目前執行的指令會以亮色標示"></pre><h4>目前的輸出</h4><pre id="output" class="terminal" aria-live="polite"></pre></section>
```

```game-css
* { box-sizing: border-box; }
body { margin: 0; padding: 18px; color: #193b2a; background: #f3faf5; font: 16px/1.6 system-ui, sans-serif; }
h3 { margin: 0 0 12px; font-size: 22px; line-height: 1.4; } h4 { margin: 14px 0 6px; font-size: 16px; }
label { display: block; font-weight: 650; } select { display: block; width: 100%; margin: 5px 0 12px; padding: 9px; border: 1px solid #8eaf9a; border-radius: 7px; background: #fff; color: #193b2a; font: inherit; }
.controls { display: flex; flex-wrap: wrap; gap: 7px; margin: 12px 0; } button { padding: 7px 11px; border: 1px solid #7f9f8b; border-radius: 6px; color: #234d34; background: #fff; font: inherit; cursor: pointer; } button:disabled { opacity: .45; cursor: default; }
.note { margin: 10px 0; padding: 10px 12px; border: 1px solid #b4d1bd; border-radius: 8px; background: #fff; }
.program { margin: 6px 0; padding: 10px 0; border-radius: 8px; background: #182b22; color: #f2f8f4; font-size: 0; line-height: 0; }
.code-line { position: relative; display: block; min-height: 1.5em; padding: 1px 10px 1px 3.2em; border-left: 4px solid transparent; font: 14px/1.5 ui-monospace, Consolas, monospace; white-space: pre-wrap; overflow-wrap: anywhere; }
.code-line::before { position: absolute; left: .2em; width: 2em; color: #aac2b3; content: attr(data-line); text-align: right; }
.code-line.is-current { color: #fff; background: #365f47; border-left-color: #ffe38a; } .code-line.is-current::before { color: #ffe38a; font-weight: 800; }
.memory { display: flex; flex-wrap: wrap; gap: 8px; } .variable { flex: 1 1 130px; min-width: 0; padding: 9px; border: 1px solid #b4d1bd; border-radius: 7px; background: #fff; } .variable.wide { flex-basis: 100%; }
.variable > strong { display: block; font-size: 13px; color: #486252; } .value { white-space: pre-wrap; overflow-wrap: anywhere; font: 650 18px/1.6 ui-monospace, Consolas, monospace; }
.array { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 6px; } .array.matrix { display: grid; grid-template-columns: repeat(var(--columns), minmax(0, 1fr)); }
.array-cell { min-width: 44px; padding: 4px 7px; border: 1px solid #b4d1bd; border-radius: 5px; text-align: center; background: #edf5ef; } .array-cell small { display: block; color: #486252; font-size: 11px; } .array-cell.current { border-color: #926521; background: #fff0cc; }
.terminal { min-height: 52px; margin: 5px 0; padding: 12px; border: 1px solid #b4d1bd; border-radius: 7px; color: #193b2a; background: #fff; font: 15px/1.5 ui-monospace, Consolas, monospace; white-space: pre-wrap; overflow-wrap: anywhere; }
.small { color: #486252; font-size: 13px; } [hidden] { display: none !important; } :focus-visible { outline: 3px solid #3675b4; outline-offset: 2px; }
@media (max-width: 460px) { body { padding: 12px; } .code-line { font-size: 13px; } }
```

```game-js
(function runtime(config) {
  const select = document.querySelector('#scenario');
  const program = document.querySelector('#program');
  let scenario, cursor = 0, codeLines = [];
  config.scenarios.forEach((item, index) => {
    const option = document.createElement('option'); option.value = String(index); option.textContent = item.label; select.append(option);
  });
  function render() {
    const state = scenario.steps[cursor];
    codeLines.forEach((line, index) => {
      const current = index + 1 === state.line;
      line.classList.toggle('is-current', current);
      if (current) line.setAttribute('aria-current', 'step'); else line.removeAttribute('aria-current');
    });
    const memory = document.querySelector('#memory'); memory.replaceChildren();
    for (const [name, value] of Object.entries(state.values)) {
      const card = document.createElement('div'); card.className = 'variable';
      const label = document.createElement('strong'); label.textContent = name; card.append(label);
      if (Array.isArray(value)) {
        card.classList.add('wide');
        const array = document.createElement('div'); array.className = 'array';
        const matrix = Array.isArray(value[0]);
        if (matrix) { array.classList.add('matrix'); array.style.setProperty('--columns', String(value[0].length)); }
        value.forEach((entry, index) => {
          const row = matrix ? entry : [entry];
          row.forEach((element, column) => {
            const cell = document.createElement('div'); cell.className = 'array-cell';
            const position = document.createElement('small'); position.textContent = matrix ? '[' + index + '][' + column + ']' : '[' + index + ']';
            const content = document.createElement('span'); content.textContent = String(element);
            const focus = state.active[name];
            if (focus && focus[0] === index && (!matrix || focus[1] === column)) cell.classList.add('current');
            cell.append(position, content); array.append(cell);
          });
        });
        card.append(array);
      } else {
        const content = document.createElement('div'); content.className = 'value';
        content.textContent = value === null ? '尚未建立' : typeof value === 'string' ? '「' + value + '」' : String(value); card.append(content);
      }
      memory.append(card);
    }
    if (!memory.children.length) { const text = document.createElement('p'); text.className = 'small'; text.textContent = '變數會隨著執行步驟出現在這裡。'; memory.append(text); }
    document.querySelector('#status').textContent = '步驟 ' + cursor + ' / ' + (scenario.steps.length - 1) + '：' + state.text;
    document.querySelector('#output').textContent = state.output;
    document.querySelector('#previous').disabled = cursor === 0;
    document.querySelector('#next').disabled = cursor === scenario.steps.length - 1;
    document.querySelector('#last').disabled = cursor === scenario.steps.length - 1;
  }
  function reset() {
    scenario = config.scenarios[Number(select.value)]; cursor = 0;
    const input = document.querySelector('#input-data'); input.hidden = !scenario.input; input.textContent = scenario.input ? '本次輸入：' + scenario.input.replaceAll('\n', ' ↵ ') : '';
    program.replaceChildren();
    codeLines = scenario.lines.map((text, index) => {
      const span = document.createElement('span'); span.className = 'code-line'; span.dataset.line = String(index + 1); span.textContent = text; program.append(span);
      if (index < scenario.lines.length - 1) program.append(document.createTextNode('\n')); return span;
    });
    render();
  }
  document.querySelector('#previous').addEventListener('click', () => { cursor = Math.max(0, cursor - 1); render(); });
  document.querySelector('#next').addEventListener('click', () => { cursor = Math.min(scenario.steps.length - 1, cursor + 1); render(); });
  document.querySelector('#last').addEventListener('click', () => { cursor = scenario.steps.length - 1; render(); });
  document.querySelector('#reset').addEventListener('click', reset);
  select.addEventListener('change', reset); reset();
})({
  "scenarios": [
    {
      "label": "remaining 從 3 開始",
      "lines": [
        "#include <iostream>",
        "using namespace std;",
        "",
        "int main() {",
        "    int remaining = 3;",
        "    while (remaining > 0) {",
        "        cout << remaining << endl;",
        "        remaining--;",
        "    }",
        "    cout << \"Done\" << endl;",
        "    return 0;",
        "}"
      ],
      "steps": [
        {
          "line": null,
          "values": {},
          "text": "準備開始，按下一步追蹤這個範例。",
          "output": "",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "remaining": 3
          },
          "text": "設定倒數起點。",
          "output": "",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "remaining": 3
          },
          "text": "檢查 remaining > 0，結果是 true。",
          "output": "",
          "active": {}
        },
        {
          "line": 7,
          "values": {
            "remaining": 3
          },
          "text": "輸出目前的 remaining。",
          "output": "3\n",
          "active": {}
        },
        {
          "line": 8,
          "values": {
            "remaining": 2
          },
          "text": "完成一輪倒數，remaining 減少 1。",
          "output": "3\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "remaining": 2
          },
          "text": "檢查 remaining > 0，結果是 true。",
          "output": "3\n",
          "active": {}
        },
        {
          "line": 7,
          "values": {
            "remaining": 2
          },
          "text": "輸出目前的 remaining。",
          "output": "3\n2\n",
          "active": {}
        },
        {
          "line": 8,
          "values": {
            "remaining": 1
          },
          "text": "完成一輪倒數，remaining 減少 1。",
          "output": "3\n2\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "remaining": 1
          },
          "text": "檢查 remaining > 0，結果是 true。",
          "output": "3\n2\n",
          "active": {}
        },
        {
          "line": 7,
          "values": {
            "remaining": 1
          },
          "text": "輸出目前的 remaining。",
          "output": "3\n2\n1\n",
          "active": {}
        },
        {
          "line": 8,
          "values": {
            "remaining": 0
          },
          "text": "完成一輪倒數，remaining 減少 1。",
          "output": "3\n2\n1\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "remaining": 0
          },
          "text": "檢查 remaining > 0，結果是 false。",
          "output": "3\n2\n1\n",
          "active": {}
        },
        {
          "line": 10,
          "values": {
            "remaining": 0
          },
          "text": "離開迴圈，接著輸出 Done。",
          "output": "3\n2\n1\nDone\n",
          "active": {}
        },
        {
          "line": 11,
          "values": {
            "remaining": 0
          },
          "text": "結束程式。",
          "output": "3\n2\n1\nDone\n",
          "active": {}
        }
      ],
      "expected": "3\n2\n1\nDone\n",
      "input": ""
    },
    {
      "label": "remaining 從 1 開始",
      "lines": [
        "#include <iostream>",
        "using namespace std;",
        "",
        "int main() {",
        "    int remaining = 1;",
        "    while (remaining > 0) {",
        "        cout << remaining << endl;",
        "        remaining--;",
        "    }",
        "    cout << \"Done\" << endl;",
        "    return 0;",
        "}"
      ],
      "steps": [
        {
          "line": null,
          "values": {},
          "text": "準備開始，按下一步追蹤這個範例。",
          "output": "",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "remaining": 1
          },
          "text": "設定倒數起點。",
          "output": "",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "remaining": 1
          },
          "text": "檢查 remaining > 0，結果是 true。",
          "output": "",
          "active": {}
        },
        {
          "line": 7,
          "values": {
            "remaining": 1
          },
          "text": "輸出目前的 remaining。",
          "output": "1\n",
          "active": {}
        },
        {
          "line": 8,
          "values": {
            "remaining": 0
          },
          "text": "完成一輪倒數，remaining 減少 1。",
          "output": "1\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "remaining": 0
          },
          "text": "檢查 remaining > 0，結果是 false。",
          "output": "1\n",
          "active": {}
        },
        {
          "line": 10,
          "values": {
            "remaining": 0
          },
          "text": "離開迴圈，接著輸出 Done。",
          "output": "1\nDone\n",
          "active": {}
        },
        {
          "line": 11,
          "values": {
            "remaining": 0
          },
          "text": "結束程式。",
          "output": "1\nDone\n",
          "active": {}
        }
      ],
      "expected": "1\nDone\n",
      "input": ""
    },
    {
      "label": "remaining 從 0 開始",
      "lines": [
        "#include <iostream>",
        "using namespace std;",
        "",
        "int main() {",
        "    int remaining = 0;",
        "    while (remaining > 0) {",
        "        cout << remaining << endl;",
        "        remaining--;",
        "    }",
        "    cout << \"Done\" << endl;",
        "    return 0;",
        "}"
      ],
      "steps": [
        {
          "line": null,
          "values": {},
          "text": "準備開始，按下一步追蹤這個範例。",
          "output": "",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "remaining": 0
          },
          "text": "設定倒數起點。",
          "output": "",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "remaining": 0
          },
          "text": "檢查 remaining > 0，結果是 false。",
          "output": "",
          "active": {}
        },
        {
          "line": 10,
          "values": {
            "remaining": 0
          },
          "text": "離開迴圈，接著輸出 Done。",
          "output": "Done\n",
          "active": {}
        },
        {
          "line": 11,
          "values": {
            "remaining": 0
          },
          "text": "結束程式。",
          "output": "Done\n",
          "active": {}
        }
      ],
      "expected": "Done\n",
      "input": ""
    }
  ]
});
```

:::


## 四、while (cin >> n)：每讀到一筆，就處理一筆

有些題目沒有先告訴我們資料筆數，而是要求把輸入中的整數全部讀完。可以把讀取動作放進 while 的條件：

~~~cpp
#include <iostream>
using namespace std;

int main() {
    int n = 0;
    while (cin >> n) {
        cout << n << endl;
    }
    cout << "Done" << endl;
    return 0;
}
~~~

假設輸入資料如下，並在 -2 之後結束：

~~~text
3 0 -2
~~~

輸出結果：

~~~text
3
0
-2
Done
~~~

每次回到條件時，`cin >> n` 都會嘗試讀取**下一筆整數**。這裡判斷的是**這次讀取是否成功**，而不是 n 的數值是不是非零。

- 讀取成功：新的整數已經存進 n，進入大括號處理這筆資料。**0 也是合法的整數，所以讀到 0 仍然會進入區塊。**
- 讀取失敗：跳過整個區塊，離開迴圈。常見原因是資料已經讀完，或下一段內容無法讀成整數。

資料結束稱為 **EOF（End Of File）**。最後一筆成功讀到的整數仍會處理；之後再嘗試讀取、已經沒有整數可讀時，迴圈才結束。在 OJ 中，測資檔結束就會提供 EOF；在終端機手動輸入時，按 Enter 只是換行，程式還會等待下一筆輸入，需要依使用環境送出輸入結束訊號。

若題目規定「讀到 0 就停止」，那是另一種輸入規則，要另外判斷 n 是否為 0。單獨的 `while (cin >> n)` 會把成功讀到的 0 當成一般資料處理。

:::interactive 讀取成功才進入 while：逐步追蹤

```game-html
<section><h3>讀取成功才進入 while：逐步追蹤</h3><label>選擇一組資料<select id="scenario"></select></label><p id="input-data" class="note" hidden></p><div class="controls"><button id="previous" type="button">上一步</button><button id="next" type="button">下一步</button><button id="last" type="button">最後一步</button><button id="reset" type="button">重新開始</button></div><p id="status" class="note" aria-live="polite"></p><h4>目前的變數</h4><div id="memory" class="memory"></div><h4>程式碼</h4><pre id="program" class="program" aria-label="目前執行的指令會以亮色標示"></pre><h4>目前的輸出</h4><pre id="output" class="terminal" aria-live="polite"></pre></section>
```

```game-css
* { box-sizing: border-box; }
body { margin: 0; padding: 18px; color: #193b2a; background: #f3faf5; font: 16px/1.6 system-ui, sans-serif; }
h3 { margin: 0 0 12px; font-size: 22px; line-height: 1.4; } h4 { margin: 14px 0 6px; font-size: 16px; }
label { display: block; font-weight: 650; } select { display: block; width: 100%; margin: 5px 0 12px; padding: 9px; border: 1px solid #8eaf9a; border-radius: 7px; background: #fff; color: #193b2a; font: inherit; }
.controls { display: flex; flex-wrap: wrap; gap: 7px; margin: 12px 0; } button { padding: 7px 11px; border: 1px solid #7f9f8b; border-radius: 6px; color: #234d34; background: #fff; font: inherit; cursor: pointer; } button:disabled { opacity: .45; cursor: default; }
.note { margin: 10px 0; padding: 10px 12px; border: 1px solid #b4d1bd; border-radius: 8px; background: #fff; }
.program { margin: 6px 0; padding: 10px 0; border-radius: 8px; background: #182b22; color: #f2f8f4; font-size: 0; line-height: 0; }
.code-line { position: relative; display: block; min-height: 1.5em; padding: 1px 10px 1px 3.2em; border-left: 4px solid transparent; font: 14px/1.5 ui-monospace, Consolas, monospace; white-space: pre-wrap; overflow-wrap: anywhere; }
.code-line::before { position: absolute; left: .2em; width: 2em; color: #aac2b3; content: attr(data-line); text-align: right; }
.code-line.is-current { color: #fff; background: #365f47; border-left-color: #ffe38a; } .code-line.is-current::before { color: #ffe38a; font-weight: 800; }
.memory { display: flex; flex-wrap: wrap; gap: 8px; } .variable { flex: 1 1 130px; min-width: 0; padding: 9px; border: 1px solid #b4d1bd; border-radius: 7px; background: #fff; } .variable.wide { flex-basis: 100%; }
.variable > strong { display: block; font-size: 13px; color: #486252; } .value { white-space: pre-wrap; overflow-wrap: anywhere; font: 650 18px/1.6 ui-monospace, Consolas, monospace; }
.array { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 6px; } .array.matrix { display: grid; grid-template-columns: repeat(var(--columns), minmax(0, 1fr)); }
.array-cell { min-width: 44px; padding: 4px 7px; border: 1px solid #b4d1bd; border-radius: 5px; text-align: center; background: #edf5ef; } .array-cell small { display: block; color: #486252; font-size: 11px; } .array-cell.current { border-color: #926521; background: #fff0cc; }
.terminal { min-height: 52px; margin: 5px 0; padding: 12px; border: 1px solid #b4d1bd; border-radius: 7px; color: #193b2a; background: #fff; font: 15px/1.5 ui-monospace, Consolas, monospace; white-space: pre-wrap; overflow-wrap: anywhere; }
.small { color: #486252; font-size: 13px; } [hidden] { display: none !important; } :focus-visible { outline: 3px solid #3675b4; outline-offset: 2px; }
@media (max-width: 460px) { body { padding: 12px; } .code-line { font-size: 13px; } }
```

```game-js
(function runtime(config) {
  const select = document.querySelector('#scenario');
  const program = document.querySelector('#program');
  let scenario, cursor = 0, codeLines = [];
  config.scenarios.forEach((item, index) => {
    const option = document.createElement('option'); option.value = String(index); option.textContent = item.label; select.append(option);
  });
  function render() {
    const state = scenario.steps[cursor];
    codeLines.forEach((line, index) => {
      const current = index + 1 === state.line;
      line.classList.toggle('is-current', current);
      if (current) line.setAttribute('aria-current', 'step'); else line.removeAttribute('aria-current');
    });
    const memory = document.querySelector('#memory'); memory.replaceChildren();
    for (const [name, value] of Object.entries(state.values)) {
      const card = document.createElement('div'); card.className = 'variable';
      const label = document.createElement('strong'); label.textContent = name; card.append(label);
      if (Array.isArray(value)) {
        card.classList.add('wide');
        const array = document.createElement('div'); array.className = 'array';
        const matrix = Array.isArray(value[0]);
        if (matrix) { array.classList.add('matrix'); array.style.setProperty('--columns', String(value[0].length)); }
        value.forEach((entry, index) => {
          const row = matrix ? entry : [entry];
          row.forEach((element, column) => {
            const cell = document.createElement('div'); cell.className = 'array-cell';
            const position = document.createElement('small'); position.textContent = matrix ? '[' + index + '][' + column + ']' : '[' + index + ']';
            const content = document.createElement('span'); content.textContent = String(element);
            const focus = state.active[name];
            if (focus && focus[0] === index && (!matrix || focus[1] === column)) cell.classList.add('current');
            cell.append(position, content); array.append(cell);
          });
        });
        card.append(array);
      } else {
        const content = document.createElement('div'); content.className = 'value';
        content.textContent = value === null ? '尚未建立' : typeof value === 'string' ? '「' + value + '」' : String(value); card.append(content);
      }
      memory.append(card);
    }
    if (!memory.children.length) { const text = document.createElement('p'); text.className = 'small'; text.textContent = '變數會隨著執行步驟出現在這裡。'; memory.append(text); }
    document.querySelector('#status').textContent = '步驟 ' + cursor + ' / ' + (scenario.steps.length - 1) + '：' + state.text;
    document.querySelector('#output').textContent = state.output;
    document.querySelector('#previous').disabled = cursor === 0;
    document.querySelector('#next').disabled = cursor === scenario.steps.length - 1;
    document.querySelector('#last').disabled = cursor === scenario.steps.length - 1;
  }
  function reset() {
    scenario = config.scenarios[Number(select.value)]; cursor = 0;
    const input = document.querySelector('#input-data'); input.hidden = !scenario.input; input.textContent = scenario.input ? '本次輸入：' + scenario.input.replaceAll('\n', ' ↵ ') : '';
    program.replaceChildren();
    codeLines = scenario.lines.map((text, index) => {
      const span = document.createElement('span'); span.className = 'code-line'; span.dataset.line = String(index + 1); span.textContent = text; program.append(span);
      if (index < scenario.lines.length - 1) program.append(document.createTextNode('\n')); return span;
    });
    render();
  }
  document.querySelector('#previous').addEventListener('click', () => { cursor = Math.max(0, cursor - 1); render(); });
  document.querySelector('#next').addEventListener('click', () => { cursor = Math.min(scenario.steps.length - 1, cursor + 1); render(); });
  document.querySelector('#last').addEventListener('click', () => { cursor = scenario.steps.length - 1; render(); });
  document.querySelector('#reset').addEventListener('click', reset);
  select.addEventListener('change', reset); reset();
})({
  "scenarios": [
    {
      "label": "輸入 3、0、-2，接著 EOF",
      "lines": [
        "#include <iostream>",
        "using namespace std;",
        "",
        "int main() {",
        "    int n = 0;",
        "    while (cin >> n) {",
        "        cout << n << endl;",
        "    }",
        "    cout << \"Done\" << endl;",
        "    return 0;",
        "}"
      ],
      "steps": [
        {
          "line": null,
          "values": {},
          "text": "按下一步，觀察條件檢查時的資料與變數。",
          "output": "",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "n": 0
          },
          "text": "先建立 n，指定初值 0。",
          "output": "",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 3
          },
          "text": "成功讀入下一筆 3，條件為 true。新的值已存進 n，準備執行區塊。",
          "output": "",
          "active": {}
        },
        {
          "line": 7,
          "values": {
            "n": 3
          },
          "text": "輸出剛才讀到的 n。",
          "output": "3\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 0
          },
          "text": "成功讀入下一筆 0，條件為 true。此處判斷的是讀取成功，所以 0 仍會進入區塊。",
          "output": "3\n",
          "active": {}
        },
        {
          "line": 7,
          "values": {
            "n": 0
          },
          "text": "輸出剛才讀到的 n。",
          "output": "3\n0\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": -2
          },
          "text": "成功讀入下一筆 -2，條件為 true。新的值已存進 n，準備執行區塊。",
          "output": "3\n0\n",
          "active": {}
        },
        {
          "line": 7,
          "values": {
            "n": -2
          },
          "text": "輸出剛才讀到的 n。",
          "output": "3\n0\n-2\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": -2
          },
          "text": "再次嘗試讀取時，已到資料結尾 EOF，沒有下一筆整數；條件為 false，跳過區塊。這次沒有新的整數可供區塊處理。",
          "output": "3\n0\n-2\n",
          "active": {}
        },
        {
          "line": 9,
          "values": {
            "n": -2
          },
          "text": "離開迴圈後輸出 Done。",
          "output": "3\n0\n-2\nDone\n",
          "active": {}
        },
        {
          "line": 10,
          "values": {
            "n": -2
          },
          "text": "main 結束。",
          "output": "3\n0\n-2\nDone\n",
          "active": {}
        }
      ],
      "expected": "3\n0\n-2\nDone\n",
      "input": "3 0 -2"
    },
    {
      "label": "輸入 7，接著 EOF",
      "lines": [
        "#include <iostream>",
        "using namespace std;",
        "",
        "int main() {",
        "    int n = 0;",
        "    while (cin >> n) {",
        "        cout << n << endl;",
        "    }",
        "    cout << \"Done\" << endl;",
        "    return 0;",
        "}"
      ],
      "steps": [
        {
          "line": null,
          "values": {},
          "text": "按下一步，觀察條件檢查時的資料與變數。",
          "output": "",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "n": 0
          },
          "text": "先建立 n，指定初值 0。",
          "output": "",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 7
          },
          "text": "成功讀入下一筆 7，條件為 true。新的值已存進 n，準備執行區塊。",
          "output": "",
          "active": {}
        },
        {
          "line": 7,
          "values": {
            "n": 7
          },
          "text": "輸出剛才讀到的 n。",
          "output": "7\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 7
          },
          "text": "再次嘗試讀取時，已到資料結尾 EOF，沒有下一筆整數；條件為 false，跳過區塊。這次沒有新的整數可供區塊處理。",
          "output": "7\n",
          "active": {}
        },
        {
          "line": 9,
          "values": {
            "n": 7
          },
          "text": "離開迴圈後輸出 Done。",
          "output": "7\nDone\n",
          "active": {}
        },
        {
          "line": 10,
          "values": {
            "n": 7
          },
          "text": "main 結束。",
          "output": "7\nDone\n",
          "active": {}
        }
      ],
      "expected": "7\nDone\n",
      "input": "7"
    },
    {
      "label": "空資料，立即 EOF",
      "lines": [
        "#include <iostream>",
        "using namespace std;",
        "",
        "int main() {",
        "    int n = 0;",
        "    while (cin >> n) {",
        "        cout << n << endl;",
        "    }",
        "    cout << \"Done\" << endl;",
        "    return 0;",
        "}"
      ],
      "steps": [
        {
          "line": null,
          "values": {},
          "text": "按下一步，觀察條件檢查時的資料與變數。",
          "output": "",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "n": 0
          },
          "text": "先建立 n，指定初值 0。",
          "output": "",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 0
          },
          "text": "再次嘗試讀取時，已到資料結尾 EOF，沒有下一筆整數；條件為 false，跳過區塊。這次沒有新的整數可供區塊處理。",
          "output": "",
          "active": {}
        },
        {
          "line": 9,
          "values": {
            "n": 0
          },
          "text": "離開迴圈後輸出 Done。",
          "output": "Done\n",
          "active": {}
        },
        {
          "line": 10,
          "values": {
            "n": 0
          },
          "text": "main 結束。",
          "output": "Done\n",
          "active": {}
        }
      ],
      "expected": "Done\n",
      "input": ""
    }
  ]
});
```

:::

## 五、`while (n--)`：用剩餘次數控制迴圈

當 n 代表「還要做幾次」，也常看到把遞減放進條件的寫法：

~~~cpp
#include <iostream>
using namespace std;

int main() {
    int n = 3;
    while (n--) {
        cout << n << endl;
    }
    cout << "n = " << n << endl;
    return 0;
}
~~~

輸出結果：

~~~text
2
1
0
n = -1
~~~

`n--` 是**後置遞減**：這個運算式提供「減少前的舊值」作為條件，同時把 n 減少 1。等到進入大括號時，n 已經完成遞減。

從 3 開始，四次條件檢查如下：

| 判斷使用的舊值 | 檢查後的 n | 是否進入區塊 | 區塊內輸出的 n |
| --- | --- | --- | --- |
| 3 | 2 | true，進入 | 2 |
| 2 | 1 | true，進入 | 1 |
| 1 | 0 | true，進入 | 0 |
| 0 | -1 | false，結束 | 這次跳過區塊 |

**最後一次雖然沒有進入區塊，條件裡的 `n--` 仍然有執行，所以 n 會從 0 變成 -1。** 起點為 0 時，區塊會執行零次，n 也會因這次條件檢查變成 -1。

這種計次方式先以**非負整數**作為起點。負數在條件中也視為 true，持續減 1 會離 0 越來越遠，就無法照這個倒數規劃結束；繼續減到型態範圍外也會產生問題。

## 六、和一般的 for 計次迴圈有什麼不同？

如果想重複三次，同時保留原本的 n，可以用另一個變數 i 計次：

~~~cpp
int n = 3;
for (int i = 0; i < n; i++) {
    cout << i << endl;
}
cout << "n = " << n << endl;
~~~

這段會依序輸出 0、1、2，最後輸出 `n = 3`。

- **上面的 for**：使用 i 計次，這個範例沒有修改 n，所以 n 仍是 3。i 在每輪區塊執行完後才加 1。
- **前面的 `while (n--)`**：直接使用並減少 n。進入區塊前 n 已減 1，所以輸出 2、1、0；正常跑到條件為 false 後，n 是 -1。

在這兩個範例中，區塊都執行三次，但變數的用途、區塊內看到的值與結束後的 n 都不同。**差異來自這兩種寫法如何安排條件與更新，不是 for 一定不會修改 n。** for 也能把 n 寫在更新部分；前面這種使用 i 的寫法，則適合保留原本次數並取得目前的索引。

如果中途使用 break 離開 `while (n--)`，剩下的條件檢查就不會再做；前面「n 最後是 -1」的結果，是指非負起點、沒有額外修改 n，並正常跑到條件為 false 的這個例子。

:::interactive 計次迴圈的兩種寫法：逐步比較

```game-html
<section><h3>while (n--) 與 for：逐步比較</h3><label>選擇一組資料<select id="scenario"></select></label><p id="input-data" class="note" hidden></p><div class="controls"><button id="previous" type="button">上一步</button><button id="next" type="button">下一步</button><button id="last" type="button">最後一步</button><button id="reset" type="button">重新開始</button></div><p id="status" class="note" aria-live="polite"></p><h4>目前的變數</h4><div id="memory" class="memory"></div><h4>程式碼</h4><pre id="program" class="program" aria-label="目前執行的指令會以亮色標示"></pre><h4>目前的輸出</h4><pre id="output" class="terminal" aria-live="polite"></pre></section>
```

```game-css
* { box-sizing: border-box; }
body { margin: 0; padding: 18px; color: #193b2a; background: #f3faf5; font: 16px/1.6 system-ui, sans-serif; }
h3 { margin: 0 0 12px; font-size: 22px; line-height: 1.4; } h4 { margin: 14px 0 6px; font-size: 16px; }
label { display: block; font-weight: 650; } select { display: block; width: 100%; margin: 5px 0 12px; padding: 9px; border: 1px solid #8eaf9a; border-radius: 7px; background: #fff; color: #193b2a; font: inherit; }
.controls { display: flex; flex-wrap: wrap; gap: 7px; margin: 12px 0; } button { padding: 7px 11px; border: 1px solid #7f9f8b; border-radius: 6px; color: #234d34; background: #fff; font: inherit; cursor: pointer; } button:disabled { opacity: .45; cursor: default; }
.note { margin: 10px 0; padding: 10px 12px; border: 1px solid #b4d1bd; border-radius: 8px; background: #fff; }
.program { margin: 6px 0; padding: 10px 0; border-radius: 8px; background: #182b22; color: #f2f8f4; font-size: 0; line-height: 0; }
.code-line { position: relative; display: block; min-height: 1.5em; padding: 1px 10px 1px 3.2em; border-left: 4px solid transparent; font: 14px/1.5 ui-monospace, Consolas, monospace; white-space: pre-wrap; overflow-wrap: anywhere; }
.code-line::before { position: absolute; left: .2em; width: 2em; color: #aac2b3; content: attr(data-line); text-align: right; }
.code-line.is-current { color: #fff; background: #365f47; border-left-color: #ffe38a; } .code-line.is-current::before { color: #ffe38a; font-weight: 800; }
.memory { display: flex; flex-wrap: wrap; gap: 8px; } .variable { flex: 1 1 130px; min-width: 0; padding: 9px; border: 1px solid #b4d1bd; border-radius: 7px; background: #fff; } .variable.wide { flex-basis: 100%; }
.variable > strong { display: block; font-size: 13px; color: #486252; } .value { white-space: pre-wrap; overflow-wrap: anywhere; font: 650 18px/1.6 ui-monospace, Consolas, monospace; }
.array { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 6px; } .array.matrix { display: grid; grid-template-columns: repeat(var(--columns), minmax(0, 1fr)); }
.array-cell { min-width: 44px; padding: 4px 7px; border: 1px solid #b4d1bd; border-radius: 5px; text-align: center; background: #edf5ef; } .array-cell small { display: block; color: #486252; font-size: 11px; } .array-cell.current { border-color: #926521; background: #fff0cc; }
.terminal { min-height: 52px; margin: 5px 0; padding: 12px; border: 1px solid #b4d1bd; border-radius: 7px; color: #193b2a; background: #fff; font: 15px/1.5 ui-monospace, Consolas, monospace; white-space: pre-wrap; overflow-wrap: anywhere; }
.small { color: #486252; font-size: 13px; } [hidden] { display: none !important; } :focus-visible { outline: 3px solid #3675b4; outline-offset: 2px; }
@media (max-width: 460px) { body { padding: 12px; } .code-line { font-size: 13px; } }
```

```game-js
(function runtime(config) {
  const select = document.querySelector('#scenario');
  const program = document.querySelector('#program');
  let scenario, cursor = 0, codeLines = [];
  config.scenarios.forEach((item, index) => {
    const option = document.createElement('option'); option.value = String(index); option.textContent = item.label; select.append(option);
  });
  function render() {
    const state = scenario.steps[cursor];
    codeLines.forEach((line, index) => {
      const current = index + 1 === state.line;
      line.classList.toggle('is-current', current);
      if (current) line.setAttribute('aria-current', 'step'); else line.removeAttribute('aria-current');
    });
    const memory = document.querySelector('#memory'); memory.replaceChildren();
    for (const [name, value] of Object.entries(state.values)) {
      const card = document.createElement('div'); card.className = 'variable';
      const label = document.createElement('strong'); label.textContent = name; card.append(label);
      if (Array.isArray(value)) {
        card.classList.add('wide');
        const array = document.createElement('div'); array.className = 'array';
        const matrix = Array.isArray(value[0]);
        if (matrix) { array.classList.add('matrix'); array.style.setProperty('--columns', String(value[0].length)); }
        value.forEach((entry, index) => {
          const row = matrix ? entry : [entry];
          row.forEach((element, column) => {
            const cell = document.createElement('div'); cell.className = 'array-cell';
            const position = document.createElement('small'); position.textContent = matrix ? '[' + index + '][' + column + ']' : '[' + index + ']';
            const content = document.createElement('span'); content.textContent = String(element);
            const focus = state.active[name];
            if (focus && focus[0] === index && (!matrix || focus[1] === column)) cell.classList.add('current');
            cell.append(position, content); array.append(cell);
          });
        });
        card.append(array);
      } else {
        const content = document.createElement('div'); content.className = 'value';
        content.textContent = value === null ? '尚未建立' : typeof value === 'string' ? '「' + value + '」' : String(value); card.append(content);
      }
      memory.append(card);
    }
    if (!memory.children.length) { const text = document.createElement('p'); text.className = 'small'; text.textContent = '變數會隨著執行步驟出現在這裡。'; memory.append(text); }
    document.querySelector('#status').textContent = '步驟 ' + cursor + ' / ' + (scenario.steps.length - 1) + '：' + state.text;
    document.querySelector('#output').textContent = state.output;
    document.querySelector('#previous').disabled = cursor === 0;
    document.querySelector('#next').disabled = cursor === scenario.steps.length - 1;
    document.querySelector('#last').disabled = cursor === scenario.steps.length - 1;
  }
  function reset() {
    scenario = config.scenarios[Number(select.value)]; cursor = 0;
    const input = document.querySelector('#input-data'); input.hidden = !scenario.input; input.textContent = scenario.input ? '本次輸入：' + scenario.input.replaceAll('\n', ' ↵ ') : '';
    program.replaceChildren();
    codeLines = scenario.lines.map((text, index) => {
      const span = document.createElement('span'); span.className = 'code-line'; span.dataset.line = String(index + 1); span.textContent = text; program.append(span);
      if (index < scenario.lines.length - 1) program.append(document.createTextNode('\n')); return span;
    });
    render();
  }
  document.querySelector('#previous').addEventListener('click', () => { cursor = Math.max(0, cursor - 1); render(); });
  document.querySelector('#next').addEventListener('click', () => { cursor = Math.min(scenario.steps.length - 1, cursor + 1); render(); });
  document.querySelector('#last').addEventListener('click', () => { cursor = scenario.steps.length - 1; render(); });
  document.querySelector('#reset').addEventListener('click', reset);
  select.addEventListener('change', reset); reset();
})({
  "scenarios": [
    {
      "label": "while (n--) 直接遞減｜起點 n = 3",
      "lines": [
        "#include <iostream>",
        "using namespace std;",
        "",
        "int main() {",
        "    int n = 3;",
        "    while (n--) {",
        "        cout << n << endl;",
        "    }",
        "    cout << \"n = \" << n << endl;",
        "    return 0;",
        "}"
      ],
      "steps": [
        {
          "line": null,
          "values": {},
          "text": "按下一步，觀察條件檢查時的資料與變數。",
          "output": "",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "n": 3
          },
          "text": "設定原本要重複的次數。",
          "output": "",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 2
          },
          "text": "n-- 提供舊值 3 作條件，視為 true；同時 n 已經減為 2。接著進入區塊。",
          "output": "",
          "active": {}
        },
        {
          "line": 7,
          "values": {
            "n": 2
          },
          "text": "區塊內取得的是已遞減後的 n。",
          "output": "2\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 1
          },
          "text": "n-- 提供舊值 2 作條件，視為 true；同時 n 已經減為 1。接著進入區塊。",
          "output": "2\n",
          "active": {}
        },
        {
          "line": 7,
          "values": {
            "n": 1
          },
          "text": "區塊內取得的是已遞減後的 n。",
          "output": "2\n1\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 0
          },
          "text": "n-- 提供舊值 1 作條件，視為 true；同時 n 已經減為 0。接著進入區塊。",
          "output": "2\n1\n",
          "active": {}
        },
        {
          "line": 7,
          "values": {
            "n": 0
          },
          "text": "區塊內取得的是已遞減後的 n。",
          "output": "2\n1\n0\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": -1
          },
          "text": "n-- 提供舊值 0 作條件，視為 false；同時 n 已經減為 -1。這次跳過區塊並結束迴圈，遞減仍有執行。",
          "output": "2\n1\n0\n",
          "active": {}
        },
        {
          "line": 9,
          "values": {
            "n": -1
          },
          "text": "輸出迴圈結束後保留的 n。",
          "output": "2\n1\n0\nn = -1\n",
          "active": {}
        },
        {
          "line": 10,
          "values": {
            "n": -1
          },
          "text": "main 結束。",
          "output": "2\n1\n0\nn = -1\n",
          "active": {}
        }
      ],
      "expected": "2\n1\n0\nn = -1\n",
      "input": ""
    },
    {
      "label": "for 使用 i 計次｜起點 n = 3",
      "lines": [
        "#include <iostream>",
        "using namespace std;",
        "",
        "int main() {",
        "    int n = 3;",
        "    for (int i = 0; i < n; i++) {",
        "        cout << i << endl;",
        "    }",
        "    cout << \"n = \" << n << endl;",
        "    return 0;",
        "}"
      ],
      "steps": [
        {
          "line": null,
          "values": {},
          "text": "按下一步，觀察條件檢查時的資料與變數。",
          "output": "",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "n": 3
          },
          "text": "設定原本要重複的次數。",
          "output": "",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 3,
            "i": 0
          },
          "text": "建立計次用的 i，從 0 開始；n 保留原值。",
          "output": "",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 3,
            "i": 0
          },
          "text": "檢查 0 < 3，結果是 true。",
          "output": "",
          "active": {}
        },
        {
          "line": 7,
          "values": {
            "n": 3,
            "i": 0
          },
          "text": "輸出這一輪的 i。",
          "output": "0\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 3,
            "i": 1
          },
          "text": "區塊執行完，執行 i++；n 維持 3。",
          "output": "0\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 3,
            "i": 1
          },
          "text": "檢查 1 < 3，結果是 true。",
          "output": "0\n",
          "active": {}
        },
        {
          "line": 7,
          "values": {
            "n": 3,
            "i": 1
          },
          "text": "輸出這一輪的 i。",
          "output": "0\n1\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 3,
            "i": 2
          },
          "text": "區塊執行完，執行 i++；n 維持 3。",
          "output": "0\n1\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 3,
            "i": 2
          },
          "text": "檢查 2 < 3，結果是 true。",
          "output": "0\n1\n",
          "active": {}
        },
        {
          "line": 7,
          "values": {
            "n": 3,
            "i": 2
          },
          "text": "輸出這一輪的 i。",
          "output": "0\n1\n2\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 3,
            "i": 3
          },
          "text": "區塊執行完，執行 i++；n 維持 3。",
          "output": "0\n1\n2\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 3,
            "i": 3
          },
          "text": "檢查 3 < 3，結果是 false。",
          "output": "0\n1\n2\n",
          "active": {}
        },
        {
          "line": 9,
          "values": {
            "n": 3
          },
          "text": "輸出迴圈結束後保留的 n。",
          "output": "0\n1\n2\nn = 3\n",
          "active": {}
        },
        {
          "line": 10,
          "values": {
            "n": 3
          },
          "text": "main 結束。",
          "output": "0\n1\n2\nn = 3\n",
          "active": {}
        }
      ],
      "expected": "0\n1\n2\nn = 3\n",
      "input": ""
    },
    {
      "label": "while (n--) 直接遞減｜起點 n = 1",
      "lines": [
        "#include <iostream>",
        "using namespace std;",
        "",
        "int main() {",
        "    int n = 1;",
        "    while (n--) {",
        "        cout << n << endl;",
        "    }",
        "    cout << \"n = \" << n << endl;",
        "    return 0;",
        "}"
      ],
      "steps": [
        {
          "line": null,
          "values": {},
          "text": "按下一步，觀察條件檢查時的資料與變數。",
          "output": "",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "n": 1
          },
          "text": "設定原本要重複的次數。",
          "output": "",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 0
          },
          "text": "n-- 提供舊值 1 作條件，視為 true；同時 n 已經減為 0。接著進入區塊。",
          "output": "",
          "active": {}
        },
        {
          "line": 7,
          "values": {
            "n": 0
          },
          "text": "區塊內取得的是已遞減後的 n。",
          "output": "0\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": -1
          },
          "text": "n-- 提供舊值 0 作條件，視為 false；同時 n 已經減為 -1。這次跳過區塊並結束迴圈，遞減仍有執行。",
          "output": "0\n",
          "active": {}
        },
        {
          "line": 9,
          "values": {
            "n": -1
          },
          "text": "輸出迴圈結束後保留的 n。",
          "output": "0\nn = -1\n",
          "active": {}
        },
        {
          "line": 10,
          "values": {
            "n": -1
          },
          "text": "main 結束。",
          "output": "0\nn = -1\n",
          "active": {}
        }
      ],
      "expected": "0\nn = -1\n",
      "input": ""
    },
    {
      "label": "for 使用 i 計次｜起點 n = 1",
      "lines": [
        "#include <iostream>",
        "using namespace std;",
        "",
        "int main() {",
        "    int n = 1;",
        "    for (int i = 0; i < n; i++) {",
        "        cout << i << endl;",
        "    }",
        "    cout << \"n = \" << n << endl;",
        "    return 0;",
        "}"
      ],
      "steps": [
        {
          "line": null,
          "values": {},
          "text": "按下一步，觀察條件檢查時的資料與變數。",
          "output": "",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "n": 1
          },
          "text": "設定原本要重複的次數。",
          "output": "",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 1,
            "i": 0
          },
          "text": "建立計次用的 i，從 0 開始；n 保留原值。",
          "output": "",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 1,
            "i": 0
          },
          "text": "檢查 0 < 1，結果是 true。",
          "output": "",
          "active": {}
        },
        {
          "line": 7,
          "values": {
            "n": 1,
            "i": 0
          },
          "text": "輸出這一輪的 i。",
          "output": "0\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 1,
            "i": 1
          },
          "text": "區塊執行完，執行 i++；n 維持 1。",
          "output": "0\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 1,
            "i": 1
          },
          "text": "檢查 1 < 1，結果是 false。",
          "output": "0\n",
          "active": {}
        },
        {
          "line": 9,
          "values": {
            "n": 1
          },
          "text": "輸出迴圈結束後保留的 n。",
          "output": "0\nn = 1\n",
          "active": {}
        },
        {
          "line": 10,
          "values": {
            "n": 1
          },
          "text": "main 結束。",
          "output": "0\nn = 1\n",
          "active": {}
        }
      ],
      "expected": "0\nn = 1\n",
      "input": ""
    },
    {
      "label": "while (n--) 直接遞減｜起點 n = 0",
      "lines": [
        "#include <iostream>",
        "using namespace std;",
        "",
        "int main() {",
        "    int n = 0;",
        "    while (n--) {",
        "        cout << n << endl;",
        "    }",
        "    cout << \"n = \" << n << endl;",
        "    return 0;",
        "}"
      ],
      "steps": [
        {
          "line": null,
          "values": {},
          "text": "按下一步，觀察條件檢查時的資料與變數。",
          "output": "",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "n": 0
          },
          "text": "設定原本要重複的次數。",
          "output": "",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": -1
          },
          "text": "n-- 提供舊值 0 作條件，視為 false；同時 n 已經減為 -1。這次跳過區塊並結束迴圈，遞減仍有執行。",
          "output": "",
          "active": {}
        },
        {
          "line": 9,
          "values": {
            "n": -1
          },
          "text": "輸出迴圈結束後保留的 n。",
          "output": "n = -1\n",
          "active": {}
        },
        {
          "line": 10,
          "values": {
            "n": -1
          },
          "text": "main 結束。",
          "output": "n = -1\n",
          "active": {}
        }
      ],
      "expected": "n = -1\n",
      "input": ""
    },
    {
      "label": "for 使用 i 計次｜起點 n = 0",
      "lines": [
        "#include <iostream>",
        "using namespace std;",
        "",
        "int main() {",
        "    int n = 0;",
        "    for (int i = 0; i < n; i++) {",
        "        cout << i << endl;",
        "    }",
        "    cout << \"n = \" << n << endl;",
        "    return 0;",
        "}"
      ],
      "steps": [
        {
          "line": null,
          "values": {},
          "text": "按下一步，觀察條件檢查時的資料與變數。",
          "output": "",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "n": 0
          },
          "text": "設定原本要重複的次數。",
          "output": "",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 0,
            "i": 0
          },
          "text": "建立計次用的 i，從 0 開始；n 保留原值。",
          "output": "",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 0,
            "i": 0
          },
          "text": "檢查 0 < 0，結果是 false。",
          "output": "",
          "active": {}
        },
        {
          "line": 9,
          "values": {
            "n": 0
          },
          "text": "輸出迴圈結束後保留的 n。",
          "output": "n = 0\n",
          "active": {}
        },
        {
          "line": 10,
          "values": {
            "n": 0
          },
          "text": "main 結束。",
          "output": "n = 0\n",
          "active": {}
        }
      ],
      "expected": "n = 0\n",
      "input": ""
    }
  ]
});
```

:::

## 七、自己試一試

先預測 remaining 從 0 開始時會輸出什麼，再操作確認。接著把程式改成從 1 增加到 5，為它選擇適合的條件與更新方式。

再比較兩組輸入規則：「所有整數都要處理」與「遇到 0 就停止」。最後用 n = 0、1、3 追蹤 `while (n--)` 和 for 計次版本，分別記錄執行次數與結束後的 n。
