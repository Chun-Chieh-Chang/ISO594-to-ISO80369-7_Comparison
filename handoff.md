# Handoff — ISO594-to-ISO80369-7_Comparison

> 最後更新：2026-10-02（v1.4.3 全面盤點與清理後）

## 專案概要

ISO 594 → ISO 80369-7 魯爾接頭圖面轉版工程審查系統（React 19 + Vite 6 + Tailwind v4，PWA）。
設計系統：Inset Focus 凹凸光影（深墨綠/薄荷綠，`.neo-card` / `.neo-tray` / `.neo-pill-active` / `.neo-input`）。
當前版本：**v1.4.3**。

## 最近完成：UI 交互動效活化（依 interaction-effects-plan.md 適配版）

方案文件 `interaction-effects-plan.md` 原為兄弟專案 `ISO_80369-7_Navigation` 撰寫（該專案已於其 commit `deafaf4` 落地）；
本次經用戶確認「針對專案修改方案」+「可從 G3\Frontend-Terms 擴充」，移植並擴充至本專案。

### 已落地動效（9 項）

1. **Stagger 逐條入場** — App.tsx 六類變更卡片（0.08s 遞延）、ActionChecklist 清單項（上限 0.5s）
2. **Page Transition** — App.tsx `<div key={activeTab} className="page-transition">`
3. **Hover Lift → Pressable 改寫** — `.neo-pressable`（hover -2px / active scale 0.98）；原因：本專案 `.neo-card` 含 6 個整頁大容器，不做全域位移
4. **Accordion** — DimensionTables 展開詳情列 `rowExpandIn` 掛載動畫 + 箭頭 `rotate-180`
5. **Sliding Pill** — Header 桌機 tabs，refs 量測 offsetLeft/offsetWidth + resize 重測（`pill-slider-dark`）
6. **Spotlight Hover** — App.tsx 變更卡片，`--mx/--my` CSS 變數，`@media (hover:hover)` 限定
7. **button-press**（擴充）— 併入 `.neo-pressable`
8. **count-up**（擴充）— App.tsx `useCountUp`（rAF），hero 統計數字
9. **back-to-top**（擴充）— 新元件 `src/components/BackToTop.tsx`

### 變更檔案（全在展示層，內容層零接觸）

- `src/index.css` — 動效 CSS 區塊 + `--neo-spotlight` 變量 + reduced-motion 降級
- `src/App.tsx` — page transition / stagger / spotlight / pressable / CountUp / BackToTop
- `src/components/Header.tsx` — 滑動指示條 + active:scale；徽章 v1.4.0
- `src/components/DimensionTables.tsx` — 展開動畫 + 觸控目標修正（40px/47px/41px）
- `src/components/MaterialGuide.tsx` — 材料卡 pressable
- `src/components/ActionChecklist.tsx` — 清單項 stagger + pressable
- `src/components/BackToTop.tsx` — **新增**
- `package.json` — 1.4.0
- `.gitignore` — 加 `.playwright-cli/`
- `interaction-effects-plan.md` — 補第七章「適配記錄」（含驗證紀錄）

### 驗證狀態（全數通過）

- `tsc --noEmit` ✅、`vite build` ✅
- 1280/768/390/375 四視口無水平溢出 ✅、console 0 錯誤 ✅
- 滑塊幾何跟隨、三種 animation computed style、count-up 收斂（60=32+2+12+9+4+1）、back-to-top 回頂、375px 不遮底部導覽 ✅
- `prefers-reduced-motion` 模擬：動畫轉 none ✅
- 截圖存證：`.playwright-cli/qa-*.png`（已 gitignore）

## 下一步建議

1. PWA「安裝 App」按鈕 33px 觸控目標（PwaInstallPrompt）為既有問題，本次未動（不在方案範圍），可列後續
2. DimensionCalculator / DatumShiftVisualizer 的材料切換按鈕（py-1.5，33px）同為既有小目標，可一併升級
3. 手機底部導覽（MobileBottomNav）滑動指示條為可選後續（等寬 grid，效益低故未做）

## v1.4.1 後續修正（同日完成，已 commit）

上述建議 1、2 已全部完成：全站互動控制項（按鈕/下拉選單）高度一律 ≥40px——
PwaInstallPrompt（安裝鈕/立即安裝/對話框關閉鈕）、DatumShiftVisualizer（接頭側/材料切換）、
DimensionCalculator（重置鈕/材料切換/分類 select）、TestRequirementsTable（嚴重度篩選/影響區域 select）、
ActionChecklist（角色篩選/僅顯示核取/清除勾選鈕）、EcoGeneratorModal（關閉/頁尾按鈕）、PwaUpdateToast、
DimensionTables 篩選 select。Header 桌機 tabs 為指標裝置專用（WCAG 2.5.8 24px 已達標）維持 33px 不變。
Playwright 六分頁複測：sub-40px 控制項 = 0、無水平溢出。驗證時注意：`http.server` 會讓 index.html 進記憶體快取，
複測須帶 `&_cb=$RANDOM` 繞過，否則量到舊 build。

僅剩建議 3（MobileBottomNav 滑動指示條）為可選項，未實作。

## v1.4.2 底部導覽滑動指示條（同日完成，已 commit）

`MobileBottomNav` 加入滑塊：保持原「圖示晶片浮起」視覺，僅將 `neo-pill-active` 從靜態晶片改為
跟隨作用中分頁的滑塊（含「更多」態；抽屜分頁作用時滑至第 5 格）。要點與陷阱：

- **量測陷阱**：按鈕需 `relative z-10` 蓋在滑塊（z-0）之上，但這使按鈕成為晶片的 offsetParent——
  `chip.offsetLeft` 從「相對格線」變成「相對按鈕」（恆 19px），滑塊卡死。解法：`getBoundingClientRect`
  對格線原點求差值，免疫於 offsetParent 變化。
- 桌機 `md:hidden` 下量測為 0 → 滑塊 opacity 0 隱藏；resize 回行動尺寸自動重量測（resize 監聽）。
- 驗證：375px 下滑塊 left 19→89→300→19 與晶片完全同步（含抽屜選「更多」態）、1280 隱藏、無溢出；
  截圖 `.playwright-cli/qa-375-bottomnav.png`。
- 測試腳本教訓：`grid.querySelectorAll(':scope > button > span')` 會把標籤 span 也算進去
  （每顆按鈕有晶片+標籤兩個 span），要以 `className.includes('rounded-lg')` 過濾出晶片。

## v1.4.3 全面盤點與清理（2026-10-02）

- 移除：`vite.config.ts` 的 `@` alias 死設定（零引用）
- 修正：`sw.js` 快取名 v1.2.0→v1.4.3（自 v1.2.0 起未隨發版更新）、theme-color 三源
  對齊 #1a3528（index.html + manifest theme_color/background_color）、
  package-lock 版本漂移同步（1.2.0→1.4.3 + npm 補齊 optional 巢狀中繼）
- 內容層死碼掃描：零發現（19 型別匯出 + 5 資料匯出全部存活）
- README：色票 #1a2744→#1a3528 修正（v1.3.1 遺漏）、補述 v1.4.x 動效與 40px 熱區
- docs/ 與 GitHub wiki 皆不存在 → 開發文件 SSOT = README + DEV_LOG + handoff +
  interaction-effects-plan 四檔，不虛建構
- 已知設計債（刻意不動）：Tailwind 藍 accent 與 --neo-accent 並存（v1.3.1 刻意僅動
  token 層，統一需獨立節點）；iOS apple-touch-icon SVG 為 iOS 不支援之既有限制
- 驗證：tsc/build 全綠、Playwright 六分頁烟霧（無溢出、console 0 錯、滑塊幾何不變）

## 推送與上線紀錄（2026-10-02）

- 9 個 commit（v1.4.0–v1.4.3 全部工作）已推送 origin/main（aa7c72e..2fc3f3e），
  資安盤點通過後經用戶核准推送（ISO 原文 PDF 確認隔離、無秘密、無二進位追蹤檔）
- GitHub Pages 部署成功（run 37007606383：build 23s + deploy 8s，CI 內獨立
  tsc 檢查與 npm ci 用新 lockfile 通過——反向驗證 lock 修正）
- 線上驗證：sw.js 快取名 v1.4.3、theme-color #1a3528 已上線
- **CI 待辦 → 已完成（2026-10-02）**：deploy.yml 四 action 升級至最新主版本
  （checkout v7 / setup-node v7 / upload-pages-artifact v5 / deploy-pages v5，
  原生 Node 24）、node-version 20→24（20 已 EOL）、runs-on 釘選 ubuntu-24.04
  （避開 10-19 的 ubuntu-latest→26 遷移）、checkout 加 persist-credentials: false。
  推送後 run 全綠、棄用警告歸零、線上內容不變（v1.4.3）。

## 關鍵上下文

- 兄弟專案 `D:\Self-developed_Apps\G1\ISO_80369-7_Navigation` 為同設計系統先例，滑塊/動效實作可互參
- 動效來源手冊：`D:\Self-developed_Apps\G3\Frontend-Terms`（69 詞條，`src/data/manualData.ts`）
- 內容層鐵律：`src/data/*`、`src/i18n/*`、`src/utils/*`、`src/types/*` 不碰（見方案第五章）
