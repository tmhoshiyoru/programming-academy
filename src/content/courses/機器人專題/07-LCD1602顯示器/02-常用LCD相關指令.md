---
title: "常用LCD相關指令"
type: knowledge
order: 2
hidden: false
draft: false
---

在撰寫 LCD 程式前，我們需要先安裝支援 I2C LCD1602 的 Arduino 函式庫，並熟悉幾項最核心的控制指令。

### 一、 安裝 LiquidCrystal_I2C 函式庫
1. 打開 **Arduino IDE**。
2. 點擊左側工具列的 **Library Manager (函式庫管理員)** 圖示（或按下快捷鍵 `Ctrl + Shift + I`）。
3. 在上方搜尋欄輸入：`LiquidCrystal_I2C`。
4. 找到由 **Frank de Brabander** 開發的版本，點擊 **Install (安裝)**。

> ⚠️ 安裝後若編譯出現「`LiquidCrystal_I2C` 程式庫是 (all 架構)，可能與 esp32 不相容」的警告，請直接忽略，這不影響正常編譯與燒錄！

---

### 二、 常用 LCD 指令速查字典

| 函數指令 | 參數與範例 | 功能說明 |
| :--- | :--- | :--- |
| **`LiquidCrystal_I2C`** | `LiquidCrystal_I2C lcd(0x27, 16, 2);` | 宣告 LCD 物件，設定 I2C 位址 (如 `0x27`) 與螢幕尺寸 (16欄 2列)。 |
| **`lcd.init()`** | `lcd.init();` | 初始化 LCD 顯示器（內部進行晶片復位與設定）。 |
| **`lcd.backlight()`** | `lcd.backlight();` | 開啟 LCD 背光板（若呼叫 `lcd.noBacklight()` 則會關閉背光）。 |
| **`lcd.clear()`** | `lcd.clear();` | 清空螢幕上的所有文字，並將游標重置回左上角 `(0, 0)`。 |
| **`lcd.setCursor()`** | `lcd.setCursor(col, row);` | 設定游標列印位置。**`col` 欄 (0~15)**，**`row` 列 (0~1)**。 |
| **`lcd.print()`** | `lcd.print("Hello");` | 從當前游標位置輸出文字、數字或變數值。 |

### 💡 座標定位小技巧
LCD1602 的座標計算都是從 **0** 開始算起的！
* **左上角第一個字** 的座標是：`setCursor(0, 0)`
* **左下角第一個字** 的座標是：`setCursor(0, 1)`
* **第一行第 5 個字** 的座標是：`setCursor(4, 0)`
