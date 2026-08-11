export type ConnectorCategory = 'male-slip' | 'female-slip' | 'male-lock' | 'female-lock';

export type MaterialType = 'rigid' | 'semi-rigid';

export interface DimensionItem {
  id: string;
  featureName: string;
  featureNameEn: string;
  iso594Symbol?: string;
  iso80369Symbol: string;
  iso594Spec: string;
  iso80369SpecRigid: string;
  iso80369SpecSemiRigid?: string;
  changeType: 'same' | 'datum-shift' | 'new-feature' | 'method-change' | 'relaxed-auxiliary';
  changeTypeLabel: string;
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
  title: string;
  titleEn: string;
  description: string;
  standardRef: string;
  items: DimensionItem[];
}

export interface TestRequirementItem {
  id: string;
  testName: string;
  testNameEn: string;
  iso594Spec: string;
  iso80369Spec: string;
  keyDifference: string;
  severity: 'high' | 'medium' | 'critical';
  impactArea: 'QA/QC Lab' | 'R&D Verification' | 'Equipment Purchase' | 'Mold Design' | 'Mold & Tooling';
}

export interface ChecklistItem {
  id: string;
  category: 'R&D CAD' | 'QA/QC' | 'Mold & Tooling' | 'RA Regulatory';
  title: string;
  detail: string;
  targetConnector: ConnectorCategory | 'all';
  completed: boolean;
  riskLevel: 'critical' | 'high' | 'medium';
  isoClauseRef: string;
}

export interface CalculatorInput {
  category: ConnectorCategory;
  material: MaterialType;
  tipOD_d?: number; // Male Tip OD
  openID_D?: number; // Female Open ID
  throughBore_f?: number; // Male Bore
  firstThread_t?: number; // Male Lock Thread Start
  lugLeading_N1?: number; // Female Lock N1
  lugTrailing_N2?: number; // Female Lock N2
  lugRoot_J?: number; // Female Lock Lug Root OD
  lugMajor_H?: number; // Female Lock Major OD
  taperLength_e?: number; // Taper Length
  measuredAt075Offset: boolean; // Was measurement taken at 0.75mm offset?
}

export interface CalculationResult {
  paramId: string;
  paramName: string;
  measuredValue: number;
  measuredAtOffset: boolean;
  iso594Status: 'pass' | 'fail' | 'warning' | 'not-applicable';
  iso594Range: string;
  iso80369Status: 'pass' | 'fail' | 'warning' | 'not-applicable';
  iso80369Range: string;
  datumShiftApplied: boolean;
  advice: string;
}
