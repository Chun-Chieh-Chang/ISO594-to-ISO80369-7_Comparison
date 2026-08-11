import { ChecklistItem } from '../types';

export const INITIAL_CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'chk-1',
    category: 'R&D CAD',
    title: '【測量基準重設】剖面往內退後 0.75 mm',
    detail: '是否已將公接頭端部外徑 (Ød) 與母接頭開口內徑 (ØD) 的 2D 尺寸標註線，由「最極端面」向內退後 0.75 mm，並對應更新了公差帶數值？',
    targetConnector: 'all',
    completed: false,
    riskLevel: 'critical',
    isoClauseRef: 'ISO 80369-7 Annex B (Datum Plane Note)'
  },
  {
    id: 'chk-2',
    category: 'R&D CAD',
    title: '【公接頭防錯接特徵】前端內孔直徑管制 (Øf ≤ 2.900 mm)',
    detail: '圖面是否已明確新增前端內孔直徑的最大限制 Øf ≤ 2.900 mm？若為大流量流道，須審查內部銜接階梯。',
    targetConnector: 'male-slip',
    completed: false,
    riskLevel: 'critical',
    isoClauseRef: 'ISO 80369-7 Table B.1 Item Øf'
  },
  {
    id: 'chk-3',
    category: 'R&D CAD',
    title: '【公鎖固螺紋起始】深度 T 降階標註 (t (3.200) / (3.650))',
    detail: '螺紋起始深度 T (3.2 mm) 是否已降為輔助尺寸，並加上括號標示為 t (3.200) 或半剛性 (3.650)？',
    targetConnector: 'male-lock',
    completed: false,
    riskLevel: 'medium',
    isoClauseRef: 'ISO 80369-7 Table B.3 Note 2'
  },
  {
    id: 'chk-4',
    category: 'R&D CAD',
    title: '【母鎖固凸耳定位】刪除 F 改標 N1 (≤1.200) 與 N2 (≤2.070)',
    detail: '是否已徹底刪除舊版距端面 0.20 mm 的 F 尺寸，改由端面往內測量標註凸耳前緣 N1 (≤ 1.200) 與後緣 N2 (≤ 2.070)？',
    targetConnector: 'female-lock',
    completed: false,
    riskLevel: 'critical',
    isoClauseRef: 'ISO 80369-7 Table B.6 Item N1 & N2'
  },
  {
    id: 'chk-5',
    category: 'R&D CAD',
    title: '【母鎖固凸耳根部】廢除弦長 V 改標直徑 ØJ (5.515 ~ 6.730 mm)',
    detail: '是否已廢除難以量測的弦長 V，改用明確的直徑公差 ØJ (5.515 ~ 6.730 mm) 來控制凸耳根部大小？',
    targetConnector: 'female-lock',
    completed: false,
    riskLevel: 'high',
    isoClauseRef: 'ISO 80369-7 Table B.6 Item ØJ'
  },
  {
    id: 'chk-6',
    category: 'R&D CAD',
    title: '【尺寸符號更新】全面替換為 ISO 80369-7 標準符號',
    detail: '圖框及尺寸標註是否已全面揚棄舊版符號 (H, J, 2X, S, W)，全面替換為 ISO 80369-7 的國際標準符號 (Øh, Øj, ØH, M, Y 等)？',
    targetConnector: 'all',
    completed: false,
    riskLevel: 'medium',
    isoClauseRef: 'ISO 80369-7 Symbol Conventions'
  },
  {
    id: 'chk-7',
    category: 'QA/QC',
    title: '【檢驗規範同步】廢除鋼制塞規改依 ISO 80369-7 規範量測',
    detail: '圖面附註 (Notes) 是否已刪除「使用鋼製量規 (Steel Gauge) 檢驗」等字眼，並改為「依據 ISO 80369-7 規範量測」？',
    targetConnector: 'all',
    completed: false,
    riskLevel: 'critical',
    isoClauseRef: 'ISO 80369-7 Clause 5 & Annex C'
  },
  {
    id: 'chk-8',
    category: 'Mold & Tooling',
    title: '【模具塑膠縮水】半剛性母接頭開口內徑預判 (≥ 4.225 mm)',
    detail: '對半剛性塑膠母接頭開口，評估射出成型包縮後內徑是否能維持在建議的 ≥ 4.225 mm，避免螺紋預緊力下降導致洩漏。',
    targetConnector: 'female-slip',
    completed: false,
    riskLevel: 'high',
    isoClauseRef: 'ISO 80369-7 Table B.2 Footnote b'
  },
  {
    id: 'chk-9',
    category: 'QA/QC',
    title: '【物理測試 SOP】Luer Lock 軸向拉拔測試提升至 32-35 N',
    detail: '將 QC 實驗室拉力機 SOP 中 Luer Lock 的測試拉力由 25 N 提高至 32 - 35 N (持壓 10-15s)，確保無塑膠接頭被拉脫。',
    targetConnector: 'male-lock',
    completed: false,
    riskLevel: 'high',
    isoClauseRef: 'ISO 80369-7 Clause 6.4 Table 3'
  },
  {
    id: 'chk-10',
    category: 'QA/QC',
    title: '【物理測試 SOP】添購定量旋卸 (0.018-0.020 N·m) & 過載扭矩設備',
    detail: '建立 0.018-0.020 N·m 逆時針旋卸及 0.15-0.17 N·m 順時針抗過載鎖緊扭矩之測試 SOP 及設備校正。',
    targetConnector: 'male-lock',
    completed: false,
    riskLevel: 'high',
    isoClauseRef: 'ISO 80369-7 Clause 6.5 & 6.6'
  },
  {
    id: 'chk-11',
    category: 'RA Regulatory',
    title: '【法規宣示】DHF / STED / 510(k) 宣示更新與 DV 測試報告整備',
    detail: '於法規文件與標籤宣告中，將符合性標準聲明由 ISO 594-1/2 更新為 ISO 80369-7:2021，並附上完整 DV 測試報告。',
    targetConnector: 'all',
    completed: false,
    riskLevel: 'high',
    isoClauseRef: 'ISO 80369-7 Compliance Statement'
  }
];

export function generateEcoText(completedItems: ChecklistItem[], docNumber = 'ECO-2026-LUER-001'): string {
  const dateStr = new Date().toISOString().slice(0, 10);
  return `====================================================================
【工程變更申請單 / ENGINEERING CHANGE ORDER (ECO)】
ECO 編號: ${docNumber}
申請日期: ${dateStr}
變更主題: 魯爾接頭規範修訂由 ISO 594-1/594-2 轉換升級至 ISO 80369-7:2021
變更原因: 依據 FDA / CE MDR 醫療器械法規要求，防止小孔徑接頭錯接 (Misconnection)
====================================================================

一、 2D 圖面與 CAD 模型修訂要點 (Drawing & CAD Revision Summary):
1. [基底位移] 重設圓錐剖面測量基準，將剖面標註後移 0.75mm，對應更新 Ød / ØD 公差數值。
2. [防錯接] 公接頭前端內孔標註新增上限限制 Øf ≤ 2.900 mm。
3. [公鎖固] 螺紋起始距離 T 改標為輔助尺寸 t (3.200) mm。
4. [母鎖固] 廢除舊版 F 及 V 弦長，改標 N1 (≤1.200mm)、N2 (≤2.070mm) 及凸耳根部直徑 ØJ (5.515 - 6.730mm)。
5. [圖面符號] 全面將舊版 H, J, 2X, S, W 符號更新為 ISO 80369-7 國際標準符號 (Øh, Øj, ØH, M, Y)。

二、 品質檢驗與驗證 SOP 修正 (QA/QC Inspection & Verification SOP):
1. 停用傳統 ISO 594 金屬塞規/環規放行，改採光學投影 / 三次元 (CMM) 量測。
2. 鎖固型 (Luer Lock) 軸向拉力測試由 25 N 提高至 32 - 35 N。
3. 新增旋卸扭矩 (0.018-0.020 N·m) 與過載抗滑牙 (0.15-0.17 N·m) 檢驗 SOP。
4. 抽吸負壓測試導入 80-88 kPa 真空儀器定量檢測 (≤ 0.005 Pa·m³/s)。

三、 審查狀態 CheckList (Checklist Completion Status):
已完成審查項目: ${completedItems.filter(i => i.completed).length} / ${completedItems.length} 項
未完成審查項目: ${completedItems.filter(i => !i.completed).length} 項

審查負責人 (Approved by): ___________________ (R&D Leader / QA Manager)
`;
}
