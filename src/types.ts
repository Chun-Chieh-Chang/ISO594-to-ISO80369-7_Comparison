/**
 * 接頭分類 — 與 ISO 80369-7:2021 Clause 5 所列之八組 Figure/Table 一對一對應。
 * 變更此聯集時，DIMENSIONS_DATA 必須同步維持 8 筆，否則視為涵蓋率缺口。
 */
export type ConnectorCategory =
  | 'male-slip'            // Figure B.1 / Table B.1
  | 'female-slip'          // Figure B.2 / Table B.2
  | 'male-lock'            // Figure B.3 / Table B.3 — 固定套環
  | 'male-lock-rotatable'  // Figure B.4 / Table B.4 — 旋轉/浮動套環
  | 'female-lock-thread'   // Figure B.5 / Table B.5 — 斜螺紋（非凸耳）
  | 'female-lock'          // Figure B.6 / Table B.6 — 直角凸耳 Variant A
  | 'female-lock-b'        // Figure B.7 / Table B.7 — 直角凸耳 Variant B
  | 'female-lock-c';       // Figure B.8 / Table B.8 — 直角凸耳 Variant C

export type MaterialType = 'rigid' | 'semi-rigid';

/**
 * 變更分類 — 以「2D 圖面必須採取的動作」為分類軸，故窮盡且互斥。
 * 符號更名本身不構成一個類別（符號欄已承載該資訊），避免與其他類別重疊。
 */
export type ChangeType =
  | 'identical'    // 無須動作：幾何與公差相同（符號可能不同）
  | 'datum-shift'  // 移動標註基準面
  | 'limit-added'  // 為既有項目補上新的上限或下限
  | 'new-feature'  // 新增標註：舊版完全無此管制項
  | 'downgraded'   // 改為括號輔助尺寸／放寬
  | 'removed';     // 自圖面移除：舊版有、新版無對應

export interface ChangeTypeMeta {
  id: ChangeType;
  /** 篩選器與徽章共用的標籤，確保兩處不會漂移 */
  label: string;
  /** 篩選下拉選項全名 */
  optionLabel: string;
  /** 圖面動作的一句話說明 */
  action: string;
}

export const CHANGE_TYPE_META: ChangeTypeMeta[] = [
  { id: 'identical',   label: '無須動作',   optionLabel: '無須動作 (IDENTICAL)',      action: '幾何與公差相同；若符號有變更，僅需更新標註文字。' },
  { id: 'datum-shift', label: '基準面位移', optionLabel: '基準面位移 (DATUM SHIFT)',  action: '尺寸線引出位置必須移動，數值隨錐度換算。' },
  { id: 'limit-added', label: '補上限值',   optionLabel: '補上限值 (LIMIT ADDED)',    action: '既有項目新增上限或下限，需補標公差。' },
  { id: 'new-feature', label: '新增標註',   optionLabel: '新增標註 (NEW FEATURE)',    action: '舊版無此管制項，圖面必須新增。' },
  { id: 'downgraded',  label: '降階輔助',   optionLabel: '降階輔助 (DOWNGRADED)',     action: '改以括號標示為輔助尺寸，功能性改由測試驗證。' },
  { id: 'removed',     label: '自圖面移除', optionLabel: '自圖面移除 (REMOVED)',      action: '新版無對應項目，應自圖面移除或轉為內部參考。' }
];

export interface DimensionItem {
  id: string;
  featureName: string;
  featureNameEn: string;
  iso594Symbol?: string;
  iso80369Symbol: string;
  iso594Spec: string;
  iso80369SpecRigid: string;
  iso80369SpecSemiRigid?: string;
  changeType: ChangeType;
  /** 該項目專屬的補充說明；泛用的動作描述來自 CHANGE_TYPE_META */
  changeTypeNote?: string;
  datumShiftNote?: string;
  engineeringExplanation: string;
  numericLimits?: {
    iso594Min?: number;
    iso594Max?: number;
    iso80369RigidMin?: number;
    iso80369RigidMax?: number;
    iso80369SemiRigidMin?: number;
    iso80369SemiRigidMax?: number;
    unit?: string;
    isAuxiliary?: boolean;
    isUpperLimitOnly?: boolean;
    isLowerLimitOnly?: boolean;
  };
}

export interface ConnectorCategoryData {
  id: ConnectorCategory;
  /** 分頁按鈕上的短標籤 */
  tabLabel: string;
  title: string;
  titleEn: string;
  description: string;
  standardRef: string;
  /** 依 Annex B 之繼承條款：本表另適用於此分類的全部尺寸（除本表覆寫者外） */
  inheritsFrom?: ConnectorCategory;
  /** 僅適用於剛性材料之變體（Table B.7 / B.8） */
  rigidOnly?: boolean;
  items: DimensionItem[];
}

export type TestSeverity = 'critical' | 'high' | 'medium' | 'low';
export type ImpactArea = 'QA/QC Lab' | 'R&D Verification' | 'Equipment Purchase' | 'Mold & Tooling';

export interface TestRequirementItem {
  id: string;
  testName: string;
  testNameEn: string;
  iso594Spec: string;
  iso80369Spec: string;
  keyDifference: string;
  severity: TestSeverity;
  impactArea: ImpactArea;
}

export type ChecklistCategory = 'R&D CAD' | 'QA/QC' | 'Mold & Tooling' | 'RA Regulatory';
export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';

export interface ChecklistItem {
  id: string;
  category: ChecklistCategory;
  title: string;
  detail: string;
  targetConnector: ConnectorCategory | 'all';
  completed: boolean;
  riskLevel: RiskLevel;
  isoClauseRef: string;
}

export interface CalculatorInput {
  category: ConnectorCategory;
  material: MaterialType;
  tipOD_d?: number;       // 公錐前端外徑 Ød
  openID_D?: number;      // 母錐開口內徑 ØD
  throughBore_f?: number; // 公錐前端內孔 Øf
  firstThread_t?: number; // 公鎖固第一圈螺紋起點 t
  lugLeading_N1?: number; // 母鎖固凸耳前緣 N1
  lugTrailing_N2?: number;// 母鎖固凸耳後緣 N2
  lugRoot_J?: number;     // 母鎖固凸耳根部直徑 ØJ
  lugMajor_H?: number;    // 母鎖固凸耳大徑 ØH
  taperLength_e?: number; // 錐體長度 e / 母錐深度 E
  /** 量測值是否取自 ISO 80369-7 規範的 0.750 mm 剖面 */
  measuredAt075Offset: boolean;
}

export type ComplianceStatus = 'pass' | 'fail' | 'warning' | 'not-applicable';

export interface CalculationResult {
  paramId: string;
  paramName: string;
  measuredValue: number;
  measuredAtOffset: boolean;
  /** 換算至 ISO 594 基準（公錐端面／母錐端面）後的值；無基準差異時等於實測值 */
  valueAt594Datum: number;
  /** 換算至 ISO 80369-7 基準（0.750 mm 剖面）後的值；無基準差異時等於實測值 */
  valueAt80369Datum: number;
  /** 本項目是否涉及基準面位移換算 */
  datumShiftApplied: boolean;
  iso594Status: ComplianceStatus;
  iso594Range: string;
  iso80369Status: ComplianceStatus;
  iso80369Range: string;
  advice: string;
}
