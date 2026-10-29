---
title: "String Buffer"
type: knowledge
order: 3
hidden: false
draft: false
---

在上一節中，我們只能一次讀取單個按鍵（例如按下 '1' 就只印出 '1'）。
但是如果我們要輸入「125」這樣的三位數，就需要建立一個字串緩衝區（String Buffer）將按鍵連續記錄下來，並設定結束字元（如 `#` 或 `*`）來代表輸入完成。

## 一、 運作原理
- 緩衝區（Buffer）：宣告一個 String inputBuffer = ""; 來暫存輸入的數字。
- 數字按鍵 ('0'~'9')：每按一個數字，就用 inputBuffer += key; 串接在後面，並即時印出目前的緩衝內容。
- 結束/中斷按鍵 (`#` 或 `*`)：
  - 按下 `#`：代表確認送出。印出最終組成的字串，並清空緩衝區。
  - 按下 `*`：代表清除重來。直接清空緩衝區，提示重新輸入。

## 二、 範例程式
```c=
#include <Keypad.h>

const byte ROWS = 4;
const byte COLS = 3;

char keys[ROWS][COLS] = {
  {'1', '2', '3'},
  {'4', '5', '6'},
  {'7', '8', '9'},
  {'*', '0', '#'}
};

byte rowPins[ROWS] = {4, 5, 6, 7};
byte colPins[COLS] = {15, 16, 17};

Keypad customKeypad = Keypad(makeKeymap(keys), rowPins, colPins, ROWS, COLS);

// 建立字串緩衝區
String inputBuffer = "";

void setup() {
  Serial.begin(115200);
  Serial.println("Buffer & Integer Practice Initialized.");
  Serial.println("Enter numbers, press '#' to send, '*' to clear.");
}

void loop() {
  char key = customKeypad.getKey();

  if (key) {
    // 1. 數字輸入判斷 ('0' ~ '9')
    if (key >= '0' && key <= '9') {
      // =======================================================
      // 任務 A：請將 key 串接至 inputBuffer 字串的末端
      // =======================================================
      /* 請撰寫串接程式碼 */


      Serial.print("Current Input: ");
      Serial.println(inputBuffer);
    } 
    // 2. 按下 '#' 代表確認送出
    else if (key == '#') {
      if (inputBuffer.length() > 0) {
        // =======================================================
        // 任務 B：請將 inputBuffer 轉為整數，存入變數 numericValue
        // =======================================================
        int numericValue = 0; // /* 請修改此行，改用 toInt() 轉型 */


        Serial.print(">>> Submitted Integer: ");
        Serial.println(numericValue);

        // =======================================================
        // 任務 C：送出後，請清空 inputBuffer 緩衝區
        // =======================================================
        /* 請撰寫清空程式碼 */


      }
      else {
        Serial.println(">>> [Warning] Buffer is empty!");
      }
    } 
    // 3. 按下 '*' 代表清除重來
    else if (key == '*') {
      // 重置緩衝區
      inputBuffer = "";
      Serial.println(">>> Cleared input!");
    }
  }
}
```
