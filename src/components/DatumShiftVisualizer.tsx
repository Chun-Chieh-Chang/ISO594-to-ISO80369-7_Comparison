import React, { useState } from 'react';
import { Layers, CheckCircle2, Cpu } from 'lucide-react';

export const DatumShiftVisualizer: React.FC = () => {
  const [connectorType, setConnectorType] = useState<'male' | 'female'>('male');

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-slate-900 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded text-[13px] font-mono font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 mb-2">
            <Cpu className="w-3.5 h-3.5 text-amber-700" /> CORE CAD GEOMETRY PRINCIPLE
          </div>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
            測量基準面位移原理 (Datum Plane Shift &amp; Math)
          </h2>
          <p className="text-slate-600 text-[13px] mt-1 leading-relaxed">
            為何 ISO 80369-7 直徑數字變大了？並非實體變大，而是測量剖面向內退後 0.75 mm！
          </p>
        </div>

        {/* Connector Switcher */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-lg border border-slate-200 self-start md:self-auto gap-1">
          <button
            onClick={() => setConnectorType('male')}
            className={`px-4 py-2 rounded-md text-[13px] font-bold uppercase tracking-wider transition-all ${
              connectorType === 'male'
                ? 'bg-blue-600 text-white shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            公接頭 (Male Luer)
          </button>
          <button
            onClick={() => setConnectorType('female')}
            className={`px-4 py-2 rounded-md text-[13px] font-bold uppercase tracking-wider transition-all ${
              connectorType === 'female'
                ? 'bg-purple-600 text-white shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            母接頭 (Female Luer)
          </button>
        </div>
      </div>

      {/* SVG Interactive Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7 bg-slate-50 rounded-xl p-4 border border-slate-200 relative overflow-hidden flex flex-col items-center justify-center">
          <div className="absolute top-3 left-3 text-[13px] font-mono font-bold uppercase tracking-wider text-slate-600 bg-white px-2 py-1 rounded border border-slate-200">
            6% Taper Cross-Section Schematic (Not to 1:1 scale)
          </div>

          <svg viewBox="0 0 550 260" className="w-full max-w-lg h-auto my-2">
            <defs>
              <linearGradient id="taperGradLight" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="femaleGradLight" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#7e22ce" stopOpacity="0.08" />
              </linearGradient>
              <pattern id="gridLight" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#cbd5e1" strokeWidth="0.5" opacity="0.5" />
              </pattern>
            </defs>

            {/* Background Grid */}
            <rect width="550" height="260" fill="url(#gridLight)" />

            {/* Center Axis */}
            <line x1="30" y1="130" x2="520" y2="130" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="6,4" />
            <text x="525" y="133" fill="#64748b" fontSize="13" fontFamily="monospace" fontWeight="bold">CL</text>

            {connectorType === 'male' ? (
              <>
                {/* Male Taper Cone */}
                <polygon points="100,75 420,55 420,205 100,185" fill="url(#taperGradLight)" stroke="#2563eb" strokeWidth="2" />
                {/* Internal Through Bore Øf */}
                <rect x="100" y="112" width="320" height="36" fill="#f8fafc" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="4,3" />

                {/* ISO 594 Datum Plane (0.00mm at tip) */}
                <line x1="100" y1="35" x2="100" y2="225" stroke="#dc2626" strokeWidth="2" strokeDasharray="3,3" />
                <text x="50" y="28" fill="#b91c1c" fontSize="13" fontWeight="bold">ISO 594 Datum (0.00 mm)</text>
                <text x="30" y="133" fill="#b91c1c" fontSize="13" fontWeight="bold">d = 3.925mm</text>

                {/* ISO 80369-7 Datum Plane (0.75mm offset) */}
                <line x1="140" y1="35" x2="140" y2="225" stroke="#16a34a" strokeWidth="2" />
                <text x="145" y="28" fill="#15803d" fontSize="13" fontWeight="bold">ISO 80369-7 Datum (0.75 mm)</text>
                <text x="145" y="100" fill="#15803d" fontSize="13" fontWeight="bold">Ød = 3.970mm</text>

                {/* Offset dimension arrow */}
                <line x1="100" y1="45" x2="140" y2="45" stroke="#334155" strokeWidth="1.5" />
                <polygon points="100,45 105,42 105,48" fill="#334155" />
                <polygon points="140,45 135,42 135,48" fill="#334155" />
                <text x="106" y="41" fill="#d97706" fontSize="13" fontWeight="bold">0.75 mm</text>

                {/* 7.50mm Reference Plane */}
                <line x1="420" y1="35" x2="420" y2="225" stroke="#9333ea" strokeWidth="1.5" strokeDasharray="2,2" />
                <text x="400" y="240" fill="#7e22ce" fontSize="13" fontWeight="bold">e = 7.50 mm</text>
                <text x="425" y="100" fill="#7e22ce" fontSize="13" fontWeight="bold">Øg = 4.375mm</text>

                {/* Through Bore label */}
                <text x="210" y="133" fill="#0369a1" fontSize="13" fontWeight="bold">Øf ≤ 2.900mm (Bore Limit)</text>
              </>
            ) : (
              <>
                {/* Female Outer Body */}
                <polygon points="100,40 100,75 420,55 420,40" fill="#cbd5e1" opacity="0.6" />
                <polygon points="100,220 100,185 420,205 420,220" fill="#cbd5e1" opacity="0.6" />

                {/* Female Taper Cone Void */}
                <polygon points="100,75 420,95 420,165 100,185" fill="url(#femaleGradLight)" stroke="#9333ea" strokeWidth="2" />

                {/* ISO 594 Datum Plane (0.00mm at face) */}
                <line x1="100" y1="25" x2="100" y2="235" stroke="#dc2626" strokeWidth="2" strokeDasharray="3,3" />
                <text x="40" y="20" fill="#b91c1c" fontSize="13" fontWeight="bold">ISO 594 Face (0.00 mm)</text>
                <text x="25" y="133" fill="#b91c1c" fontSize="13" fontWeight="bold">D = 4.270mm</text>

                {/* ISO 80369-7 Datum Plane (0.75mm inside) */}
                <line x1="140" y1="25" x2="140" y2="235" stroke="#16a34a" strokeWidth="2" />
                <text x="145" y="20" fill="#15803d" fontSize="13" fontWeight="bold">ISO 80369-7 Datum (0.75 mm)</text>
                <text x="145" y="105" fill="#15803d" fontSize="13" fontWeight="bold">ØD = 4.225mm</text>

                {/* Offset dimension arrow */}
                <line x1="100" y1="32" x2="140" y2="32" stroke="#334155" strokeWidth="1.5" />
                <polygon points="100,32 105,29 105,35" fill="#334155" />
                <polygon points="140,32 135,29 135,35" fill="#334155" />
                <text x="106" y="29" fill="#d97706" fontSize="13" fontWeight="bold">0.75 mm</text>

                {/* 7.50mm Depth Plane */}
                <line x1="420" y1="25" x2="420" y2="235" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="2,2" />
                <text x="390" y="248" fill="#0369a1" fontSize="13" fontWeight="bold">E = 7.50 mm</text>
                <text x="425" y="133" fill="#0369a1" fontSize="13" fontWeight="bold">ØG = 3.820mm</text>
              </>
            )}
          </svg>
        </div>

        {/* Mathematical Formula & Concept Explainer */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="font-black text-amber-800 text-[13px] uppercase tracking-wider flex items-center gap-1.5 mb-2 font-mono">
              <Layers className="w-4 h-4 text-amber-600" />
              計算公式 (Taper Delta Mathematics)
            </h3>
            <div className="font-mono text-[13px] bg-white p-3 rounded-lg border border-slate-200 space-y-1.5 text-slate-800">
              <p className="text-amber-900 font-black uppercase">ΔDiameter = Offset × Taper Ratio</p>
              <p>• Offset (位移量) = <span className="text-emerald-700 font-bold">0.750 mm</span></p>
              <p>• Taper Ratio (錐度) = <span className="text-blue-700 font-bold">6% = 0.060 mm/mm</span></p>
              <p className="pt-1.5 border-t border-slate-200 text-amber-900 font-black">
                • ΔD = 0.750 mm × 0.060 = +0.045 mm
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-[13px]">
            <h4 className="font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              繪圖工程師（CAD）核心處置行動：
            </h4>
            <ul className="space-y-1.5 text-slate-700 pl-4 list-disc font-sans">
              <li>
                <strong className="text-slate-900 font-bold">實體 CAD 3D 模型完全不用修：</strong> 產品的物理幾何形狀 100% 相同。
              </li>
              <li>
                <strong className="text-slate-900 font-bold">2D 工程圖面剖面標註後移：</strong> 將尺寸線引出點由最前端面後移 0.75 mm。
              </li>
              <li>
                <strong className="text-slate-900 font-bold">更換標註數值：</strong>
                {connectorType === 'male' ? (
                  <span> 公錐前端直徑由 3.925mm 更新標註為 <strong className="text-emerald-700 font-mono font-bold">3.970 mm</strong>。</span>
                ) : (
                  <span> 母錐開口內徑由 4.270mm 更新標註為 <strong className="text-emerald-700 font-mono font-bold">4.225 mm</strong>。</span>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
