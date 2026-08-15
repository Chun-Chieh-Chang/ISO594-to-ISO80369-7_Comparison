# 專案開發與工程確效日誌 (DEV_LOG.md)

## [2026-08-15] PWA 相容性與手機版介面全方位升級

### 1. 需求背景與目標 (Requirement & Objective)
- **需求**：工程人員需在無塵室、廠房、檢驗產線與出差現場等弱網/無網環境下使用手機查驗 ISO 594 轉 ISO 80369-7 標準數據與 CAD 公差。
- **目標**：
  1. 完整相容 PWA (Progressive Web App) 技術標準，支援離線快取與獨立視窗 (Standalone) 運行。
  2. 實現「提示更新 (Prompt on Update)」策略，防止背景強制重載丟失用戶輸入的公差數據。
  3. 提供跨平台安裝引導 (Install Prompt)，涵蓋 Android/Chrome 原生安裝與 iOS Safari 圖文引導。
  4. 手機版（螢幕 < 768px）導入符合人體工學的底部觸控導航列 (Bottom Navigation Bar) 與 Safe Area 適配。

---

### 2. 根因分析 (RCA - Root Cause Analysis)
- **問題 A (iOS 差異性)**：iOS Safari 不支援 `beforeinstallprompt` 事件，若無專屬圖文指引，用戶無法得知如何加入主畫面；且 iOS 全螢幕獨立模式容易被底部 Home Bar 遮蔽按鈕。
  - *矯正對策*：針對 iOS 裝置偵測 User Agent，提供精確的「點擊分享 ➔ 加入主畫面」動態引導 Modal，並使用 CSS `env(safe-area-inset-bottom)`。
- **問題 B (快取不一致與資料丟失)**：若採用強制 auto-reload 快取策略，在工程師正在輸入精密公差時會被強制中斷。
  - *矯正對策*：採用 Service Worker `waiting` 狀態監聽，彈出無干擾 Toast 讓工程師主動選擇立即更新。

---

### 3. 矯正與預防措施 (CAPA - Corrective and Preventive Actions)
- **PWA Manifest**：配置完整的 `public/manifest.webmanifest`，包含 `standalone`、主題色、高解析度 Icons 與常用功能 Shortcuts。
- **Service Worker**：純原生輕量化 `sw.js`，兼具 Cache-First 離線支援與 Network 優先檢驗。
- **Mobile First UX**：
  - 手機專屬底部觸控導航（熱區 ≥ 44x44px，字體 ≥ 14px）。
  - Safe Area 底部保護留白 (`pb-24`)。
  - 頂部精簡 Header + 安裝按鈕。

---

### 4. 驗證與確效結果 (Verification & Validation)
- [x] **TypeScript 型別確效**：執行 `npm run lint` (`tsc --noEmit`) 通過（0 錯誤）。
- [x] **生產環境打包確效**：執行 `npm run build` 成功輸出至 `dist/`，完整包含 `manifest.webmanifest`, `sw.js`, `icons/`。
- [x] **PWA 規格檢驗**：
  - Web App Manifest 正確配置 `standalone`、`theme_color (#0F172A)`、高解析度 SVG 圖標與快捷捷徑。
  - Service Worker 實現靜態預快取與 Prompt on Update 監聽機制。
  - 跨平台安裝引導（Android 原生 beforeinstallprompt + iOS Safari 分享/加入主畫面圖文引導）。
- [x] **Mobile First 體驗與去 AI 味調優**：
  - 手機版（< 768px）精緻底部導航欄（Bottom Navigation Bar）與 Safe Area 適配。
  - 移除浮誇高飽和度 AI 漸層與聳動文字，改採工業醫療等級莫蘭迪色調與嚴謹 4-Grid 資訊架構。
  - 觸控熱區 ≥ 44x44px，字體符合標準層級。
- [x] **品牌與作者署名宣告**：
  - 全站頁尾與手機版抽屜底部加入「Developed by Wesley Chang @Mouldex, Aug-2026.」及「© 2026 Mouldex. All rights reserved.」。
- [x] **專案整體程式碼與檔案優化 (MECE Project Refactor & Cleanup)**：
  - 清理舊樣板標頭與相依名稱，更新 `package.json`（版本提升至 `v1.1.0`）。
  - 重構 `README.md`，建立完整的 7 大核心模組手冊、技術棧與作者版權說明。
  - 盤點所有 `src/components` 與 `src/data` 檔案結構，確保 100% MECE 且無死碼。

