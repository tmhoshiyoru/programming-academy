---
title: "Adafruit_Neopixel套件"
type: knowledge
order: 3
hidden: false
draft: false
---

ESP32-S3 板載的 LED 為 WS2812B（全彩 RGB），除了時間控制，還可以控制三原色（紅 R、綠 G、藍 B，數值範圍 0~255）。

我們可以導入官方程式庫 Adafruit NeoPixel，並建立一個支援 (time, r, g, b) 四個參數的靈活控制函式。

- 安裝提示：請先至 Arduino IDE 的「程式庫管理員」搜尋並安裝 Adafruit NeoPixel。

RGB 全彩燈號控制範例
```C=
#include <Adafruit_NeoPixel.h>

#define LED_PIN   48
#define NUM_LEDS  1

// 宣告 NeoPixel 控制物件
Adafruit_NeoPixel pixels(NUM_LEDS, LED_PIN, NEO_GRB + NEO_KHZ800);

void setup() {
  pixels.begin();           // 啟動燈號控制
  pixels.setBrightness(20); // 設定適宜亮度 (0~255)
  pixels.clear();
  pixels.show();
}

// 打包控制函式：接收亮燈時間(duration)、紅(r)、綠(g)、藍(b)
void playColor(int duration, int r, int g, int b) {
  pixels.setPixelColor(0, pixels.Color(r, g, b)); // 設定顏色
  pixels.show();                                   // 送出顯示訊號
  delay(duration);                                 // 維持亮度時間

  pixels.clear();                                  // 熄滅燈號
  pixels.show();
  delay(200);                                      // 預設滅燈間隔 0.2 秒
}

void loop() {
  playColor(500, 255, 0, 0);   // 紅光 0.5 秒
  playColor(500, 0, 255, 0);   // 綠光 0.5 秒
  playColor(500, 0, 0, 255);   // 藍光 0.5 秒
  
  delay(1500);
}

```