# Web Engine Displacement Calculator

這是一個網頁版的台灣熱門白牌機車改裝排量計算機的專案。

去年初做C#排氣量計算機的初心是給我老闆馬力機上方便算排氣量用  
所以做成windows用的應用程式  
[EngineDisplacementCalculator](https://github.com/timliucode/windowsEngineDisplacementCalculator)

後面偶有車友會問我他想改什麼缸排氣量會有多少cc  
但人在外只有手機每次都得開計算機手慢慢按  
按個幾次之後實在覺得麻煩  
趁學PHP的經驗直接做網頁版計算機  
只要能看網頁的設備，都能快速計算

喔對老樣子有在[小老婆汽機車資訊網](https://forum.jorsindo.com/thread-2571527-1-1.html)分享

## 如何使用

1. 打開 [Web Engine Displacement Calculator](https://enginecalculator.timliudev.com/) 
2. 下方選擇你的車款，沒有你的車款就直接輸入
3. 輸入改裝程度(幾缸、拉條數)，如果是搪缸也可以選擇加大幾條，曲軸也可以選擇輸入長度
4. 輸入當下會自動計算cc數

PS:如果是知道排量及另一單位，想計算未知的缸徑行程就留空你想知道的格子，按下計算缸徑或計算行程就會算出未知的內容

<img width="1920" height="1032" alt="image" src="https://github.com/user-attachments/assets/90c185ce-9229-4427-ae1d-d2cd48465e34" />


## 專案結構

```
webEngineDisplacementCalculator/
├── assets/          # 靜態資源（圖片、圖示等）
│   └── images/
├── css/             # 樣式表
│   └── styles.css   # 主要樣式檔案
├── js/              # JavaScript 檔案
│   └── calculator.js # 排量計算邏輯
└── index.html       # 主要 HTML 頁面
```

### 程式碼特色

- **分離關注點**：HTML、CSS 和 JavaScript 各自獨立，易於維護
- **清晰命名**：使用具描述性的函數和變數名稱
- **完整文件**：包含 JSDoc 註解說明函數用途
- **常數定義**：將魔術數字提取為有意義的常數
