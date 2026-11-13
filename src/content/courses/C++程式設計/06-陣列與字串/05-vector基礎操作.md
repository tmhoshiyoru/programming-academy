---
title: "vector 基礎操作"
type: interactive
order: 5
hidden: false
draft: false
---

## 一、vector 是可以調整長度的整數列車

陣列建立後，長度通常固定；`vector<int>` 則能在程式執行時增加或縮短元素。可以把 vector 想成一列能加掛或摘除車廂的列車：每節車廂仍用索引編號，車頭所在的第0節也是元素。

使用 vector 前要載入 `<vector>`：

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> v;
    v.push_back(6);
    v.push_back(9);
    cout << v.size() << endl;
    cout << v[0] << " " << v[1] << endl;
    return 0;
}
```

輸出：

```text
2
6 9
```

`vector<int> v;` 建立一個目前長度為 0 的 vector。每次呼叫 `push_back()`，就會在尾端加一個元素。

## 二、宣告時建立指定數量的元素

`vector<int> v(n, 1);` 會建立 n 個整數，並把每個元素設成 1。例如：

```cpp
int n = 4;
vector<int> v(n, 1);
```

此時 `v` 的內容是 `{1, 1, 1, 1}`，索引依序為 0、1、2、3。也可以用大括號指定不同初值：

```cpp
vector<int> score = {72, 85, 60};
```

注意兩種大括號的意思不同：`vector<int> v(4, 1)` 是四個 1；`vector<int> v{4, 1}` 則是兩個元素 4 和 1。

## 三、讀取長度與存取元素

`v.size()` 會回傳目前元素數量。若長度是 n，合法索引就是 0 到 n - 1。可以像陣列一樣用 `v[i]` 讀取或修改內容：

```cpp
cout << v.size() << endl;
cout << v[0] << endl;
v[0] = 7;
```

`v[0]` 是第0節的內容。存取前要確認索引小於 `v.size()`；例如長度為 3 時，`v[3]` 已經超出範圍。空 vector 的長度是 0，不能讀取 `v[0]`。

## 四、用 resize 調整車廂數量

`v.resize(6);` 把長度改為 6。若增加長度，新增的 `int` 元素會是 0；若縮短長度，尾端多出的元素會被移除。也可以提供新增元素的初值：

```cpp
vector<int> v = {4, 8};
v.resize(5, 1);
```

調整後是 `{4, 8, 1, 1, 1}`。resize 不會改寫原本保留下來的元素。縮短後被移除的值不會自動保留；之後再把長度加長，新增位置會重新初始化。

## 五、操作列車看看

先調整車廂數量並設定初值，再試著讀取、修改某一節，或在尾端加車。觀察 `size()`、索引和值如何一起改變。操作範圍限制在 0 到 12 節，方便在畫面上看清楚每個位置。

:::interactive 動態列車：vector 車廂調度

```game-html
<main><h3>動態列車：vector 車廂調度</h3><p>這列車代表 <code>vector&lt;int&gt; v</code>。第0節是第一個元素；你可以調整車廂數量，並讀取或改寫任一節。</p><div class="train" id="train" aria-label="vector 列車"></div><p class="length">目前長度 <output id="length">0</output> 節（<code>v.size()</code>）</p><fieldset><legend>初始化</legend><label>車廂數量 <input id="init-size" type="number" min="0" max="12" value="4"></label><label>每節初值 <input id="init-value" type="number" value="1"></label><button id="initialize" type="button">建立 vector(n, 初值)</button></fieldset><fieldset><legend>依索引存取</legend><label>索引 i <input id="index" type="number" min="0" value="0"></label><label>寫入數值 <input id="value" type="number" value="7"></label><div class="controls"><button id="read" type="button">讀取 v[i]</button><button id="write" type="button">寫入 v[i]</button></div></fieldset><fieldset><legend>動態調整長度</legend><label>新長度 <input id="resize-size" type="number" min="0" max="12" value="6"></label><label>新增車廂初值 <input id="resize-value" type="number" value="1"></label><div class="controls"><button id="resize" type="button">執行 resize</button><label class="append">尾端加一節 <input id="append-value" type="number" value="5"></label><button id="append" type="button">push_back</button></div></fieldset><p id="status" class="status" role="status" aria-live="polite"></p><h4>對應的 C++ 操作</h4><pre id="code"></pre><button id="reset" type="button">重設示範</button></main>
```

```game-css
*{box-sizing:border-box}body{margin:0;padding:18px;color:#193b2a;background:#f3faf5;font:16px/1.6 system-ui,sans-serif}h3{margin:0 0 8px}fieldset{margin:12px 0;padding:12px;border:1px solid #b4d1bd;border-radius:9px;background:#fff}legend{padding:0 6px;font-weight:750;color:#315844}label{display:inline-flex;align-items:center;gap:6px;margin:5px 10px 5px 0}input{width:82px;padding:7px;border:1px solid #9bb8a4;border-radius:6px;font:inherit}button{padding:8px 11px;border:1px solid #7f9f8b;border-radius:7px;color:#234d34;background:#fff;font:inherit;cursor:pointer}.controls{display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin:7px 0}.train{display:flex;align-items:stretch;gap:5px;overflow-x:auto;padding:35px 5px 14px;min-height:130px}.car{position:relative;flex:1 0 76px;min-height:80px;padding:7px;border:2px solid #658b70;border-radius:12px 12px 8px 8px;background:#fff;text-align:center}.car:after{position:absolute;content:'● ●';left:0;right:0;bottom:-15px;color:#52675a}.car.selected{border-color:#c08725;background:#fff0c7;box-shadow:0 0 0 3px #f3d99d}.car.empty-slot{border-style:dashed;background:#f8fbf8;color:#718477}.index{display:block;color:#52695a;font-size:12px}.value{font:750 22px ui-monospace,Consolas,monospace}.length{font-weight:750}.status{min-height:1.5em;padding:10px 12px;border:1px solid #b4d1bd;border-radius:8px;background:#fff}pre{overflow:auto;padding:12px;border-radius:8px;background:#182b22;color:#f2f8f4;font:14px/1.6 ui-monospace,Consolas,monospace;white-space:pre-wrap}button:disabled{opacity:.5;cursor:default}:focus-visible{outline:3px solid #3675b4;outline-offset:2px}@media(max-width:520px){body{padding:12px}label{display:flex}}
```

```game-js
let v=[2,4,6];let selected=-1;const train=document.querySelector('#train'),length=document.querySelector('#length'),status=document.querySelector('#status'),code=document.querySelector('#code');function numberOf(id){const n=Number.parseInt(document.querySelector(id).value,10);return Number.isFinite(n)?n:0}function boundedSize(id){return Math.max(0,Math.min(12,numberOf(id)))}function draw(){train.replaceChildren();v.forEach((value,i)=>{const car=document.createElement('div');car.className='car'+(i===selected?' selected':'');const index=document.createElement('span');index.className='index';index.textContent=`第${i}節（索引 ${i}）`;const content=document.createElement('strong');content.className='value';content.textContent=String(value);car.append(index,content);car.addEventListener('click',()=>{selected=i;document.querySelector('#index').value=String(i);status.textContent=`選取第${i}節；讀取 v[${i}] 可查看，或輸入新值後寫入。`;draw();});train.append(car);});if(v.length===0){const empty=document.createElement('div');empty.className='car empty-slot';empty.textContent='目前沒有車廂';train.append(empty);}length.textContent=String(v.length);document.querySelector('#index').max=String(Math.max(0,v.length-1));}function show(message,snippet){status.textContent=message;code.textContent=snippet;draw()}document.querySelector('#initialize').addEventListener('click',()=>{const n=boundedSize('#init-size'),fill=numberOf('#init-value');v=Array(n).fill(fill);selected=-1;show(`建立長度 ${n} 的 vector，每節初值都是 ${fill}。`,`vector<int> v(${n}, ${fill});\ncout << v.size();`);});document.querySelector('#read').addEventListener('click',()=>{const i=numberOf('#index');if(i<0||i>=v.length){show(`索引 ${i} 超出範圍；目前長度是 ${v.length}，合法索引為 0 到 ${v.length-1}。`,`// 存取前先確認索引有效\nif (i >= 0 && i < v.size()) {\n    cout << v[i];\n}`);return;}selected=i;show(`讀取第${i}節：v[${i}] 是 ${v[i]}。`,`int value = v[${i}];`);});document.querySelector('#write').addEventListener('click',()=>{const i=numberOf('#index'),value=numberOf('#value');if(i<0||i>=v.length){show(`索引 ${i} 超出範圍；目前沒有第${i}節，請先增加長度。`,`// v[i] 必須是有效索引\nif (i >= 0 && i < v.size()) {\n    v[i] = ${value};\n}`);return;}v[i]=value;selected=i;show(`已把第${i}節由原值改成 ${value}。`,`v[${i}] = ${value};`);});document.querySelector('#resize').addEventListener('click',()=>{const old=v.length,n=boundedSize('#resize-size'),fill=numberOf('#resize-value');v.resize;const removed=old>n;v.length=n;if(n>old)for(let i=old;i<n;i++)v[i]=fill;selected=selected<n?selected:-1;show(removed?`長度由 ${old} 縮為 ${n}，尾端車廂已移除。`:`長度由 ${old} 調整為 ${n}；新車廂初值為 ${fill}，原車廂內容保留。`,removed?`v.resize(${n});`:`v.resize(${n}, ${fill});`);});document.querySelector('#append').addEventListener('click',()=>{if(v.length>=12){show('示範畫面最多顯示 12 節，請先縮短列車再加車。','// 示範上限：12 節');return;}const value=numberOf('#append-value');v.push(value);selected=v.length-1;show(`尾端新增第${selected}節，內容是 ${value}；size() 現在是 ${v.length}。`,`v.push_back(${value});`);});document.querySelector('#reset').addEventListener('click',()=>{v=[2,4,6];selected=-1;document.querySelector('#init-size').value='4';document.querySelector('#init-value').value='1';document.querySelector('#index').value='0';document.querySelector('#value').value='7';document.querySelector('#resize-size').value='6';document.querySelector('#resize-value').value='1';document.querySelector('#append-value').value='5';show('示範列車已重設為 {2, 4, 6}。','vector<int> v = {2, 4, 6};');});show('列車目前有三節。點選車廂，或使用下方操作改變它。','vector<int> v = {2, 4, 6};\ncout << v.size();');
```

:::
