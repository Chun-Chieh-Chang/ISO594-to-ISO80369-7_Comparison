import React, { useState } from 'react';
import { MaterialType } from '../types';
import { BandGroup, ToleranceBandChart } from './ToleranceBandChart';
import { Layers, CheckCircle2, Cpu, AlertTriangle } from 'lucide-react';

interface Props {
  material: MaterialType;
  onSelectMaterial: (mat: MaterialType) => void;
}

const TAPER_RATIO = 0.06;
const DATUM_OFFSET = 0.75;
const DATUM_DELTA = 0.045;

type Side = 'male' | 'female';

interface Band {
  min: number;
  max: number;
}

/** 兩標準各自基準下的公差帶 */
function bands(side: Side, material: MaterialType): { old: Band; next: Band; pureShift: boolean } {
  if (side === 'male') {
    const old: Band = { min: 3.925, max: material === 'rigid' ? 3.99 : 4.027 };
    const next: Band = { min: 3.97, max: material === 'rigid' ? 4.035 : 4.072 };
    return { old, next, pureShift: true };
  }
  const old: Band = { min: 4.27, max: 4.315 };
  const next: Band =
    material === 'rigid' ? { min: 4.225, max: 4.27 } : { min: 4.198, max: 4.298 };
  // 母錐半剛性的公差帶被額外放寬，並非單純平移
  return { old, next, pureShift: material === 'rigid' };
}

/** 尺標的顯示範圍：涵蓋兩種材料的全部公差帶並留白 */
const AXIS = {
  male: { min: 3.9, max: 4.1, step: 0.05, delta: 0.045 },
  female: { min: 4.15, max: 4.35, step: 0.05, delta: -0.045 }
} as const;

export const DatumShiftVisualizer: React.FC<Props> = ({ material, onSelectMaterial }) => {
  const [side, setSide] = useState<Side>('male');
  const { old, next, pureShift } = bands(side, material);
  const isMale = side === 'male';

  const oldSymbol = isMale ? 'd' : 'D';
  const newSymbol = isMale ? 'Ød' : 'ØD';
  const deepSymbol = isMale ? 'Øg' : 'ØG';
  const deepValue = isMale ? 4.375 : 3.82;
  const lengthSymbol = isMale ? 'e' : 'E';
  const axis = AXIS[side];

  const bandGroups: BandGroup[] = (['rigid', 'semi-rigid'] as MaterialType[]).map((m) => {
    const b = bands(side, m);
    return {
      material: m,
      groupLabel: m === 'rigid' ? '剛性材料 RIGID' : '半剛性材料 SEMI-RIGID',
      oldLabel: `ISO 594-1 · ${oldSymbol}`,
      newLabel: `ISO 80369-7 · ${newSymbol}`,
      old: b.old,
      next: b.next,
      pureShift: b.pureShift
    };
  });

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-slate-900 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded text-[13px] font-mono font-black tracking-wider bg-amber-100 text-amber-900 border border-amber-300 mb-2">
            <Cpu className="w-3.5 h-3.5 text-amber-700" aria-hidden="true" /> 基準幾何原理
          </div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
            測量基準面位移原理 (Datum Plane Shift)
          </h2>
          <p className="text-slate-600 text-[13px] mt-1 leading-relaxed max-w-2xl">
            ISO 80369-7 的直徑數字變大（公端）或變小（母端），並非實體幾何改變，而是量測剖面自端面內移
            0.750 mm 所致。
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <div>
            <span className="text-[13px] text-slate-700 font-bold block mb-1">接頭側</span>
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 gap-1">
              {(['male', 'female'] as Side[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSide(s)}
                  aria-pressed={side === s}
                  className={`px-3.5 py-1.5 rounded-md text-[13px] font-bold tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
                    side === s
                      ? s === 'male'
                        ? 'bg-blue-600 text-white font-black'
                        : 'bg-purple-600 text-white font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {s === 'male' ? '公接頭' : '母接頭'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[13px] text-slate-700 font-bold block mb-1">材料（全站連動）</span>
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 gap-1">
              {(['semi-rigid', 'rigid'] as MaterialType[]).map((m) => (
                <button
                  key={m}
                  onClick={() => onSelectMaterial(m)}
                  aria-pressed={material === m}
                  className={`px-3.5 py-1.5 rounded-md text-[13px] font-bold tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
                    material === m
                      ? 'bg-slate-900 text-white font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {m === 'rigid' ? '剛性' : '半剛性'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 公差帶尺標：同一數線上並列兩種材料的新舊公差帶 */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-6">
        <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
          <h3 className="text-[13px] font-mono font-bold tracking-wider text-slate-700">
            公差帶對照尺標
          </h3>
          <span className="text-[13px] font-mono text-slate-500">
            {isMale ? '公接頭前端外徑' : '母錐開口內徑'}　{oldSymbol} → {newSymbol}
          </span>
        </div>

        <div className="overflow-x-auto">
          <ToleranceBandChart
            groups={bandGroups}
            axisMin={axis.min}
            axisMax={axis.max}
            tickStep={axis.step}
            delta={axis.delta}
            activeMaterial={material}
            caption={`${isMale ? '公' : '母'}接頭 ${oldSymbol} → ${newSymbol}`}
          />
        </div>

        <p className="text-[13px] text-slate-600 leading-relaxed mt-3 pt-3 border-t border-slate-200">
          ISO 594-1 於{isMale ? '公錐「端面」量測 d' : '母錐「開口端面」量測 D'}；ISO 80369-7 改於「
          {isMale ? '距端面' : '距開口內縮'} 0.750 mm 剖面」量測 {newSymbol}。因 6 % 錐度，公差帶上下限同步平移{' '}
          {isMale ? '+' : '−'}0.045 mm，實體幾何未變。同一組關係在 {deepSymbol}（
          {isMale ? '距端面' : '距開口'} 7.500 mm）上亦成立：6.75 × 0.06 = 0.405 mm。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-slate-50 rounded-xl p-4 border border-slate-200 overflow-x-auto">
          <div className="text-[13px] font-mono font-bold tracking-wider text-slate-600 mb-2">
            6% 錐度剖面示意（非 1:1 比例）
          </div>

          <svg viewBox="0 0 560 250" className="w-full min-w-[480px] h-auto" role="img"
            aria-label={`${isMale ? '公' : '母'}接頭剖面：ISO 594 於端面量測 ${oldSymbol}，ISO 80369-7 於距端面 0.750 mm 剖面量測 ${newSymbol}`}>
            <defs>
              <pattern id="gridLight" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#cbd5e1" strokeWidth="0.5" opacity="0.5" />
              </pattern>
            </defs>
            <rect width="560" height="250" fill="url(#gridLight)" />

            {/* 中心線 */}
            <line x1="40" y1="130" x2="520" y2="130" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="6,4" />
            <text x="524" y="134" fill="#64748b" fontSize="13" fontFamily="monospace" fontWeight="bold">CL</text>

            {isMale ? (
              <>
                <polygon points="110,80 420,58 420,202 110,180" fill="#3b82f6" fillOpacity="0.18" stroke="#2563eb" strokeWidth="2" />
                <rect x="110" y="114" width="310" height="32" fill="#f8fafc" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="4,3" />
                <text x="200" y="134" fill="#0369a1" fontSize="13" fontWeight="bold" fontFamily="monospace">Øf ≤ 2.900</text>
              </>
            ) : (
              <>
                <polygon points="110,46 110,80 420,58 420,46" fill="#cbd5e1" fillOpacity="0.7" stroke="none" />
                <polygon points="110,214 110,180 420,202 420,214" fill="#cbd5e1" fillOpacity="0.7" stroke="none" />
                <polygon points="110,80 420,98 420,162 110,180" fill="#a855f7" fillOpacity="0.16" stroke="#9333ea" strokeWidth="2" />
              </>
            )}

            {/* ISO 594 基準（端面） */}
            <line x1="110" y1="36" x2="110" y2="224" stroke="#dc2626" strokeWidth="2" strokeDasharray="3,3" />
            <text x="106" y="30" fill="#b91c1c" fontSize="13" fontWeight="bold" textAnchor="end" fontFamily="monospace">
              ISO 594 端面 0.000
            </text>

            {/* ISO 80369-7 基準（0.750 mm） */}
            <line x1="150" y1="36" x2="150" y2="224" stroke="#16a34a" strokeWidth="2" />
            <text x="156" y="30" fill="#15803d" fontSize="13" fontWeight="bold" fontFamily="monospace">
              ISO 80369-7 剖面 0.750
            </text>

            {/* 位移標註 */}
            <line x1="110" y1="238" x2="150" y2="238" stroke="#b45309" strokeWidth="1.5" />
            <path d="M110 238 l6 -3 v6 z" fill="#b45309" />
            <path d="M150 238 l-6 -3 v6 z" fill="#b45309" />
            <text x="156" y="242" fill="#b45309" fontSize="13" fontWeight="bold" fontFamily="monospace">
              0.750 mm 位移 → Δ⌀ {isMale ? '+' : '−'}0.045 mm
            </text>

            {/* 7.500 mm 深處剖面 */}
            <line x1="420" y1="36" x2="420" y2="224" stroke="#7e22ce" strokeWidth="1.5" strokeDasharray="2,2" />
            <text x="424" y="30" fill="#7e22ce" fontSize="13" fontWeight="bold" fontFamily="monospace">
              {lengthSymbol} = 7.500 mm
            </text>
            <text x="424" y="134" fill="#7e22ce" fontSize="13" fontWeight="bold" fontFamily="monospace">
              {deepSymbol} {deepValue.toFixed(3)}
            </text>

            {/* 數值標註 */}
            <text x="106" y="112" fill="#b91c1c" fontSize="13" fontWeight="bold" textAnchor="end" fontFamily="monospace">
              {oldSymbol} {old.min.toFixed(3)}
            </text>
            <text x="106" y="128" fill="#b91c1c" fontSize="13" fontWeight="bold" textAnchor="end" fontFamily="monospace">
              – {old.max.toFixed(3)}
            </text>
            <text x="156" y="164" fill="#15803d" fontSize="13" fontWeight="bold" fontFamily="monospace">
              {newSymbol} {next.min.toFixed(3)}
            </text>
            <text x="156" y="180" fill="#15803d" fontSize="13" fontWeight="bold" fontFamily="monospace">
              – {next.max.toFixed(3)}
            </text>
          </svg>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="font-black text-amber-800 text-[13px] tracking-wider flex items-center gap-1.5 mb-2 font-mono">
              <Layers className="w-4 h-4 text-amber-600" aria-hidden="true" />
              換算公式
            </h3>
            <div className="font-mono text-[13px] bg-white p-3 rounded-lg border border-slate-200 space-y-1.5 text-slate-800">
              <p className="text-amber-900 font-black">Δ⌀ = 位移量 × 錐度比</p>
              <p>
                • 位移量 = <span className="text-emerald-700 font-bold">{DATUM_OFFSET.toFixed(3)} mm</span>
              </p>
              <p>
                • 錐度比 = <span className="text-blue-700 font-bold">6% = {TAPER_RATIO}</span>
              </p>
              <p className="pt-1.5 border-t border-slate-200 text-amber-900 font-black">
                • Δ⌀ = {DATUM_OFFSET.toFixed(3)} × {TAPER_RATIO} = {isMale ? '+' : '−'}
                {DATUM_DELTA.toFixed(3)} mm
              </p>
            </div>
          </div>

          {!pureShift && (
            <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-xl text-[13px] text-amber-900 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
              <div className="leading-relaxed">
                <strong className="font-black block mb-0.5">此組合並非單純平移</strong>
                半剛性母接頭的 ØD 為 4.198 – 4.298 mm，公差帶寬度由 0.045 擴大為 0.100 mm，是新版針對塑膠成型變異的額外放寬。Table B.2 註 b 仍建議最小值維持 4.225 mm，以確保與所有公鎖固接頭的螺紋咬合。
              </div>
            </div>
          )}

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-[13px]">
            <h4 className="font-black text-slate-900 tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
              繪圖工程師處置行動
            </h4>
            <ul className="space-y-1.5 text-slate-700 pl-4 list-disc">
              <li>
                <strong className="text-slate-900 font-bold">2D 圖面剖面標註後移：</strong>
                尺寸線引出點由端面移至 0.750 mm 處，數值改為{' '}
                <strong className="text-emerald-700 font-mono">
                  {next.min.toFixed(3)} – {next.max.toFixed(3)} mm
                </strong>
                。
              </li>
              <li>
                <strong className="text-slate-900 font-bold">錐體幾何本身不需修改：</strong>
                僅此項如此。轉版整體仍須修改實體幾何，例如 Øf ≤ 2.900 mm 的內孔上限、{lengthSymbol} ≤ 10.500 mm
                的長度上限，以及母鎖固接頭新增的 N1／N2 與 ØJ 下限。
              </li>
              <li>
                <strong className="text-slate-900 font-bold">同步補上第二控制剖面：</strong>
                {deepSymbol} 於 7.500 mm 處，與前端剖面相距 6.75 mm（6.75 × 0.06 = 0.405 mm）。
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
