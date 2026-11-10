---
title: "ESP32-S3 連上 Wi-Fi"
type: knowledge
order: 1
hidden: false
draft: false
---

## 從感測器到網路

ESP32-S3 在這個專案是 Wi-Fi 用戶端。SSID 是網路名稱，密碼用來加入網路。連線後拿到的 IP 位址，可以在序列監控視窗查看。拿到 IP 表示已加入區域網路，能否到達 GAS 要在下一節另外確認。

在程式的 `ssid` 和 `password` 填入你要連的 Wi-Fi 名稱和密碼。ESP32-S3 使用 2.4 GHz Wi-Fi，請選能直接連上網路的 2.4 GHz 網路。分享程式前，記得把自己的密碼換回範例文字。

```cpp
#include <WiFi.h>

const char* ssid = "填入 Wi-Fi 名稱";
const char* password = "填入 Wi-Fi 密碼";

bool connectWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.print("Connecting");
  const unsigned long started = millis();

  while (WiFi.status() != WL_CONNECTED && millis() - started < 15000) {
    delay(250);
    Serial.print('.');
  }
  Serial.println();

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Wi-Fi timeout");
    return false;
  }

  Serial.print("Wi-Fi connected, IP: ");
  Serial.println(WiFi.localIP());
  return true;
}

void setup() {
  Serial.begin(115200);
  connectWiFi();
}

void loop() {}
```

上傳後打開序列監控視窗（115200 baud），必要時按板子的 RESET。驗收時指出 IP；如果逾時，核對網路名稱、密碼與頻段後再試。下一節會沿用這份程式。
