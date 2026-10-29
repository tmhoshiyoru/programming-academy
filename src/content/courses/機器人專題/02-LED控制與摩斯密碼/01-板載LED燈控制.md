---
title: "板載LED燈控制"
type: knowledge
order: 1
hidden: false
draft: false
---

在 ESP32-S3 開發板上，除了電源指示燈（ON）之外，設有一顆可控制的板載全彩 LED（WS2812）。首先，我們使用傳統數位控制語法來點亮並開關燈號。

核心語法
- pinMode(pin, mode)：將指定引腳設定為 OUTPUT（輸出模式）。
- digitalWrite(pin, value)：設定引腳電位為 HIGH（高電位 / 送電）或 LOW（低電位 / 斷電）。
- delay(ms)：暫停程式執行，單位為毫秒（1000 ms = 1 秒）。

初階範例：LED 閃爍（Blink）

```c=
#define LED_PIN 48 // ESP32-S3 板載 LED 腳位

void setup() { // setup函式：開發板剛開機時會執行一次
  pinMode(LED_PIN, OUTPUT); // 初始化引腳為輸出模式
}
void loop() { // loop函式：執行完 setup() 後，會重複不斷執行
  digitalWrite(LED_PIN, HIGH); // 點亮 LED
  delay(1000);                  // 維持亮燈 1 秒
  
  digitalWrite(LED_PIN, LOW);  // 熄滅 LED
  delay(1000);                  // 維持滅燈 1 秒
}
```