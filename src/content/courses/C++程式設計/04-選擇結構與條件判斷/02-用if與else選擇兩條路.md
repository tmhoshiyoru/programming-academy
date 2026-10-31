---
title: "用 if 與 else 選擇兩條路"
type: interactive
order: 2
hidden: false
draft: false
---

## 一、成立與不成立，各有一件事

如果希望及格時輸出 `Pass`，其他情況輸出 `Keep trying`，可以在 if 後面接 `else`。

```cpp
#include <iostream>
using namespace std;

int main() {
    int score = 75;
    if (score >= 60) {
        cout << "Pass" << endl;
    }
    else {
        cout << "Keep trying" << endl;
    }
    cout << "Done" << endl;
    return 0;
}
```

輸出結果：

```text
Pass
Done
```

`if` 和這個 `else` 是一組選擇：條件成立時，執行 if 大括號內的指令並跳過 else；條件為 false 時，跳過 if 大括號內的所有指令，改執行 else 的區塊。這次只會執行其中一個區塊。不論走哪條路，該區塊結束後都會接回後面的 `cout << "Done"`。

## 二、else 代表其他情況

~~~cpp
if (score >= 60) {
    cout << "Pass" << endl;
}
else {
    cout << "Keep trying" << endl;
}
~~~

`else` 直接接大括號即可，條件已經由前面的 if 決定。分數是 60 時符合 `>= 60`，會走 Pass；59 則走另一邊。

## 三、把互斥的情況放在一起

「偶數或奇數」也適合這種二選一的結構：用 `number % 2 == 0` 作為條件，成立輸出 `Even`，else 輸出 `Odd`。這裡包含兩個操作：先求餘數，再比較是否等於 0。

每條路徑可以有多行指令。需要兩邊都做的事情，像輸出結束訊息，放在整組 if／else 後面即可。


:::interactive 用 if 與 else 選擇兩條路：逐步追蹤

```game-html
<section><h3>用 if 與 else 選擇兩條路：逐步追蹤</h3><label>選擇一組資料<select id="scenario"></select></label><p id="input-data" class="note" hidden></p><div class="controls"><button id="previous" type="button">上一步</button><button id="next" type="button">下一步</button><button id="last" type="button">最後一步</button><button id="reset" type="button">重新開始</button></div><p id="status" class="note" aria-live="polite"></p><h4>目前的變數</h4><div id="memory" class="memory"></div><h4>程式碼</h4><pre id="program" class="program" aria-label="目前執行的指令會以亮色標示"></pre><h4>目前的輸出</h4><pre id="output" class="terminal" aria-live="polite"></pre></section>
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
      "label": "score = 75",
      "lines": [
        "#include <iostream>",
        "using namespace std;",
        "",
        "int main() {",
        "    int score = 75;",
        "    if (score >= 60) {",
        "        cout << \"Pass\" << endl;",
        "    }",
        "    else {",
        "        cout << \"Keep trying\" << endl;",
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
            "score": 75
          },
          "text": "建立 score，指定初值 75。",
          "output": "",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "score": 75
          },
          "text": "75 >= 60 是 true，進入 if 區塊。",
          "output": "",
          "active": {}
        },
        {
          "line": 7,
          "values": {
            "score": 75
          },
          "text": "條件成立，輸出 Pass。",
          "output": "Pass\n",
          "active": {}
        },
        {
          "line": 12,
          "values": {
            "score": 75
          },
          "text": "兩條路都會接回這裡，輸出 Done。",
          "output": "Pass\nDone\n",
          "active": {}
        },
        {
          "line": 13,
          "values": {
            "score": 75
          },
          "text": "main 結束。",
          "output": "Pass\nDone\n",
          "active": {}
        }
      ],
      "expected": "Pass\nDone\n",
      "input": ""
    },
    {
      "label": "score = 59",
      "lines": [
        "#include <iostream>",
        "using namespace std;",
        "",
        "int main() {",
        "    int score = 59;",
        "    if (score >= 60) {",
        "        cout << \"Pass\" << endl;",
        "    }",
        "    else {",
        "        cout << \"Keep trying\" << endl;",
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
            "score": 59
          },
          "text": "建立 score，指定初值 59。",
          "output": "",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "score": 59
          },
          "text": "59 >= 60 是 false，改走 else 區塊。",
          "output": "",
          "active": {}
        },
        {
          "line": 10,
          "values": {
            "score": 59
          },
          "text": "條件為 false，輸出 Keep trying。",
          "output": "Keep trying\n",
          "active": {}
        },
        {
          "line": 12,
          "values": {
            "score": 59
          },
          "text": "兩條路都會接回這裡，輸出 Done。",
          "output": "Keep trying\nDone\n",
          "active": {}
        },
        {
          "line": 13,
          "values": {
            "score": 59
          },
          "text": "main 結束。",
          "output": "Keep trying\nDone\n",
          "active": {}
        }
      ],
      "expected": "Keep trying\nDone\n",
      "input": ""
    },
    {
      "label": "score = 60",
      "lines": [
        "#include <iostream>",
        "using namespace std;",
        "",
        "int main() {",
        "    int score = 60;",
        "    if (score >= 60) {",
        "        cout << \"Pass\" << endl;",
        "    }",
        "    else {",
        "        cout << \"Keep trying\" << endl;",
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
            "score": 60
          },
          "text": "建立 score，指定初值 60。",
          "output": "",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "score": 60
          },
          "text": "60 >= 60 是 true，進入 if 區塊。",
          "output": "",
          "active": {}
        },
        {
          "line": 7,
          "values": {
            "score": 60
          },
          "text": "條件成立，輸出 Pass。",
          "output": "Pass\n",
          "active": {}
        },
        {
          "line": 12,
          "values": {
            "score": 60
          },
          "text": "兩條路都會接回這裡，輸出 Done。",
          "output": "Pass\nDone\n",
          "active": {}
        },
        {
          "line": 13,
          "values": {
            "score": 60
          },
          "text": "main 結束。",
          "output": "Pass\nDone\n",
          "active": {}
        }
      ],
      "expected": "Pass\nDone\n",
      "input": ""
    }
  ]
});
```

:::


## 四、自己試一試

把分數判斷改成票價判斷：年齡小於 12 歲輸出 `Child`，其他情況輸出 `Regular`。測試 11 歲與 12 歲，確認分界。
