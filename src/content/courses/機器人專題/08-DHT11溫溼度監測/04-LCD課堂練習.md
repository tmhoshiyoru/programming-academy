---
title: "課堂練習｜讓 LCD 跟著環境變化"
type: knowledge
order: 3
hidden: false
draft: false
---

## 任務｜製作溫溼度監測站

使用 GPIO 10 讀取 DHT11，每隔 2 秒更新 LCD1602。第一行顯示溫度，例如 `T: 25.0 C`，第二行顯示相對溼度，例如 `H: 60.0 % RH`。兩行均從最左邊開始，保留一位小數。

## 程式碼填空

1. 填入取樣間隔（毫秒），再用現在時間與上次取樣時間的差值判斷是否要更新。
2. 填入 DHT 程式庫讀取相對溼度和攝氏溫度的方法。
3. 填入兩次 `printReading()` 的列索引與數值變數。LCD 第一列的索引從 0 開始。
4. 使用 I2C 掃描確認 LCD 位址。若結果與範例的 `0x27` 不同，請更新程式。

```cpp
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <DHT.h>

// DHT11 的 DATA 接 GPIO 10。
DHT dht(10, DHT11);
// LCD 的 I2C 位址、每行字數和行數。
LiquidCrystal_I2C lcd(0x27, 16, 2);
// TODO 1：把題目指定的 2 秒換算成毫秒。
const unsigned long sampleInterval = ____;
unsigned long lastSample = 0;

void setup() {
  Serial.begin(115200);
  // 啟動 DHT11，讓程式可以向感測器讀取資料。
  dht.begin();
  // 設定 I2C：SDA 接 GPIO 8，SCL 接 GPIO 9，時脈為 100 kHz。
  Wire.begin(8, 9, 100000);
  // 初始化 LCD、開啟背光，先顯示等待訊息。
  lcd.init();
  lcd.backlight();
  lcd.print("Waiting...");
  lastSample = millis();
}

void printReading(uint8_t row, const char* label, float value, const char* unit) {
  lcd.setCursor(0, row);
  // 用 16 個空格清掉整行，再回到行首寫入新數值。
  lcd.print("                ");
  lcd.setCursor(0, row);
  lcd.print(label);
  lcd.print(value, 1);
  lcd.print(unit);
}

void loop() {
  const unsigned long now = millis();
  // TODO 2：用目前時間減去上次取樣時間，算出經過多久。
  // 還沒到取樣時間就先返回，留到下一輪 loop() 再檢查。
  if (____ - ____ < sampleInterval) return;
  lastSample = now;

  // TODO 3：第一個空格填讀取相對溼度的方法，第二個填讀取攝氏溫度的方法。
  const float humidity = dht.____();
  const float temperature = dht.____();
  // 任一讀值失敗時顯示錯誤，結束本次更新。
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("DHT11 read failed");
    lcd.setCursor(0, 0);
    lcd.print("DHT11 read error");
    lcd.setCursor(0, 1);
    lcd.print("Check wiring    ");
    return;
  }

  Serial.printf("T: %.1f C, H: %.1f %% RH\n", temperature, humidity);
  // TODO 4：每行填入行索引和要顯示的讀值變數。
  // 溫度在第一行，溼度在第二行。行索引從 0 開始。
  printReading(____, "T: ", ____, " C");
  printReading(____, "H: ", ____, " % RH");
}
```

## 驗收

- LCD 每 2 秒取樣更新，兩行各顯示正確的數值與單位，並與序列監控視窗一致。
- 數值位數減少時，舊字元會被清除。讀取失敗時，LCD 顯示錯誤訊息。
