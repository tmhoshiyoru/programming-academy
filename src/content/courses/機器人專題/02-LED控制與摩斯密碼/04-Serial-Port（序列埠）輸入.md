---
title: "Serial Port（序列埠）輸入"
type: knowledge
order: 4
hidden: false
draft: false
---

為了讓開發板與電腦進行互動，我們使用 Serial Port 來接收使用者從電腦鍵盤輸入的字串。

核心語法
- `Serial.begin(115200)`：初始化序列埠通訊。
- `Serial.available()`：檢查是否有從電腦傳入的資料。
- `Serial.readStringUntil('\n')`：讀取一整行文字直到按下 Enter。

序列埠輸入讀取範例
```C=
void setup() {
  Serial.begin(115200); // 開啟序列埠監控器，鮑率設為 115200
  Serial.println("System Ready. Please enter message:");
}

void loop() {
  // 檢查是否有鍵盤輸入資料
  if (Serial.available() > 0) {
    String input = Serial.readStringUntil('\n'); // 讀取完整字串
    input.trim();                                // 清除前後換行或空白字元

    if (input.length() > 0) {
      Serial.print("Received message: ");
      Serial.println(input);                     // 印出接收到的訊息
    }
  }
}
```