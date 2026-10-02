# Handoff — ISO594-to-ISO80369-7_Comparison

> 最後更新：2026-10-02（UI 動效活化任務完成後）

## 專案概要

ISO 594 → ISO 80369-7 魯爾接頭圖面轉版工程審查系統（React 19 + Vite 6 + Tailwind v4，PWA）。
設計系統：Inset Focus 凹凸光影（深墨綠/薄荷綠，`.neo-card` / `.neo-tray` / `.neo-pill-active` / `.neo-input`）。
當前版本：**v1.4.0**（未 commit，工作區有未提交變更）。

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

1. **Commit**：用戶未要求 commit，變更仍在工作區。建議訊息方向：`feat(ui): activate 9 interaction effects per adapted interaction-effects-plan (v1.4.0)`
2. PWA「安裝 App」按鈕 33px 觸控目標（PwaInstallPrompt）為既有問題，本次未動（不在方案範圍），可列後續
3. DimensionCalculator / DatumShiftVisualizer 的材料切換按鈕（py-1.5，33px）同為既有小目標，可一併升級
4. 手機底部導覽（MobileBottomNav）滑動指示條為可選後續（等寬 grid，效益低故未做）

## 關鍵上下文

- 兄弟專案 `D:\Self-developed_Apps\G1\ISO_80369-7_Navigation` 為同設計系統先例，滑塊/動效實作可互參
- 動效來源手冊：`D:\Self-developed_Apps\G3\Frontend-Terms`（69 詞條，`src/data/manualData.ts`）
- 內容層鐵律：`src/data/*`、`src/i18n/*`、`src/utils/*`、`src/types/*` 不碰（見方案第五章）
