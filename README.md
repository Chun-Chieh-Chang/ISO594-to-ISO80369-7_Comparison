# ISO 594 至 ISO 80369-7 魯爾接頭圖面轉版比對與工程審查系統
### Luer Medical Connector Engineering Standards Audit Suite (ISO 594 ➔ ISO 80369-7:2021)

本系統專為醫療器材研發 (R&D)、模具工程 (Tooling)、品保法規 (QA/RA) 及量測檢驗部門打造，提供從 **ISO 594-1 / ISO 594-2** 轉版至 **ISO 80369-7:2021** 的幾何公差比對、0.750 mm 基準位移換算、測試要求變更指引與工程變更申請單 (ECO) 產生工具。

> **資料基準 (SSOT)**：所有數值均逐條核對自 ISO 594-1:1986、ISO 594-2:1998 與 ISO 80369-7:2021 原文。
> 標準原文為單一使用者授權文件，不隨本專案散布，且已於 `.gitignore` 排除。

---

## 🚀 核心功能模組

1. **尺寸規格對照 (Dimension Comparison)**
   - 完整收錄 ISO 80369-7:2021 Annex B **全部八張表 (Table B.1 – B.8)**，共 **60 項尺寸**，與標準 Clause 5 所列之八組 Figure/Table 一對一對應。
   - 呈現 Annex B 的**繼承條款**：公鎖固繼承公滑套、母鎖固各變體繼承母滑套，並標示哪些項目由後表覆寫。
   - 每項標示「2D 圖面必須採取的動作」，分為六類且窮盡互斥：無須動作／基準面位移／補上限值／新增標註／降階輔助／自圖面移除。

2. **基準位移圖解 (Datum Shift Visualizer)**
   - 互動剖面圖解，展示基準面由端面內移 0.750 mm 對直徑的影響（公端 +0.045 mm、母端 −0.045 mm）。
   - 依材料類別顯示實際公差帶，並標示半剛性母接頭「非單純平移」的例外情形。
   - **公差帶對照尺標**（深色圖表區，採 ISO 逗號記法）：以 SVG 刻度軸並列顯示新舊標準之公差帶位置，剛性與半剛性兩組同時呈現；位移量以琥珀色標註箭頭，母接頭半剛性之放寬另以文字提示。

3. **雙標準評估計算器 (Compliance Calculator)**
   - 將量測值**同時換算至兩個標準各自的基準面**再分別判定；換算雙向可逆，切換量測剖面不影響結論。
   - 涵蓋 Ød、Øf、ØD、e/E、t、ØH/H、ØJ、N1、N2，並依接頭變體自動套用對應限值。

4. **測試要求比對 (Test Requirements Matrix)**
   - 9 項測試（量規檢驗、正壓液體洩漏、負壓空氣洩漏、軸向分離力、旋卸扭矩、抗過載滑牙、易組裝性、應力龜裂、防錯接驗證）。
   - 舊版欄位**分別列出 ISO 594-1（滑套）與 ISO 594-2（鎖固）**，並標明哪些項目實為沿用而非新增 —— 僅引用 594-1 會系統性高估轉版幅度。

5. **材料剛性分類 (Material Rigidity Guide)**
   - 依 ISO 80369-7:2021 Clause 3.7 / 3.8：剛性材料 **> 3 433 MPa**、半剛性材料 **700 – 3 433 MPa**；低於 700 MPa 之彈性體不在標準範圍內。

6. **查核清單與 ECO 產生器 (Checklist & ECO Generator)**
   - 14 項查核項目，含風險等級與適用接頭類型；ECO 內容**完全依實際勾選狀態產生**，未勾選項目改列「尚未完成」清單以維持可追溯性。

7. **PWA 漸進式網頁應用**
   - 可安裝至主畫面；首次連網載入後即可於無網路環境使用；提供「有新版本時提示更新」而非強制重載。

---

## 🛠️ 技術棧

- **核心架構**：React 19 + TypeScript（`strict` 全開）+ Vite 6
- **樣式**：Tailwind CSS 4
- **圖示**：Lucide React
- **PWA**：原生 Service Worker（stale-while-revalidate）+ Web App Manifest
- **CI/CD**：GitHub Actions 自動部署至 GitHub Pages，型別檢查為獨立必過關卡

---

## 💻 本地端運行

```bash
npm install       # 安裝依賴
npm run dev       # 啟動開發伺服器
npm run lint      # TypeScript 型別檢查 (tsc --noEmit)
npm run build     # 型別檢查 + 生產環境打包
```

> `npm run build` 會先執行型別檢查再打包。Vite 建置本身不做型別檢查，因此型別關卡必須獨立存在。

---

## 👨‍💻 作者與版權

- **開發者**：Wesley Chang　**機構**：Mouldex
- © 2026 Mouldex. All rights reserved.
