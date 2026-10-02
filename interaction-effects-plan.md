# ISO 80369-7 Navigation — UI 交互動效活化方案

> 來源：D:\Self-developed_Apps\G3\Frontend-Terms（前端交互效果 VibeCoding 術語手冊，共 12 章 ~70 詞條）
> 目標專案：ISO 80369-7 Medical Small-Bore Connector Validation Navigator
> 設計系統：奶茶焦糖米 Neumorphic（`.neo-card` / `.neo-tray` / `.neo-pill-active` / `.neo-input`）

---

## 一、分析方法論

從 Frontend-Terms 的 70 個詞條中，依三個維度篩選：

1. **視覺衝擊力** — 是否一眼就能感知到「活了起來」
2. **場景契合度** — 是否與 ISO 專案現有的元件結構（卡片網格、Tab 導航、樹狀目錄、抽屜）天然對應
3. **實作成本** — 是否可在不引入額外動畫庫的前提下，用純 CSS + 少量 React 狀態實現

最終精選 **6 項**，按優先級排序如下。

---

## 二、精選動效清單

### 動效 1：逐條入場 Stagger（優先級 ★★★★★）

| 項目 | 內容 |
|------|------|
| **來源詞條** | `stagger` — 第二章 頁面入場與加載 |
| **作用元件** | `TopicClauseExplorer.tsx:235` — `filteredTopics.map()` 卡片網格 |
| **現狀** | 卡片在 `filteredTopics` 變化時瞬間全部出現 |
| **目標** | 每張卡片從下方 30px 淡入上浮，延遲依序 0.08s，單張 0.5s ease-out |
| **實作方式** | 在 `.map()` 中用 `index` 計算 `animationDelay`，CSS keyframe `fadeUp` |
| **修改檔案** | `src/index.css`（加 keyframe）、`TopicClauseExplorer.tsx`（加 inline style） |
| **效能** | ✅ 僅用 `transform: translateY()` + `opacity`（GPU 加速） |

**核心程式碼方向：**

```css
/* src/index.css */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}
.stagger-card {
  animation: fadeUp 0.5s ease-out backwards;
}
```

```tsx
// TopicClauseExplorer.tsx — 卡片 div
<div
  key={topic.id}
  className="group neo-card stagger-card rounded-2xl ..."
  style={{ animationDelay: `${idx * 0.08}s` }}
  onClick={() => drawer.openTopic(topic)}
>
```

---

### 動效 2：頁面淡入轉場 Page Transition（優先級 ★★★★★）

| 項目 | 內容 |
|------|------|
| **來源詞條** | `page-transition` — 第十三章 頁面轉場與主題 |
| **作用元件** | `App.tsx:39-58` — `activeTab` 切換時的 `<main>` 內容區 |
| **現狀** | Tab 切換時內容瞬間替換（無過渡） |
| **目標** | 舊內容淡出 → 新內容從下方淡入上浮，總時長 0.4s |
| **實作方式** | 用 `key={activeTab}` 觸發 React 重新掛載 + CSS `animation` |
| **修改檔案** | `src/index.css`（加 keyframe）、`App.tsx`（加 key 屬性 + class） |
| **注意** | 不需要 `framer-motion`；React `key` 變更會 unmount→remount，CSS animation 自動播放 |

**核心程式碼方向：**

```tsx
// App.tsx
<main className="... ">
  <div key={activeTab} className="page-transition">
    {activeTab === 'topic-explorer' && <TopicClauseExplorer />}
    {/* ... */}
  </div>
</main>
```

```css
.page-transition {
  animation: pageIn 0.4s ease-out;
}
@keyframes pageIn {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

---

### 動效 3：懸停上浮 Hover Lift（優先級 ★★★★☆）

| 項目 | 內容 |
|------|------|
| **來源詞條** | `hover-lift` — 第四章 懸停與指針反饋 |
| **作用元件** | 全域 `.neo-card` class（影響所有卡片） |
| **現狀** | `.neo-card:hover` 僅改變 `box-shadow`，無位移 |
| **目標** | 懸停時 `transform: translateY(-4px)` + 陰影加深，0.25s ease-out |
| **實作方式** | 直接修改 `.neo-card` CSS class，加 `transform` 到 hover 狀態 |
| **修改檔案** | `src/index.css` |
| **效能** | ✅ `transform` + `box-shadow` 均為 GPU 友好屬性 |

**核心程式碼方向：**

```css
/* src/index.css — 修改現有 .neo-card */
.neo-card {
  background-color: var(--neo-surface);
  box-shadow: 6px 6px 15px var(--neo-sd), -6px -6px 15px var(--neo-sl);
  transition: box-shadow 0.25s ease, transform 0.25s ease;  /* ← 加 transform */
}
.neo-card:hover {
  transform: translateY(-4px);                               /* ← 新增 */
  box-shadow: 9px 9px 22px var(--neo-sd), -9px -9px 22px var(--neo-sl);
}
```

> **設計契合點**：Neumorphic 設計的核心就是「凹凸光影」。卡片上浮時陰影拉長，
> 視覺上等同實體卡片被拿起來，與奶茶焦糖米的擬物風格完全一致。

---

### 動效 4：手風琴展開動畫 Accordion Expand（優先級 ★★★★☆）

| 項目 | 內容 |
|------|------|
| **來源詞條** | `accordion` / `tree-view` — 第七章 展開與收起 |
| **作用元件** | `TopicClauseExplorer.tsx:340+` — Figure Tree 樹狀目錄的 `expandedNodes` 切換 |
| **現狀** | `expandedNodes['iso7'] && (...)` 條件渲染，瞬間出現/消失 |
| **目標** | 子節點區域從 `max-height: 0` 平滑過渡到展開高度，箭頭旋轉 |
| **實作方式** | 改為常駐渲染 + `max-height` + `opacity` + `overflow: hidden` 過渡 |
| **修改檔案** | `TopicClauseExplorer.tsx`（改條件渲染為 class 切換）、`index.css`（加過渡 class） |
| **注意** | `max-height` 需設一個足夠大的值（如 800px），不是精確高度；有輕微過衝感反而自然 |

**核心程式碼方向：**

```tsx
// TopicClauseExplorer.tsx — 條件渲染改為 class 控制
<div className={`tree-children ${expandedNodes['iso7'] ? 'expanded' : ''}`}>
  {/* 子節點內容 — 永遠渲染，靠 CSS 控制可見性 */}
</div>
```

```css
.tree-children {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out, opacity 0.3s ease-out;
}
.tree-children.expanded {
  max-height: 800px;
  opacity: 1;
}
```

箭頭旋轉：

```tsx
// ChevronRight/ChevronDown 改為單一 Chevron，用 transform 控制
<ChevronRight
  className={`w-4 h-4 text-blue-600 transition-transform duration-300 ${
    expandedNodes['iso7'] ? 'rotate-90' : ''
  }`}
/>
```

---

### 動效 5：滑動指示條 Sliding Pill Indicator（優先級 ★★★☆☆）

| 項目 | 內容 |
|------|------|
| **來源詞條** | `segmented-control` / `tabs-control` — 第八章 導航與切換 |
| **作用元件** | `Header.tsx:96-114`（Hub tabs）+ `TopicClauseExplorer.tsx:153-183`（View Mode switcher） |
| **現狀** | `neo-pill-active` class 在選中按鈕上瞬間切換 |
| **目標** | 膠囊背景（白色滑塊）在選項間平滑滑動，0.25s |
| **實作方式** | 用一個絕對定位的 `<div>` 作為滑塊，根據 active index 計算 `left` + `width` |
| **修改檔案** | `Header.tsx`、`TopicClauseExplorer.tsx`、`index.css` |
| **難度** | 中等 — 需要用 `ref` 量測按鈕位置，或預設固定寬度 |

**核心程式碼方向（簡化版 — 固定寬度）：**

```tsx
// Header.tsx — Hub tabs
<nav className="relative flex items-center ...">
  {/* Sliding pill background */}
  <div
    className="neo-pill-active absolute rounded-xl transition-all duration-300 ease-out"
    style={{
      left: activeHubIndex * tabWidth,
      width: tabWidth,
      height: '100%',
      zIndex: 0,
    }}
  />
  {/* Tab buttons — 移除各自的 pill-active，改為 z-index: 1 */}
  {primaryHubs.map(hub => (
    <button className="relative z-10 ...">{hub.label}</button>
  ))}
</nav>
```

---

### 動效 6：聚光燈懸停 Spotlight Hover（優先級 ★★★☆☆）

| 項目 | 內容 |
|------|------|
| **來源詞條** | `spotlight-hover` — 第十二章 高級視覺特效 |
| **作用元件** | `TopicClauseExplorer.tsx:244` — Topic 卡片 |
| **現狀** | 卡片懸停僅有顏色變化（icon bg 變藍等） |
| **目標** | 滑鼠位置出現柔和徑向光斑，照亮卡片內部，移開淡出 |
| **實作方式** | `onMouseMove` 更新 CSS variable `--mx` / `--my`，卡片用 `radial-gradient` |
| **修改檔案** | `TopicClauseExplorer.tsx`、`index.css` |
| **效能** | ✅ CSS variable + radial-gradient 不觸發 reflow |

**核心程式碼方向：**

```tsx
// TopicClauseExplorer.tsx — 卡片
<div
  className="group neo-card spotlight-card rounded-2xl ..."
  onMouseMove={(e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
  }}
>
```

```css
.spotlight-card {
  position: relative;
  overflow: hidden;
}
.spotlight-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    200px circle at var(--mx, 50%) var(--my, 50%),
    rgba(255, 248, 235, 0.25),
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 1;
}
.spotlight-card:hover::before {
  opacity: 1;
}
```

> **設計契合點**：光斑顏色用 `--neo-sl`（奶油高光色），與 Neumorphic 體系的高光色一致，
> 看起來像是卡片表面被實體光源照亮，而非外掛濾鏡。

---

## 三、實施順序與預估工作量

| 階段 | 動效 | 改動範圍 | 依賴 |
|------|------|----------|------|
| Phase 1 | Hover Lift (#3) | `index.css` 1 處 | 無 — 全域生效，立即見效 |
| Phase 2 | Stagger (#1) | `index.css` + `TopicClauseExplorer.tsx` | Phase 1 完成 |
| Phase 3 | Page Transition (#2) | `index.css` + `App.tsx` | 無 |
| Phase 4 | Accordion Expand (#4) | `TopicClauseExplorer.tsx` + `index.css` | 無 |
| Phase 5 | Spotlight Hover (#6) | `TopicClauseExplorer.tsx` + `index.css` | Phase 1 完成 |
| Phase 6 | Sliding Pill (#5) | `Header.tsx` + `TopicClauseExplorer.tsx` | 需測試響應式 |

---

## 四、避坑清單（摘自 Frontend-Terms 附錄 C）

| 踩坑點 | 本專案對策 |
|--------|-----------|
| 一頁別貪多 | 已精選 6 項，每頁同時最多觸發 2-3 種（stagger + hover lift + spotlight 可共存） |
| 手機沒有懸停 | Spotlight hover 需加 `@media (hover: hover)` 限制；移動端退回純色 |
| 用 transform + opacity | 全部動效僅使用 `translateY` / `scale` / `opacity`，不碰 width/height/margin |
| 滾動入場加 once | Stagger 動畫加 `animation-fill-mode: backwards` 確保只播一次 |
| 顏色用變量 | 光斑、陰影均引用 `--neo-sl` / `--neo-sd` CSS 變量，不硬編色值 |

---

## 五、變更範圍隔離確認 — 內容層零接觸

### 內容層（完全不碰 — 共 4,454 行 / 7 個檔案）

| 檔案 | 行數 | 職責 | 是否修改 |
|------|------|------|----------|
| `src/data/isoData.ts` | 910 | ISO 標準圖表、條文、夾具數據 | ✕ 不碰 |
| `src/data/isoTopicsData.ts` | 1,587 | 測試主題、分類、關鍵參數 | ✕ 不碰 |
| `src/i18n/translations.ts` | 416 | 中英雙語 UI 文字 | ✕ 不碰 |
| `src/utils/i18nHelpers.ts` | 1,064 | 雙語輔助函式 | ✕ 不碰 |
| `src/utils/isoHelpers.ts` | 247 | ISO 數據輔助函式 | ✕ 不碰 |
| `src/types/index.ts` | 230 | TypeScript 型別定義 | ✕ 不碰 |
| `src/i18n/LanguageContext.tsx` | — | 語言切換 Context | ✕ 不碰 |

### 展示層（僅修改 — 共 4 個檔案）

| 檔案 | 修改類型 | 修改內容 | 涉及文字/數據？ |
|------|----------|----------|----------------|
| `src/index.css` | 新增 + 微調 CSS | 新增 `@keyframes`；修改 `.neo-card:hover` 加 `transform` | 否 — 純 CSS |
| `src/App.tsx` | 加 JSX 屬性 | 加 `key={activeTab}` + `className="page-transition"` | 否 — 僅屬性 |
| `src/components/Header.tsx` | 重構 tab 佈局 | tab 按鈕改為絕對定位滑塊結構 | 否 — 文字/icon/onClick 全保留 |
| `src/components/TopicClauseExplorer.tsx` | 加屬性 + 渲染模式 | 加 `className`/`style`/`onMouseMove`；accordion 條件渲染→常駐渲染 | 否 — 卡片內文字/數據不變 |

**結論：6 項動效的改動全部隔離在展示層。不修改任何條文內容、測試參數、UI 文字、翻譯、型別定義或數據輔助函式。**

---

## 六、未選入但可作為備選的動效

| 動效 | 未選入原因 |
|------|-----------|
| Skeleton Screen | 專案資料為靜態 SSOT，無 async 載入延遲 |
| Ripple 水波紋 | 與 Neumorphic 風格略有衝突（Material 語系） |
| 3D Tilt 傾斜 | 效果炫但與工具型應用調性不符 |
| Custom Cursor | 醫療法規工具，不宜過度裝飾 |
| Particles 粒子 | 背景動畫會干擾資料閱讀 |
| Dark Mode | 專案目前為單一 Neumorphic 米色主題，暫不規劃暗色 |

---

## 七、適配記錄 — 本專案（ISO594-to-ISO80369-7_Comparison）實際落地版 v1.4.0

> 本方案原為 ISO_80369-7_Navigation 撰寫（該專案已於 commit `deafaf4` 完成落地）。
> 2026-10-02 依本專案實際結構改寫移植，差異如下。

### 7.1 作用點映射

| 動效 | 原方案目標（Navigation） | 本專案實際目標 |
|------|------------------------|----------------|
| #1 Stagger | `TopicClauseExplorer` 主題卡片網格 | `App.tsx` 六類變更卡片（×6）；`ActionChecklist` 查核清單項（上限 0.5s） |
| #2 Page Transition | `App.tsx` 分頁內容區 | 相同 — `<div key={activeTab} className="page-transition">` 包 6 分頁 |
| #3 Hover Lift | 全域 `.neo-card:hover` 位移 | **改寫** — 本專案 `.neo-card` 同時用於整頁大容器（6 個分頁根節點），全域位移會讓整頁浮動；改為 `.neo-pressable` 互動元素級回饋（hover `-2px` 預告 / active 按壓 `scale(0.98)`），`.neo-card:hover` 維持僅陰影加深 |
| #4 Accordion | 圖表樹狀目錄 `max-height` 過渡 | **改寫** — 本專案無樹狀目錄；對應 `DimensionTables` 表格展開詳情列。`<tr>` 環境不適用 max-height 過渡，改為掛載動畫 `rowExpandIn`（展開淡入下落 0.28s）+ 箭頭 `rotate-180` 過渡 |
| #5 Sliding Pill | Header Hub tabs + View Mode 切換器 | `Header.tsx` 桌機 6 分頁（refs 量測 offsetLeft/offsetWidth + resize 重測，滑塊樣式 `pill-slider-dark`）；分類頁籤因 flex-wrap 換行不適用，未套用 |
| #6 Spotlight | 主題卡片 | `App.tsx` 六類變更卡片（光斑色改用本主題變量 `--neo-spotlight`，`@media (hover:hover)` 限定） |

### 7.2 Frontend-Terms 擴充項（原方案 6 項之外）

| 詞條 | 落地方式 |
|------|---------|
| `button-press`（第四章） | 併入 `.neo-pressable`：active 按壓內縮，套用於變更卡片、材料卡、清單項、分類頁籤 |
| `count-up`（第二章） | `App.tsx` `useCountUp` hook（rAF + ease-out cubic），hero 總數 60 與六卡數字滾動；reduced-motion 直達終值 |
| `back-to-top`（第一章） | 新元件 `src/components/BackToTop.tsx`：捲動逾 480px 浮現，`bottom-24 md:bottom-8` 避開手機底部導覽 |

### 7.3 附加修正（品質門禁要求）

- `DimensionTables` 觸控目標升級：複製/展開圖示鈕 28px→40px（`h-10 w-10`）、分類頁籤 37px→47px（`py-2.5`）、材料切換 33px→41px
- 全部新動畫加入 `@media (prefers-reduced-motion: reduce)` 降級；`useCountUp` / `BackToTop` 亦以 JS 偵測
- 版本號同步：package.json 1.3.0→1.4.0、Header 徽章 v1.4.0

### 7.4 驗證紀錄（2026-10-02）

- `tsc --noEmit` ✅、`vite build` ✅（1689 模組，gzip 107 kB）
- 四視口溢出檢查 1280/768/390/375：`scrollWidth <= innerWidth` 全數通過 ✅
- 互動實證：滑塊 left=按鈕 offsetLeft（4px→419px 跟隨）✅、`pageIn`/`rowExpandIn`/`fadeUp` computed animation 生效 ✅、count-up 收斂 60=32+2+12+9+4+1 ✅、back-to-top 點擊回頂並隱藏 ✅、375px 與底部導覽無重疊（716 < 737）✅
- reduced-motion 模擬：animation 全轉 `none` ✅；console 0 錯誤 0 警告 ✅
- 截圖存證：`.playwright-cli/qa-*.png`（已入 .gitignore）
