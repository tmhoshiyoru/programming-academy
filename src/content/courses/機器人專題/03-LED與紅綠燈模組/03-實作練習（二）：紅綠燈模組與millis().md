---
title: "實作練習（二）：紅綠燈模組與millis()"
type: knowledge
order: 3
hidden: false
draft: false
---

```c=
int redPin = 19;
int yellowPin = 20;
int greenPin = 21;

int currentState = 0;             // 0: 綠燈 | 1: 黃燈 | 2: 紅燈
unsigned long previousMillis = 0; // 紀錄上一次切換狀態的時間

// 使用陣列整理所有外接腳位
int leds[] = {redPin, yellowPin, greenPin};
int numLeds = sizeof(leds) / sizeof(leds[0]);

void setup() {
  // 利用迴圈初始化所有 LED 腳位
  for (int i = 0; i < numLeds; i++) {
    pinMode(leds[i], OUTPUT);
    digitalWrite(leds[i], LOW); // 預設全部關閉
  }
}

void setTrafficLight(bool r, bool y, bool g) {
  digitalWrite(redPin, r ? HIGH : LOW);
  digitalWrite(yellowPin, y ? HIGH : LOW);
  digitalWrite(greenPin, g ? HIGH : LOW);
}

void loop() {
  unsigned long currentMillis = millis();

  switch (currentState) {
    case 0: // 這邊以綠燈階段 (亮 5 秒)作為示範
      setTrafficLight(false, false, true);
      if (currentMillis - previousMillis >= 5000) {
        currentState = 1;               // 時間到，切換至狀態 1 (黃燈)
        previousMillis = currentMillis; // 刷新計時器
      }
      break;

    // =======================================================
    // 課堂實作任務：請完成黃燈 (狀態 1) 的控制邏輯
    // 要求：
    // 1. 使用 setTrafficLight 亮黃燈
    // 2. 判斷時間差是否達到 2000 ms (2 秒)
    // 3. 時間到後，將 currentState 切換為 2 (紅燈) 並重設 previousMillis
    // =======================================================
    case 1: 
      /* 請在此處撰寫黃燈邏輯 */




      break;

    // =======================================================
    // 課堂實作任務：請完成紅燈 (狀態 2) 的控制邏輯
    // 要求：
    // 1. 使用 setTrafficLight 亮紅燈
    // 2. 判斷時間差是否達到 5000 ms (5 秒)
    // 3. 時間到後，將 currentState 切換為 0 (綠燈) 並重設 previousMillis
    // =======================================================
    case 2: // 紅燈階段 (亮 5 秒)
      /* 請在此處撰寫紅燈邏輯 */



      break;
  }
}
```