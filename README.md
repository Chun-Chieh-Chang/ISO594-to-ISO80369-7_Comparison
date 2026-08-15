# ISO 594 至 ISO 80369-7 魯爾接頭圖面轉版比對與工程審查系統
### Luer Medical Connector Engineering Standards Audit Suite (ISO 594 ➔ ISO 80369-7:2021)

本系統專為醫療器材研發 (R&D)、模具工程 (Tooling)、品保法規 (QA/RA) 及量測檢驗部門打造，提供從 **ISO 594-1 / ISO 594-2** 轉版至 **ISO 80369-7:2021** 的幾何公差比對、0.75mm 基準位移計算、測試法規變更指引與工程變更申請單 (ECO) 生成工具。

---

## 🚀 核心功能模組

1. **逐一尺寸對照 (Dimension Comparison Table)**：
   - 涵蓋公接頭 (Male Slip/Lock) 與母接頭 (Female Slip/Lock) 在剛性與半剛性材料下的每一項幾何參數對照。
   - 標註「基準位移」、「新增特徵」、「檢測變更」、「放寬/輔助」等分類標籤與詳細工程技術解析。
2. **0.75mm 基準位移圖解 (Datum Shift Visualizer)**：
   - 互動式 2D 剖面圖解，動態展示基準面由接頭前端內移 0.75mm 對外徑截面數值 (+0.045mm) 的影響。
3. **CAD 評估計算器 (CAD Dimension Calculator)**：
   - 支援輸入既有 ISO 594 圖面尺寸，自動計算在 ISO 80369-7 基準下的推算外徑、上下限公差與相容性判定。
4. **測試 SOP 變更指引 (Test Requirements Matrix)**：
   - 詳列正壓液體洩漏、負壓空氣洩漏、應力開裂、分離力、旋開扭矩、抗滑絲等 6 大測試項目在 ISO 594 vs ISO 80369-7 的定量要求差異。
5. **材料剛性矩陣指南 (Material Rigidity Guide)**：
   - 剛性材料（彈性模數 > 700 MPa）與半剛性材料（≤ 700 MPa）在公差與測試要求上的實務指引。
6. **R&D 行動清單 & ECO 生成器 (Action Checklist & ECO Generator)**：
   - 10 大關鍵圖面審查 Checkpoints，支援一鍵產生標準工程變更申請單 (ECO) 文本並複製。
7. **PWA 漸進式網頁應用 (Progressive Web App)**：
   - 支援安裝至手機主畫面、無網環境 100% 離線運算、Prompt on Update 提示更新與手機版專屬底部觸控導航列。

---

## 🛠️ 技術棧 (Tech Stack)

- **核心架構**：React 19 + TypeScript + Vite 6
- **樣式與設計系統**：Tailwind CSS 4 (Morandi Palette / Slate / Approachable Luxury)
- **圖示庫**：Lucide React
- **PWA 技術**：Service Worker 快取 + Web App Manifest + Safe Area Mobile Adaption
- **CI/CD**：GitHub Actions 自動部署至 GitHub Pages

---

## 💻 本地端運行 (Run Locally)

```bash
# 1. 安裝依賴
npm install

# 2. 啟動本地開發伺服器
npm run dev

# 3. 執行 TypeScript 型別檢查
npm run lint

# 4. 生產環境打包
npm run build
```

---

## 👨‍💻 作者與版權資訊 (Author & Copyright)

- **開發者**：Wesley Chang
- **機構**：Mouldex
- **發布時間**：August 2026
- **版權聲明**：© 2026 Mouldex. All rights reserved.
