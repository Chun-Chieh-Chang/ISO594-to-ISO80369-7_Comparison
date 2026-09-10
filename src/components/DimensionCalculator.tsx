import React, { useMemo, useState } from 'react';
import {
  CalculationResult,
  CalculatorInput,
  ComplianceStatus,
  ConnectorCategory,
  MaterialType
} from '../types';
import { DIMENSIONS_DATA } from '../data/dimensionsData';
import { Calculator, CheckCircle2, XCircle, AlertTriangle, RotateCcw, Info, MoveHorizontal, MinusCircle } from 'lucide-react';

interface Props {
  category: ConnectorCategory;
  material: MaterialType;
  onSelectCategory: (cat: ConnectorCategory) => void;
  onSelectMaterial: (mat: MaterialType) => void;
}

/** 6% 錐度：每沿軸向移動 1 mm，直徑變化 0.06 mm */
const TAPER_RATIO = 0.06;
/** ISO 80369-7 Table B.1 / B.2 規定的量測剖面偏移量 */
const DATUM_OFFSET = 0.75;
/** 基準面位移造成的直徑差 = 0.75 × 0.06 */
const DATUM_DELTA = 0.045;

interface Limits {
  min?: number;
  max?: number;
}

const round3 = (v: number) => Math.round(v * 1000) / 1000;

function statusOf(value: number, lim: Limits): ComplianceStatus {
  if (lim.min === undefined && lim.max === undefined) return 'not-applicable';
  if (lim.min !== undefined && value < lim.min) return 'fail';
  if (lim.max !== undefined && value > lim.max) return 'fail';
  return 'pass';
}

function rangeText(lim: Limits, note?: string): string {
  const suffix = note ? ` ${note}` : '';
  if (lim.min === undefined && lim.max === undefined) return `無對應管制${suffix}`;
  if (lim.min === undefined) return `≤ ${lim.max!.toFixed(3)} mm${suffix}`;
  if (lim.max === undefined) return `≥ ${lim.min.toFixed(3)} mm${suffix}`;
  return `${lim.min.toFixed(3)} - ${lim.max.toFixed(3)} mm${suffix}`;
}

const isMaleCat = (c: ConnectorCategory) => c.startsWith('male');
const isFemaleCat = (c: ConnectorCategory) => c.startsWith('female');
const isMaleLockCat = (c: ConnectorCategory) => c === 'male-lock' || c === 'male-lock-rotatable';
const isFemaleLockCat = (c: ConnectorCategory) => isFemaleCat(c) && c !== 'female-slip';
const isRigidOnlyCat = (c: ConnectorCategory) => c === 'female-lock-b' || c === 'female-lock-c';

/** 凸耳／螺紋根部直徑 ØJ 的限值，依變體而異 */
function lugRootLimits(c: ConnectorCategory): { old: Limits; next: Limits } {
  if (c === 'female-slip') return { old: {}, next: { min: 6.0, max: 6.73 } };
  if (c === 'female-lock-b' || c === 'female-lock-c') return { old: { max: 5.7 }, next: { min: 5.515, max: 5.7 } };
  return { old: { max: 6.73 }, next: { min: 5.515, max: 6.73 } };
}

/** 凸耳大徑 ØH / H 的限值，依變體而異 */
function lugMajorLimits(c: ConnectorCategory): { old: Limits; next: Limits; label: string } {
  if (c === 'female-lock-b') {
    return { old: { min: 7.7, max: 7.8 }, next: { min: 7.7, max: 7.8 }, label: '凸耳大徑對角 (H，非直徑)' };
  }
  if (c === 'female-lock-c') {
    return { old: { min: 7.7, max: 7.8 }, next: { min: 7.7, max: 7.8 }, label: '凸耳大徑 (ØH)' };
  }
  return { old: { min: 7.73, max: 7.83 }, next: { min: 7.73, max: 7.83 }, label: '凸耳／螺紋大徑 (ØH)' };
}

const DEFAULTS: CalculatorInput = {
  category: 'male-slip',
  material: 'semi-rigid',
  tipOD_d: 3.97,
  openID_D: 4.225,
  throughBore_f: 2.8,
  firstThread_t: 3.1,
  lugLeading_N1: 1.1,
  lugTrailing_N2: 1.9,
  lugRoot_J: 6.2,
  lugMajor_H: 7.78,
  taperLength_e: 8.5,
  measuredAt075Offset: true
};

export const DimensionCalculator: React.FC<Props> = ({
  category,
  material,
  onSelectCategory,
  onSelectMaterial
}) => {
  const [values, setValues] = useState<Omit<CalculatorInput, 'category' | 'material'>>({
    tipOD_d: DEFAULTS.tipOD_d,
    openID_D: DEFAULTS.openID_D,
    throughBore_f: DEFAULTS.throughBore_f,
    firstThread_t: DEFAULTS.firstThread_t,
    lugLeading_N1: DEFAULTS.lugLeading_N1,
    lugTrailing_N2: DEFAULTS.lugTrailing_N2,
    lugRoot_J: DEFAULTS.lugRoot_J,
    lugMajor_H: DEFAULTS.lugMajor_H,
    taperLength_e: DEFAULTS.taperLength_e,
    measuredAt075Offset: DEFAULTS.measuredAt075Offset
  });

  const setValue = <K extends keyof typeof values>(field: K, value: (typeof values)[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const readNumber = (raw: string): number | undefined => {
    if (raw.trim() === '') return undefined;
    const n = parseFloat(raw);
    return Number.isNaN(n) ? undefined : n;
  };

  /** Variant B/C 僅供剛性材料設計，強制以剛性限值評估 */
  const effectiveMaterial: MaterialType = isRigidOnlyCat(category) ? 'rigid' : material;
  const isRigid = effectiveMaterial === 'rigid';
  const atOffset = values.measuredAt075Offset;

  const results = useMemo<CalculationResult[]>(() => {
    const list: CalculationResult[] = [];

    const push = (
      paramId: string,
      paramName: string,
      measured: number,
      at594: number,
      at80369: number,
      oldLim: Limits,
      newLim: Limits,
      opts: {
        datumShift?: boolean;
        oldNote?: string;
        newNote?: string;
        auxiliary?: boolean;
        advice: (s594: ComplianceStatus, s80369: ComplianceStatus) => string;
      }
    ) => {
      const s594 = statusOf(at594, oldLim);
      let s80369 = statusOf(at80369, newLim);
      // 輔助尺寸超差不判退，僅示警（功能性合規改由 6.4 驗證）
      if (opts.auxiliary && s80369 === 'fail') s80369 = 'warning';
      list.push({
        paramId,
        paramName,
        measuredValue: measured,
        measuredAtOffset: atOffset,
        valueAt594Datum: round3(at594),
        valueAt80369Datum: round3(at80369),
        datumShiftApplied: !!opts.datumShift,
        iso594Status: s594,
        iso594Range: rangeText(oldLim, opts.oldNote),
        iso80369Status: s80369,
        iso80369Range: rangeText(newLim, opts.newNote),
        advice: opts.advice(s594, s80369)
      });
    };

    // ── 公錐前端外徑 Ød（基準面位移項）
    if (isMaleCat(category) && values.tipOD_d !== undefined) {
      const m = values.tipOD_d;
      // 公錐：0.75 mm 剖面的直徑比端面大 0.045 mm
      const atTip = atOffset ? m - DATUM_DELTA : m;
      const atPlane = atOffset ? m : m + DATUM_DELTA;
      push(
        'tipOD',
        '公錐體前端外徑 (Ød)',
        m,
        atTip,
        atPlane,
        { min: 3.925, max: isRigid ? 3.99 : 4.027 },
        { min: 3.97, max: isRigid ? 4.035 : 4.072 },
        {
          datumShift: true,
          oldNote: '@ 端面',
          newNote: '@ 0.750 mm 剖面',
          advice: (s594, s80369) => {
            if (s80369 === 'fail' && s594 === 'pass')
              return '換算後不符 ISO 80369-7，但符合舊版 —— 屬轉版新增之判退風險，請檢查模具公錐外徑縮模量。';
            if (s80369 === 'fail') return '兩版皆不符，錐體外徑本身超出規格，須修模。';
            if (s594 === 'fail') return '符合 ISO 80369-7，但依舊版基準換算後超出 ISO 594 —— 舊圖面若仍在流通須留意。';
            return '兩版基準換算後皆符合。';
          }
        }
      );
    }

    // ── 公錐前端內孔 Øf（防錯接）
    if (isMaleCat(category) && values.throughBore_f !== undefined) {
      const m = values.throughBore_f;
      push('bore_f', '前端內孔直徑 (Øf)', m, m, m, {}, { max: 2.9 }, {
        newNote: '(未定義下限)',
        advice: (_s594, s80369) =>
          s80369 === 'fail'
            ? '嚴重違規：內孔大於 2.900 mm，無法通過防錯接驗證，且可能與 ISO 80369-6 神經軸接頭誤接。'
            : '符合防錯接內孔上限。ISO 80369-7 刻意不定義下限，以容納玻璃針筒的極小內孔。'
      });
    }

    // ── 母錐開口內徑 ØD（基準面位移項）
    if (isFemaleCat(category) && values.openID_D !== undefined) {
      const m = values.openID_D;
      // 母錐：0.75 mm 剖面的直徑比端面小 0.045 mm
      const atFace = atOffset ? m + DATUM_DELTA : m;
      const atPlane = atOffset ? m : m - DATUM_DELTA;
      push(
        'openID',
        '母錐開口內徑 (ØD)',
        m,
        atFace,
        atPlane,
        { min: 4.27, max: 4.315 },
        { min: isRigid ? 4.225 : 4.198, max: isRigid ? 4.27 : 4.298 },
        {
          datumShift: true,
          oldNote: '@ 端面',
          newNote: '@ 內縮 0.750 mm 剖面',
          advice: (s594, s80369) => {
            if (s80369 === 'fail') return '換算後不符 ISO 80369-7 開口內徑規範，請檢查母模芯尺寸與成型收縮。';
            if (!isRigid && atPlane < 4.225)
              return '符合半剛性公差帶，但低於 Table B.2 註 b 建議的 4.225 mm —— 與部分公鎖固接頭可能咬合不足，建議提高。';
            if (s594 === 'fail')
              return '符合 ISO 80369-7，但依舊版基準換算後超出 ISO 594 —— 屬新版放寬所致（半剛性公差帶較寬）。';
            return '兩版基準換算後皆符合。';
          }
        }
      );
    }

    // ── 錐體長度 e / 母錐深度 E
    if (values.taperLength_e !== undefined) {
      const m = values.taperLength_e;
      const name = isMaleCat(category) ? '公錐體有效長度 (e)' : '母錐體有效深度 (E)';
      push('taperLength', name, m, m, m, { min: 7.5 }, { min: 7.5, max: 10.5 }, {
        oldNote: '(無上限)',
        advice: (_s594, s80369) =>
          s80369 === 'fail'
            ? m > 10.5
              ? '超過新增的 10.500 mm 上限 —— 舊版不判退，屬轉版新增之判退風險。'
              : '低於 7.500 mm 最小值，兩版皆判退。'
            : '符合。此尺寸同時定義接頭的延伸範圍 (extent of the connector)。'
      });
    }

    // ── 公鎖固：至第一圈完整螺紋距離 t（輔助尺寸）
    if (isMaleLockCat(category) && values.firstThread_t !== undefined) {
      const m = values.firstThread_t;
      const newMax = isRigid ? 3.2 : 3.65;
      push('firstThread_t', '至第一圈螺紋起點距離 (t)', m, m, m, { max: 3.2 }, { max: newMax }, {
        auxiliary: true,
        oldNote: '(強制管制)',
        newNote: '(輔助尺寸)',
        advice: (s594, s80369) => {
          if (s594 === 'fail' && s80369 !== 'fail' && s80369 !== 'warning')
            return '舊版判退，但半剛性材料在新版放寬至 3.650 mm 且已降為輔助尺寸；功能性合規改由 6.4 抗軸向分離 (32-35 N) 驗證。';
          if (s80369 === 'warning')
            return '超出輔助尺寸建議上限。輔助尺寸不直接判退，但必須通過 6.4 抗軸向分離測試，且 Table B.3 註 c 建議半剛性仍維持 3.200 mm。';
          if (!isRigid && m > 3.2)
            return '符合半剛性輔助上限，但註 c 建議維持 3.200 mm 以確保與所有母鎖固接頭咬合。';
          return '符合第一圈螺紋起點輔助參考值。';
        }
      });
    }

    // ── 母鎖固：凸耳大徑 ØH / H
    if (isFemaleLockCat(category) && values.lugMajor_H !== undefined) {
      const m = values.lugMajor_H;
      const { old, next, label } = lugMajorLimits(category);
      push('lugMajor_H', label, m, m, m, old, next, {
        advice: (_s594, s80369) =>
          s80369 === 'fail'
            ? '凸耳大徑超出範圍，將影響與公接頭套環的咬合與防錯接判定。'
            : category === 'female-lock-b'
            ? '符合。注意 Variant B 量測的是「對角」(H，無 Ø)，Variant A/C 量測的是圓柱直徑 (ØH)。'
            : '符合凸耳大徑管制。'
      });
    }

    // ── 母接頭：包絡／凸耳根部直徑 ØJ
    if (isFemaleCat(category) && values.lugRoot_J !== undefined) {
      const m = values.lugRoot_J;
      const { old, next } = lugRootLimits(category);
      const name = category === 'female-slip' ? '本體包絡外徑 (ØJ)' : '凸耳／螺紋根部直徑 (ØJ)';
      push('lugRoot_J', name, m, m, m, old, next, {
        oldNote: category === 'female-slip' ? '' : '(僅上限)',
        advice: (s594, s80369) => {
          if (s80369 === 'fail' && next.min !== undefined && m < next.min)
            return `低於新增的下限 ${next.min.toFixed(3)} mm —— 舊版無下限故不判退，屬轉版新增之判退風險。`;
          if (s80369 === 'fail') return '超出上限，且自端面起 5.5 mm 內皆不得超過此值。';
          if (s594 === 'not-applicable') return '符合。母滑套的 ØJ 為全新包絡直徑管制，同時是防錯接關鍵特徵。';
          return '符合。上限與「自端面 5.5 mm 內不得放大」之條件沿用舊版 G，新版僅補上下限。';
        }
      });
    }

    // ── 母鎖固 Variant A：N1 / N2
    if (category === 'female-lock' && values.lugLeading_N1 !== undefined) {
      const m = values.lugLeading_N1;
      push('lugN1', '凸耳前緣定位距離 (N1)', m, m, m, {}, { max: 1.2 }, {
        oldNote: '(Variant A 無此尺寸)',
        advice: (_s594, s80369) =>
          s80369 === 'fail'
            ? '凸耳前緣 N1 超過 1.200 mm，旋緊時可能導致螺紋預緊卡死。'
            : '符合。自端面往內量測，於對應 6.730 之直徑處。舊版 Variant A 無此尺寸，舊圖面未標註屬重大缺失。'
      });
    }
    if (category === 'female-lock' && values.lugTrailing_N2 !== undefined) {
      const m = values.lugTrailing_N2;
      push('lugN2', '凸耳後緣定位距離 (N2)', m, m, m, {}, { max: 2.07 }, {
        oldNote: '(Variant A 無此尺寸)',
        advice: (_s594, s80369) =>
          s80369 === 'fail'
            ? '凸耳後緣 N2 超過 2.070 mm 上限，螺紋咬合圈數不足。'
            : '符合凸耳後緣定位規範。'
      });
    }

    return list;
  }, [category, effectiveMaterial, values, atOffset, isRigid]);

  const activeCategory = DIMENSIONS_DATA.find((c) => c.id === category);

  const resetDefaults = () => {
    setValues({
      tipOD_d: DEFAULTS.tipOD_d,
      openID_D: DEFAULTS.openID_D,
      throughBore_f: DEFAULTS.throughBore_f,
      firstThread_t: DEFAULTS.firstThread_t,
      lugLeading_N1: DEFAULTS.lugLeading_N1,
      lugTrailing_N2: DEFAULTS.lugTrailing_N2,
      lugRoot_J: DEFAULTS.lugRoot_J,
      lugMajor_H: DEFAULTS.lugMajor_H,
      taperLength_e: DEFAULTS.taperLength_e,
      measuredAt075Offset: DEFAULTS.measuredAt075Offset
    });
  };

  const numberField = (
    field: keyof typeof values,
    label: string,
    hint: string,
    hintTone: 'muted' | 'alert' = 'muted'
  ) => {
    const raw = values[field];
    return (
      <div key={field}>
        <div className="flex justify-between text-[13px] mb-1 gap-2">
          <label htmlFor={`calc-${field}`} className="text-slate-800 font-bold">
            {label}
          </label>
          <span
            className={`font-mono text-[13px] ${
              hintTone === 'alert' ? 'text-rose-700 font-black' : 'text-slate-500'
            }`}
          >
            {hint}
          </span>
        </div>
        <input
          id={`calc-${field}`}
          type="number"
          step="0.001"
          inputMode="decimal"
          value={typeof raw === 'number' ? raw : ''}
          onChange={(e) => setValue(field, readNumber(e.target.value) as never)}
          className="w-full bg-white border border-slate-300 text-slate-900 text-[13px] rounded-lg p-2 font-mono font-bold focus:border-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
        />
      </div>
    );
  };

  const statusPill = (status: ComplianceStatus, label: string) => {
    const map: Record<ComplianceStatus, string> = {
      pass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      fail: 'bg-rose-100 text-rose-900 border-rose-300',
      warning: 'bg-amber-100 text-amber-900 border-amber-300',
      'not-applicable': 'bg-slate-100 text-slate-600 border-slate-300'
    };
    const icon =
      status === 'pass' ? (
        <CheckCircle2 className="w-3.5 h-3.5" />
      ) : status === 'warning' ? (
        <AlertTriangle className="w-3.5 h-3.5" />
      ) : status === 'fail' ? (
        <XCircle className="w-3.5 h-3.5" />
      ) : (
        <MinusCircle className="w-3.5 h-3.5" />
      );
    const text =
      status === 'not-applicable' ? 'N/A' : status === 'warning' ? 'WARN' : status.toUpperCase();
    return (
      <span
        className={`text-[13px] px-2.5 py-1 rounded-md font-mono font-black tracking-wider border inline-flex items-center gap-1 ${map[status]}`}
      >
        {icon}
        {label}: {text}
      </span>
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 mb-6">
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-600" />
            實測 / CAD 尺寸合規評估計算器
          </h2>
          <p className="text-slate-600 text-[13px] mt-1">
            輸入量測值後，系統會將其換算至<strong className="text-slate-900">兩個標準各自的基準面</strong>，再分別判定 —— 換算是雙向可逆的，切換量測剖面不會改變結論。
          </p>
        </div>
        <button
          onClick={resetDefaults}
          className="text-[13px] font-mono font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5 self-start sm:self-auto transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" /> 重置預設數值
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 輸入面板 */}
        <div className="lg:col-span-5 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
          <h3 className="text-[13px] font-black tracking-wider text-amber-900 font-mono flex items-center gap-1.5 pb-2 border-b border-slate-200">
            <Info className="w-4 h-4 text-amber-600" />
            1. 設定接頭條件與量測基準
          </h3>

          <div>
            <label htmlFor="calc-category" className="text-[13px] text-slate-800 font-bold block mb-1">
              接頭類型（與尺寸比對表連動）
            </label>
            <select
              id="calc-category"
              value={category}
              onChange={(e) => onSelectCategory(e.target.value as ConnectorCategory)}
              className="w-full bg-white border border-slate-300 text-slate-900 text-[13px] font-mono font-bold rounded-lg p-2.5 focus:border-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
            >
              {DIMENSIONS_DATA.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.tabLabel}
                </option>
              ))}
            </select>
            {activeCategory && (
              <p className="text-[13px] text-slate-500 font-mono mt-1">{activeCategory.standardRef}</p>
            )}
          </div>

          <div>
            <span className="text-[13px] text-slate-800 font-bold block mb-1">材料剛性類別</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onSelectMaterial('semi-rigid')}
                disabled={isRigidOnlyCat(category)}
                aria-pressed={effectiveMaterial === 'semi-rigid'}
                className={`py-2 px-3 rounded-lg text-[13px] font-black tracking-wider border text-center transition-all disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
                  effectiveMaterial === 'semi-rigid'
                    ? 'bg-purple-100 text-purple-900 border-purple-500'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                半剛性 (PP/PC)
              </button>
              <button
                type="button"
                onClick={() => onSelectMaterial('rigid')}
                aria-pressed={effectiveMaterial === 'rigid'}
                className={`py-2 px-3 rounded-lg text-[13px] font-black tracking-wider border text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
                  effectiveMaterial === 'rigid'
                    ? 'bg-blue-100 text-blue-900 border-blue-500'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                剛性 (金屬/玻璃)
              </button>
            </div>
            {isRigidOnlyCat(category) && (
              <p className="text-[13px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5 mt-2">
                本變體依標準僅供剛性材料設計使用，已鎖定為剛性限值。
              </p>
            )}
          </div>

          <fieldset className="bg-white p-3 rounded-lg border border-slate-200">
            <legend className="text-[13px] text-slate-800 font-bold px-1">量測剖面 (Measurement Plane)</legend>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="datumMode"
                  checked={atOffset}
                  onChange={() => setValue('measuredAt075Offset', true)}
                  className="text-blue-600"
                />
                <span>
                  ISO 80369-7 剖面：距端面 <strong className="text-slate-900 font-mono">0.750 mm</strong> 處
                </span>
              </label>
              <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="datumMode"
                  checked={!atOffset}
                  onChange={() => setValue('measuredAt075Offset', false)}
                  className="text-blue-600"
                />
                <span>
                  ISO 594 剖面：<strong className="text-slate-900 font-mono">端面 (0.000 mm)</strong>
                </span>
              </label>
            </div>
            <p className="text-[13px] text-slate-500 mt-2 pt-2 border-t border-slate-100 leading-relaxed">
              此設定僅影響 Ød 與 ØD（唯二具基準差異的項目）。系統會同時換算出另一基準的等效值，兩個判定皆據各自基準計算。
            </p>
          </fieldset>

          <div className="pt-2 border-t border-slate-200 space-y-3">
            <h4 className="text-[13px] font-black tracking-wider text-slate-800 font-mono">
              2. 輸入量測數值 (mm)
            </h4>

            {isMaleCat(category) && (
              <>
                {numberField('tipOD_d', '公錐外徑 Ød', isRigid ? '3.970 - 4.035' : '3.970 - 4.072')}
                {numberField('throughBore_f', '前端內孔 Øf', '上限 ≤ 2.900', 'alert')}
              </>
            )}

            {isFemaleCat(category) &&
              numberField('openID_D', '母錐開口內徑 ØD', isRigid ? '4.225 - 4.270' : '4.198 - 4.298')}

            {numberField(
              'taperLength_e',
              isMaleCat(category) ? '公錐長度 e' : '母錐深度 E',
              '7.500 - 10.500'
            )}

            {isMaleLockCat(category) &&
              numberField('firstThread_t', '至第一圈螺紋 t', isRigid ? '輔助 (3.200)' : '輔助 (3.650)')}

            {isFemaleLockCat(category) &&
              numberField(
                'lugMajor_H',
                lugMajorLimits(category).label,
                rangeText(lugMajorLimits(category).next).replace(' mm', '')
              )}

            {isFemaleCat(category) &&
              numberField(
                'lugRoot_J',
                category === 'female-slip' ? '本體包絡外徑 ØJ' : '凸耳根部直徑 ØJ',
                rangeText(lugRootLimits(category).next).replace(' mm', '')
              )}

            {category === 'female-lock' && (
              <div className="grid grid-cols-2 gap-2">
                {numberField('lugLeading_N1', '凸耳前緣 N1', '≤ 1.200')}
                {numberField('lugTrailing_N2', '凸耳後緣 N2', '≤ 2.070')}
              </div>
            )}
          </div>
        </div>

        {/* 結果面板 */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-[13px] font-black tracking-wider text-emerald-800 font-mono flex items-center gap-1.5 pb-2 border-b border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            3. 雙標準合規判定
          </h3>

          <div className="space-y-3">
            {results.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-[13px] bg-slate-50 font-mono rounded-xl border border-slate-200">
                請在左側輸入量測數據以檢視審查結果。
              </div>
            ) : (
              results.map((res) => (
                <div key={res.paramId} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <div>
                      <span className="font-black text-slate-900 text-sm">{res.paramName}</span>
                      <span className="text-[13px] text-slate-700 font-mono ml-2">
                        實測 <strong className="text-amber-800 font-black">{res.measuredValue} mm</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {statusPill(res.iso594Status, 'ISO 594')}
                      {statusPill(res.iso80369Status, 'ISO 80369-7')}
                    </div>
                  </div>

                  {res.datumShiftApplied && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-[13px] font-mono text-amber-900 flex items-center gap-2 flex-wrap">
                      <MoveHorizontal className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>
                        端面基準 <strong>{res.valueAt594Datum.toFixed(3)}</strong>
                      </span>
                      <span className="text-amber-600">↔</span>
                      <span>
                        0.750 mm 剖面 <strong>{res.valueAt80369Datum.toFixed(3)}</strong>
                      </span>
                      <span className="text-amber-700">
                        （Δ = {DATUM_OFFSET.toFixed(3)} × {TAPER_RATIO} = {DATUM_DELTA.toFixed(3)} mm）
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13px] font-mono">
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block text-[13px] font-bold">ISO 594 許容範圍</span>
                      <span className="text-slate-800 font-bold">{res.iso594Range}</span>
                      {res.datumShiftApplied && (
                        <span className="block text-slate-500 mt-0.5">
                          比對值 {res.valueAt594Datum.toFixed(3)} mm
                        </span>
                      )}
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block text-[13px] font-bold">ISO 80369-7 許容範圍</span>
                      <span className="text-emerald-800 font-bold">{res.iso80369Range}</span>
                      {res.datumShiftApplied && (
                        <span className="block text-slate-500 mt-0.5">
                          比對值 {res.valueAt80369Datum.toFixed(3)} mm
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-[13px] text-slate-800 leading-relaxed">
                    <strong className="text-amber-800 font-mono font-black">處置建議：</strong> {res.advice}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
