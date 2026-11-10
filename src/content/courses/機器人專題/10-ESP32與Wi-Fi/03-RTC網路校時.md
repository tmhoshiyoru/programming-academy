---
title: "ESP32 系統時鐘｜網路校時與整秒排程"
type: knowledge
order: 3
hidden: false
draft: false
---

## 現在幾點？

`millis()` 回答「開機到現在過了多久」。這次要在每分鐘的 00、10、20、30、40、50 秒附近寫入，就需要知道「現在是幾點幾分幾秒」。

ESP32-S3 有自己的系統時鐘。本章用 Wi-Fi 向網路時間伺服器校時，校時後可以直接讀取板上的時間，不用每次取樣都問伺服器，也不用另外接 RTC 模組。

## 讀取台灣時間

1. 先確認上一節的 Wi-Fi 程式能連線，在程式頂端加上 `#include <time.h>`。
2. 在 `setup()` 中，確認 `connectWiFi()` 成功後，再加入以下程式。若原本有單獨一行 `connectWiFi();`，請改成先檢查它的回傳值，再校時。
3. 開啟序列監控視窗（115200 baud），核對印出的時間。

```cpp
  if (!connectWiFi()) return;

  // CST-8 在這裡代表 UTC+8，使用台灣時間。
  configTzTime("CST-8", "time.google.com", "pool.ntp.org");

  struct tm localTime;
  if (getLocalTime(&localTime, 15000)) {
    char clockText[9];
    strftime(clockText, sizeof(clockText), "%H:%M:%S", &localTime);
    Serial.println(clockText);
  } else {
    Serial.println("Clock sync timeout");
  }
```

`getLocalTime()` 會等到時間可用，最多等 15 秒。成功後可以從 `localTime.tm_sec` 讀出秒數。若校時逾時，確認 Wi-Fi 能連外，且網路允許 NTP 校時。

## 同一個時段只送一次

把 `time(nullptr)` 讀到的時間戳除以 10，得到目前的「10 秒時段編號」。在 `09:15:20` 到 `09:15:29` 之間，編號都相同。程式只在遇到比上次更新的編號時送出一次。

```cpp
// 校時成功後，先記下目前時段，從下一個時段開始上傳。
time_t lastUploadSlot = time(nullptr) / 10;

// 以下放在 loop() 取得有效溫溼度之後。
const time_t currentSlot = time(nullptr) / 10;
if (currentSlot > lastUploadSlot) {
  lastUploadSlot = currentSlot; // 先記下這個時段，再嘗試送出。
  sendReading(temperature, humidity);
}
```

實作時，`lastUploadSlot` 要宣告在全域區，校時成功後在 `setup()` 設定初值。若讀值在 21 秒才更新，這一筆仍屬於 20 秒開始的時段。板子就算錯過整個時段，也只送目前這個時段的讀值。上傳失敗會等下一個時段再試，避免收到回覆前重送同一筆。

試算表的時間欄由 GAS 記下收到資料的時間，可能比 ESP32 顯示的取樣時間晚幾秒。請在試算表設定中確認時區為台灣時間，方便對照序列監控視窗。網路正常時，一分鐘有六個上傳時段。

[Espressif ESP32-S3 系統時間說明](https://docs.espressif.com/projects/esp-idf/en/latest/esp32s3/api-reference/system/system_time.html)
