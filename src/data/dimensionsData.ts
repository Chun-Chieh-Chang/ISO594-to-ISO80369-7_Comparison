import { ConnectorCategoryData, TestRequirementItem } from '../types';

export const DIMENSIONS_DATA: ConnectorCategoryData[] = [
  {
    id: 'male-slip',
    title: '公滑套接頭 (Male Luer Slip)',
    titleEn: 'Male Luer Slip Connector',
    description: '適用於無螺紋鎖固之圓錐形公接頭（如一次性注射器前端、針頭座公端）。核心關注點為 0.75mm 測量基準位移及 2.900mm 內孔上限。',
    standardRef: 'ISO 594-1 Clause 4.1 vs. ISO 80369-7 Table B.1',
    items: [
      {
        id: 'ms-taper-angle',
        featureName: '錐度角 (Taper Angle)',
        featureNameEn: 'Taper Angle',
        iso594Symbol: '6% Taper',
        iso80369Symbol: 'α',
        iso594Spec: '6% 圓錐 (約 3.44°)，無標註公差',
        iso80369SpecRigid: '(3.44°) 輔助尺寸/參考值',
        iso80369SpecSemiRigid: '(3.44°) 輔助尺寸/參考值',
        changeType: 'same',
        changeTypeLabel: '純符號/輔助尺寸化',
        engineeringExplanation: '幾何維度保持 6% 錐度（每邊約 1.72°，全角約 3.44°）。新版加上括號標註為參考輔助尺寸，實際由兩點剖面直徑（Ød 與 Øg）來約束錐度形狀。',
        numericLimits: {
          iso594Min: 3.44,
          iso594Max: 3.44,
          iso80369RigidMin: 3.44,
          iso80369RigidMax: 3.44,
          unit: '°',
          isAuxiliary: true
        }
      },
      {
        id: 'ms-tip-od',
        featureName: '公錐體前端外徑 (Tip Outer Diameter)',
        featureNameEn: 'Tip Outer Diameter',
        iso594Symbol: 'd',
        iso80369Symbol: 'Ød',
        iso594Spec: '測量於極端面：剛性 3.925 - 3.990 mm / 半剛性 3.925 - 4.027 mm',
        iso80369SpecRigid: '3.970 - 4.035 mm (距前端 0.750 mm 剖面處)',
        iso80369SpecSemiRigid: '3.970 - 4.072 mm (距前端 0.750 mm 剖面處)',
        changeType: 'datum-shift',
        changeTypeLabel: '基準面位移 (Datum Shift)',
        datumShiftNote: '測量剖面由端面退後 0.750 mm，因 6% 錐度使公差帶數值增加 +0.045 mm (0.75 * 0.06 = 0.045 mm)。',
        engineeringExplanation: '為避免射出成型端面毛邊或倒角影響光學二次元量測，ISO 80369-7 將剖面後移 0.75mm。CAD 模型實體幾何形狀並未改變，但 2D 圖面必須更新剖面標註線及數值。',
        numericLimits: {
          iso594Min: 3.925,
          iso594Max: 3.990,
          iso80369RigidMin: 3.970,
          iso80369RigidMax: 4.035,
          iso80369SemiRigidMin: 3.970,
          iso80369SemiRigidMax: 4.072,
          unit: 'mm'
        }
      },
      {
        id: 'ms-through-bore',
        featureName: '前端內孔直徑 (Through Bore)',
        featureNameEn: 'Through Bore Diameter',
        iso594Symbol: '無管制',
        iso80369Symbol: 'Øf',
        iso594Spec: '未對前端內孔上限設定強制限值',
        iso80369SpecRigid: '≤ 2.900 mm (最大上限)',
        iso80369SpecSemiRigid: '≤ 2.900 mm (最大上限)',
        changeType: 'new-feature',
        changeTypeLabel: '全新強制管制項 (防錯接)',
        engineeringExplanation: '防錯接的核心技術點！若內孔大於 2.900 mm，極易誤插入神經軸 (N1/N2) 等小孔徑接頭。高流量注射器或針頭設計若過往開到 3.0mm，轉版時必須修模縮小孔徑。',
        numericLimits: {
          iso80369RigidMax: 2.900,
          iso80369SemiRigidMax: 2.900,
          unit: 'mm',
          isUpperLimitOnly: true
        }
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
        changeType: 'same',
        changeTypeLabel: '符號更新 + 增設上限',
        engineeringExplanation: '舊版僅限制最小長度 7.5mm，新版增加 10.500mm 上限以防止公錐過長插入母接頭深處發生機械干涉。圖面需補上上限公差。',
        numericLimits: {
          iso594Min: 7.500,
          iso80369RigidMin: 7.500,
          iso80369RigidMax: 10.500,
          unit: 'mm'
        }
      },
      {
        id: 'ms-base-od',
        featureName: '公錐體大端參考外徑 (Base Outer Diameter)',
        featureNameEn: 'Base Outer Diameter',
        iso594Symbol: '無管制',
        iso80369Symbol: 'Øg',
        iso594Spec: '無明確單獨標註',
        iso80369SpecRigid: '4.375 - 4.440 mm (距前端 7.500 mm 處)',
        iso80369SpecSemiRigid: '4.375 - 4.477 mm (距前端 7.500 mm 處)',
        changeType: 'new-feature',
        changeTypeLabel: '全新幾何控制剖面',
        engineeringExplanation: '在距前端 7.50mm 處定義第二個控制直徑 Øg，用以搭配前端 Ød 共同驗證 7.5mm 長度範圍內的實際圓錐角度與幾何公差。',
        numericLimits: {
          iso80369RigidMin: 4.375,
          iso80369RigidMax: 4.440,
          iso80369SemiRigidMin: 4.375,
          iso80369SemiRigidMax: 4.477,
          unit: 'mm'
        }
      },
      {
        id: 'ms-tip-radius',
        featureName: '前端頂角倒角半徑 (Tip Chamfer Radius)',
        featureNameEn: 'Tip Radius / Chamfer',
        iso594Symbol: 'R0.5 max',
        iso80369Symbol: 'r',
        iso80369SpecRigid: '0.000 - 0.500 mm',
        iso80369SpecSemiRigid: '0.000 - 0.500 mm',
        iso594Spec: '圖示 R 0.5 mm 最大值',
        changeType: 'same',
        changeTypeLabel: '規範明確化',
        engineeringExplanation: '將舊版文字圖示說明轉換為標準幾何公差帶 (0.000 - 0.500 mm)，確保頂端倒角不影響 0.75mm 處剖面直徑之測量精度。',
        numericLimits: {
          iso594Max: 0.5,
          iso80369RigidMin: 0.0,
          iso80369RigidMax: 0.5,
          unit: 'mm'
        }
      }
    ]
  },
  {
    id: 'female-slip',
    title: '母滑套接頭 (Female Luer Slip)',
    titleEn: 'Female Luer Slip Connector',
    description: '適用於無螺紋鎖固之圓錐形母接頭（如針頭座母端、靜脈輸液管路母口）。核心關注點為內徑基準內縮 0.75mm 及半剛性塑膠最小建議尺寸。',
    standardRef: 'ISO 594-1 Clause 4.1 vs. ISO 80369-7 Table B.2',
    items: [
      {
        id: 'fs-opening-id',
        featureName: '母錐開口內徑 (Opening Inner Diameter)',
        featureNameEn: 'Opening Inner Diameter',
        iso594Symbol: 'D',
        iso80369Symbol: 'ØD',
        iso594Spec: '測量於最前端開口：剛性/半剛性 4.270 - 4.315 mm',
        iso80369SpecRigid: '4.225 - 4.270 mm (距開口內縮 0.750 mm 剖面處)',
        iso80369SpecSemiRigid: '4.198 - 4.298 mm (建議最小 4.225 mm)',
        changeType: 'datum-shift',
        changeTypeLabel: '基準面內縮 (Datum Shift)',
        datumShiftNote: '測量剖面自開口面往內移動 0.750 mm，因 6% 錐度使公差帶數值減少 -0.045 mm (0.75 * 0.06 = 0.045 mm)。',
        engineeringExplanation: '母接頭開口內徑剖面內移 0.75mm。若塑膠材料為半剛性 (如 PP/PC)，新版特別給予較寬的 4.198-4.298mm 公差，但建議保持在 ≥4.225mm 以防塑膠後縮變形。',
        numericLimits: {
          iso594Min: 4.270,
          iso594Max: 4.315,
          iso80369RigidMin: 4.225,
          iso80369RigidMax: 4.270,
          iso80369SemiRigidMin: 4.198,
          iso80369SemiRigidMax: 4.298,
          unit: 'mm'
        }
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
        changeType: 'same',
        changeTypeLabel: '符號變更 (F→E) + 增設上限',
        engineeringExplanation: '舊版使用符號 F，新版改為大寫 E。新增 10.500mm 上限限制，圖面應將符號及公差上限一併修正。',
        numericLimits: {
          iso594Min: 7.500,
          iso80369RigidMin: 7.500,
          iso80369RigidMax: 10.500,
          unit: 'mm'
        }
      },
      {
        id: 'fs-base-id',
        featureName: '母錐體底部參考內徑 (Base Inner Diameter)',
        featureNameEn: 'Base Inner Diameter',
        iso594Symbol: '無管制',
        iso80369Symbol: 'ØG',
        iso594Spec: '無明確單獨標註',
        iso80369SpecRigid: '3.820 - 3.865 mm (距開口 7.500 mm 深處)',
        iso80369SpecSemiRigid: '3.793 - 3.893 mm (建議最小 3.820 mm)',
        changeType: 'new-feature',
        changeTypeLabel: '全新幾何控制剖面',
        engineeringExplanation: '新增距開口 7.50mm 深處的內部尺寸 ØG，確保內部圓錐腔體的錐度與全平滑度。',
        numericLimits: {
          iso80369RigidMin: 3.820,
          iso80369RigidMax: 3.865,
          iso80369SemiRigidMin: 3.793,
          iso80369SemiRigidMax: 3.893,
          unit: 'mm'
        }
      },
      {
        id: 'fs-body-od',
        featureName: '母接頭本體最大外徑 (Body Max OD)',
        featureNameEn: 'Body Outer Diameter',
        iso594Symbol: '無管制',
        iso80369Symbol: 'ØJ',
        iso594Spec: '無明確限制',
        iso80369SpecRigid: '6.000 - 6.730 mm',
        iso80369SpecSemiRigid: '6.000 - 6.730 mm',
        changeType: 'new-feature',
        changeTypeLabel: '全新包絡外徑管制',
        engineeringExplanation: '防範母滑套接頭外部肋條或壁厚過大，導致無法順利插入公鎖固接頭的外螺紋套環內。',
        numericLimits: {
          iso80369RigidMin: 6.000,
          iso80369RigidMax: 6.730,
          unit: 'mm'
        }
      }
    ]
  },
  {
    id: 'male-lock',
    title: '公鎖固接頭 (Male Luer Lock)',
    titleEn: 'Male Luer Lock Connector',
    description: '帶有內部內螺紋套環的公接頭。包含前述 Male Slip 之圓錐體尺寸，再加上螺紋角度、大徑/小徑、套環外徑及降為輔助尺寸的 t 軸向距離。',
    standardRef: 'ISO 594-2 Clause 4.2 vs. ISO 80369-7 Table B.3 & B.4',
    items: [
      {
        id: 'ml-bearing-angle',
        featureName: '受力面螺紋角 (Bearing Surface Angle)',
        featureNameEn: 'Bearing Surface Angle',
        iso594Symbol: 'α',
        iso80369Symbol: 'σ',
        iso594Spec: '25° (+5° / -0°)',
        iso80369SpecRigid: '25.0° - 30.0°',
        iso80369SpecSemiRigid: '25.0° - 30.0°',
        changeType: 'same',
        changeTypeLabel: '符號更新 (α→σ)',
        engineeringExplanation: '螺紋主要受力咬合面的傾斜角。幾何範圍同為 25° 至 30°，標準符號由 α 變更為 σ (Sigma)。',
        numericLimits: {
          iso594Min: 25.0,
          iso594Max: 30.0,
          iso80369RigidMin: 25.0,
          iso80369RigidMax: 30.0,
          unit: '°'
        }
      },
      {
        id: 'ml-nonbearing-angle',
        featureName: '非受力面螺紋角 (Non-bearing Surface Angle)',
        featureNameEn: 'Non-bearing Angle',
        iso594Symbol: 'β',
        iso80369Symbol: 'β',
        iso594Spec: '≥ 25° (最小值)',
        iso80369SpecRigid: '≥ 25.0°',
        iso80369SpecSemiRigid: '≥ 25.0°',
        changeType: 'same',
        changeTypeLabel: '規範維持一致',
        engineeringExplanation: '螺紋背面非承載面角度，維持下限 ≥ 25.0°。',
        numericLimits: {
          iso594Min: 25.0,
          iso80369RigidMin: 25.0,
          unit: '°',
          isLowerLimitOnly: true
        }
      },
      {
        id: 'ml-tip-projection',
        featureName: '公錐體突出身管長度 (Tip Projection)',
        featureNameEn: 'Tip Projection Beyond Collar',
        iso594Symbol: 'P',
        iso80369Symbol: 'c',
        iso594Spec: '≥ 2.1 mm',
        iso80369SpecRigid: '≥ 2.100 mm',
        iso80369SpecSemiRigid: '≥ 2.100 mm',
        changeType: 'same',
        changeTypeLabel: '符號變更 (P→c)',
        engineeringExplanation: '圓錐前端突出於螺紋套環開口平面的距離。符號由大寫 P 變更為小寫 c。',
        numericLimits: {
          iso594Min: 2.1,
          iso80369RigidMin: 2.100,
          unit: 'mm',
          isLowerLimitOnly: true
        }
      },
      {
        id: 'ml-thread-major-id',
        featureName: '螺紋大徑/根部直徑 (Thread Major ID / Root)',
        featureNameEn: 'Thread Major Inner Diameter',
        iso594Symbol: 'H',
        iso80369Symbol: 'Øh',
        iso594Spec: '8.0 ± 0.1 mm (7.90 - 8.10 mm)',
        iso80369SpecRigid: '7.900 - 8.100 mm',
        iso80369SpecSemiRigid: '7.900 - 8.100 mm',
        changeType: 'same',
        changeTypeLabel: '符號更新 (H→Øh)',
        engineeringExplanation: '套環內部螺紋根部大徑。公差絕對數值相同，符號由 H 改為 Øh。',
        numericLimits: {
          iso594Min: 7.9,
          iso594Max: 8.1,
          iso80369RigidMin: 7.900,
          iso80369RigidMax: 8.100,
          unit: 'mm'
        }
      },
      {
        id: 'ml-thread-minor-id',
        featureName: '螺紋小徑/波峰直徑 (Thread Minor ID / Crest)',
        featureNameEn: 'Thread Minor Inner Diameter',
        iso594Symbol: 'J',
        iso80369Symbol: 'Øj',
        iso594Spec: '7.0 ± 0.2 mm (6.80 - 7.20 mm)',
        iso80369SpecRigid: '6.800 - 7.200 mm',
        iso80369SpecSemiRigid: '6.800 - 7.200 mm',
        changeType: 'same',
        changeTypeLabel: '符號更新 (J→Øj)',
        engineeringExplanation: '套環內部螺紋牙頂小徑。公差完全相同，符號由 J 改為 Øj。',
        numericLimits: {
          iso594Min: 6.8,
          iso594Max: 7.2,
          iso80369RigidMin: 6.800,
          iso80369RigidMax: 7.200,
          unit: 'mm'
        }
      },
      {
        id: 'ml-first-thread-dist',
        featureName: '至第一圈完整螺紋起始距離 (Distance to 1st Thread)',
        featureNameEn: 'Distance to First Complete Thread',
        iso594Symbol: 'T (強制管制)',
        iso80369Symbol: 't (輔助尺寸)',
        iso594Spec: '≤ 3.2 mm (強制超差判退)',
        iso80369SpecRigid: '(3.200) mm max (降為輔助/參考值)',
        iso80369SpecSemiRigid: '(3.650) mm max [建議維持 (3.200) mm]',
        changeType: 'relaxed-auxiliary',
        changeTypeLabel: '降階為輔助尺寸 (Auxiliary)',
        engineeringExplanation: '重大審查點！實務上極難光學量測螺紋底部起點，新版降階為輔助尺寸（括號標示）。半剛性材料上限放寬至 3.650mm。功能性合規改由抗軸向拉拔力 (6.4) 驗證。',
        numericLimits: {
          iso594Max: 3.2,
          iso80369RigidMax: 3.200,
          iso80369SemiRigidMax: 3.650,
          unit: 'mm',
          isAuxiliary: true,
          isUpperLimitOnly: true
        }
      },
      {
        id: 'ml-collar-od',
        featureName: '螺紋套環外部最大直徑 (Collar Outer Diameter)',
        featureNameEn: 'Collar Outer Diameter',
        iso594Symbol: '無管制',
        iso80369Symbol: 'Øw',
        iso594Spec: '無明確限制',
        iso80369SpecRigid: '8.800 - 11.500 mm',
        iso80369SpecSemiRigid: '8.800 - 11.500 mm',
        changeType: 'new-feature',
        changeTypeLabel: '全新套環外徑限制',
        engineeringExplanation: '限制公鎖固接頭套環外徑不超過 11.500mm，防止夾具或相鄰醫療管道碰撞。',
        numericLimits: {
          iso80369RigidMin: 8.800,
          iso80369RigidMax: 11.500,
          unit: 'mm'
        }
      }
    ]
  },
  {
    id: 'female-lock',
    title: '母鎖固接頭 (Female Luer Lock - Variant A 直凸耳)',
    titleEn: 'Female Luer Lock Connector (Variant A Lugs)',
    description: '外部帶有雙直凸耳 (Rigid/Semi-rigid Lugs) 的母接頭，為醫療器械中最常發生轉版誤判的類型！舊版 F 及 V 弦長被廢除，改由 N1、N2 及 ØJ 直徑全新控制。',
    standardRef: 'ISO 594-2 Clause 4.3 vs. ISO 80369-7 Table B.6 (Variant A)',
    items: [
      {
        id: 'fl-lug-major-od',
        featureName: '凸耳大徑/外山頂直徑 (Major Lug OD)',
        featureNameEn: 'Major Lug Outer Diameter',
        iso594Symbol: '2X',
        iso80369Symbol: 'ØH',
        iso594Spec: '7.83 (+0 / -0.1) mm (7.73 - 7.83 mm)',
        iso80369SpecRigid: '7.730 - 7.830 mm',
        iso80369SpecSemiRigid: '7.730 - 7.830 mm',
        changeType: 'same',
        changeTypeLabel: '符號更新 (2X→ØH)',
        engineeringExplanation: '凸耳最外側對角直徑。幾何範圍相同，符號改標為標準直徑 ØH。',
        numericLimits: {
          iso594Min: 7.73,
          iso594Max: 7.83,
          iso80369RigidMin: 7.730,
          iso80369RigidMax: 7.830,
          unit: 'mm'
        }
      },
      {
        id: 'fl-lug-minor-od',
        featureName: '凸耳根部直徑 (Minor Lug OD / Lug Root)',
        featureNameEn: 'Minor Lug Root Diameter',
        iso594Symbol: 'V (弦長間接定義)',
        iso80369Symbol: 'ØJ',
        iso594Spec: '弦長 V ≥ 3.5 mm (無直徑標註)',
        iso80369SpecRigid: '5.515 - 6.730 mm (直接直徑管制)',
        iso80369SpecSemiRigid: '5.515 - 6.730 mm',
        changeType: 'method-change',
        changeTypeLabel: '量測方法重大變更 (弦長→直徑)',
        engineeringExplanation: '【繪圖修圖重點】舊版用弦長 V 間接控制，三次元極難量測。新版徹底廢除 V 弦長，直接改標根部圓柱直徑 ØJ (5.515-6.730mm)！2D圖面必須改標 ØJ。',
        numericLimits: {
          iso80369RigidMin: 5.515,
          iso80369RigidMax: 6.730,
          unit: 'mm'
        }
      },
      {
        id: 'fl-lug-leading-n1',
        featureName: '凸耳前緣定位距離 (Lug Leading Edge Position)',
        featureNameEn: 'Lug Leading Edge Position (N1)',
        iso594Symbol: 'F (標稱 0.20 mm)',
        iso80369Symbol: 'N1',
        iso594Spec: 'F = 0.20 mm (凸耳邊緣距開口端面距離)',
        iso80369SpecRigid: '≤ 1.200 mm (由開口端面往內測量)',
        iso80369SpecSemiRigid: '≤ 1.200 mm (由開口端面往內測量)',
        changeType: 'new-feature',
        changeTypeLabel: '幾何結構重構 (廢除 F 改 N1/N2)',
        engineeringExplanation: '【致命審查點】舊版 F 尺寸已作廢！新版定義在直徑 6.730mm 剖面上，從開口面往內量測凸耳前端螺旋進程，限制 N1 ≤ 1.200mm。舊圖面無 N1 屬重大缺失！',
        numericLimits: {
          iso80369RigidMax: 1.200,
          unit: 'mm',
          isUpperLimitOnly: true
        }
      },
      {
        id: 'fl-lug-trailing-n2',
        featureName: '凸耳後緣定位距離 (Lug Trailing Edge Position)',
        featureNameEn: 'Lug Trailing Edge Position (N2)',
        iso594Symbol: 'Y (底寬 ≤ 1.2 mm)',
        iso80369Symbol: 'N2',
        iso594Spec: '凸耳基底寬度 Y ≤ 1.2 mm',
        iso80369SpecRigid: '≤ 2.070 mm (由開口端面往內測量)',
        iso80369SpecSemiRigid: '≤ 2.070 mm (由開口端面往內測量)',
        changeType: 'new-feature',
        changeTypeLabel: '幾何結構重構 (廢除 Y 改 N2)',
        engineeringExplanation: '【致命審查點】新版規範凸耳後緣螺旋最大退後距離 N2 ≤ 2.070mm，確保公母接頭旋緊時螺紋完全咬合且不卡死。',
        numericLimits: {
          iso80369RigidMax: 2.070,
          unit: 'mm',
          isUpperLimitOnly: true
        }
      },
      {
        id: 'fl-lug-crest-width',
        featureName: '凸耳山頂波峰寬度 (Lug Crest Width)',
        featureNameEn: 'Lug Crest Width',
        iso594Symbol: 'S',
        iso80369Symbol: 'M',
        iso594Spec: '≥ 0.3 mm',
        iso80369SpecRigid: '≥ 0.300 mm',
        iso80369SpecSemiRigid: '≥ 0.300 mm',
        changeType: 'same',
        changeTypeLabel: '符號變更 (S→M)',
        engineeringExplanation: '凸耳最外側平坦波峰寬度。符號由 S 改為大寫 M。',
        numericLimits: {
          iso594Min: 0.3,
          iso80369RigidMin: 0.300,
          unit: 'mm',
          isLowerLimitOnly: true
        }
      },
      {
        id: 'fl-lug-bearing-angle',
        featureName: '凸耳受力面角度 (Lug Bearing Angle)',
        featureNameEn: 'Lug Bearing Surface Angle',
        iso594Symbol: 'α',
        iso80369Symbol: 'Σ',
        iso594Spec: '25° (+5° / -0°)',
        iso80369SpecRigid: '25.0° - 30.0°',
        iso80369SpecSemiRigid: '25.0° - 30.0°',
        changeType: 'same',
        changeTypeLabel: '符號變更 (α→Σ)',
        engineeringExplanation: '凸耳與螺紋咬合受力面的角度。符號由小寫 α 變更為大寫 Σ (Sigma)。',
        numericLimits: {
          iso594Min: 25.0,
          iso594Max: 30.0,
          iso80369RigidMin: 25.0,
          iso80369RigidMax: 30.0,
          unit: '°'
        }
      },
      {
        id: 'fl-lug-base-dist',
        featureName: '凸耳根部距端面深 (Dist to Lug Base)',
        featureNameEn: 'Distance to Lug Base',
        iso594Symbol: '無管制',
        iso80369Symbol: 'Q',
        iso594Spec: '無明確限制',
        iso80369SpecRigid: '≤ 0.300 mm',
        iso80369SpecSemiRigid: '≤ 0.300 mm',
        changeType: 'new-feature',
        changeTypeLabel: '全新幾何控制',
        engineeringExplanation: '限制凸耳起點與端面之間的沉入深度，防止凸耳過深造成旋緊干涉。',
        numericLimits: {
          iso80369RigidMax: 0.300,
          unit: 'mm',
          isUpperLimitOnly: true
        }
      }
    ]
  }
];

export const TEST_REQUIREMENTS_DATA: TestRequirementItem[] = [
  {
    id: 'test-liquid-leakage',
    testName: '正壓液體洩漏測試 (Liquid Leakage)',
    testNameEn: 'Positive Pressure Liquid Leakage Test',
    iso594Spec: '300 kPa 充水壓力，維持 30 秒。合格判定：無脫落水滴 (No falling drop)。',
    iso80369Spec: '雙軌可選：1. 水壓 300 - 330 kPa 持壓 30-35 秒，無滴落水；2. 氣壓降法 300 - 330 kPa，洩漏率 ≤ 0.005 Pa·m³/s (持壓 15-20 秒)。',
    keyDifference: '新增可自動化精準量測的「氣壓降法 (Pressure Decay)」，水壓上限及持壓時間區間精確化。',
    severity: 'high',
    impactArea: 'QA/QC Lab'
  },
  {
    id: 'test-vacuum-leakage',
    testName: '抽吸負壓氣密性 (Sub-atmospheric Leakage)',
    testNameEn: 'Sub-atmospheric Air Leakage Test',
    iso594Spec: '注射器抽水 25%，堵住出口手拉活塞至滿刻度，目視 15 秒內是否有持續氣泡。',
    iso80369Spec: '真空儀器定量檢測：施加 80.0 - 88.0 kPa 負壓 (真空)，持壓 15-20 秒，氣體洩漏率不得超過 0.005 Pa·m³/s。',
    keyDifference: '淘汰傳統人工目視抽水法，全面改用真空儀器定量數位化洩漏率判定。',
    severity: 'high',
    impactArea: 'Equipment Purchase'
  },
  {
    id: 'test-axial-separation',
    testName: '抗軸向拉拔分離力 (Axial Load Separation)',
    testNameEn: 'Resistance to Separation from Axial Load',
    iso594Spec: '一律施加 25 N 軸向拉力，拉伸速率 10 N/s，維持 10 秒，接頭不可分離。',
    iso80369Spec: '區分接頭類型：1. 滑套型 (Slip): 23 - 25 N 持壓 10-15s; 2. 鎖固型 (Lock): 大幅提高至 32 - 35 N 持壓 10-15s。',
    keyDifference: '鎖固型 (Luer Lock) 拉拔測試力由 25 N 提升至 32-35 N！偏軟塑膠需防拉脫。',
    severity: 'critical',
    impactArea: 'R&D Verification'
  },
  {
    id: 'test-unscrewing-torque',
    testName: '抗旋卸分離力 (Unscrewing Torque)',
    testNameEn: 'Resistance to Unscrewing Separation',
    iso594Spec: '無具體定量物理扭矩標準（僅定性描述不可輕易鬆開）。',
    iso80369Spec: '【僅限 Luer Lock】施加 0.018 N·m - 0.020 N·m 逆時針解鎖扭矩，持壓 10-15 秒，接頭不可鬆脫分離。',
    keyDifference: '全新定量扭矩檢測項目，需採購具備 0.001 N·m 解析度的精密扭力測試儀。',
    severity: 'high',
    impactArea: 'Equipment Purchase'
  },
  {
    id: 'test-overriding-torque',
    testName: '抗過載/抗滑牙測試 (Resistance to Overriding)',
    testNameEn: 'Resistance to Overriding Torque',
    iso594Spec: '無扭矩過載破壞測試。',
    iso80369Spec: '【僅限 Luer Lock】施加 0.15 N·m - 0.17 N·m 順時針過載鎖緊扭矩，持壓 5-10 秒，螺紋或凸耳不可滑牙跳牙。',
    keyDifference: '防止使用者過度擰緊導致螺紋塑性滑牙崩塌，考驗模具與材料剛性。',
    severity: 'critical',
    impactArea: 'Mold & Tooling'
  },
  {
    id: 'test-stress-cracking',
    testName: '應力龜裂試驗 (Stress Cracking)',
    testNameEn: 'Resistance to Stress Cracking',
    iso594Spec: '組裝後靜置 24小時 (針頭) 或 48小時 (其他)，僅目視檢查有無龜裂。',
    iso80369Spec: '依 ISO 80369-20 Annex E 預塗應力組裝靜置後，【必須再次通過 6.1.1 液體洩漏測試】。',
    keyDifference: '取消純目視放行，要求靜置後必須進行功能性正壓洩漏測試驗證！',
    severity: 'medium',
    impactArea: 'QA/QC Lab'
  },
  {
    id: 'test-misconnection',
    testName: '防錯接特性驗證 (Non-interconnectable)',
    testNameEn: 'Non-interconnectable Design Evaluation',
    iso594Spec: '無跨領域醫療接頭防錯接驗證。',
    iso80369Spec: '強制條款！使用 ISO 80369-7 Annex C 參考件與 N1/N2/E1 等跨領域標準件進行 CAD 干涉或物理干涉測試。',
    keyDifference: 'ISO 80369 系列的核心要求，確保血管 Luer 不會誤插腸創、神經軸或呼吸管路。',
    severity: 'critical',
    impactArea: 'R&D Verification'
  }
];
