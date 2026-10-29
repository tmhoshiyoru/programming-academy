---
title: "Arduino IDE設定步驟"
type: knowledge
order: 1
hidden: false
draft: false
---

1. 開啟 Arduino IDE（如果尚未安裝，Microsoft Store有可以下載）
2. 依序點選上方工具列：工具（Tools）→開發板（Board）→開發板管理員（Boards Manager）
3. 搜尋ESP32，找到對應的選項（by Espressif Systems）後安裝

<img
  src="/images/courses/機器人專題/ArduinoIDE開發板選項.jpg"
  width="600"
/>
<img
  src="/images/courses/機器人專題/ESP32 installation.png"
  width="600"
/>

4. 每一個連接USB到電腦上的裝置，都會被分配一個COM Port（連接埠），我們需要知道現在連接的是第幾個 COM Port
5. 開始功能表→鍵盤輸入「裝置管理員」
6. 準備好ESP32開發板及USB Type C傳輸線，接到開發板上右方的插孔（另一端則接到電腦上）
7. 接上電腦後，檢查「連接埠(COM和LPT)」新增了哪一個Port（COM+數字）
8. 再回到Arduino IDE，開啟 工具→序列埠 ，選擇對應的COM Port


<img
  src="/images/courses/機器人專題/ESP32接線示意圖.jpg"
  width="300"
/>

<img
  src="/images/courses/機器人專題/裝置管理員.png"
  width="600"
/>

<img
  src="/images/courses/機器人專題/選擇COM port.jpg"
  width="800"
/>

<img
  src="/images/courses/機器人專題/ESP32ArduinoIDE設定.png"
  width="400"
/>