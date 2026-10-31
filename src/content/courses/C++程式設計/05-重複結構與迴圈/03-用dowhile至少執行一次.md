---
title: "用 do while 至少執行一次"
type: interactive
supplementary: true
order: 3
hidden: false
draft: false
---

## 一、先做一次，再決定要不要繼續

上一節的 while 會在區塊前檢查；`do while` 則先執行區塊，再在後面檢查條件。因此，區塊**至少會執行一次**。

```cpp
#include <iostream>
using namespace std;

int main() {
    int remaining = 0;
    do {
        cout << remaining << endl;
        remaining--;
    } while (remaining > 0);
    cout << "Done" << endl;
    return 0;
}
```

輸出結果：

```text
0
Done
```

這次特別把 remaining 設為 0。程式先輸出 0，再把它減成 -1，最後才檢查 `remaining > 0`，因此離開迴圈。

## 二、和 while 比較執行順序

~~~cpp
while (remaining > 0) {
    cout << remaining << endl;
    remaining--;
}
~~~

當 remaining 一開始為 0，這個 while 的區塊會執行零次。把同樣的資料放進 do while，就會看到前面說的差別。

do while 常用於「至少先詢問一次，再依答案決定是否繼續」的流程，例如重複顯示選單。

## 三、最後的分號是語法的一部分

~~~cpp
do {
    // 要重複的工作
} while (條件);
~~~

`do while` 最後的 `;` 要保留。這和 `for (...) { ... }`、`while (...) { ... }` 的寫法不同，閱讀時可以把整組 do 到分號看成一個完整敘述。


:::interactive 用 do while 至少執行一次：逐步追蹤

```game-html
<section><h3>用 do while 至少執行一次：逐步追蹤</h3><label>選擇一組資料<select id="scenario"></select></label><p id="input-data" class="note" hidden></p><div class="controls"><button id="previous" type="button">上一步</button><button id="next" type="button">下一步</button><button id="last" type="button">最後一步</button><button id="reset" type="button">重新開始</button></div><p id="status" class="note" aria-live="polite"></p><h4>目前的變數</h4><div id="memory" class="memory"></div><h4>程式碼</h4><pre id="program" class="program" aria-label="目前執行的指令會以亮色標示"></pre><h4>目前的輸出</h4><pre id="output" class="terminal" aria-live="polite"></pre></section>
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
      "label": "remaining 從 0 開始",
      "lines": [
        "#include <iostream>",
        "using namespace std;",
        "",
        "int main() {",
        "    int remaining = 0;",
        "    do {",
        "        cout << remaining << endl;",
        "        remaining--;",
        "    } while (remaining > 0);",
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
          "text": "先進入區塊，再檢查是否繼續。",
          "output": "",
          "active": {}
        },
        {
          "line": 7,
          "values": {
            "remaining": 0
          },
          "text": "輸出目前的 remaining。",
          "output": "0\n",
          "active": {}
        },
        {
          "line": 8,
          "values": {
            "remaining": -1
          },
          "text": "完成一輪倒數，remaining 減少 1。",
          "output": "0\n",
          "active": {}
        },
        {
          "line": 9,
          "values": {
            "remaining": -1
          },
          "text": "在區塊後檢查 remaining > 0，結果是 false。",
          "output": "0\n",
          "active": {}
        },
        {
          "line": 10,
          "values": {
            "remaining": -1
          },
          "text": "離開迴圈，接著輸出 Done。",
          "output": "0\nDone\n",
          "active": {}
        },
        {
          "line": 11,
          "values": {
            "remaining": -1
          },
          "text": "結束程式。",
          "output": "0\nDone\n",
          "active": {}
        }
      ],
      "expected": "0\nDone\n",
      "input": ""
    },
    {
      "label": "remaining 從 3 開始",
      "lines": [
        "#include <iostream>",
        "using namespace std;",
        "",
        "int main() {",
        "    int remaining = 3;",
        "    do {",
        "        cout << remaining << endl;",
        "        remaining--;",
        "    } while (remaining > 0);",
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
          "text": "先進入區塊，再檢查是否繼續。",
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
          "line": 9,
          "values": {
            "remaining": 2
          },
          "text": "在區塊後檢查 remaining > 0，結果是 true。",
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
          "line": 9,
          "values": {
            "remaining": 1
          },
          "text": "在區塊後檢查 remaining > 0，結果是 true。",
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
          "line": 9,
          "values": {
            "remaining": 0
          },
          "text": "在區塊後檢查 remaining > 0，結果是 false。",
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
        "    do {",
        "        cout << remaining << endl;",
        "        remaining--;",
        "    } while (remaining > 0);",
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
          "text": "先進入區塊，再檢查是否繼續。",
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
          "line": 9,
          "values": {
            "remaining": 0
          },
          "text": "在區塊後檢查 remaining > 0，結果是 false。",
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
    }
  ]
});
```

:::


## 四、自己試一試

改用 remaining = 3，列出每輪輸出的值與檢查條件的時機。再比較 while 與 do while 在這組資料下的輸出。
