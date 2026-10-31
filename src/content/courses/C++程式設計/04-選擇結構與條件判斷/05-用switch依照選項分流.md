---
title: "用 switch 依照選項分流"
type: interactive
supplementary: true
order: 5
hidden: false
draft: false
---

## 一、依照編號選擇動作

當選單有固定的整數或字元選項，例如 1 代表茶、2 代表水，`switch` 可以把各個選項排列在一起。

**switch 括號內，本課先使用整數或字元**，例如 `int`、`long long`、`char`。它會取得一個值，再找值相同的 case；字元本身有對應的整數字元碼，因此也能使用 `case 'A':`。

`float`、`double` 和 `string` 不能直接作為這裡的 switch 判斷對象。需要比較小數、字串或某個範圍時，使用 if／else if 會更適合。case 後面則寫編譯時就能確定的值，例如 `1`、`2` 或 `'A'`，而不是當次才從 cin 讀到的變數。

```cpp
#include <iostream>
using namespace std;

int main() {
    int choice = 1;
    switch (choice) {
        case 1:
            cout << "Tea" << endl;
            break;
        case 2:
            cout << "Water" << endl;
            break;
        default:
            cout << "Choose 1 or 2" << endl;
    }
    cout << "Done" << endl;
    return 0;
}
```

輸出結果：

```text
Tea
Done
```

`switch (choice)` 取得選項值，找到符合的 `case` 標籤後開始執行。`case 1:` 的冒號是標籤的一部分；`default:` 則處理其他編號。

## 二、break 決定這次在哪裡結束

選中 case 後，程式會從那裡往下執行。**每個選項各做各的時候，要記得用 `break;` 結束該選項。**

如果第一個 case 的 break 省略，選擇 1 時就會先輸出 Tea，接著繼續執行 case 2 的 Water，直到遇到下一個 break。case 標籤是入口，break 才是這個例子中的離開點。

## 三、什麼情況適合哪一種判斷？

固定的整數、字元選項可以使用 switch，例如 `case 'A':`。需要判斷大小、範圍或組合多個條件時，用 if／else if 會更直接。這一篇先以整數編號練習分流。

下面改成字元選項。注意字元用半形單引號，`'A'` 和字串 `"A"` 是不同的資料。

~~~cpp
#include <iostream>
using namespace std;

int main() {
    char choice = 'A';
    switch (choice) {
        case 'A':
            cout << "Tea" << endl;
            break;
        case 'B':
            cout << "Water" << endl;
            break;
        default:
            cout << "Choose A or B" << endl;
    }
    return 0;
}
~~~

這次會輸出 Tea。把 choice 改成 `'B'` 或 `'C'`，就能分別走到另一個 case 或 default。

## 四、多個 case 可以共用一段工作

如果 1、2、3 都要執行同一件事，可以把三個標籤接在一起：

~~~cpp
switch (choice) {
    case 1:
    case 2:
    case 3:
        cout << "Small group" << endl;
        break;
    default:
        cout << "Other group" << endl;
}
~~~

choice 為 1 時從 case 1 進入，接著往下走到共同的 cout；2、3 也會到達同一行。這是標準 C++ 的寫法，適合少量固定選項共用一段指令。

## 五、補充：case 1 ... 3: 是什麼？

你可能看過這樣的範例：

~~~cpp
// GNU 擴充語法，需使用支援這項擴充的編譯器與設定
switch (choice) {
    case 1 ... 3:
        cout << "Small group" << endl;
        break;
    default:
        cout << "Other group" << endl;
}
~~~

`case 1 ... 3:` 表示包含 1、2、3，兩端都算在範圍內；效果和前面連寫三個 case 標籤相同。`case 'A' ... 'Z':` 也能用來表示一段連續字元碼。

**這是 GNU 編譯器擴充，並非標準 C++ 語法。** GCC／g++ 支援這種寫法，但不同編譯器或嚴格標準模式可能拒絕它。若要讓程式方便換到其他環境，可以使用前面的多個 case，或改用 if 判斷範圍。三個點 `...` 的前後要留空白，例如 `case 1 ... 3:`。[GCC 官方說明](https://gcc.gnu.org/onlinedocs/gcc/Case-Ranges.html)


:::interactive 用 switch 依照選項分流：逐步追蹤

```game-html
<section><h3>用 switch 依照選項分流：逐步追蹤</h3><label>選擇一組資料<select id="scenario"></select></label><p id="input-data" class="note" hidden></p><div class="controls"><button id="previous" type="button">上一步</button><button id="next" type="button">下一步</button><button id="last" type="button">最後一步</button><button id="reset" type="button">重新開始</button></div><p id="status" class="note" aria-live="polite"></p><h4>目前的變數</h4><div id="memory" class="memory"></div><h4>程式碼</h4><pre id="program" class="program" aria-label="目前執行的指令會以亮色標示"></pre><h4>目前的輸出</h4><pre id="output" class="terminal" aria-live="polite"></pre></section>
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
      "label": "choice = 1",
      "lines": [
        "#include <iostream>",
        "using namespace std;",
        "",
        "int main() {",
        "    int choice = 1;",
        "    switch (choice) {",
        "        case 1:",
        "            cout << \"Tea\" << endl;",
        "            break;",
        "        case 2:",
        "            cout << \"Water\" << endl;",
        "            break;",
        "        default:",
        "            cout << \"Choose 1 or 2\" << endl;",
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
            "choice": 1
          },
          "text": "建立選項編號。",
          "output": "",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "choice": 1
          },
          "text": "用 choice 的值找對應 case。",
          "output": "",
          "active": {}
        },
        {
          "line": 7,
          "values": {
            "choice": 1
          },
          "text": "從這個位置開始執行。",
          "output": "",
          "active": {}
        },
        {
          "line": 8,
          "values": {
            "choice": 1
          },
          "text": "輸出 Tea。",
          "output": "Tea\n",
          "active": {}
        },
        {
          "line": 9,
          "values": {
            "choice": 1
          },
          "text": "break 結束這個 switch。",
          "output": "Tea\n",
          "active": {}
        },
        {
          "line": 16,
          "values": {
            "choice": 1
          },
          "text": "離開 switch，輸出 Done。",
          "output": "Tea\nDone\n",
          "active": {}
        },
        {
          "line": 17,
          "values": {
            "choice": 1
          },
          "text": "結束程式。",
          "output": "Tea\nDone\n",
          "active": {}
        }
      ],
      "expected": "Tea\nDone\n",
      "input": ""
    },
    {
      "label": "choice = 2",
      "lines": [
        "#include <iostream>",
        "using namespace std;",
        "",
        "int main() {",
        "    int choice = 2;",
        "    switch (choice) {",
        "        case 1:",
        "            cout << \"Tea\" << endl;",
        "            break;",
        "        case 2:",
        "            cout << \"Water\" << endl;",
        "            break;",
        "        default:",
        "            cout << \"Choose 1 or 2\" << endl;",
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
            "choice": 2
          },
          "text": "建立選項編號。",
          "output": "",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "choice": 2
          },
          "text": "用 choice 的值找對應 case。",
          "output": "",
          "active": {}
        },
        {
          "line": 10,
          "values": {
            "choice": 2
          },
          "text": "從這個位置開始執行。",
          "output": "",
          "active": {}
        },
        {
          "line": 11,
          "values": {
            "choice": 2
          },
          "text": "輸出 Water。",
          "output": "Water\n",
          "active": {}
        },
        {
          "line": 12,
          "values": {
            "choice": 2
          },
          "text": "break 結束這個 switch。",
          "output": "Water\n",
          "active": {}
        },
        {
          "line": 16,
          "values": {
            "choice": 2
          },
          "text": "離開 switch，輸出 Done。",
          "output": "Water\nDone\n",
          "active": {}
        },
        {
          "line": 17,
          "values": {
            "choice": 2
          },
          "text": "結束程式。",
          "output": "Water\nDone\n",
          "active": {}
        }
      ],
      "expected": "Water\nDone\n",
      "input": ""
    },
    {
      "label": "choice = 9",
      "lines": [
        "#include <iostream>",
        "using namespace std;",
        "",
        "int main() {",
        "    int choice = 9;",
        "    switch (choice) {",
        "        case 1:",
        "            cout << \"Tea\" << endl;",
        "            break;",
        "        case 2:",
        "            cout << \"Water\" << endl;",
        "            break;",
        "        default:",
        "            cout << \"Choose 1 or 2\" << endl;",
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
            "choice": 9
          },
          "text": "建立選項編號。",
          "output": "",
          "active": {}
        },
        {
          "line": 6,
          "values": {
            "choice": 9
          },
          "text": "用 choice 的值找對應 case。",
          "output": "",
          "active": {}
        },
        {
          "line": 13,
          "values": {
            "choice": 9
          },
          "text": "從這個位置開始執行。",
          "output": "",
          "active": {}
        },
        {
          "line": 14,
          "values": {
            "choice": 9
          },
          "text": "輸出 Choose 1 or 2。",
          "output": "Choose 1 or 2\n",
          "active": {}
        },
        {
          "line": 16,
          "values": {
            "choice": 9
          },
          "text": "離開 switch，輸出 Done。",
          "output": "Choose 1 or 2\nDone\n",
          "active": {}
        },
        {
          "line": 17,
          "values": {
            "choice": 9
          },
          "text": "結束程式。",
          "output": "Choose 1 or 2\nDone\n",
          "active": {}
        }
      ],
      "expected": "Choose 1 or 2\nDone\n",
      "input": ""
    }
  ]
});
```

:::


## 六、自己試一試

把選單改成 1 加法、2 減法，讀入選項與兩個整數，依選項輸出答案。再測試一個其他選項，確認 default 會提供適當訊息。
