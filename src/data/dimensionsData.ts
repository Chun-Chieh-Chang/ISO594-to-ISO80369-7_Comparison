import { ConnectorCategoryData, TestRequirementItem } from '../types';

/**
 * 資料來源 (SSOT)：
 *   ISO 594-1:1986  Table、Clause 4/5、Annex
 *   ISO 594-2:1998  Table 1、Figures 1-4、Clause 4/5
 *   ISO 80369-7:2021 Annex B (Table B.1 - B.8)、Clause 6、Annex A
 *
 * 本陣列必須維持 8 筆，與 ISO 80369-7 Clause 5 所列之八組 Figure/Table 一對一對應。
 * 數值以標準原文為準；標準原文使用逗號小數點，此處統一改為點號以利程式比對。
 */
export const DIMENSIONS_DATA: ConnectorCategoryData[] = [
  // ────────────────────────────────────────────────────────── Table B.1
  {
    id: 'male-slip',
    tabLabel: '公滑套 B.1',
    title: '公滑套接頭 (Male Luer Slip)',
    titleEn: 'Male Luer Slip Connector',
    description: '無螺紋鎖固之圓錐形公接頭（如一次性注射器前端、針頭座公端）。核心關注點為 0.750 mm 測量基準位移及 2.900 mm 內孔上限。',
    standardRef: 'ISO 594-1 Clause 3 + Table vs. ISO 80369-7 Table B.1',
    items: [
      {
        id: 'ms-taper-angle',
        featureName: '錐度角 (Taper Angle)',
        featureNameEn: 'Taper Angle',
        iso594Symbol: '6% Taper',
        iso80369Symbol: 'α',
        iso594Spec: '6% 圓錐 (0.06:1)，無標註公差',
        iso80369SpecRigid: '(3.44°) 輔助尺寸／參考值',
        iso80369SpecSemiRigid: '(3.44°) 輔助尺寸／參考值',
        changeType: 'identical',
        engineeringExplanation: '幾何維度保持 6% 錐度。新版以括號標註為輔助尺寸，實際由兩點剖面直徑 (Ød 與 Øg) 共同約束錐度形狀。',
        numericLimits: { iso594Min: 3.44, iso594Max: 3.44, iso80369RigidMin: 3.44, iso80369RigidMax: 3.44, unit: '°', isAuxiliary: true }
      },
      {
        id: 'ms-tip-od',
        featureName: '公錐體前端外徑 (Tip Outer Diameter)',
        featureNameEn: 'Tip Outer Diameter',
        iso594Symbol: 'd',
        iso80369Symbol: 'Ød',
        iso594Spec: '量測於端面：剛性 3.925 - 3.990 mm／半剛性 3.925 - 4.027 mm',
        iso80369SpecRigid: '3.970 - 4.035 mm (距前端 0.750 mm 剖面處)',
        iso80369SpecSemiRigid: '3.970 - 4.072 mm (距前端 0.750 mm 剖面處)',
        changeType: 'datum-shift',
        datumShiftNote: '量測剖面由端面退後 0.750 mm，因 6% 錐度使公差帶數值增加 +0.045 mm (0.750 × 0.06 = 0.045)。',
        engineeringExplanation: '為避免射出成型端面毛邊或倒角影響光學量測，ISO 80369-7 將剖面後移 0.750 mm。CAD 實體幾何未改變，但 2D 圖面必須更新剖面標註線及數值。',
        numericLimits: { iso594Min: 3.925, iso594Max: 3.990, iso80369RigidMin: 3.970, iso80369RigidMax: 4.035, iso80369SemiRigidMin: 3.970, iso80369SemiRigidMax: 4.072, unit: 'mm' }
      },
      {
        id: 'ms-through-bore',
        featureName: '前端內孔直徑 (Through Bore)',
        featureNameEn: 'Through Bore Diameter',
        iso594Symbol: '無管制',
        iso80369Symbol: 'Øf',
        iso594Spec: '未對前端內孔設定限值',
        iso80369SpecRigid: '≤ 2.900 mm (未定義下限)',
        iso80369SpecSemiRigid: '≤ 2.900 mm (未定義下限)',
        changeType: 'new-feature',
        changeTypeNote: '防錯接核心管制項',
        engineeringExplanation: '防錯接的核心技術點。若內孔大於 2.900 mm，極易與神經軸 (ISO 80369-6) 等小孔徑公接頭誤接。依 Annex A，委員會評估「開至理論銳邊 3.50 mm 所增加的流量」不足以抵銷誤接風險；下限則刻意不定義，以容納玻璃針筒的極小內孔。高流量注射器或針頭若過往開到 3.0 mm，轉版時必須修模縮小。',
        numericLimits: { iso80369RigidMax: 2.900, iso80369SemiRigidMax: 2.900, unit: 'mm', isUpperLimitOnly: true }
      },
      {
        id: 'ms-taper-length',
        featureName: '公錐體有效長度 (Male Taper Length)',
        featureNameEn: 'Male Taper Length',
        iso594Symbol: 'E',
        iso80369Symbol: 'e',
        iso594Spec: '≥ 7.500 mm (僅規範最小值)',
        iso80369SpecRigid: '7.500 - 10.500 mm',
        iso80369SpecSemiRigid: '7.500 - 10.500 mm',
        changeType: 'limit-added',
        changeTypeNote: '新增上限 10.500 mm',
        engineeringExplanation: '舊版僅限制最小長度，新版增加 10.500 mm 上限以防止公錐過長插入母接頭深處造成機械干涉。此尺寸同時定義接頭的延伸範圍 (extent of the connector)。圖面需補上上限公差。',
        numericLimits: { iso594Min: 7.500, iso80369RigidMin: 7.500, iso80369RigidMax: 10.500, unit: 'mm' }
      },
      {
        id: 'ms-base-od',
        featureName: '公錐體大端外徑 (Base Outer Diameter)',
        featureNameEn: 'Base Outer Diameter',
        iso594Symbol: '無管制',
        iso80369Symbol: 'Øg',
        iso594Spec: '無單獨標註',
        iso80369SpecRigid: '4.375 - 4.440 mm (距前端 7.500 mm 處)',
        iso80369SpecSemiRigid: '4.375 - 4.477 mm (距前端 7.500 mm 處)',
        changeType: 'new-feature',
        engineeringExplanation: '在距前端 7.500 mm 處定義第二個控制直徑，與前端 Ød 共同驗證 7.500 mm 範圍內的實際錐角。交叉驗證：兩剖面相距 6.75 mm，6.75 × 0.06 = 0.405 mm，恰為 Øg 與 Ød 各限值之差。',
        numericLimits: { iso80369RigidMin: 4.375, iso80369RigidMax: 4.440, iso80369SemiRigidMin: 4.375, iso80369SemiRigidMax: 4.477, unit: 'mm' }
      },
      {
        id: 'ms-tip-radius',
        featureName: '前端倒角半徑 (Tip Radius / Chamfer)',
        featureNameEn: 'Tip Radius / Chamfer',
        iso594Symbol: 'R 0.5 max',
        iso80369Symbol: 'r',
        iso594Spec: '圖示 R 0.5 mm 最大值（或等效入口倒角，不得有銳角）',
        iso80369SpecRigid: '0.000 - 0.500 mm',
        iso80369SpecSemiRigid: '0.000 - 0.500 mm',
        changeType: 'identical',
        changeTypeNote: '僅補上 0.000 之名目下限',
        engineeringExplanation: '將舊版圖示說明轉為標準公差帶。0.000 mm 下限不構成實質約束，實務上仍是「不得大於 0.500 mm」，以確保頂端倒角不影響 0.750 mm 剖面直徑之量測。',
        numericLimits: { iso594Max: 0.5, iso80369RigidMin: 0.0, iso80369RigidMax: 0.5, unit: 'mm' }
      },
      {
        id: 'ms-engagement-length',
        featureName: '嚙合長度及其公差 (Length of Engagement)',
        featureNameEn: 'Length of Engagement & Tolerances',
        iso594Symbol: 'L / M / N',
        iso80369Symbol: '—',
        iso594Spec: 'L 最小嚙合長度：剛性 4.665 mm／半剛性 4.050 mm；M (母錐公差) 0.750 mm；N (公錐公差) 剛性 1.083 mm／半剛性 1.700 mm',
        iso80369SpecRigid: '無對應項目',
        iso80369SpecSemiRigid: '無對應項目',
        changeType: 'removed',
        engineeringExplanation: '此為組立層級尺寸（見 ISO 594-1 Figure 2 之典型組立圖），標準原文註明係由基本尺寸推導而得。ISO 80369-7 未收錄任何對應項，嚙合深度改由 Ød／ØD 與 Øg／ØG 兩組剖面直徑，以及 6.4 抗軸向分離測試共同約束。附帶一提：舊版 M = 0.750 mm 是母錐 0.045 mm 直徑公差的軸向等效值 (0.045 ÷ 0.06)，與新版的 0.750 mm 基準位移量僅為數值巧合，兩者意義完全不同，勿混用。',
        numericLimits: { iso594Min: 4.050, iso594Max: 4.665, unit: 'mm' }
      }
    ]
  },

  // ────────────────────────────────────────────────────────── Table B.2
  {
    id: 'female-slip',
    tabLabel: '母滑套 B.2',
    title: '母滑套接頭 (Female Luer Slip)',
    titleEn: 'Female Luer Slip Connector',
    description: '無螺紋鎖固之圓錐形母接頭（如針頭座母端、靜脈輸液管路母口）。核心關注點為內徑基準內縮 0.750 mm，以及半剛性材料的建議最小值。本表所有尺寸依繼承條款同時適用於 Table B.5 - B.8 之母鎖固接頭。',
    standardRef: 'ISO 594-1 Clause 3 + Table vs. ISO 80369-7 Table B.2',
    items: [
      {
        id: 'fs-taper-angle',
        featureName: '錐度角 (Taper Angle)',
        featureNameEn: 'Taper Angle',
        iso594Symbol: '6% Taper',
        iso80369Symbol: 'α',
        iso594Spec: '6% 圓錐 (0.06:1)，無標註公差',
        iso80369SpecRigid: '(3.44°) 輔助尺寸／參考值',
        iso80369SpecSemiRigid: '(3.44°) 輔助尺寸／參考值',
        changeType: 'identical',
        engineeringExplanation: '母錐內腔錐度，與公錐同為 6%。以括號標示為輔助尺寸，實際由 ØD 與 ØG 兩剖面直徑約束。',
        numericLimits: { iso594Min: 3.44, iso594Max: 3.44, iso80369RigidMin: 3.44, iso80369RigidMax: 3.44, unit: '°', isAuxiliary: true }
      },
      {
        id: 'fs-opening-id',
        featureName: '母錐開口內徑 (Opening Inner Diameter)',
        featureNameEn: 'Opening Inner Diameter',
        iso594Symbol: 'D',
        iso80369Symbol: 'ØD',
        iso594Spec: '量測於開口端面：剛性／半剛性同為 4.270 - 4.315 mm',
        iso80369SpecRigid: '4.225 - 4.270 mm (距開口內縮 0.750 mm 剖面處)',
        iso80369SpecSemiRigid: '4.198 - 4.298 mm (建議最小 4.225 mm)',
        changeType: 'datum-shift',
        datumShiftNote: '量測剖面自開口端面往內移動 0.750 mm，因 6% 錐度使公差帶數值減少 −0.045 mm (0.750 × 0.06 = 0.045)。',
        engineeringExplanation: '剛性材料的新公差帶恰為舊版下移 0.045 mm。半剛性材料則另給較寬的 4.198 - 4.298 mm，但 Table B.2 註 b 建議仍維持 ≥ 4.225 mm，以確保與所有公鎖固接頭的螺紋能確實咬合（Annex A 指出開口過小會使公錐提前抵住，螺紋來不及咬合）。',
        numericLimits: { iso594Min: 4.270, iso594Max: 4.315, iso80369RigidMin: 4.225, iso80369RigidMax: 4.270, iso80369SemiRigidMin: 4.198, iso80369SemiRigidMax: 4.298, unit: 'mm' }
      },
      {
        id: 'fs-taper-depth',
        featureName: '母錐體有效深度 (Female Taper Depth)',
        featureNameEn: 'Female Taper Depth',
        iso594Symbol: 'F',
        iso80369Symbol: 'E',
        iso594Spec: '≥ 7.500 mm (僅規範最小值)',
        iso80369SpecRigid: '7.500 - 10.500 mm',
        iso80369SpecSemiRigid: '7.500 - 10.500 mm',
        changeType: 'limit-added',
        changeTypeNote: '新增上限 10.500 mm；符號 F → E',
        engineeringExplanation: '舊版符號 F 在新版改為大寫 E，並新增 10.500 mm 上限。注意 ISO 594-2 亦使用 E 表示「公鎖固接頭最小長度」，兩版之間 E 的所指不同，圖面轉換時須確認對象。',
        numericLimits: { iso594Min: 7.500, iso80369RigidMin: 7.500, iso80369RigidMax: 10.500, unit: 'mm' }
      },
      {
        id: 'fs-base-id',
        featureName: '母錐體底部內徑 (Base Inner Diameter)',
        featureNameEn: 'Base Inner Diameter',
        iso594Symbol: '無管制',
        iso80369Symbol: 'ØG',
        iso594Spec: '無單獨標註',
        iso80369SpecRigid: '3.820 - 3.865 mm (距開口 7.500 mm 深處)',
        iso80369SpecSemiRigid: '3.793 - 3.893 mm (建議最小 3.820 mm)',
        changeType: 'new-feature',
        engineeringExplanation: '距開口 7.500 mm 深處的第二控制直徑，確保內錐腔體的實際錐角。交叉驗證：與 ØD 剖面相距 6.75 mm，6.75 × 0.06 = 0.405 mm，恰為兩者各限值之差。半剛性同樣建議維持 ≥ 3.820 mm。',
        numericLimits: { iso80369RigidMin: 3.820, iso80369RigidMax: 3.865, iso80369SemiRigidMin: 3.793, iso80369SemiRigidMax: 3.893, unit: 'mm' }
      },
      {
        id: 'fs-body-od',
        featureName: '本體包絡外徑 (Body Envelope OD)',
        featureNameEn: 'Body Envelope Outer Diameter',
        iso594Symbol: '無管制',
        iso80369Symbol: 'ØJ',
        iso594Spec: '無明確限制（ISO 594-2 的 G 僅適用於鎖固接頭）',
        iso80369SpecRigid: '6.000 - 6.730 mm',
        iso80369SpecSemiRigid: '6.000 - 6.730 mm',
        changeType: 'new-feature',
        engineeringExplanation: 'ØJ 定義為「能包覆接頭所有外部特徵的最小圓柱直徑」，且自端面起 5.5 mm 內不得超過上限。除防範母接頭外部肋條或壁厚過大而無法插入公鎖固接頭的內螺紋套環外，此包絡直徑同時是防錯接 (non-interconnectable) 的關鍵特徵。注意：母鎖固接頭的 ØJ 由 Table B.5 - B.8 覆寫為 5.515 - 6.730 mm（Variant B/C 為 5.515 - 5.700 mm）。',
        numericLimits: { iso80369RigidMin: 6.000, iso80369RigidMax: 6.730, unit: 'mm' }
      },
      {
        id: 'fs-entry-radius',
        featureName: '母錐入口倒角半徑 (Entry Radius / Chamfer)',
        featureNameEn: 'Entry Radius / Chamfer',
        iso594Symbol: 'R 0.5 max',
        iso80369Symbol: 'R',
        iso594Spec: '圖示 R 0.5 mm 最大值（或等效入口倒角，不得有銳角）',
        iso80369SpecRigid: '≤ 0.500 mm',
        iso80369SpecSemiRigid: '≤ 0.500 mm',
        changeType: 'identical',
        engineeringExplanation: '母錐入口的導引倒角。數值與舊版相同，但須注意此倒角不得侵入距開口 0.750 mm 的 ØD 量測剖面，否則量測值失效。',
        numericLimits: { iso594Max: 0.5, iso80369RigidMax: 0.5, unit: 'mm', isUpperLimitOnly: true }
      }
    ]
  },

  // ────────────────────────────────────────────────────────── Table B.3
  {
    id: 'male-lock',
    tabLabel: '公鎖固 B.3',
    title: '公鎖固接頭 · 固定套環 (Male Luer Lock, Fixed Collar)',
    titleEn: 'Male Luer Lock Connector with Fixed Collar',
    description: '帶有永久連接之內螺紋套環的公接頭。除本表項目外，另完整適用公滑套接頭 (Table B.1) 之全部圓錐體尺寸。',
    standardRef: 'ISO 594-2 Table 1 + Fig. 1 vs. ISO 80369-7 Table B.3',
    inheritsFrom: 'male-slip',
    items: [
      {
        id: 'ml-taper-length',
        featureName: '公錐體有效長度 (Male Taper Length)',
        featureNameEn: 'Male Taper Length',
        iso594Symbol: 'E',
        iso80369Symbol: 'e',
        iso594Spec: '≥ 7.500 mm（ISO 594-2「公鎖固接頭最小長度」）',
        iso80369SpecRigid: '7.500 - 10.500 mm',
        iso80369SpecSemiRigid: '7.500 - 10.500 mm',
        changeType: 'limit-added',
        changeTypeNote: '新增上限 10.500 mm',
        engineeringExplanation: 'Table B.3 重申此尺寸，並註明「螺紋長度不予規範，但須為母接頭螺紋預留讓位空間」。此尺寸同時定義接頭的延伸範圍。',
        numericLimits: { iso594Min: 7.500, iso80369RigidMin: 7.500, iso80369RigidMax: 10.500, unit: 'mm' }
      },
      {
        id: 'ml-bearing-angle',
        featureName: '螺紋受力面角度 (Bearing Surface Angle)',
        featureNameEn: 'Thread Bearing Surface Angle',
        iso594Symbol: 'α',
        iso80369Symbol: 'σ',
        iso594Spec: '25° (+5° / −0°)，即 25° - 30°',
        iso80369SpecRigid: '25.0° - 30.0°',
        iso80369SpecSemiRigid: '25.0° - 30.0°',
        changeType: 'identical',
        changeTypeNote: '符號 α → σ (小寫 sigma)',
        engineeringExplanation: '螺紋抗分離受力面相對於垂直軸線平面的傾角。範圍完全相同。Table B.3 註明螺紋輪廓 (σ、β、m) 之設計得與標示值不同，只要滿足 Clause 6 之效能要求，且此三者與防錯接特性無關。',
        numericLimits: { iso594Min: 25.0, iso594Max: 30.0, iso80369RigidMin: 25.0, iso80369RigidMax: 30.0, unit: '°' }
      },
      {
        id: 'ml-nonbearing-angle',
        featureName: '螺紋非受力面角度 (Non-bearing Surface Angle)',
        featureNameEn: 'Thread Non-bearing Surface Angle',
        iso594Symbol: 'β',
        iso80369Symbol: 'β',
        iso594Spec: '≥ 25°（內螺紋非受力面最小角度）',
        iso80369SpecRigid: '≥ 25.0°',
        iso80369SpecSemiRigid: '≥ 25.0°',
        changeType: 'identical',
        engineeringExplanation: '螺紋背面非承載面角度，維持下限 ≥ 25.0°。注意母接頭側的對應符號為大寫 Β 且下限為 0.0°，兩者不可互換。',
        numericLimits: { iso594Min: 25.0, iso80369RigidMin: 25.0, unit: '°', isLowerLimitOnly: true }
      },
      {
        id: 'ml-tip-projection',
        featureName: '公錐前端突出套環長度 (Tip Projection)',
        featureNameEn: 'Tip Projection Beyond Collar',
        iso594Symbol: 'P',
        iso80369Symbol: 'c',
        iso594Spec: '≥ 2.1 mm',
        iso80369SpecRigid: '≥ 2.100 mm',
        iso80369SpecSemiRigid: '≥ 2.100 mm',
        changeType: 'identical',
        changeTypeNote: '符號 P → c',
        engineeringExplanation: '圓錐前端突出於螺紋套環開口平面的距離。數值不變，符號由大寫 P 改為小寫 c。',
        numericLimits: { iso594Min: 2.1, iso80369RigidMin: 2.100, unit: 'mm', isLowerLimitOnly: true }
      },
      {
        id: 'ml-thread-major-id',
        featureName: '螺紋大徑／根部直徑 (Thread Major ID)',
        featureNameEn: 'Major Inside Thread Diameter',
        iso594Symbol: 'H',
        iso80369Symbol: 'Øh',
        iso594Spec: '8.0 ± 0.1 mm (7.900 - 8.100 mm)',
        iso80369SpecRigid: '7.900 - 8.100 mm',
        iso80369SpecSemiRigid: '7.900 - 8.100 mm',
        changeType: 'identical',
        changeTypeNote: '符號 H → Øh',
        engineeringExplanation: '套環內螺紋根部大徑。公差絕對數值相同，僅改為直徑符號標示。注意母接頭側的 ØH 是「凸耳大徑」，與此為不同特徵。',
        numericLimits: { iso594Min: 7.9, iso594Max: 8.1, iso80369RigidMin: 7.900, iso80369RigidMax: 8.100, unit: 'mm' }
      },
      {
        id: 'ml-thread-minor-id',
        featureName: '螺紋小徑／牙頂直徑 (Thread Minor ID)',
        featureNameEn: 'Minor Inside Thread Diameter',
        iso594Symbol: 'J',
        iso80369Symbol: 'Øj',
        iso594Spec: '7.0 ± 0.2 mm (6.800 - 7.200 mm)',
        iso80369SpecRigid: '6.800 - 7.200 mm',
        iso80369SpecSemiRigid: '6.800 - 7.200 mm',
        changeType: 'identical',
        changeTypeNote: '符號 J → Øj',
        engineeringExplanation: '套環內螺紋牙頂小徑。公差完全相同。舊版 J 的最小值 7.0 mm 同時是 V 弦長的量測基準圓直徑，新版改以固定值 7.000 mm 明寫於 X 的定義中。',
        numericLimits: { iso594Min: 6.8, iso594Max: 7.2, iso80369RigidMin: 6.800, iso80369RigidMax: 7.200, unit: 'mm' }
      },
      {
        id: 'ml-thread-crest-width',
        featureName: '螺紋牙頂寬度 (Thread Crest Width)',
        featureNameEn: 'Width of Thread Profile at Crest',
        iso594Symbol: 'Q',
        iso80369Symbol: 'm',
        iso594Spec: '≥ 0.3 mm',
        iso80369SpecRigid: '≥ 0.300 mm',
        iso80369SpecSemiRigid: '≥ 0.300 mm',
        changeType: 'identical',
        changeTypeNote: '符號 Q → m',
        engineeringExplanation: '公鎖固接頭內螺紋牙頂的最小寬度。數值不變。注意舊版 Q 與新版母接頭側的 Q（凸耳根部距端面深度）為完全不同的特徵，圖面轉換時極易誤植。',
        numericLimits: { iso594Min: 0.3, iso80369RigidMin: 0.300, unit: 'mm', isLowerLimitOnly: true }
      },
      {
        id: 'ml-thread-root-width',
        featureName: '螺紋根部寬度 (Thread Root Width)',
        featureNameEn: 'Width of Thread Profile at Root',
        iso594Symbol: 'K',
        iso80369Symbol: 'n',
        iso594Spec: '≤ 1 mm',
        iso80369SpecRigid: '≤ 1.000 mm',
        iso80369SpecSemiRigid: '≤ 1.000 mm',
        changeType: 'identical',
        changeTypeNote: '符號 K → n',
        engineeringExplanation: '公鎖固接頭內螺紋根部的最大寬度。數值不變，僅符號更新。',
        numericLimits: { iso594Max: 1.0, iso80369RigidMax: 1.000, unit: 'mm', isUpperLimitOnly: true }
      },
      {
        id: 'ml-thread-pitch',
        featureName: '螺紋節距 (Thread Pitch)',
        featureNameEn: 'Nominal Thread Pitch',
        iso594Symbol: 'Pitch',
        iso80369Symbol: 'p',
        iso594Spec: '2.5 mm（雙線右旋，導程 5 mm）',
        iso80369SpecRigid: '(2.500) mm 輔助尺寸（雙線右旋，導程 5 mm）',
        iso80369SpecSemiRigid: '(2.500) mm 輔助尺寸',
        changeType: 'downgraded',
        changeTypeNote: '改以括號標示為輔助尺寸',
        engineeringExplanation: '雙線右旋螺紋節距。數值不變，但新版標示為輔助尺寸。Table B.3 說明螺紋輪廓不影響防錯接特性，實際咬合由 Øh／Øj 與 6.4 - 6.6 之功能性測試驗證。',
        numericLimits: { iso594Min: 2.5, iso594Max: 2.5, iso80369RigidMin: 2.5, iso80369RigidMax: 2.5, unit: 'mm', isAuxiliary: true }
      },
      {
        id: 'ml-first-thread-dist',
        featureName: '至第一圈完整螺紋距離 (Distance to 1st Thread)',
        featureNameEn: 'Distance to First Complete Thread',
        iso594Symbol: 'T',
        iso80369Symbol: 't',
        iso594Spec: '≤ 3.2 mm（強制管制，超差判退）',
        iso80369SpecRigid: '(3.200) mm max — 輔助尺寸',
        iso80369SpecSemiRigid: '(3.650) mm max — 輔助尺寸［建議仍維持 3.200］',
        changeType: 'downgraded',
        changeTypeNote: '由強制降為輔助尺寸；半剛性上限放寬至 3.650',
        engineeringExplanation: 'Table B.3 NOTE 2 說明此尺寸對有效鎖固至關重要，但極難量測，故降為輔助尺寸，功能性合規改由 6.4 抗軸向分離測試驗證。Annex A 指出市面上許多半剛性公鎖固接頭未達 3.200 mm 而未見實際問題，故予放寬；註 c 仍建議半剛性維持 3.200 mm 以確保與所有母鎖固接頭咬合。',
        numericLimits: { iso594Max: 3.2, iso80369RigidMax: 3.200, iso80369SemiRigidMax: 3.650, unit: 'mm', isAuxiliary: true, isUpperLimitOnly: true }
      },
      {
        id: 'ml-collar-od',
        featureName: '螺紋套環外部包絡直徑 (Collar Envelope OD)',
        featureNameEn: 'Collar Envelope Outer Diameter',
        iso594Symbol: '無管制',
        iso80369Symbol: 'Øw',
        iso594Spec: '無明確限制',
        iso80369SpecRigid: '8.800 - 11.500 mm',
        iso80369SpecSemiRigid: '8.800 - 11.500 mm',
        changeType: 'new-feature',
        engineeringExplanation: '能包覆套環所有外部特徵的最小圓柱直徑。註 b 規定：此範圍須自套環開口端維持至少 1 mm；超過 1 mm 後直徑可小於下限；上限則須維持至少 e 的長度。此尺寸得由接頭本身或搭載該接頭的醫材達成，亦可改以 ISO 80369-1 Annex B 之防錯接測試證明。',
        numericLimits: { iso80369RigidMin: 8.800, iso80369RigidMax: 11.500, unit: 'mm' }
      }
    ]
  },

  // ────────────────────────────────────────────────────────── Table B.4
  {
    id: 'male-lock-rotatable',
    tabLabel: '公鎖固·旋轉 B.4',
    title: '公鎖固接頭 · 旋轉套環 (Male Luer Lock, Rotatable Collar)',
    titleEn: 'Male Luer Lock Connector with Rotatable Collar',
    description: '螺紋套環可相對本體旋轉或浮動的公鎖固接頭。除本表三項外，其餘尺寸與公差完全比照固定套環版本 (Table B.3)，而 Table B.3 又繼承公滑套 (Table B.1)。',
    standardRef: 'ISO 594-2 Table 1 + Fig. 2 vs. ISO 80369-7 Table B.4',
    inheritsFrom: 'male-lock',
    items: [
      {
        id: 'mlr-tip-projection',
        featureName: '公錐前端突出套環長度 (Tip Projection)',
        featureNameEn: 'Tip Projection Beyond Collar',
        iso594Symbol: 'P',
        iso80369Symbol: 'c',
        iso594Spec: '≥ 2.1 mm',
        iso80369SpecRigid: '≥ 2.100 mm（量測時套環須完全推向接頭前端）',
        iso80369SpecSemiRigid: '≥ 2.100 mm（量測時套環須完全推向接頭前端）',
        changeType: 'limit-added',
        changeTypeNote: '新增量測姿態條件',
        engineeringExplanation: '數值與固定套環版本相同，但註 a 明訂：此尺寸係在浮動／旋轉套環「完全推向接頭前端」的位置下量測。舊版未規範量測姿態，是浮動套環設計最容易被忽略的驗收條件——圖面必須加註此姿態，否則不同量測姿勢會得到不同結果。',
        numericLimits: { iso594Min: 2.1, iso80369RigidMin: 2.100, unit: 'mm', isLowerLimitOnly: true }
      },
      {
        id: 'mlr-taper-length',
        featureName: '公錐體有效長度 (Male Taper Length)',
        featureNameEn: 'Male Taper Length',
        iso594Symbol: 'E',
        iso80369Symbol: 'e',
        iso594Spec: '≥ 7.500 mm',
        iso80369SpecRigid: '7.500 - 10.500 mm',
        iso80369SpecSemiRigid: '7.500 - 10.500 mm',
        changeType: 'limit-added',
        changeTypeNote: '新增上限 10.500 mm',
        engineeringExplanation: '與固定套環版本相同，同時定義接頭的延伸範圍。',
        numericLimits: { iso594Min: 7.500, iso80369RigidMin: 7.500, iso80369RigidMax: 10.500, unit: 'mm' }
      },
      {
        id: 'mlr-first-thread-dist',
        featureName: '至第一圈完整螺紋距離 (Distance to 1st Thread)',
        featureNameEn: 'Distance to First Complete Thread',
        iso594Symbol: 'T',
        iso80369Symbol: 't',
        iso594Spec: '≤ 3.2 mm（強制管制）',
        iso80369SpecRigid: '(3.200) mm max — 輔助尺寸（套環完全推向前端時量測）',
        iso80369SpecSemiRigid: '(3.650) mm max — 輔助尺寸［建議仍維持 3.200］',
        changeType: 'downgraded',
        changeTypeNote: '降為輔助尺寸；量測姿態同 c',
        engineeringExplanation: '同 Table B.3 之 t，但註 a 同樣要求在套環完全推向前端的姿態下量測。功能性合規改由 6.4 抗軸向分離測試驗證。',
        numericLimits: { iso594Max: 3.2, iso80369RigidMax: 3.200, iso80369SemiRigidMax: 3.650, unit: 'mm', isAuxiliary: true, isUpperLimitOnly: true }
      }
    ]
  },

  // ────────────────────────────────────────────────────────── Table B.5
  {
    id: 'female-lock-thread',
    tabLabel: '母鎖固·斜螺紋 B.5',
    title: '母鎖固接頭 · 斜螺紋 (Female Luer Lock, Inclined Thread)',
    titleEn: 'Female Luer Lock Connector (Inclined Thread)',
    description: '螺紋位於相對軸線傾斜之平面的母鎖固接頭，即連續螺旋牙型，也是商業上最常見的母魯爾鎖形式。螺紋長度不受限制。除本表項目外，另完整適用母滑套接頭 (Table B.2) 之全部尺寸，惟 ØJ 由本表覆寫。',
    standardRef: 'ISO 594-2 Table 1 + Fig. 4 vs. ISO 80369-7 Table B.5',
    inheritsFrom: 'female-slip',
    items: [
      {
        id: 'flt-nonbearing-angle',
        featureName: '外螺紋非受力面角度 (Non-bearing Surface Angle)',
        featureNameEn: 'External Thread Non-bearing Angle',
        iso594Symbol: 'γ',
        iso80369Symbol: 'Β',
        iso594Spec: '≥ 0°',
        iso80369SpecRigid: '≥ 0.0°',
        iso80369SpecSemiRigid: '≥ 0.0°',
        changeType: 'identical',
        changeTypeNote: '符號 γ → Β (大寫 beta)',
        engineeringExplanation: '外螺紋背面非承載面的最小角度，兩版同為 0°（即可為垂直面）。注意公接頭側的 β 為小寫且下限 25.0°，兩者不可互換。',
        numericLimits: { iso594Min: 0, iso80369RigidMin: 0.0, unit: '°', isLowerLimitOnly: true }
      },
      {
        id: 'flt-taper-depth',
        featureName: '母錐體有效深度 (Female Taper Depth)',
        featureNameEn: 'Female Taper Depth',
        iso594Symbol: 'F',
        iso80369Symbol: 'E',
        iso594Spec: '≥ 7.500 mm',
        iso80369SpecRigid: '7.500 - 10.500 mm',
        iso80369SpecSemiRigid: '7.500 - 10.500 mm',
        changeType: 'limit-added',
        changeTypeNote: '新增上限 10.500 mm；符號 F → E',
        engineeringExplanation: 'Table B.5 重申此尺寸，同時定義接頭的延伸範圍。',
        numericLimits: { iso594Min: 7.500, iso80369RigidMin: 7.500, iso80369RigidMax: 10.500, unit: 'mm' }
      },
      {
        id: 'flt-thread-major-od',
        featureName: '外螺紋大徑／牙頂直徑 (Major Outside Thread Diameter)',
        featureNameEn: 'Major Outside Thread Diameter',
        iso594Symbol: '2X',
        iso80369Symbol: 'ØH',
        iso594Spec: '7.83 (+0 / −0.1) mm，即 7.730 - 7.830 mm',
        iso80369SpecRigid: '7.730 - 7.830 mm',
        iso80369SpecSemiRigid: '7.730 - 7.830 mm',
        changeType: 'identical',
        changeTypeNote: '符號 2X → ØH',
        engineeringExplanation: '螺紋牙頂處的最大外徑，範圍不變。新版另明訂：此直徑同時定義「自端面起深度 5.5 mm 內能包覆所有外部特徵的最小圓柱直徑」，且該段內不得超過上限——這是防錯接的關鍵約束，舊版僅以 2X 表示對角尺寸而未含包絡條件。',
        numericLimits: { iso594Min: 7.73, iso594Max: 7.83, iso80369RigidMin: 7.730, iso80369RigidMax: 7.830, unit: 'mm' }
      },
      {
        id: 'flt-thread-minor-od',
        featureName: '外螺紋小徑／根部直徑 (Minor Outside Thread Diameter)',
        featureNameEn: 'Minor Outside Thread Diameter',
        iso594Symbol: 'G',
        iso80369Symbol: 'ØJ',
        iso594Spec: '≤ 6.73 mm（自端面起 5.5 mm 內不得放大）',
        iso80369SpecRigid: '5.515 - 6.730 mm（自端面起 5.5 mm 內不得超過上限）',
        iso80369SpecSemiRigid: '5.515 - 6.730 mm',
        changeType: 'limit-added',
        changeTypeNote: '新增下限 5.515 mm；上限與 5.5 mm 條件沿用舊版 G',
        engineeringExplanation: 'ISO 594-2 的 G 本已是直徑管制且含「自端面 5.5 mm 內不得放大」的條件，新版逐字沿用並補上下限 5.515 mm。此值覆寫母滑套 (Table B.2) 的 ØJ 6.000 - 6.730 mm。',
        numericLimits: { iso594Max: 6.73, iso80369RigidMin: 5.515, iso80369RigidMax: 6.730, iso80369SemiRigidMin: 5.515, iso80369SemiRigidMax: 6.730, unit: 'mm' }
      },
      {
        id: 'flt-thread-crest-width',
        featureName: '外螺紋牙頂寬度 (Thread Crest Width)',
        featureNameEn: 'Width of Thread Profile at Crest',
        iso594Symbol: 'S',
        iso80369Symbol: 'M',
        iso594Spec: '≥ 0.3 mm',
        iso80369SpecRigid: '≥ 0.300 mm',
        iso80369SpecSemiRigid: '≥ 0.300 mm',
        changeType: 'identical',
        changeTypeNote: '符號 S → M',
        engineeringExplanation: '外螺紋牙頂的最小寬度。數值不變。Table B.5 註明螺紋輪廓 (Σ、Β、M) 得與標示值不同，只要滿足 Clause 6 效能要求，且與防錯接特性無關。',
        numericLimits: { iso594Min: 0.3, iso80369RigidMin: 0.300, unit: 'mm', isLowerLimitOnly: true }
      },
      {
        id: 'flt-thread-root-width',
        featureName: '外螺紋根部寬度 (Thread Root Width)',
        featureNameEn: 'Width of Thread Profile at Root',
        iso594Symbol: 'Y',
        iso80369Symbol: 'N',
        iso594Spec: '≤ 1.2 mm（量測於外徑等於 G = 6.73 之處）',
        iso80369SpecRigid: '≤ 1.200 mm（量測於對應 ØJ max = 6.730 之直徑處）',
        iso80369SpecSemiRigid: '≤ 1.200 mm',
        changeType: 'identical',
        changeTypeNote: '符號 Y → N',
        engineeringExplanation: '舊版 Y 的直接對應項，數值與量測基準直徑相同。符號注意：新版另有一個 Y（Table B.6 的凸耳頂端弦長 ≥ 2.710 mm），與此處的舊版 Y 為不同特徵，數值不可互換。直角凸耳變體 (Table B.6) 則將此尺寸改拆為自端面起算的 N1／N2。',
        numericLimits: { iso594Max: 1.2, iso80369RigidMax: 1.200, unit: 'mm', isUpperLimitOnly: true }
      },
      {
        id: 'flt-thread-pitch',
        featureName: '螺紋節距 (Thread Pitch)',
        featureNameEn: 'Nominal Thread Pitch',
        iso594Symbol: 'Pitch',
        iso80369Symbol: 'P',
        iso594Spec: '2.5 mm（雙線右旋，導程 5 mm）',
        iso80369SpecRigid: '(2.500) mm 輔助尺寸（雙線右旋，導程 5 mm）',
        iso80369SpecSemiRigid: '(2.500) mm 輔助尺寸',
        changeType: 'downgraded',
        changeTypeNote: '改以括號標示為輔助尺寸',
        engineeringExplanation: '數值不變但降為輔助尺寸。注意公接頭側的節距符號為小寫 p，母接頭側為大寫 P；而舊版 ISO 594-2 的 P 是「公錐突出套環長度」，新版該項改為小寫 c——同一字母在兩版之間意義翻轉，是圖面轉換的高風險項。',
        numericLimits: { iso594Min: 2.5, iso594Max: 2.5, iso80369RigidMin: 2.5, iso80369RigidMax: 2.5, unit: 'mm', isAuxiliary: true }
      },
      {
        id: 'flt-thread-base-dist',
        featureName: '螺紋根部距端面深度 (Distance to Thread Base)',
        featureNameEn: 'Distance to Thread Base',
        iso594Symbol: '無管制（F 僅適用 Variant B/C）',
        iso80369Symbol: 'Q',
        iso594Spec: '斜螺紋型無此尺寸；ISO 594-2 的 F = 0.20 mm 僅適用 Figures 3b)/3c)',
        iso80369SpecRigid: '≤ 0.300 mm（量測至非受力側之螺紋起始處）',
        iso80369SpecSemiRigid: '≤ 0.300 mm',
        changeType: 'new-feature',
        engineeringExplanation: '限制螺紋起點與端面之間的沉入深度，防止螺紋過深造成旋緊干涉。ISO 594-2 的 F 定義文字與此完全對應，但僅對 Variant B/C 給值，斜螺紋型與 Variant A 欄位皆為「—」，故對本型而言屬全新管制。',
        numericLimits: { iso80369RigidMax: 0.300, unit: 'mm', isUpperLimitOnly: true }
      },
      {
        id: 'flt-entry-radius',
        featureName: '母錐入口倒角半徑 (Entry Radius / Chamfer)',
        featureNameEn: 'Entry Radius / Chamfer',
        iso594Symbol: 'R 0.5 max',
        iso80369Symbol: 'R',
        iso594Spec: '圖示 R 0.5 mm 最大值',
        iso80369SpecRigid: '≤ 0.500 mm',
        iso80369SpecSemiRigid: '≤ 0.500 mm',
        changeType: 'identical',
        engineeringExplanation: '母錐入口導引倒角，數值與舊版相同。不得侵入距開口 0.750 mm 的 ØD 量測剖面。',
        numericLimits: { iso594Max: 0.5, iso80369RigidMax: 0.5, unit: 'mm', isUpperLimitOnly: true }
      },
      {
        id: 'flt-bearing-angle',
        featureName: '外螺紋受力面角度 (Bearing Surface Angle)',
        featureNameEn: 'External Thread Bearing Surface Angle',
        iso594Symbol: 'α',
        iso80369Symbol: 'Σ',
        iso594Spec: '25° (+5° / −0°)，即 25° - 30°',
        iso80369SpecRigid: '25.0° - 30.0°',
        iso80369SpecSemiRigid: '25.0° - 30.0°',
        changeType: 'identical',
        changeTypeNote: '符號 α → Σ (大寫 sigma)',
        engineeringExplanation: '外螺紋抗分離受力面的傾角，範圍不變。注意公接頭側為小寫 σ，母接頭側為大寫 Σ。',
        numericLimits: { iso594Min: 25.0, iso594Max: 30.0, iso80369RigidMin: 25.0, iso80369RigidMax: 30.0, unit: '°' }
      }
    ]
  },

  // ────────────────────────────────────────────────────────── Table B.6
  {
    id: 'female-lock',
    tabLabel: '母鎖固·凸耳A B.6',
    title: '母鎖固接頭 · 直角凸耳 Variant A (Female Luer Lock, Lugs Variant A)',
    titleEn: 'Female Luer Lock Connector with Lugs at Right Angle, Variant A',
    description: '外部帶有雙直角凸耳的母接頭。主要變更為新增自端面起算的 N1／N2、凸耳根部直徑補上下限，以及弦長符號由 V／W 更名為 X／Y。除本表項目外，另適用母滑套 (Table B.2) 之全部尺寸，惟 ØJ 由本表覆寫。',
    standardRef: 'ISO 594-2 Table 1 + Fig. 3a) vs. ISO 80369-7 Table B.6 (Variant A)',
    inheritsFrom: 'female-slip',
    items: [
      {
        id: 'fl-nonbearing-angle',
        featureName: '凸耳非受力面角度 (Non-bearing Surface Angle)',
        featureNameEn: 'External Lug Non-bearing Angle',
        iso594Symbol: 'γ',
        iso80369Symbol: 'Β',
        iso594Spec: '≥ 0°',
        iso80369SpecRigid: '≥ 0.0°',
        iso80369SpecSemiRigid: '≥ 0.0°',
        changeType: 'identical',
        changeTypeNote: '符號 γ → Β (大寫 beta)',
        engineeringExplanation: '凸耳背面非承載面的最小角度，兩版同為 0°。與公接頭側的小寫 β（下限 25.0°）為不同特徵。',
        numericLimits: { iso594Min: 0, iso80369RigidMin: 0.0, unit: '°', isLowerLimitOnly: true }
      },
      {
        id: 'fl-taper-depth',
        featureName: '母錐體有效深度 (Female Taper Depth)',
        featureNameEn: 'Female Taper Depth',
        iso594Symbol: 'F',
        iso80369Symbol: 'E',
        iso594Spec: '≥ 7.500 mm',
        iso80369SpecRigid: '7.500 - 10.500 mm',
        iso80369SpecSemiRigid: '7.500 - 10.500 mm',
        changeType: 'limit-added',
        changeTypeNote: '新增上限 10.500 mm；符號 F → E',
        engineeringExplanation: 'Table B.6 重申此尺寸，同時定義接頭的延伸範圍。',
        numericLimits: { iso594Min: 7.500, iso80369RigidMin: 7.500, iso80369RigidMax: 10.500, unit: 'mm' }
      },
      {
        id: 'fl-lug-major-od',
        featureName: '凸耳大徑／牙頂直徑 (Major Lug OD)',
        featureNameEn: 'Major Lug Outer Diameter',
        iso594Symbol: '2X',
        iso80369Symbol: 'ØH',
        iso594Spec: '7.83 (+0 / −0.1) mm，即 7.730 - 7.830 mm',
        iso80369SpecRigid: '7.730 - 7.830 mm',
        iso80369SpecSemiRigid: '7.730 - 7.830 mm',
        changeType: 'identical',
        changeTypeNote: '符號 2X → ØH',
        engineeringExplanation: '凸耳最外側對角直徑。範圍相同，改標為標準直徑符號。',
        numericLimits: { iso594Min: 7.73, iso594Max: 7.83, iso80369RigidMin: 7.730, iso80369RigidMax: 7.830, unit: 'mm' }
      },
      {
        id: 'fl-lug-minor-od',
        featureName: '凸耳根部直徑 (Minor Lug Root Diameter)',
        featureNameEn: 'Minor Lug Root Diameter',
        iso594Symbol: 'G',
        iso80369Symbol: 'ØJ',
        iso594Spec: '≤ 6.73 mm（自端面起 5.5 mm 內不得放大）',
        iso80369SpecRigid: '5.515 - 6.730 mm（自端面起 5.5 mm 內不得超過上限）',
        iso80369SpecSemiRigid: '5.515 - 6.730 mm',
        changeType: 'limit-added',
        changeTypeNote: '新增下限 5.515 mm；上限與 5.5 mm 條件沿用舊版 G',
        engineeringExplanation: 'ISO 594-2 的 G 即為凸耳根部最大外徑 6.73 mm，並規定自端面起 5.5 mm 內不得放大；新版 ØJ 沿用同一上限與同一條件，另新增下限 5.515 mm。圖面動作為補標下限。此值覆寫母滑套 (Table B.2) 的 ØJ 6.000 - 6.730 mm。',
        numericLimits: { iso594Max: 6.73, iso80369RigidMin: 5.515, iso80369RigidMax: 6.730, iso80369SemiRigidMin: 5.515, iso80369SemiRigidMax: 6.730, unit: 'mm' }
      },
      {
        id: 'fl-lug-chord-base',
        featureName: '凸耳根部弦長 (Lug Base Chord)',
        featureNameEn: 'Chord Length at Lug Base',
        iso594Symbol: 'V',
        iso80369Symbol: 'X',
        iso594Spec: '≤ 3.5 mm（量測於直徑 7.0 mm 之弦上）',
        iso80369SpecRigid: '≤ 3.500 mm（量測於直徑 7.000 mm 之弦上）',
        iso80369SpecSemiRigid: '≤ 3.500 mm',
        changeType: 'identical',
        changeTypeNote: '符號 V → X，數值與量測基準不變',
        engineeringExplanation: '舊版 V 於新版更名為 X，上限同為 3.500 mm，量測基準同為直徑 7.000 mm 的弦。Table B.6 對 X 為強制 (normative) 項目，且明訂 Y 不得大於 X，2D 圖面須保留此標註。符號注意：舊版 ISO 594-2 另有一個 X（凸耳頂端至軸線距離，表中無給值），與此為不同特徵。',
        numericLimits: { iso594Max: 3.5, iso80369RigidMax: 3.500, iso80369SemiRigidMax: 3.500, unit: 'mm', isUpperLimitOnly: true }
      },
      {
        id: 'fl-lug-chord-crest',
        featureName: '凸耳頂端弦長 (Lug Extremity Chord)',
        featureNameEn: 'Chord Length at Lug Extremity',
        iso594Symbol: 'W',
        iso80369Symbol: 'Y',
        iso594Spec: '≥ 2.71 mm（且 W 不得大於 V）',
        iso80369SpecRigid: '≥ 2.710 mm（且 Y 不得大於 X）',
        iso80369SpecSemiRigid: '≥ 2.710 mm',
        changeType: 'identical',
        changeTypeNote: '符號 W → Y，數值不變',
        engineeringExplanation: '舊版 W 於新版更名為 Y，下限同為 2.710 mm，並維持「不得大於 X」之限制。符號注意：ISO 594-2 的 Y 指「凸耳基底軸向寬度 ≤ 1.2 mm」，與新版 Y 為不同特徵，舊圖的 Y 值不可直接沿用至新符號 Y。',
        numericLimits: { iso594Min: 2.71, iso80369RigidMin: 2.710, iso80369SemiRigidMin: 2.710, unit: 'mm', isLowerLimitOnly: true }
      },
      {
        id: 'fl-lug-leading-n1',
        featureName: '凸耳前緣定位距離 (Lug Leading Edge Position)',
        featureNameEn: 'Lug Leading Edge Position (N1)',
        iso594Symbol: 'Y（數值相同，基準不同）',
        iso80369Symbol: 'N1',
        iso594Spec: 'Variant A 無此尺寸。最接近者為 Y ≤ 1.2 mm（凸耳基底「軸向寬度」，量測於外徑 6.73 處）',
        iso80369SpecRigid: '≤ 1.200 mm（自端面往內量測，於對應 6.730 之直徑處）',
        iso80369SpecSemiRigid: '≤ 1.200 mm（自端面往內量測，於對應 6.730 之直徑處）',
        changeType: 'new-feature',
        changeTypeNote: '量測基準由「凸耳自身寬度」改為「距端面之絕對距離」',
        engineeringExplanation: 'N1 量測至凸耳「旋入公接頭時的前緣」，上限 1.200 mm，數值與舊版 Y 相同，但基準由凸耳自身寬度改為距端面的絕對距離。2021 版 Foreword 說明此變更之目的：使量測可自接頭開口端進行，以確保設計極端值下的相容性。變體注意：ISO 594-2 Table 1 的 F = 0.20 mm 僅適用 Figures 3b)/3c)（Variant B/C），Variant A 欄位為「—」，故 Variant A 舊版無對應尺寸。',
        numericLimits: { iso80369RigidMax: 1.200, iso80369SemiRigidMax: 1.200, unit: 'mm', isUpperLimitOnly: true }
      },
      {
        id: 'fl-lug-trailing-n2',
        featureName: '凸耳後緣定位距離 (Lug Trailing Edge Position)',
        featureNameEn: 'Lug Trailing Edge Position (N2)',
        iso594Symbol: '無對應尺寸',
        iso80369Symbol: 'N2',
        iso594Spec: 'Variant A 無對應尺寸',
        iso80369SpecRigid: '≤ 2.070 mm（自端面往內量測，於對應 6.730 之直徑處）',
        iso80369SpecSemiRigid: '≤ 2.070 mm（自端面往內量測，於對應 6.730 之直徑處）',
        changeType: 'new-feature',
        engineeringExplanation: '量測至凸耳「旋入公接頭時的後緣」，限制其最大退後距離，確保公母接頭旋緊時螺紋完全咬合且不卡死。對照：Table B.5（斜螺紋型）以單一 N ≤ 1.200 mm 對應舊版 Y；Variant A 則拆為 N1／N2 兩個自端面起算的絕對距離。',
        numericLimits: { iso80369RigidMax: 2.070, iso80369SemiRigidMax: 2.070, unit: 'mm', isUpperLimitOnly: true }
      },
      {
        id: 'fl-lug-crest-width',
        featureName: '凸耳牙頂寬度 (Lug Crest Width)',
        featureNameEn: 'Width of Lug Profile at Crest',
        iso594Symbol: 'S',
        iso80369Symbol: 'M',
        iso594Spec: '≥ 0.3 mm',
        iso80369SpecRigid: '≥ 0.300 mm',
        iso80369SpecSemiRigid: '≥ 0.300 mm',
        changeType: 'identical',
        changeTypeNote: '符號 S → M',
        engineeringExplanation: '凸耳最外側平坦牙頂的最小寬度。數值不變。',
        numericLimits: { iso594Min: 0.3, iso80369RigidMin: 0.300, unit: 'mm', isLowerLimitOnly: true }
      },
      {
        id: 'fl-lug-bearing-angle',
        featureName: '凸耳受力面角度 (Lug Bearing Angle)',
        featureNameEn: 'Lug Bearing Surface Angle',
        iso594Symbol: 'α',
        iso80369Symbol: 'Σ',
        iso594Spec: '25° (+5° / −0°)，即 25° - 30°',
        iso80369SpecRigid: '25.0° - 30.0°',
        iso80369SpecSemiRigid: '25.0° - 30.0°',
        changeType: 'identical',
        changeTypeNote: '符號 α → Σ (大寫 sigma)',
        engineeringExplanation: '凸耳與公接頭螺紋咬合的受力面傾角。範圍不變。',
        numericLimits: { iso594Min: 25.0, iso594Max: 30.0, iso80369RigidMin: 25.0, iso80369RigidMax: 30.0, unit: '°' }
      },
      {
        id: 'fl-lug-base-dist',
        featureName: '凸耳根部距端面深度 (Distance to Lug Base)',
        featureNameEn: 'Distance to Lug Base',
        iso594Symbol: 'F（僅 Variant B/C）',
        iso80369Symbol: 'Q',
        iso594Spec: 'Variant A 未規範；Variant B/C 標稱 F = 0.20 mm',
        iso80369SpecRigid: '≤ 0.300 mm',
        iso80369SpecSemiRigid: '≤ 0.300 mm',
        changeType: 'new-feature',
        engineeringExplanation: 'ISO 594-2 的 F「自接頭端面至凸耳根部之標稱距離」與新版 Q 的定義文字完全對應，但 594-2 僅對 Variant B/C 給值（標稱 0.20 mm），Variant A 欄位為「—」。新版 Q ≤ 0.300 mm 對 Table B.5/B.6/B.7 全部型式皆為強制。此項限制凸耳起點與端面之間的沉入深度，防止凸耳過深造成旋緊干涉。',
        numericLimits: { iso80369RigidMax: 0.300, unit: 'mm', isUpperLimitOnly: true }
      }
    ]
  },

  // ────────────────────────────────────────────────────────── Table B.7
  {
    id: 'female-lock-b',
    tabLabel: '母鎖固·凸耳B B.7',
    title: '母鎖固接頭 · 直角凸耳 Variant B (Female Luer Lock, Lugs Variant B)',
    titleEn: 'Female Luer Lock Connector with Lugs at Right Angle, Variant B',
    description: '直角凸耳的第二種變體，凸耳尺寸較小且以「對角」而非「直徑」定義大徑，另以 Z 管制跨凸耳寬度。本變體僅供剛性材料設計使用。除本表項目外，另適用母滑套 (Table B.2) 之全部尺寸，惟 ØJ 由本表覆寫。',
    standardRef: 'ISO 594-2 Table 1 + Fig. 3b) vs. ISO 80369-7 Table B.7 (Variant B)',
    inheritsFrom: 'female-slip',
    rigidOnly: true,
    items: [
      {
        id: 'flb-nonbearing-angle',
        featureName: '凸耳非受力面角度 (Non-bearing Surface Angle)',
        featureNameEn: 'External Lug Non-bearing Angle',
        iso594Symbol: 'γ',
        iso80369Symbol: 'Β',
        iso594Spec: '≥ 0°',
        iso80369SpecRigid: '≥ 0.0°',
        changeType: 'identical',
        changeTypeNote: '符號 γ → Β',
        engineeringExplanation: '凸耳背面非承載面的最小角度，兩版同為 0°。',
        numericLimits: { iso594Min: 0, iso80369RigidMin: 0.0, unit: '°', isLowerLimitOnly: true }
      },
      {
        id: 'flb-taper-depth',
        featureName: '母錐體有效深度 (Female Taper Depth)',
        featureNameEn: 'Female Taper Depth',
        iso594Symbol: 'F',
        iso80369Symbol: 'E',
        iso594Spec: '≥ 7.500 mm',
        iso80369SpecRigid: '7.500 - 10.500 mm',
        changeType: 'limit-added',
        changeTypeNote: '新增上限 10.500 mm；符號 F → E',
        engineeringExplanation: '同時定義接頭的延伸範圍。',
        numericLimits: { iso594Min: 7.500, iso80369RigidMin: 7.500, iso80369RigidMax: 10.500, unit: 'mm' }
      },
      {
        id: 'flb-lug-major-diagonal',
        featureName: '凸耳大徑對角 (Major Lug Diagonal)',
        featureNameEn: 'Major Outside Lug Diagonal',
        iso594Symbol: '2X',
        iso80369Symbol: 'H（無 Ø，為對角非直徑）',
        iso594Spec: '7.80 (+0 / −0.1) mm，即 7.700 - 7.800 mm',
        iso80369SpecRigid: '7.700 - 7.800 mm',
        changeType: 'identical',
        changeTypeNote: '符號 2X → H；範圍不變',
        engineeringExplanation: '請注意符號寫法：Variant B 使用不帶 Ø 的 H，因為此處量測的是凸耳牙頂之間的「對角距離」而非圓柱直徑；Variant A 與 C 則使用 ØH（直徑）。標註時不可混用，否則量測方式會錯。數值與 Variant A 的 7.730 - 7.830 mm 亦不同。',
        numericLimits: { iso594Min: 7.70, iso594Max: 7.80, iso80369RigidMin: 7.700, iso80369RigidMax: 7.800, unit: 'mm' }
      },
      {
        id: 'flb-lug-minor-od',
        featureName: '凸耳根部直徑 (Minor Lug Root Diameter)',
        featureNameEn: 'Minor Lug Root Diameter',
        iso594Symbol: 'G',
        iso80369Symbol: 'ØJ',
        iso594Spec: '≤ 5.7 mm（自端面起 5.5 mm 內不得放大）',
        iso80369SpecRigid: '5.515 - 5.700 mm（自端面起 5.5 mm 內不得超過上限）',
        changeType: 'limit-added',
        changeTypeNote: '新增下限 5.515 mm；上限沿用舊版 G',
        engineeringExplanation: 'Variant B 的 G 上限為 5.7 mm（Variant A 為 6.73 mm），新版沿用並補上與 Variant A 相同的下限 5.515 mm，使公差帶僅剩 0.185 mm——這是本變體限定剛性材料的原因之一。此值覆寫母滑套的 ØJ。',
        numericLimits: { iso594Max: 5.7, iso80369RigidMin: 5.515, iso80369RigidMax: 5.700, unit: 'mm' }
      },
      {
        id: 'flb-lug-crest-width',
        featureName: '凸耳牙頂寬度 (Lug Crest Width)',
        featureNameEn: 'Width of Lug Profile at Crest',
        iso594Symbol: 'S',
        iso80369Symbol: 'M',
        iso594Spec: '≤ 0.27 mm（最大值）',
        iso80369SpecRigid: '≤ 0.270 mm',
        changeType: 'identical',
        changeTypeNote: '符號 S → M',
        engineeringExplanation: '方向性提醒：Variant A 的 M 是「最小值 ≥ 0.300 mm」，Variant B 的 M 是「最大值 ≤ 0.270 mm」——同一符號、相反方向。此差異在舊版 ISO 594-2 的 S 列即已存在（0.3 min 對 0.27 max），轉版時務必確認變體別。',
        numericLimits: { iso594Max: 0.27, iso80369RigidMax: 0.270, unit: 'mm', isUpperLimitOnly: true }
      },
      {
        id: 'flb-lug-width',
        featureName: '凸耳輪廓寬度 (Lug Profile Width)',
        featureNameEn: 'Width of Lug Profile',
        iso594Symbol: 'Y',
        iso80369Symbol: 'N',
        iso594Spec: '≤ 1.30 mm（量測於外徑等於 G 之處）',
        iso80369SpecRigid: '≤ 1.300 mm（量測於對應 6.730 之直徑處）',
        changeType: 'identical',
        changeTypeNote: '符號 Y → N',
        engineeringExplanation: '舊版 Y 的直接對應項，數值不變。惟量測基準直徑在新版明訂為 6.730 mm，而舊版是「外徑等於 G」——Variant B 的 G 為 5.7 mm，兩者不同，量測時應以新版的 6.730 mm 為準。',
        numericLimits: { iso594Max: 1.30, iso80369RigidMax: 1.300, unit: 'mm', isUpperLimitOnly: true }
      },
      {
        id: 'flb-lug-base-dist',
        featureName: '凸耳根部距端面深度 (Distance to Lug Base)',
        featureNameEn: 'Distance to Lug Base',
        iso594Symbol: 'F',
        iso80369Symbol: 'Q',
        iso594Spec: '標稱 0.20 mm',
        iso80369SpecRigid: '≤ 0.300 mm',
        changeType: 'limit-added',
        changeTypeNote: '由標稱值改為最大值 0.300 mm',
        engineeringExplanation: '這裡才是 ISO 594-2 之 F 的真正對應處。舊版對 Variant B/C 給定標稱值 0.20 mm（無公差帶），新版改為明確上限 0.300 mm，屬合理放寬且可量測化。Variant A 舊版並無 F。',
        numericLimits: { iso594Min: 0.20, iso594Max: 0.20, iso80369RigidMax: 0.300, unit: 'mm' }
      },
      {
        id: 'flb-lug-bearing-angle',
        featureName: '凸耳受力面角度 (Lug Bearing Angle)',
        featureNameEn: 'Lug Bearing Surface Angle',
        iso594Symbol: 'α',
        iso80369Symbol: 'Σ',
        iso594Spec: '25° (+5° / −0°)，即 25° - 30°',
        iso80369SpecRigid: '25.0° - 30.0°',
        changeType: 'identical',
        changeTypeNote: '符號 α → Σ',
        engineeringExplanation: '凸耳抗分離受力面的傾角，範圍不變。',
        numericLimits: { iso594Min: 25.0, iso594Max: 30.0, iso80369RigidMin: 25.0, iso80369RigidMax: 30.0, unit: '°' }
      },
      {
        id: 'flb-lug-chord-base',
        featureName: '凸耳根部弦長 (Lug Base Chord)',
        featureNameEn: 'Chord Length at Lug Base',
        iso594Symbol: 'V',
        iso80369Symbol: 'X',
        iso594Spec: '≤ 5.0 mm（量測於直徑 7.0 mm 之弦上）',
        iso80369SpecRigid: '≤ 5.000 mm（量測於直徑 7.000 mm 之弦上）',
        changeType: 'identical',
        changeTypeNote: '符號 V → X，數值不變',
        engineeringExplanation: '舊版 V 更名為 X，上限 5.000 mm（Variant A 為 3.500 mm）。Table B.7 未列 Y（頂端弦長），故本變體無「Y 不得大於 X」之限制。',
        numericLimits: { iso594Max: 5.0, iso80369RigidMax: 5.000, unit: 'mm', isUpperLimitOnly: true }
      },
      {
        id: 'flb-lug-width-across',
        featureName: '跨凸耳寬度 (Width Across Lugs)',
        featureNameEn: 'Width Across the Lugs',
        iso594Symbol: 'Z',
        iso80369Symbol: 'Z',
        iso594Spec: '6.50 (+0 / −0.1) mm，即 6.400 - 6.500 mm',
        iso80369SpecRigid: '6.400 - 6.500 mm',
        changeType: 'identical',
        engineeringExplanation: '垂直於軸線平面上，跨越兩凸耳的平行寬度。符號與數值皆不變，是少數兩版完全一致的項目。此尺寸僅存在於 Variant B。',
        numericLimits: { iso594Min: 6.40, iso594Max: 6.50, iso80369RigidMin: 6.400, iso80369RigidMax: 6.500, unit: 'mm' }
      }
    ]
  },

  // ────────────────────────────────────────────────────────── Table B.8
  {
    id: 'female-lock-c',
    tabLabel: '母鎖固·凸耳C B.8',
    title: '母鎖固接頭 · 直角凸耳 Variant C (Female Luer Lock, Lugs Variant C)',
    titleEn: 'Female Luer Lock Connector with Lugs at Right Angle, Variant C',
    description: '直角凸耳的第三種變體，僅以兩項尺寸覆寫 Variant B。本變體僅供剛性材料設計使用。除本表兩項外，另適用母滑套 (Table B.2) 之全部尺寸，以及 Table B.7 之 Section B-B 剖面尺寸。',
    standardRef: 'ISO 594-2 Table 1 + Fig. 3c) vs. ISO 80369-7 Table B.8 (Variant C)',
    inheritsFrom: 'female-lock-b',
    rigidOnly: true,
    items: [
      {
        id: 'flc-lug-major-od',
        featureName: '凸耳大徑／牙頂直徑 (Major Lug OD)',
        featureNameEn: 'Major Outside Lug Diameter',
        iso594Symbol: '2X',
        iso80369Symbol: 'ØH（直徑，非對角）',
        iso594Spec: '7.80 (+0 / −0.1) mm，即 7.700 - 7.800 mm',
        iso80369SpecRigid: '7.700 - 7.800 mm',
        changeType: 'identical',
        changeTypeNote: '符號 2X → ØH；數值同 Variant B 但量測方式不同',
        engineeringExplanation: '關鍵區辨：Variant C 使用帶 Ø 的 ØH（圓柱直徑），Variant B 使用不帶 Ø 的 H（對角距離），兩者數值同為 7.700 - 7.800 mm 但量測方式不同。這是 Variant B 與 C 在 ISO 80369-7 中唯一的實質區別之一，舊版 ISO 594-2 以同一欄位涵蓋兩者而未作此區分。',
        numericLimits: { iso594Min: 7.70, iso594Max: 7.80, iso80369RigidMin: 7.700, iso80369RigidMax: 7.800, unit: 'mm' }
      },
      {
        id: 'flc-lug-chord-base',
        featureName: '凸耳根部弦長 (Lug Base Chord)',
        featureNameEn: 'Chord Length at Lug Base',
        iso594Symbol: 'V',
        iso80369Symbol: 'X',
        iso594Spec: '≤ 5.0 mm（量測於直徑 7.0 mm 之弦上）',
        iso80369SpecRigid: '≤ 5.000 mm（量測於直徑 7.000 mm 之弦上）',
        changeType: 'identical',
        changeTypeNote: '符號 V → X，數值不變',
        engineeringExplanation: '舊版 V 更名為 X，上限 5.000 mm，與 Variant B 相同。圖面須保留此標註。',
        numericLimits: { iso594Max: 5.0, iso80369RigidMax: 5.000, unit: 'mm', isUpperLimitOnly: true }
      }
    ]
  }
];

/**
 * 效能與測試要求比對。
 * 舊版欄位已區分 ISO 594-1（滑套，通用）與 ISO 594-2（鎖固）—— 兩者對同一項目常有不同數值，
 * 兩者對同一項目常有不同數值，須依接頭型式引用正確的一本。
 */
export const TEST_REQUIREMENTS_DATA: TestRequirementItem[] = [
  {
    id: 'test-gauging',
    testName: '量規檢驗 (Gauging)',
    testNameEn: 'Gauging / Limit Gauge Verification',
    iso594Spec: 'ISO 594-1 4.1 / 5.1：以鋼製限界量規於 (20±5) °C、5 N 軸向力（不施扭矩）檢驗；公錐小端須落於兩限界平面之間，剛性件不得有搖晃 (rocking)。ISO 594-2 4.1：鎖固件之錐面部分依 594-1 檢驗。',
    iso80369Spec: '無量規檢驗條款。依 Annex A Clause 5，舊式 Luer 量規因缺少與防錯接相關之表面，不得用於驗證符合性；符合性改依 Annex B 逐項尺寸與公差查驗。製程品管自用之規具不在本標準範圍內。',
    keyDifference: '本次轉版最大的方法變更：放行依據由「限界量規＋無搖晃」改為「二次元／三次元逐項尺寸量測」。',
    severity: 'critical',
    impactArea: 'QA/QC Lab'
  },
  {
    id: 'test-liquid-leakage',
    testName: '正壓液體洩漏測試 (Liquid Leakage)',
    testNameEn: 'Positive Pressure Liquid Leakage Test',
    iso594Spec: '滑套型 (ISO 594-1 5.2)：300 kPa，維持 30 秒，無脫落水滴。鎖固型 (ISO 594-2 5.2.3)：300 - 330 kPa，維持 30 秒。兩者組裝條件：軸向力 ≤27.5 N、扭矩 ≤0.12 N·m。ISO 594-1 資訊性附錄另載壓力衰減法，判定值同為 0.005 Pa·m³/s。',
    iso80369Spec: '雙軌可選 (6.1.1 二擇一)：1. 水壓 300 - 330 kPa 持壓 30-35 秒，無滴落水；2. 氣壓降法 300 - 330 kPa，洩漏率 ≤ 0.005 Pa·m³/s，持壓 15-20 秒。',
    keyDifference: '鎖固件的 300 - 330 kPa 壓力區間沿用自 ISO 594-2 5.2.3；氣壓降法與 0.005 Pa·m³/s 判定值沿用自 ISO 594-1 資訊性附錄。新增的是持壓時間上限 (30-35 秒)，以及氣壓降法由資訊性附錄升格為正式可選路徑。',
    severity: 'medium',
    impactArea: 'QA/QC Lab'
  },
  {
    id: 'test-vacuum-leakage',
    testName: '抽吸負壓氣密性 (Sub-atmospheric Leakage)',
    testNameEn: 'Sub-atmospheric Air Leakage Test',
    iso594Spec: '注射器抽水 25%，堵住出口手拉活塞至滿刻度，目視 15 秒內是否有持續氣泡（前 5 秒之氣泡不計）。ISO 594-2 5.3.1 已明文允許使用經確效之替代方法（如自動化測試），惟爭議時以本文方法為準。',
    iso80369Spec: '真空儀器定量檢測：施加 80.0 - 88.0 kPa 負壓 (真空)，持壓 15-20 秒，氣體洩漏率不得超過 0.005 Pa·m³/s。',
    keyDifference: '由「目視無持續氣泡」改為定量洩漏率判定。ISO 594-2 5.3.1 已開放經確效之自動化替代法，可作為既有量測能力的銜接基礎。',
    severity: 'high',
    impactArea: 'Equipment Purchase'
  },
  {
    id: 'test-axial-separation',
    testName: '抗軸向拉拔分離力 (Axial Load Separation)',
    testNameEn: 'Resistance to Separation from Axial Load',
    iso594Spec: '滑套型 (ISO 594-1 5.4.2)：25 N，速率 10 N/s，維持 ≥10 秒。鎖固型 (ISO 594-2 5.4.2)：漸進加載至 35 N，速率 10 N/s，維持 ≥10 秒。',
    iso80369Spec: '區分接頭類型：1. 滑套型 (Slip)：23 - 25 N 持壓 10-15 秒；2. 鎖固型 (Lock)：32 - 35 N 持壓 10-15 秒。',
    keyDifference: '加載目標由單一值改為區間：鎖固型 35 N → 32-35 N，滑套型 25 N → 23-25 N，兩者下限均較舊版寬鬆。新增的是持壓時間上限 (10-15 秒)。查對舊版時須依接頭型式分別引用 594-1 或 594-2。',
    severity: 'medium',
    impactArea: 'QA/QC Lab'
  },
  {
    id: 'test-unscrewing-torque',
    testName: '抗旋卸分離力 (Unscrewing Torque)',
    testNameEn: 'Resistance to Unscrewing Separation',
    iso594Spec: '【僅限 Lock】ISO 594-2 4.4 / 5.5.2：施加旋卸扭矩 0.02 (+0 / −0.002) N·m，即 0.018 - 0.020 N·m，維持 ≥10 秒，接頭不得與參考件分離。',
    iso80369Spec: '【僅限 Luer Lock】施加 0.018 N·m - 0.020 N·m 旋卸扭矩，持壓 10-15 秒，接頭不可鬆脫分離。',
    keyDifference: '扭矩區間 0.018 - 0.020 N·m 與 ISO 594-2 5.5.2 相同，變更僅在持壓時間：由「≥10 秒」改為「10-15 秒」。',
    severity: 'low',
    impactArea: 'QA/QC Lab'
  },
  {
    id: 'test-overriding-torque',
    testName: '抗過載／抗滑牙測試 (Resistance to Overriding)',
    testNameEn: 'Resistance to Overriding Torque',
    iso594Spec: '【僅限 Lock】ISO 594-2 4.6 / 5.7：施加 ≥0.15 N·m 扭矩並恆定保持 5 秒，參考件不得滑脫受測件之螺紋或凸耳。',
    iso80369Spec: '【僅限 Luer Lock】施加 0.15 N·m - 0.17 N·m 過載扭矩，持壓 5-10 秒，螺紋或凸耳不可滑牙跳牙。',
    keyDifference: '扭矩下限 0.15 N·m 沿用自 ISO 594-2 5.7。新增的是上限 0.17 N·m 與持壓區間 5-10 秒，使測試可重現、避免無上限加載。',
    severity: 'medium',
    impactArea: 'Mold & Tooling'
  },
  {
    id: 'test-ease-of-assembly',
    testName: '易組裝性 (Ease of Assembly)',
    testNameEn: 'Ease of Assembly',
    iso594Spec: '【僅限 Lock】ISO 594-2 4.5 / 5.6：剛性件——手工組裝至錐面確實密合前不得感受到阻力；半剛性件——以 ≤20 N 軸向力搭配 ≤0.08 N·m 扭矩即應達成良好配合。',
    iso80369Spec: '無對應要求（本項已刪除）。ISO 80369-7 Clause 6 未收錄易組裝性；相關風險改由 6.4 抗軸向分離，以及 Annex A 對半剛性錐面咬合深度之建議值 (ØD ≥ 4.225 / ØG ≥ 3.820) 間接涵蓋。',
    keyDifference: '本項於新版無對應條款，屬實質刪除。轉版時應確認此風險改由何種驗證覆蓋。',
    severity: 'medium',
    impactArea: 'R&D Verification'
  },
  {
    id: 'test-stress-cracking',
    testName: '應力龜裂試驗 (Stress Cracking)',
    testNameEn: 'Resistance to Stress Cracking',
    iso594Spec: 'ISO 594-1 5.5：靜置 24 小時（針頭）或 48 小時（其他），目視檢查。ISO 594-2 5.8：以 ≥27.5 N 軸向力／5 秒搭配 ≥0.12 N·m 扭矩組裝，靜置 (48 ± 1) 小時 @ (20 ± 5) °C（熱帶國家可用 27 ± 5 °C），目視檢查。',
    iso80369Spec: '依 ISO 80369-20 Annex E 預塗應力組裝靜置後，【必須再次通過 6.1.1 液體洩漏測試】。',
    keyDifference: '取消純目視放行，要求靜置後必須進行功能性洩漏測試驗證。舊版鎖固件的靜置時間為 (48 ± 1) 小時，較 594-1 的針頭 24 小時嚴格。',
    severity: 'medium',
    impactArea: 'QA/QC Lab'
  },
  {
    id: 'test-misconnection',
    testName: '防錯接特性驗證 (Non-interconnectable)',
    testNameEn: 'Non-interconnectable Design Evaluation',
    iso594Spec: '無跨領域醫療接頭防錯接驗證。',
    iso80369Spec: '強制條款。依 ISO 80369-1:2018 Annex B，使用 Annex C 之參考件 (Figures C.1、C.2、C.4、C.5) 與其他應用領域之標準件進行干涉評估。',
    keyDifference: 'ISO 80369 系列的核心要求，確保血管用 Luer 不會誤接至腸道、神經軸或呼吸管路。Clause 4.1 另警示：在部分公差組合下，公接頭內孔可能接觸 ISO 80369-6 神經軸 N1 接頭的密封面而導致雙方互為失敗，詳見 Annex G.2.2。',
    severity: 'critical',
    impactArea: 'R&D Verification'
  }
];
