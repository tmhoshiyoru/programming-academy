---
title: "用 break 與 continue 控制迴圈"
type: interactive
order: 5
hidden: false
draft: false
---

## 一、提前結束與略過一輪

`break` 用來**結束目前這個迴圈**；`continue` 用來**略過這一輪剩下的指令**，接著準備下一輪。

```cpp
#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i <= 7; i++) {
        if (i == 3) {
            continue;
        }
        if (i == 5) {
            break;
        }
        cout << i << endl;
    }
    cout << "Done" << endl;
    return 0;
}
```

輸出結果：

```text
1
2
4
Done
```

走到 3 時，continue 讓本輪的後續判斷與 cout 略過。走到 5 時，break 讓迴圈直接結束。所以輸出的是 1、2、4，接著才是迴圈後的 Done。

## 二、continue 之後，for 仍然會更新

在這種 for 中，continue 會先前往 `i++`，再檢查條件。這也是為什麼略過 3 後，下一輪會輪到 4。

while 的更新位置由自己安排，使用 continue 時要特別確認更新仍然有機會執行。例如：

~~~cpp
int i = 0;
while (i < 5) {
    i++;
    if (i == 3) {
        continue;
    }
    cout << i << endl;
}
~~~

這段先更新 i，再決定是否略過輸出，因此每輪都有往終點推進。

## 三、條件排列也會影響結果

本例先檢查略過，再檢查結束。當兩個條件恰好在同一輪成立時，先遇到的 continue 會讓後面的判斷略過。設計時先想清楚哪一件事優先，再排列指令。


:::interactive 用 break 與 continue 控制迴圈：逐步追蹤

```game-html
<section><h3>用 break 與 continue 控制迴圈：逐步追蹤</h3><label>選擇一組資料<select id="scenario"></select></label><p id="input-data" class="note" hidden></p><div class="controls"><button id="previous" type="button">上一步</button><button id="next" type="button">下一步</button><button id="last" type="button">最後一步</button><button id="reset" type="button">重新開始</button></div><p id="status" class="note" aria-live="polite"></p><h4>目前的變數</h4><div id="memory" class="memory"></div><h4>程式碼</h4><pre id="program" class="program" aria-label="目前執行的指令會以亮色標示"></pre><h4>目前的輸出</h4><pre id="output" class="terminal" aria-live="polite"></pre></section>
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
      "label": "略過 3，遇到 5 結束",
      "lines": [
        "#include <iostream>",
        "using namespace std;",
        "",
        "int main() {",
        "    for (int i = 1; i <= 7; i++) {",
        "        if (i == 3) {",
        "            continue;",
        "        }",
        "        if (i == 5) {",
        "            break;",
        "        }",
        "        cout << i << endl;",
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
            "i": 1
          },
          "text": "建立 i，從 1 開始。",
          "output": "",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "i": 1
          },
          "text": "檢查 i <= 7：true。",
          "output": "",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "i": 1
          },
          "text": "檢查是否略過這一輪：false。",
          "output": "",
          "active": {}
        },
        {
          "line": 9,
          "values": {
            "i": 1
          },
          "text": "檢查是否結束整個迴圈：false。",
          "output": "",
          "active": {}
        },
        {
          "line": 12,
          "values": {
            "i": 1
          },
          "text": "輸出 i。",
          "output": "1\n",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "i": 2
          },
          "text": "執行更新 i++。",
          "output": "1\n",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "i": 2
          },
          "text": "檢查 i <= 7：true。",
          "output": "1\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "i": 2
          },
          "text": "檢查是否略過這一輪：false。",
          "output": "1\n",
          "active": {}
        },
        {
          "line": 9,
          "values": {
            "i": 2
          },
          "text": "檢查是否結束整個迴圈：false。",
          "output": "1\n",
          "active": {}
        },
        {
          "line": 12,
          "values": {
            "i": 2
          },
          "text": "輸出 i。",
          "output": "1\n2\n",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "i": 3
          },
          "text": "執行更新 i++。",
          "output": "1\n2\n",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "i": 3
          },
          "text": "檢查 i <= 7：true。",
          "output": "1\n2\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "i": 3
          },
          "text": "檢查是否略過這一輪：true。",
          "output": "1\n2\n",
          "active": {}
        },
        {
          "line": 7,
          "values": {
            "i": 3
          },
          "text": "continue 略過本輪剩餘指令，接著仍會執行 for 的 i++。",
          "output": "1\n2\n",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "i": 4
          },
          "text": "執行更新 i++。",
          "output": "1\n2\n",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "i": 4
          },
          "text": "檢查 i <= 7：true。",
          "output": "1\n2\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "i": 4
          },
          "text": "檢查是否略過這一輪：false。",
          "output": "1\n2\n",
          "active": {}
        },
        {
          "line": 9,
          "values": {
            "i": 4
          },
          "text": "檢查是否結束整個迴圈：false。",
          "output": "1\n2\n",
          "active": {}
        },
        {
          "line": 12,
          "values": {
            "i": 4
          },
          "text": "輸出 i。",
          "output": "1\n2\n4\n",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "i": 5
          },
          "text": "執行更新 i++。",
          "output": "1\n2\n4\n",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "i": 5
          },
          "text": "檢查 i <= 7：true。",
          "output": "1\n2\n4\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "i": 5
          },
          "text": "檢查是否略過這一輪：false。",
          "output": "1\n2\n4\n",
          "active": {}
        },
        {
          "line": 9,
          "values": {
            "i": 5
          },
          "text": "檢查是否結束整個迴圈：true。",
          "output": "1\n2\n4\n",
          "active": {}
        },
        {
          "line": 10,
          "values": {
            "i": 5
          },
          "text": "break 直接離開這個迴圈，這一輪的 cout 也略過。",
          "output": "1\n2\n4\n",
          "active": {}
        },
        {
          "line": 14,
          "values": {},
          "text": "繼續執行迴圈後的指令。",
          "output": "1\n2\n4\nDone\n",
          "active": {}
        },
        {
          "line": 15,
          "values": {},
          "text": "結束程式。",
          "output": "1\n2\n4\nDone\n",
          "active": {}
        }
      ],
      "expected": "1\n2\n4\nDone\n",
      "input": ""
    },
    {
      "label": "略過 2，遇到 6 結束",
      "lines": [
        "#include <iostream>",
        "using namespace std;",
        "",
        "int main() {",
        "    for (int i = 1; i <= 7; i++) {",
        "        if (i == 2) {",
        "            continue;",
        "        }",
        "        if (i == 6) {",
        "            break;",
        "        }",
        "        cout << i << endl;",
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
            "i": 1
          },
          "text": "建立 i，從 1 開始。",
          "output": "",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "i": 1
          },
          "text": "檢查 i <= 7：true。",
          "output": "",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "i": 1
          },
          "text": "檢查是否略過這一輪：false。",
          "output": "",
          "active": {}
        },
        {
          "line": 9,
          "values": {
            "i": 1
          },
          "text": "檢查是否結束整個迴圈：false。",
          "output": "",
          "active": {}
        },
        {
          "line": 12,
          "values": {
            "i": 1
          },
          "text": "輸出 i。",
          "output": "1\n",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "i": 2
          },
          "text": "執行更新 i++。",
          "output": "1\n",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "i": 2
          },
          "text": "檢查 i <= 7：true。",
          "output": "1\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "i": 2
          },
          "text": "檢查是否略過這一輪：true。",
          "output": "1\n",
          "active": {}
        },
        {
          "line": 7,
          "values": {
            "i": 2
          },
          "text": "continue 略過本輪剩餘指令，接著仍會執行 for 的 i++。",
          "output": "1\n",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "i": 3
          },
          "text": "執行更新 i++。",
          "output": "1\n",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "i": 3
          },
          "text": "檢查 i <= 7：true。",
          "output": "1\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "i": 3
          },
          "text": "檢查是否略過這一輪：false。",
          "output": "1\n",
          "active": {}
        },
        {
          "line": 9,
          "values": {
            "i": 3
          },
          "text": "檢查是否結束整個迴圈：false。",
          "output": "1\n",
          "active": {}
        },
        {
          "line": 12,
          "values": {
            "i": 3
          },
          "text": "輸出 i。",
          "output": "1\n3\n",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "i": 4
          },
          "text": "執行更新 i++。",
          "output": "1\n3\n",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "i": 4
          },
          "text": "檢查 i <= 7：true。",
          "output": "1\n3\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "i": 4
          },
          "text": "檢查是否略過這一輪：false。",
          "output": "1\n3\n",
          "active": {}
        },
        {
          "line": 9,
          "values": {
            "i": 4
          },
          "text": "檢查是否結束整個迴圈：false。",
          "output": "1\n3\n",
          "active": {}
        },
        {
          "line": 12,
          "values": {
            "i": 4
          },
          "text": "輸出 i。",
          "output": "1\n3\n4\n",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "i": 5
          },
          "text": "執行更新 i++。",
          "output": "1\n3\n4\n",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "i": 5
          },
          "text": "檢查 i <= 7：true。",
          "output": "1\n3\n4\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "i": 5
          },
          "text": "檢查是否略過這一輪：false。",
          "output": "1\n3\n4\n",
          "active": {}
        },
        {
          "line": 9,
          "values": {
            "i": 5
          },
          "text": "檢查是否結束整個迴圈：false。",
          "output": "1\n3\n4\n",
          "active": {}
        },
        {
          "line": 12,
          "values": {
            "i": 5
          },
          "text": "輸出 i。",
          "output": "1\n3\n4\n5\n",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "i": 6
          },
          "text": "執行更新 i++。",
          "output": "1\n3\n4\n5\n",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "i": 6
          },
          "text": "檢查 i <= 7：true。",
          "output": "1\n3\n4\n5\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "i": 6
          },
          "text": "檢查是否略過這一輪：false。",
          "output": "1\n3\n4\n5\n",
          "active": {}
        },
        {
          "line": 9,
          "values": {
            "i": 6
          },
          "text": "檢查是否結束整個迴圈：true。",
          "output": "1\n3\n4\n5\n",
          "active": {}
        },
        {
          "line": 10,
          "values": {
            "i": 6
          },
          "text": "break 直接離開這個迴圈，這一輪的 cout 也略過。",
          "output": "1\n3\n4\n5\n",
          "active": {}
        },
        {
          "line": 14,
          "values": {},
          "text": "繼續執行迴圈後的指令。",
          "output": "1\n3\n4\n5\nDone\n",
          "active": {}
        },
        {
          "line": 15,
          "values": {},
          "text": "結束程式。",
          "output": "1\n3\n4\n5\nDone\n",
          "active": {}
        }
      ],
      "expected": "1\n3\n4\n5\nDone\n",
      "input": ""
    },
    {
      "label": "略過 3，遇到 9 結束",
      "lines": [
        "#include <iostream>",
        "using namespace std;",
        "",
        "int main() {",
        "    for (int i = 1; i <= 7; i++) {",
        "        if (i == 3) {",
        "            continue;",
        "        }",
        "        if (i == 9) {",
        "            break;",
        "        }",
        "        cout << i << endl;",
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
            "i": 1
          },
          "text": "建立 i，從 1 開始。",
          "output": "",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "i": 1
          },
          "text": "檢查 i <= 7：true。",
          "output": "",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "i": 1
          },
          "text": "檢查是否略過這一輪：false。",
          "output": "",
          "active": {}
        },
        {
          "line": 9,
          "values": {
            "i": 1
          },
          "text": "檢查是否結束整個迴圈：false。",
          "output": "",
          "active": {}
        },
        {
          "line": 12,
          "values": {
            "i": 1
          },
          "text": "輸出 i。",
          "output": "1\n",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "i": 2
          },
          "text": "執行更新 i++。",
          "output": "1\n",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "i": 2
          },
          "text": "檢查 i <= 7：true。",
          "output": "1\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "i": 2
          },
          "text": "檢查是否略過這一輪：false。",
          "output": "1\n",
          "active": {}
        },
        {
          "line": 9,
          "values": {
            "i": 2
          },
          "text": "檢查是否結束整個迴圈：false。",
          "output": "1\n",
          "active": {}
        },
        {
          "line": 12,
          "values": {
            "i": 2
          },
          "text": "輸出 i。",
          "output": "1\n2\n",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "i": 3
          },
          "text": "執行更新 i++。",
          "output": "1\n2\n",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "i": 3
          },
          "text": "檢查 i <= 7：true。",
          "output": "1\n2\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "i": 3
          },
          "text": "檢查是否略過這一輪：true。",
          "output": "1\n2\n",
          "active": {}
        },
        {
          "line": 7,
          "values": {
            "i": 3
          },
          "text": "continue 略過本輪剩餘指令，接著仍會執行 for 的 i++。",
          "output": "1\n2\n",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "i": 4
          },
          "text": "執行更新 i++。",
          "output": "1\n2\n",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "i": 4
          },
          "text": "檢查 i <= 7：true。",
          "output": "1\n2\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "i": 4
          },
          "text": "檢查是否略過這一輪：false。",
          "output": "1\n2\n",
          "active": {}
        },
        {
          "line": 9,
          "values": {
            "i": 4
          },
          "text": "檢查是否結束整個迴圈：false。",
          "output": "1\n2\n",
          "active": {}
        },
        {
          "line": 12,
          "values": {
            "i": 4
          },
          "text": "輸出 i。",
          "output": "1\n2\n4\n",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "i": 5
          },
          "text": "執行更新 i++。",
          "output": "1\n2\n4\n",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "i": 5
          },
          "text": "檢查 i <= 7：true。",
          "output": "1\n2\n4\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "i": 5
          },
          "text": "檢查是否略過這一輪：false。",
          "output": "1\n2\n4\n",
          "active": {}
        },
        {
          "line": 9,
          "values": {
            "i": 5
          },
          "text": "檢查是否結束整個迴圈：false。",
          "output": "1\n2\n4\n",
          "active": {}
        },
        {
          "line": 12,
          "values": {
            "i": 5
          },
          "text": "輸出 i。",
          "output": "1\n2\n4\n5\n",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "i": 6
          },
          "text": "執行更新 i++。",
          "output": "1\n2\n4\n5\n",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "i": 6
          },
          "text": "檢查 i <= 7：true。",
          "output": "1\n2\n4\n5\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "i": 6
          },
          "text": "檢查是否略過這一輪：false。",
          "output": "1\n2\n4\n5\n",
          "active": {}
        },
        {
          "line": 9,
          "values": {
            "i": 6
          },
          "text": "檢查是否結束整個迴圈：false。",
          "output": "1\n2\n4\n5\n",
          "active": {}
        },
        {
          "line": 12,
          "values": {
            "i": 6
          },
          "text": "輸出 i。",
          "output": "1\n2\n4\n5\n6\n",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "i": 7
          },
          "text": "執行更新 i++。",
          "output": "1\n2\n4\n5\n6\n",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "i": 7
          },
          "text": "檢查 i <= 7：true。",
          "output": "1\n2\n4\n5\n6\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "i": 7
          },
          "text": "檢查是否略過這一輪：false。",
          "output": "1\n2\n4\n5\n6\n",
          "active": {}
        },
        {
          "line": 9,
          "values": {
            "i": 7
          },
          "text": "檢查是否結束整個迴圈：false。",
          "output": "1\n2\n4\n5\n6\n",
          "active": {}
        },
        {
          "line": 12,
          "values": {
            "i": 7
          },
          "text": "輸出 i。",
          "output": "1\n2\n4\n5\n6\n7\n",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "i": 8
          },
          "text": "執行更新 i++。",
          "output": "1\n2\n4\n5\n6\n7\n",
          "active": {}
        },
        {
          "line": 5,
          "values": {
            "i": 8
          },
          "text": "條件為 false，離開迴圈。",
          "output": "1\n2\n4\n5\n6\n7\n",
          "active": {}
        },
        {
          "line": 14,
          "values": {},
          "text": "繼續執行迴圈後的指令。",
          "output": "1\n2\n4\n5\n6\n7\nDone\n",
          "active": {}
        },
        {
          "line": 15,
          "values": {},
          "text": "結束程式。",
          "output": "1\n2\n4\n5\n6\n7\nDone\n",
          "active": {}
        }
      ],
      "expected": "1\n2\n4\n5\n6\n7\nDone\n",
      "input": ""
    }
  ]
});
```

:::


## 四、自己試一試

把「略過 3、遇到 5 結束」改成「略過 2、遇到 6 結束」，先寫出預測輸出。之後介紹巢狀迴圈時，也可以觀察 break 只結束最內層的那一個迴圈。
