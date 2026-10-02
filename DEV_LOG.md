# 專案開發與工程確效日誌 (DEV_LOG.md)

## [2026-10-02] UI 交互動效活化 + 全站觸控目標升級 (v1.4.0 – v1.4.2)

### 1. 背景
依 `interaction-effects-plan.md`（源自 G3\Frontend-Terms 術語手冊，原為同系列專案
ISO_80369-7_Navigation 撰寫並已於該專案落地）進行本專案之 UI 活化。經確認採「移植改寫」策略：
保留 6 項核心動效框架，作用點依本專案實際結構重新映射，並自手冊擴充 3 項詞條，
另依行動端品質門禁（mobile-responsive-audit）完成全站觸控目標升級。

### 2. 實作內容

**v1.4.0 — `feat(ui): 活化 9 項交互動效`**（commit `f7f3944`）
- **Stagger 逐條入場**：首頁六類變更卡片（0.08s 遞延）＋ R&D 清單項（遞延上限 0.5s），
  僅 `transform` + `opacity`（GPU 加速），`animation-fill-mode: backwards` 確保只播一次。
- **Page Transition**：`App.tsx` 以 `key={activeTab}` 觸發重掛載 + `pageIn` 動畫（0.4s），免動畫庫。
- **Accordion**：尺寸表展開詳情列改 `rowExpandIn` 掛載動畫（0.28s）＋ 箭頭 `rotate-180` 過渡。
  原方案之 `max-height` 過渡不適用 `<tr>` 環境，為本專案改寫點之一。
- **Sliding Pill**：`Header.tsx` 桌機六分頁滑動指示條（refs 量測 offsetLeft/offsetWidth、
  resize 重測、`pill-slider-dark` 深色滑塊）。
- **Spotlight Hover**：變更卡片徑向光斑，`--mx/--my` CSS 變數驅動，限 `@media (hover:hover)`，
  光斑色走主題變量 `--neo-spotlight`。
- **Pressable 浮沉回饋**（擴充 `button-press` 詞條）：hover `-2px` 預告、active 按壓 `scale(0.98)`。
  原方案之全域 `.neo-card:hover` 位移在本專案會波及 6 個整頁大容器，故改為互動元素級 `.neo-pressable`，
  為本專案改寫點之二。
- **Count-up**（擴充）：`useCountUp` rAF hook，hero 統計數字滾動。
- **Back-to-top**（擴充）：新元件 `BackToTop.tsx`，捲動逾 480px 浮現，避開手機底部導覽。
- 全部動畫附 `prefers-reduced-motion` 降級（CSS `animation: none` ＋ JS 偵測）。
- 內容層零接觸：`src/data/*`、`src/i18n/*`、`src/utils/*`、`src/types/*` 未動。

**v1.4.1 — `fix(ui): 全站互動控制項觸控目標升級至 ≥40px`**（commit `526a210`）
- 修正 12 處低於 40px 之控制項：`PwaInstallPrompt`（安裝鈕 33→41px、對話框關閉鈕 28→40px）、
  `TestRequirementsTable`（嚴重度篩選 31→41px、兩處 select `min-h-[40px]`）、
  `DatumShiftVisualizer`（接頭側/材料切換 33→41px）、`DimensionCalculator`（重置/材料/分類 select）、
  `ActionChecklist`（角色篩選/核取標籤/清除鈕）、`EcoGeneratorModal`（關閉/頁尾）、`PwaUpdateToast`。
- 刻意保留：Header 桌機 tabs 33px（僅指標裝置可見、WCAG 2.5.8 之 24px 已達標，
  手機端走 48px 底部導覽）。

**v1.4.2 — `feat(ui): 手機底部導覽加入滑動指示條`**（commit `6fadd03`）
- 保持原「圖示晶片浮起」視覺，`neo-pill-active` 改為跟隨作用分頁之滑塊（含「更多」態，
  抽屜分頁作用時滑至第 5 格）；桌機 `md:hidden` 量測為 0 時自動隱藏。
- **工程陷阱記錄**：按鈕 `relative z-10` 化後成為晶片之 `offsetParent`，
  `chip.offsetLeft` 變為相對按鈕（恆 19px）致滑塊卡死；改用 `getBoundingClientRect`
  對格線原點求差值解決。此陷阱同步記錄於方案文件 7.1 節。

### 3. 驗證結果
- [x] `tsc --noEmit`（strict 全開）：0 錯誤；`vite build`：成功（JS 367 kB gzip 107 kB）
- [x] 四視口（1280/768/390/375）水平溢出檢查：`scrollWidth <= innerWidth` 全數通過，console 0 錯誤
- [x] 互動實證（Playwright）：Header 滑塊 left 與作用按鈕 offsetLeft 完全一致（4px→419px 跟隨）；
  `pageIn`/`rowExpandIn`/`fadeUp` computed animation 生效；count-up 收斂 60 = 32+2+12+9+4+1；
  back-to-top 點擊回頂並隱藏；375px 下與底部導覽無重疊（716 < 737）
- [x] 底部導覽滑塊：375px 依序操作 left 19→89→300→19 與晶片座標（19/89/159/230/300）吻合；
  1280px 隱藏
- [x] `prefers-reduced-motion` 模擬：動畫 computed value 全轉 `none`
- [x] 六分頁 sub-40px 控制項複測：0 筆
- [x] 截圖存證：`.playwright-cli/qa-*.png`（已入 .gitignore）
- 備註：驗證時 `python http.server` 會令 index.html 進記憶體快取，複測須帶 `&_cb=$RANDOM`
  繞過，否則量得舊 build 假數據。

---

## [2026-09-16] 主色調由藍灰切換為深墨綠／薄荷綠色系 (v1.3.1)

> 本節為 2026-10-02 補記（原 commit 漏寫日誌，沿用 v1.2.3 之補記慣例）。

### 1. 背景
v1.3.0 落地 Inset Focus 凹凸光影系統後，同日將全站主色調由藍灰（冷色科技調）遷移至
深墨綠／薄荷鼠尾草（暖色植物調），使配色更貼近醫療審查工具之沉穩氣質。

### 2. 實作內容（commit `aa7c72e`）
`src/index.css` 色票遷移（11 個 token 中 10 個調整，僅 `--neo-sl` 白色高光不變）：

| 變數 | 藍灰（v1.3.0） | 墨綠（v1.3.1） |
|------|--------------|--------------|
| `--neo-header` | `#1a2744` | `#1a3528` |
| `--neo-bg` | `#e3e9f3` | `#dde8e2` |
| `--neo-surface` | `#ecf1f9` | `#e5eeea` |
| `--neo-inset` | `#d8e0ee` | `#d2e3db` |
| `--neo-pill` | `#f4f7fd` | `#f0f6f3` |
| `--neo-sd`（陰影） | `rgba(140,158,192,.48)` | `rgba(95,138,117,.42)` |
| `--neo-accent` | `#3764d7` | `#3a7a5f` |
| `--neo-border` | `rgba(182,198,222,.55)` | `rgba(152,188,168,.55)` |
| `--neo-text` / `--neo-muted` | `#17263c` / `#62778f` | `#162c22` / `#5a7a68` |

`src/components/Header.tsx`：陰影、標準碼徽章、版本文字、分頁文字同步改綠調；
focus ring 與 scrollbar 配色一併更新。純 CSS 變數層遷移，無邏輯變更（2 檔案 +21 −20）。

### 3. 驗證結果
- 原 session 未留存驗證紀錄；以現行版本追溯驗證：`tsc` 0 錯誤、`vite build` 成功、
  全站渲染正常（見 v1.4.0–v1.4.2 之驗證節），凹凸光影於綠色地基下階層清晰。

---

## [2026-09-16] UI/UX 全面重構 — Inset Focus 凹凸光影設計系統 (v1.3.0)

### 1. 背景
參照同系列專案 ISO_80369-7_Navigation 之介面設計語言，以「Inset Focus」凹凸光影設計系統取代原有白色扁平卡片配色，提升工業醫療場景下的視覺階層清晰度。

### 2. 設計系統架構
採三層表面模型（Three-surface strata）：

| 層級 | 變數 | 色值 | 語意 |
|------|------|------|------|
| 地面 | `--neo-bg` | `#e3e9f3` | 頁面底色 |
| 浮起卡片 | `--neo-surface` | `#ecf1f9` | 內容卡片 |
| 下沉托盤 | `--neo-inset` | `#d8e0ee` | 群組容器 / 輸入框 |
| 主動藥丸 | `--neo-pill` | `#f4f7fd` | 活躍按鈕 |

雙層陰影對（深色投影 + 白色高光）產生凹凸立體感，深色品牌導覽列 `--neo-header: #1a2744` 與淺色頁面形成強烈對比。

### 3. 實作範圍
**`src/index.css`**：
- 新增 `:root` CSS 自訂屬性（`--neo-*` 十一個 token）
- 新增工具類別 `.neo-card`、`.neo-tray`、`.neo-pill-active`、`.neo-input`
- 引入 Inter 字型（Google Fonts）、自訂捲軸樣式

**`index.html`**：新增 Inter Google Fonts preconnect 與 stylesheet

**重構組件（共 9 個）**：`Header`、`App`、`DimensionTables`、`TestRequirementsTable`、`MaterialGuide`、`ActionChecklist`、`DimensionCalculator`、`MobileBottomNav`

**刻意保留深色 slate 的組件**（overlay/toast 對比需求，非遺漏）：
- `PwaInstallPrompt`：安裝指引 Modal 與 banner 變體
- `PwaUpdateToast`：更新提示浮層
- `EcoGeneratorModal`：ECO 產生器 Modal
- `DatumShiftVisualizer` / `ToleranceBandChart`：固定深色圖表區（已於 v1.2.1/v1.2.2 記錄）

### 4. 盤點清理
- **移除** `metadata.json`（AI Studio 殘留樣板，無任何程式引用）
- **更新** `package.json` 版本 `1.2.0` → `1.3.0`
- **更新** `Header.tsx` UI 版本徽章 `v1.2.0` → `v1.3.0`
- 版控追蹤檔由 32 個減至 31 個（`metadata.json` 移除）

### 5. 驗證結果
- [x] `tsc --noEmit`（strict 全開）：0 錯誤
- [x] `vite build`：成功（CSS 42.87 kB gzip 8.42 kB；JS 364.43 kB gzip 106.34 kB）
- [x] 瀏覽器實測：六個分頁、手機底部導覽、抽屜、ECO Modal 全數正常渲染
- [x] 無 Console 錯誤

---

## [2026-09-10] 項目全面整理作業 (v1.2.3)

### 1. 背景
脈絡窗口重置後，針對版控歷史、文件同步狀態與本機目錄防護進行系統性盤點。

### 2. 修正項目
- **`.env.example`**：清除與本專案完全無關的 AI Studio 殘留樣板（`GEMINI_API_KEY` / `APP_URL`）；
  新版說明「純前端靜態網站，不需任何環境變數」，消除誤導性。
- **`.gitignore`**：補上根層 `assets/` 排除規則。原先僅靠 `assets/.aistudio/.gitignore` 內
  的 `*` 阻斷子目錄；若有任何檔案直接放入 `assets/`（非 `.aistudio/`），仍會被追蹤。
- **`README.md`**：補上公差帶對照尺標功能說明（深色圖表區、ISO 逗號記法、SVG 刻度軸）。
- **`DEV_LOG.md`**：補齊 v1.2.1–v1.2.2 兩筆開發節點（公差帶圖表）。

### 3. 驗證結果
- [x] `tsc --noEmit`：0 錯誤，嚴格模式全開
- [x] 版控清單 (`git ls-files`)：共 32 個追蹤檔，無 isodoc/ 或任何 PDF 滲漏
- [x] 全專案無死碼（無未使用的 import、export、函式）

---

## [2026-09-10] 公差帶對照尺標整合 (v1.2.1 / v1.2.2)

### 1. 背景
使用者提供深色圖表截圖，要求將公差帶視覺化整合至「基準位移」分頁，
並設定為獨立於全站淺色配色的固定深色圖表區，數字採 ISO 標準原文之逗號小數點記法。

### 2. 實作內容

**v1.2.1 — `feat(visualizer): 新增公差帶對照尺標`**（commit `6346bc7`）
- 新增 `src/components/ToleranceBandChart.tsx`：
  - 純 SVG 元件，帶有固定深色色票 `C`（SkillsBuilder Dark Mode 色彩系統）。
  - `iso()` 函式將浮點數格式化為 ISO 逗號記法（`3.925` → `3,925`）。
  - `BandGroup` 介面含 `pureShift: boolean`，用於區分純平移與非純平移。
  - 位移標註箭頭（琥珀色 `#FBBF24`）只在首組繪製；後續純平移組標「位移量同上」；
    非純平移組（母接頭半剛性 ØD）標「公差帶另有放寬，非單純平移」。
- `DatumShiftVisualizer.tsx` 整合 `ToleranceBandChart`，傳入 `bandGroups`、軸線範圍與 delta。

**v1.2.2 — `style(visualizer): 公差帶尺標改為獨立深色圖表區並採 ISO 逗號記法`**（commit `ac5a8ef`）
- 圖表容器改為深色面板（`bg-[#0F172A]` 外框 + `bg-[#151F32]` 圖表框）。
- 說明文字框以深色邊框獨立呈現，數字統一改逗號記法（`0,750 mm`、`6,75 × 0,06`）。
- 眉標 `02` + 「基準位移驗證」標題樣式比照截圖設計。
- 圖表區意圖永遠為深色，不隨全站主題翻轉；色值硬編碼於元件，避免 Tailwind 暗色類別污染光色設計系統。

### 3. 驗證結果
- [x] `tsc --noEmit`：0 錯誤
- [x] `vite build`：成功
- [x] 瀏覽器實測：深色面板正確顯示，新版公差帶（綠色）、舊版（深藍灰）、位移箭頭（琥珀）對比清晰
- [x] ISO 逗號記法驗算：`0,750`、`+0,045`、`6,75 × 0,06 = 0,405` 全部正確

---

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
- **`.env.example`**：~~仍記載 `GEMINI_API_KEY` / `APP_URL` 兩個未使用的環境變數~~ → 已於 v1.2.3 修正。

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

