import { ChecklistItem, RiskLevel } from '../types';

export const CHECKLIST_STORAGE_KEY = 'iso_luer_checklist_v4';

export const INITIAL_CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'chk-1',
    category: 'R&D CAD',
    title: '【量測基準重設】剖面往內退後 0.750 mm',
    detail:
      '是否已將公接頭前端外徑 (Ød) 與母接頭開口內徑 (ØD) 的 2D 尺寸標註線，由端面向內退後 0.750 mm，並對應更新公差帶數值？公端 +0.045 mm、母端 −0.045 mm。此為唯一「實體幾何不需修改」的變更項。',
    targetConnector: 'all',
    completed: false,
    riskLevel: 'critical',
    isoClauseRef: 'ISO 80369-7 Table B.1 Ød / Table B.2 ØD'
  },
  {
    id: 'chk-2',
    category: 'R&D CAD',
    title: '【防錯接特徵】公接頭前端內孔 Øf ≤ 2.900 mm',
    detail:
      '圖面是否已新增前端內孔直徑上限 Øf ≤ 2.900 mm？若為大流量流道，須一併審查內部銜接階梯與流阻。標準刻意未定義下限，以容納玻璃針筒的極小內孔。',
    targetConnector: 'male-slip',
    completed: false,
    riskLevel: 'critical',
    isoClauseRef: 'ISO 80369-7 Table B.1 Øf'
  },
  {
    id: 'chk-3',
    category: 'R&D CAD',
    title: '【公鎖固螺紋起始】T 降階為輔助尺寸 t (3.200) / (3.650)',
    detail:
      '螺紋起始深度是否已改以括號標示為輔助尺寸 t (3.200)，半剛性材料為 (3.650)？功能性合規改由 6.4 抗軸向分離測試驗證。Table B.3 註 c 仍建議半剛性維持 3.200 mm。',
    targetConnector: 'male-lock',
    completed: false,
    riskLevel: 'medium',
    isoClauseRef: 'ISO 80369-7 Table B.3 NOTE 2 及註 c'
  },
  {
    id: 'chk-4',
    category: 'R&D CAD',
    title: '【母鎖固凸耳定位】新增端面基準 N1 (≤1.200) 與 N2 (≤2.070)',
    detail:
      '是否已補上自端面往內量測（於對應 6.730 之直徑處）的凸耳前緣 N1 與後緣 N2？變體注意：ISO 594-2 的 F = 0.20 mm 僅適用 Variant B/C，Variant A 舊版無此尺寸；F 的對應項為 Q (≤ 0.300)。',
    targetConnector: 'female-lock',
    completed: false,
    riskLevel: 'critical',
    isoClauseRef: 'ISO 80369-7 Table B.6 N1 & N2'
  },
  {
    id: 'chk-5',
    category: 'R&D CAD',
    title: '【凸耳根部直徑】ØJ 補上下限（Variant A 5.515 / Variant B·C 5.515–5.700）',
    detail:
      'ISO 594-2 的 G 為直徑管制（含「自端面 5.5 mm 內不得放大」條件），新版 ØJ 沿用同一上限與條件並新增下限，圖面動作為補標下限。另注意母鎖固的 ØJ 覆寫母滑套的 6.000–6.730 mm。',
    targetConnector: 'female-lock',
    completed: false,
    riskLevel: 'high',
    isoClauseRef: 'ISO 80369-7 Table B.5 / B.6 / B.7 ØJ'
  },
  {
    id: 'chk-6',
    category: 'R&D CAD',
    title: '【弦長標註】V / W 更名為 X / Y，圖面須保留',
    detail:
      '舊版弦長 V / W 於新版更名為 X / Y，數值與量測基準不變（X 量測於 Ø7.000 之弦；Variant A 為 ≤3.500、Variant B/C 為 ≤5.000；Variant A 另規定 Y ≥2.710 且 Y 不得大於 X）。Table B.6 對 X、Y 為強制 (normative) 項目，2D 圖面須保留此兩項標註。',
    targetConnector: 'female-lock',
    completed: false,
    riskLevel: 'critical',
    isoClauseRef: 'ISO 80369-7 Table B.6 X & Y'
  },
  {
    id: 'chk-7',
    category: 'R&D CAD',
    title: '【符號對映】全面更新為 ISO 80369-7 符號，並處理三組意義翻轉',
    detail:
      '對映表：H→Øh、J→Øj、2X→ØH、G→ØJ、S→M、V→X、W→Y、P→c、K→n、Q→m、T→t、F(594-1 母錐深度)→E。三組高風險翻轉：(1) Y 由「凸耳基底軸向寬 1.2」變為「凸耳頂端弦長 ≥2.710」；(2) P 由「公錐突出長度」變為「螺紋節距」；(3) Q 由「公螺紋牙頂寬」變為「凸耳根部距端面深度」。另注意 Variant B 使用不帶 Ø 的 H（對角），Variant A/C 使用 ØH（直徑）；Variant A 的 M 是最小值 ≥0.300，Variant B 的 M 是最大值 ≤0.270。',
    targetConnector: 'all',
    completed: false,
    riskLevel: 'high',
    isoClauseRef: 'ISO 80369-7 Annex B 符號慣例'
  },
  {
    id: 'chk-8',
    category: 'R&D CAD',
    title: '【旋轉套環】c 與 t 須註明量測姿態',
    detail:
      'Table B.4 註 a 明訂：浮動／旋轉套環版本的 c 與 t，須在「套環完全推向接頭前端」的位置下量測。圖面必須加註此姿態，否則不同量測姿勢會得到不同結果。舊版 ISO 594-2 未規範量測姿態。',
    targetConnector: 'male-lock-rotatable',
    completed: false,
    riskLevel: 'medium',
    isoClauseRef: 'ISO 80369-7 Table B.4 註 a'
  },
  {
    id: 'chk-9',
    category: 'QA/QC',
    title: '【檢驗依據】量規不再作為符合性驗證手段',
    detail:
      '圖面附註是否已將「以 ISO 594 鋼製量規檢驗」改為「依 ISO 80369-7 Annex B 尺寸量測」？依 Annex A Clause 5，舊式 Luer 量規因缺少防錯接相關表面而不得用於驗證符合性；惟製程品管自用的規具本身不在本標準範圍內，並非一律禁用。',
    targetConnector: 'all',
    completed: false,
    riskLevel: 'critical',
    isoClauseRef: 'ISO 80369-7 Annex A, Clause 5'
  },
  {
    id: 'chk-10',
    category: 'Mold & Tooling',
    title: '【成型收縮】半剛性母接頭開口內徑內控 ≥ 4.225 mm',
    detail:
      '對半剛性塑膠母接頭，評估射出成型收縮後 ØD 是否能維持在建議的 ≥ 4.225 mm。低於此值雖仍落在半剛性公差帶內，但依 Annex A 分析，錐面可能提前抵住而使螺紋咬合不足，導致連接強度等同滑套接頭。',
    targetConnector: 'female-slip',
    completed: false,
    riskLevel: 'high',
    isoClauseRef: 'ISO 80369-7 Table B.2 註 b'
  },
  {
    id: 'chk-11',
    category: 'QA/QC',
    title: '【測試 SOP】軸向拉拔改為區間值 (Lock 32–35 N / Slip 23–25 N)',
    detail:
      'SOP 需修改的是加載目標區間化與新增持壓時間上限 (10–15 秒)。舊版對照：鎖固型見 ISO 594-2 5.4.2（漸進加載至 35 N），滑套型見 ISO 594-1 5.4.2（25 N）—— 兩型式的舊版要求不同，查對時勿混用。',
    targetConnector: 'male-lock',
    completed: false,
    riskLevel: 'medium',
    isoClauseRef: 'ISO 80369-7 Clause 6.4 ↔ ISO 594-2 Clause 5.4.2'
  },
  {
    id: 'chk-12',
    category: 'QA/QC',
    title: '【測試 SOP】旋卸與過載扭矩的持壓區間',
    detail:
      '旋卸扭矩 0.018–0.020 N·m 沿用自 ISO 594-2 5.5.2；過載扭矩下限 0.15 N·m 沿用自 5.7，新版另加上限 0.17 N·m。SOP 需更新的是持壓區間：旋卸由「≥10 秒」改為 10–15 秒，過載由「5 秒」改為 5–10 秒。',
    targetConnector: 'male-lock',
    completed: false,
    riskLevel: 'low',
    isoClauseRef: 'ISO 80369-7 Clause 6.5 & 6.6 ↔ ISO 594-2 Clause 5.5 & 5.7'
  },
  {
    id: 'chk-13',
    category: 'QA/QC',
    title: '【已刪除項目】確認「易組裝性」風險改由何者覆蓋',
    detail:
      'ISO 594-2 4.5／5.6 的易組裝性要求（半剛性：≤20 N 軸向力＋≤0.08 N·m 扭矩即應良好配合）在 ISO 80369-7 中無對應條款。若內部 SOP 刪除此項，須於風險管理檔案說明改由 6.4 抗軸向分離與 Annex A 半剛性建議值涵蓋。',
    targetConnector: 'all',
    completed: false,
    riskLevel: 'medium',
    isoClauseRef: 'ISO 594-2 Clause 4.5（ISO 80369-7 無對應）'
  },
  {
    id: 'chk-14',
    category: 'RA Regulatory',
    title: '【法規宣示】DHF / STED / 510(k) 符合性聲明更新與 DV 報告整備',
    detail:
      '於法規文件與標籤宣告中，將符合性標準聲明由 ISO 594-1 / 594-2 更新為 ISO 80369-7:2021，並附上完整 DV 測試報告與依 ISO 80369-1 Annex B 之防錯接評估結果。',
    targetConnector: 'all',
    completed: false,
    riskLevel: 'high',
    isoClauseRef: 'ISO 80369-7 符合性聲明'
  }
];

const RISK_LABEL: Record<RiskLevel, string> = {
  critical: '關鍵',
  high: '高',
  medium: '中',
  low: '低'
};

const CATEGORY_ORDER: ChecklistItem['category'][] = [
  'R&D CAD',
  'QA/QC',
  'Mold & Tooling',
  'RA Regulatory'
];

const CATEGORY_TITLE: Record<ChecklistItem['category'], string> = {
  'R&D CAD': '一、 2D 圖面與 CAD 模型修訂 (Drawing & CAD Revision)',
  'QA/QC': '二、 品質檢驗與驗證 SOP 修正 (QA/QC Inspection & Verification)',
  'Mold & Tooling': '三、 模具與成型條件 (Mold & Tooling)',
  'RA Regulatory': '四、 法規文件更新 (Regulatory Affairs)'
};

/**
 * 依「實際勾選狀態」產生 ECO 文本。
 * 未勾選的項目不會出現在變更內容中，只會列入「尚未完成」清單，
 * 以維持工程變更單的可追溯性。
 */
export function generateEcoText(items: ChecklistItem[], docNumber = 'ECO-2026-LUER-001'): string {
  const dateStr = new Date().toISOString().slice(0, 10);
  const done = items.filter((i) => i.completed);
  const open = items.filter((i) => !i.completed);

  const lines: string[] = [
    '====================================================================',
    '【工程變更申請單 / ENGINEERING CHANGE ORDER (ECO)】',
    `ECO 編號: ${docNumber}`,
    `產生日期: ${dateStr}`,
    '變更主題: 魯爾接頭規範由 ISO 594-1 / 594-2 轉換至 ISO 80369-7:2021',
    '變更原因: 依 FDA / EU MDR 醫療器材法規要求，防止小孔徑接頭錯接 (Misconnection)',
    '====================================================================',
    ''
  ];

  if (done.length === 0) {
    lines.push(
      '⚠ 本變更單目前不含任何變更內容。',
      '  審查清單尚無勾選項目，請先於系統中完成查核並勾選，再重新產生 ECO。',
      ''
    );
  } else {
    lines.push(`【已完成之變更內容】共 ${done.length} 項`, '');
    let n = 0;
    CATEGORY_ORDER.forEach((cat) => {
      const group = done.filter((i) => i.category === cat);
      if (group.length === 0) return;
      lines.push(CATEGORY_TITLE[cat]);
      group.forEach((item) => {
        n += 1;
        lines.push(`  ${String(n).padStart(2, '0')}. ${item.title}`);
        lines.push(`      風險等級: ${RISK_LABEL[item.riskLevel]}　依據: ${item.isoClauseRef}`);
        lines.push(`      內容: ${item.detail}`);
      });
      lines.push('');
    });
  }

  if (open.length > 0) {
    lines.push('--------------------------------------------------------------------');
    lines.push(`【尚未完成之查核項目】共 ${open.length} 項 — 本 ECO 不涵蓋下列變更`);
    open.forEach((item) => {
      lines.push(`  ・[${RISK_LABEL[item.riskLevel]}] ${item.title}　(${item.isoClauseRef})`);
    });
    lines.push('');
    const openCritical = open.filter((i) => i.riskLevel === 'critical');
    if (openCritical.length > 0) {
      lines.push(
        `  ⚠ 其中 ${openCritical.length} 項為關鍵風險項目，未完成前不建議放行本次轉版。`,
        ''
      );
    }
  }

  lines.push('--------------------------------------------------------------------');
  lines.push(
    `審查進度: ${done.length} / ${items.length} 項 (${Math.round((done.length / Math.max(items.length, 1)) * 100)}%)`,
    '',
    '審查負責人 (Approved by): ___________________  (R&D Leader / QA Manager)',
    '核准日期 (Date): ___________________'
  );

  return lines.join('\n');
}
