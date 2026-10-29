---
title: "從delay()到millis()，輸出控制更進階"
type: knowledge
order: 2
hidden: false
draft: false
---

delay() 雖然看起來很直覺，但它是一個阻塞式（Blocking）語法。開發板 delay() 執行期間無法執行任何其他工作（例如感測器讀取或按鈕監聽）。
本章除了介紹 delay() 以外，也將說明如何透過 millis() 來避免上述問題。
- 如果說 delay() 是暫停計時（暫停500毫秒或1000毫秒），那 millis() 就像是一個從開機後就不斷運作的碼表，隨時記錄「開機到現在經過的毫秒數」。
- 為了精準判斷時間經過多久，我們需要利用 `現在時間 - 上次時間 >= 間隔時間` 的方式來取代 delay()。

以下先回歸到最簡單的單一燈號閃爍來實作 millis()，我們以紅綠燈模組的紅燈為例。

```c=
const int redPin = 19;

unsigned long previousMillis = 0; // 紀錄上一次切換燈號的時間
long interval = 1000;       // 設定閃爍間隔時間 (1000 ms)
bool ledState = LOW;              // 紀錄當前燈號狀態

void setup() {
  pinMode(redPin, OUTPUT);
}

void loop() {
  // 1. 取得當前時間
  unsigned long currentMillis = millis();

  // 2. 檢查時間差是否達到設定值
  if (currentMillis - previousMillis >= interval) {
    // 刷新上次紀錄的時間
    previousMillis = currentMillis;

    // 反轉燈號狀態
    ledState = !ledState;
    digitalWrite(greenPin, ledState);
  }

  // 如果程式還有同時執行其他指令，也不會因為本來的 delay() 而被卡住
}
```

通常紅綠燈一次只能顯示一種燈號，如果紅燈亮，此時黃燈跟綠燈應該都是熄滅狀態。因此，我們需要一段程式來專門控制現在換誰亮。
```c=
// 燈號控制輔助函式
void setTrafficLight(bool r, bool y, bool g) {
  digitalWrite(redPin, r ? HIGH : LOW);
  digitalWrite(yellowPin, y ? HIGH : LOW);
  digitalWrite(greenPin, g ? HIGH : LOW);
}

// 使用方式： setTrafficLight(true, false, false); 代表亮紅燈
```