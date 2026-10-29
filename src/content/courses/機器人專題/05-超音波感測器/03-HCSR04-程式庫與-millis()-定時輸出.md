---
title: "HCSR04 程式庫與 millis() 定時輸出"
type: knowledge
order: 3
hidden: false
draft: false
---

## 一、 安裝 HCSR04 程式庫教學
在 Arduino IDE 中使用程式庫，可以幫我們省去手動計算微秒（$\mu s$）與脈衝轉換的繁瑣細節。
軟體操作步驟
1. 開啟 Arduino IDE。
2. 點擊左側選單欄的 「程式庫管理員（Library Manager）」 圖示（或按下快捷鍵 Ctrl + Shift + I / Cmd + Shift + I）。
3. 在搜尋欄輸入 HCSR04。
4. 找到由 Martin Sosic 所開發的 HCSR04（名稱通常為 HCSR04 by Martin Sosic）。
5. 點擊 「安裝（Install）」 按鈕，等待安裝完成。

## 二、 基礎超音波感測程式
1. 程式庫標頭檔與物件初始化
```c=
#include <HCSR04.h>

// 宣告超音波感測器物件 (Trig 腳位, Echo 腳位)
UltraSonicDistanceSensor distanceSensor(41, 42);
```
2. 讀取距離數值
```c=
float distance = distanceSensor.measureDistanceCm();
```
- 傳回值：物體的距離，單位為 公分 (cm)。
- 異常值處理：若超出量測範圍（例如超過 $400\text{ cm}$ 或低於 $2\text{ cm}$）或未接收到回波，函式會回傳 -1 或超出範圍的數值。

3. millis() 非阻塞式 1 秒定時觸發
使用 millis() 替代 delay(1000)，讓系統在等待 1 秒計時的同時，微控制器依然具備高頻率執行其他任務的能力（請參閱先前的章節）。

以下是一份已經具備超音波感測器和透過 millis() 定期檢查距離的程式，請嘗試完成：
- 當感測距離大於 0 且小於 15 時，透過 Serial 輸出警示訊息


```c=
#include <HCSR04.h>

#define TRIG_PIN 41
#define ECHO_PIN 42

UltraSonicDistanceSensor distanceSensor(TRIG_PIN, ECHO_PIN);

unsigned long lastReadTime = 0;
const unsigned long INTERVAL = 1000; 

void setup() {
  Serial.begin(115200);
  Serial.println("Distance Alert Practice Initialized.");
}

void loop() {
  unsigned long currentMillis = millis();

  // 1. 每 1 秒讀取一次距離
  if (currentMillis - lastReadTime >= INTERVAL) {
    lastReadTime = currentMillis;

    float dist = distanceSensor.measureDistanceCm();


    Serial.print("Distance: ");
    Serial.print(dist);
    Serial.println(" cm");

    // =======================================================
    // 任務 A：若 dist 大於 0 且小於 20 cm，印出警示訊息
    // =======================================================
    /* 請撰寫 if 邏輯 */




  }
}
```