---
title: "用 for 重複執行指令"
type: interactive
order: 1
hidden: false
draft: false
---

## 一、讓同一段指令重複工作

如果要依序輸出 1、2、3，可以寫三行 cout；要輸出到 100 時，就可以把「輸出目前的數」交給**迴圈**。迴圈會在條件成立時，重複執行一個區塊。

```cpp
#include <iostream>
using namespace std;

int main() {
    int n = 3;
    for (int i = 1; i <= n; i++) {
        cout << i << endl;
    }
    return 0;
}
```

輸出結果：

```text
1
2
3
```

本例的 `i` 代表目前輪到的數字。每完成一輪就增加 1，一直做到 `i <= n` 為 false。

## 二、for 括號裡的三個部分

~~~cpp
for (int i = 1; i <= n; i++) {
    cout << i << endl;
}
~~~

1. **初始化**：`int i = 1`，在迴圈開始時執行一次。
2. **條件**：`i <= n`，每輪開始前檢查，成立才進入區塊。
3. **更新**：`i++`，完成區塊後執行，讓 i 增加 1。

順序是「初始化 → 檢查 → 區塊 → 更新 → 檢查……」。兩個分號把三部分隔開，大括號內才是重複的工作。

## 三、觀察起點、終點與步長

本例使用 `<= n`，因此包含 n；改成 `< n`，就只會做到 n 的前一個整數。更新也可以寫成 `i += 2`，讓數字每次增加 2。

~~~cpp
for (int i = 2; i <= 10; i += 2) {
    cout << i << endl;
}
~~~

這段會輸出 2、4、6、8、10。先在紙上列出希望出現的數字，再決定起點、條件與更新方式。


:::interactive 用 for 重複執行指令：逐步追蹤

```game-html
<section><h3>用 for 重複執行指令：逐步追蹤</h3><label>選擇一組資料<select id="scenario"></select></label><p id="input-data" class="note" hidden></p><div class="controls"><button id="previous" type="button">上一步</button><button id="next" type="button">下一步</button><button id="last" type="button">最後一步</button><button id="reset" type="button">重新開始</button></div><p id="status" class="note" aria-live="polite"></p><h4>目前的變數</h4><div id="memory" class="memory"></div><h4>程式碼</h4><pre id="program" class="program" aria-label="目前執行的指令會以亮色標示"></pre><h4>目前的輸出</h4><pre id="output" class="terminal" aria-live="polite"></pre></section>
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
      "label": "從 1 輸出到 3",
      "lines": [
        "#include <iostream>",
        "using namespace std;",
        "",
        "int main() {",
        "    int n = 3;",
        "    for (int i = 1; i <= n; i++) {",
        "        cout << i << endl;",
        "    }",
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
            "n": 3
          },
          "text": "設定終點 n。",
          "output": "",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 3,
            "i": 1
          },
          "text": "初始化只做一次：建立 i，指定為 1。",
          "output": "",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 3,
            "i": 1
          },
          "text": "檢查 1 <= 3，結果是 true。",
          "output": "",
          "active": {}
        },
        {
          "line": 7,
          "values": {
            "n": 3,
            "i": 1
          },
          "text": "輸出目前的 i：1。",
          "output": "1\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 3,
            "i": 2
          },
          "text": "這一輪結束，執行 i++，再回去檢查條件。",
          "output": "1\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 3,
            "i": 2
          },
          "text": "檢查 2 <= 3，結果是 true。",
          "output": "1\n",
          "active": {}
        },
        {
          "line": 7,
          "values": {
            "n": 3,
            "i": 2
          },
          "text": "輸出目前的 i：2。",
          "output": "1\n2\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 3,
            "i": 3
          },
          "text": "這一輪結束，執行 i++，再回去檢查條件。",
          "output": "1\n2\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 3,
            "i": 3
          },
          "text": "檢查 3 <= 3，結果是 true。",
          "output": "1\n2\n",
          "active": {}
        },
        {
          "line": 7,
          "values": {
            "n": 3,
            "i": 3
          },
          "text": "輸出目前的 i：3。",
          "output": "1\n2\n3\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 3,
            "i": 4
          },
          "text": "這一輪結束，執行 i++，再回去檢查條件。",
          "output": "1\n2\n3\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 3,
            "i": 4
          },
          "text": "檢查 4 <= 3，結果是 false。",
          "output": "1\n2\n3\n",
          "active": {}
        },
        {
          "line": 9,
          "values": {
            "n": 3
          },
          "text": "條件為 false，離開迴圈；在 for 裡建立的 i 也結束使用。",
          "output": "1\n2\n3\n",
          "active": {}
        }
      ],
      "expected": "1\n2\n3\n",
      "input": ""
    },
    {
      "label": "從 1 輸出到 1",
      "lines": [
        "#include <iostream>",
        "using namespace std;",
        "",
        "int main() {",
        "    int n = 1;",
        "    for (int i = 1; i <= n; i++) {",
        "        cout << i << endl;",
        "    }",
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
            "n": 1
          },
          "text": "設定終點 n。",
          "output": "",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 1,
            "i": 1
          },
          "text": "初始化只做一次：建立 i，指定為 1。",
          "output": "",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 1,
            "i": 1
          },
          "text": "檢查 1 <= 1，結果是 true。",
          "output": "",
          "active": {}
        },
        {
          "line": 7,
          "values": {
            "n": 1,
            "i": 1
          },
          "text": "輸出目前的 i：1。",
          "output": "1\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 1,
            "i": 2
          },
          "text": "這一輪結束，執行 i++，再回去檢查條件。",
          "output": "1\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 1,
            "i": 2
          },
          "text": "檢查 2 <= 1，結果是 false。",
          "output": "1\n",
          "active": {}
        },
        {
          "line": 9,
          "values": {
            "n": 1
          },
          "text": "條件為 false，離開迴圈；在 for 裡建立的 i 也結束使用。",
          "output": "1\n",
          "active": {}
        }
      ],
      "expected": "1\n",
      "input": ""
    },
    {
      "label": "從 1 輸出到 0",
      "lines": [
        "#include <iostream>",
        "using namespace std;",
        "",
        "int main() {",
        "    int n = 0;",
        "    for (int i = 1; i <= n; i++) {",
        "        cout << i << endl;",
        "    }",
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
            "n": 0
          },
          "text": "設定終點 n。",
          "output": "",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 0,
            "i": 1
          },
          "text": "初始化只做一次：建立 i，指定為 1。",
          "output": "",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 0,
            "i": 1
          },
          "text": "檢查 1 <= 0，結果是 false。",
          "output": "",
          "active": {}
        },
        {
          "line": 9,
          "values": {
            "n": 0
          },
          "text": "條件為 false，離開迴圈；在 for 裡建立的 i 也結束使用。",
          "output": "",
          "active": {}
        }
      ],
      "expected": "",
      "input": ""
    },
    {
      "label": "從 1 輸出到 5",
      "lines": [
        "#include <iostream>",
        "using namespace std;",
        "",
        "int main() {",
        "    int n = 5;",
        "    for (int i = 1; i <= n; i++) {",
        "        cout << i << endl;",
        "    }",
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
            "n": 5
          },
          "text": "設定終點 n。",
          "output": "",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 5,
            "i": 1
          },
          "text": "初始化只做一次：建立 i，指定為 1。",
          "output": "",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 5,
            "i": 1
          },
          "text": "檢查 1 <= 5，結果是 true。",
          "output": "",
          "active": {}
        },
        {
          "line": 7,
          "values": {
            "n": 5,
            "i": 1
          },
          "text": "輸出目前的 i：1。",
          "output": "1\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 5,
            "i": 2
          },
          "text": "這一輪結束，執行 i++，再回去檢查條件。",
          "output": "1\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 5,
            "i": 2
          },
          "text": "檢查 2 <= 5，結果是 true。",
          "output": "1\n",
          "active": {}
        },
        {
          "line": 7,
          "values": {
            "n": 5,
            "i": 2
          },
          "text": "輸出目前的 i：2。",
          "output": "1\n2\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 5,
            "i": 3
          },
          "text": "這一輪結束，執行 i++，再回去檢查條件。",
          "output": "1\n2\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 5,
            "i": 3
          },
          "text": "檢查 3 <= 5，結果是 true。",
          "output": "1\n2\n",
          "active": {}
        },
        {
          "line": 7,
          "values": {
            "n": 5,
            "i": 3
          },
          "text": "輸出目前的 i：3。",
          "output": "1\n2\n3\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 5,
            "i": 4
          },
          "text": "這一輪結束，執行 i++，再回去檢查條件。",
          "output": "1\n2\n3\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 5,
            "i": 4
          },
          "text": "檢查 4 <= 5，結果是 true。",
          "output": "1\n2\n3\n",
          "active": {}
        },
        {
          "line": 7,
          "values": {
            "n": 5,
            "i": 4
          },
          "text": "輸出目前的 i：4。",
          "output": "1\n2\n3\n4\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 5,
            "i": 5
          },
          "text": "這一輪結束，執行 i++，再回去檢查條件。",
          "output": "1\n2\n3\n4\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 5,
            "i": 5
          },
          "text": "檢查 5 <= 5，結果是 true。",
          "output": "1\n2\n3\n4\n",
          "active": {}
        },
        {
          "line": 7,
          "values": {
            "n": 5,
            "i": 5
          },
          "text": "輸出目前的 i：5。",
          "output": "1\n2\n3\n4\n5\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 5,
            "i": 6
          },
          "text": "這一輪結束，執行 i++，再回去檢查條件。",
          "output": "1\n2\n3\n4\n5\n",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "n": 5,
            "i": 6
          },
          "text": "檢查 6 <= 5，結果是 false。",
          "output": "1\n2\n3\n4\n5\n",
          "active": {}
        },
        {
          "line": 9,
          "values": {
            "n": 5
          },
          "text": "條件為 false，離開迴圈；在 for 裡建立的 i 也結束使用。",
          "output": "1\n2\n3\n4\n5\n",
          "active": {}
        }
      ],
      "expected": "1\n2\n3\n4\n5\n",
      "input": ""
    }
  ]
});
```

:::


選擇 n = 0 時，第一次條件檢查就是 false，區塊會執行零次。這也是測試迴圈邊界的一種方式。

## 四、自己試一試

寫一個從 10 倒數到 1 的 for，更新部分使用 `i--`。再把終點改成 0，觀察條件需要怎麼調整。
