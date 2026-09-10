# 專案開發與工程確效日誌 (DEV_LOG.md)

## [2026-09-10] SSOT 稽核與涵蓋率補齊 (v1.2.0)

### 1. 背景
以 `isodoc/` 三份標準原文為唯一真實來源進行全面稽核，共登錄 28 項非符合。稽核分兩輪：
第 1 輪時 ISO 594-2 僅有預覽版（標準第 1–5 頁），Clause 4/5 不在檔內；第 2 輪取得完整版（16 頁）後全面重審。

### 2. 根因分析 (RCA)
- **問題 A（資料層）**：多項「舊版已廢除」的敘述與標準原文相反。其中「弦長 V 已廢除」會導致工程師刪除
  Table B.6 中仍為強制的 X 標註，直接產出不合規圖面。根因是未逐條回溯 ISO 594-2 Table 1 的變體欄位
  （F = 0.20 mm 僅適用 Variant B/C，Variant A 欄位為「—」）。
- **問題 B（測試比對）**：四項被標為「新增／大幅提高」的測試要求，在 ISO 594-2:1998 就已存在且數值幾乎相同
  （鎖固型軸向拉拔本即 35 N；旋卸扭矩 0.018–0.020 N·m 完全相同；抗過載已要求 ≥0.15 N·m）。
  根因是把 ISO 594-1（滑套）的要求當成整個 ISO 594 系列的要求。其中兩項曾被用來論證測試設備採購。
- **問題 C（涵蓋率）**：Annex B 八張表僅收錄四張，缺 B.4／B.5／B.7／B.8，其中 B.5（斜螺紋母鎖固）是
  商業上最常見的形式。且未呈現 Annex B 的繼承條款，導致尺寸表與計算器對「公鎖固是否含錐體尺寸」答案相反。
- **問題 D（計算邏輯）**：雙標準比對計算器在選擇 0.750 mm 剖面時，未將量測值反向換算即比對 ISO 594 的
  端面公差帶，造成單邊誤判（4.035 @ 剖面會被誤報舊版不合格，實際端面值 3.990 完全合格）。
- **問題 E（樣式破壞語意）**：尺寸表「舊符號」欄套用 CSS `text-transform: uppercase`，
  使 d→D、e→E、α→Α、β→Β。這些在標準中是不同特徵，而本系統的目的正是防止此類混淆。
- **問題 F（建置關卡）**：CI 僅執行 `npm run build`，而 Vite 建置不做型別檢查，型別錯誤可直接部署。

### 3. 矯正與預防措施 (CAPA)
- **資料層**：全數更正並補上 SSOT 依據；V→X、W→Y 改述為「更名而非廢除」；F→Q 血緣更正；
  G→ØJ 改述為「沿用上限、新增下限」。
- **測試矩陣**：舊版欄改為分列 ISO 594-1 與 ISO 594-2；四項標示【非新增項目】；
  新增「量規檢驗」與「易組裝性（已刪除）」兩列，共 9 項。
- **涵蓋率**：補齊 Annex B 全部八表共 60 項尺寸；新增繼承條款提示並可點擊跳轉至父表。
- **分類法**：以「2D 圖面必須採取的動作」重建為六類（窮盡且互斥），首頁摘要卡、篩選器與徽章
  全部由 `CHANGE_TYPE_META` 單一來源衍生，杜絕三套分類漂移。
- **計算器**：改為將量測值同時換算至兩個標準各自的基準面再分別判定，雙向可逆。
- **狀態一致性**：接頭類型與材料類別提升為全站共用狀態；分頁切換同步寫入網址。
- **建置關卡**：`npm run build` 改為先跑 `tsc --noEmit`；CI 新增獨立 Type check 步驟；
  tsconfig 開啟 `strict`、`noUnusedLocals`、`noUnusedParameters`。
- **相依清理**：移除 `@google/genai`、`express`、`dotenv`、`motion` 等 4 個零引用套件
  （`vite` 原同時列於 dependencies 與 devDependencies，已修正），移除 132 個傳遞相依。
- **無障礙**：查核清單改用 `role="checkbox"` + `aria-checked`；表格展開加上 `aria-expanded`／`aria-controls`；
  對話框與抽屜補上 Esc 關閉、捲動鎖定與焦點移入；移除遮罩層上互斥的 `aria-hidden` + `onClick`。
- **PWA**：修正 Service Worker 離線保底（原 `caches.match() || caches.match()` 因 Promise 恆真而永不 fallback）；
  安裝提示改用模組層單一事件來源，避免多實例重複呼叫 `prompt()`；更新提示補上監聽器清理。

### 4. 驗證結果
- [x] `npx tsc --noEmit`（strict 全開）：0 錯誤
- [x] `npx vite build`：成功
- [x] 瀏覽器實測八個分類分頁：0 應用層 Console 錯誤
- [x] 計算器可逆性：`Ød = 4.035 @ 0.750 剖面` 與 `Ød = 3.990 @ 端面` 產生完全相同的換算值與雙標準判定
- [x] 分頁項目數與 Annex B 一致：B.1=7、B.2=6、B.3=11、B.4=3、B.5=10、B.6=11、B.7=10、B.8=2

### 5. 已知未完成項目
- **深色模式**：全站配色仍為單一淺色，未提供 dark 變體。
- **`.env.example`**：仍記載 `GEMINI_API_KEY` / `APP_URL` 兩個未使用的環境變數（依檔案保留原則未刪除）。

---

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

