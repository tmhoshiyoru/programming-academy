---
title: "從手動執行到接收 ESP32 的資料"
type: knowledge
order: 2
hidden: false
draft: false
---

上一節按「執行」，GAS 就把程式內的固定值寫入工作表。這一節由裝置發出 HTTP POST，Google 收到請求後呼叫 `doPost(e)`，把請求內容交給程式處理。

```text
測試工具或 ESP32 → POST 傳入 JSON → GAS 驗證讀值 → 試算表新增一列
                                      └→ 回覆 OK 或 ERROR
```

## 約定資料格式

送出 `{"temperature":25,"humidity":60}`。兩欄都填數字，單位依序為 °C 和 % RH。GAS 寫入時自動加上當下時間，欄位順序沿用「時間、溫度、相對溼度」。

## 加入接收程式

沿用上一節的試算表和「溫溼度紀錄」分頁。在 Apps Script 原本的程式下方貼上這段，並替換試算表網址中 `/d/` 和下一個斜線之間的 ID。網頁應用程式執行時要用 ID 指定試算表。

```javascript
function doPost(e) {
  const reply = (message) => ContentService.createTextOutput(message);
  let reading;
  try {
    reading = JSON.parse(e.postData.contents);
  } catch (error) {
    return reply('ERROR: invalid JSON');
  }

  // DHT11 課堂資料的檢查範圍。缺少欄位或填成文字也會被拒絕。
  if (!reading || !Number.isFinite(reading.temperature) ||
      !Number.isFinite(reading.humidity) ||
      reading.temperature < 0 || reading.temperature > 50 ||
      reading.humidity < 0 || reading.humidity > 100) {
    return reply('ERROR: invalid reading');
  }

  try {
    const spreadsheet = SpreadsheetApp.openById('貼上試算表 ID');
    const sheet = spreadsheet.getSheetByName('溫溼度紀錄');
    if (!sheet) return reply('ERROR: sheet not found');

    sheet.appendRow([new Date(), reading.temperature, reading.humidity]);
    return reply('OK');
  } catch (error) {
    console.error(error);
    return reply('ERROR: spreadsheet write failed');
  }
}
```

`OK` 代表寫入完成。看到 `ERROR` 時，依訊息檢查資料、分頁名稱或 Apps Script 執行記錄。請在下一節從網址送測試資料，讓 Google 提供 `e`。

[Google 官方網頁應用程式說明](https://developers.google.com/apps-script/guides/web) · [綁定指令碼的執行限制](https://developers.google.com/apps-script/guides/bound)
