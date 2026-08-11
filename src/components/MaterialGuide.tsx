import React from 'react';
import { Layers, ShieldAlert } from 'lucide-react';

export const MaterialGuide: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded text-[13px] font-mono font-black uppercase tracking-wider bg-purple-600 text-white mb-2 shadow-2xs">
            <Layers className="w-3.5 h-3.5" /> ISO 80369-7 ANNEX F MATERIAL SPEC
          </div>
          <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
            材料彈性模數分類矩陣 (Modulus of Elasticity Matrix)
          </h2>
          <p className="text-slate-600 text-[13px] mt-1 leading-relaxed">
            舊版 ISO 594 僅定性舉例；新版 ISO 80369-7 定量以 3,433 MPa 為嚴格分界線！
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Rigid Material Card */}
        <div className="bg-slate-50 p-5 rounded-xl border-2 border-blue-300 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-black text-blue-800 text-sm uppercase tracking-wider">剛性材料 (RIGID MATERIAL)</span>
            <span className="text-[13px] bg-blue-100 text-blue-800 font-mono font-black px-2.5 py-1 rounded-md border border-blue-300 uppercase">
              E &gt; 3,433 MPa
            </span>
          </div>

          <p className="text-[13px] text-slate-700 leading-relaxed font-sans">
            彎曲或拉伸彈性模數大於 3,433 MPa。變形量極微小，適用於精密咬合與高壓注入場合。
          </p>

          <div className="text-[13px] space-y-1 text-slate-800 border-t border-slate-200 pt-3 font-mono">
            <div>• 代表材料：316L 不鏽鋼、黃銅、玻璃、加纖 PEEK、高剛性聚合物</div>
            <div>• 母開口內徑 ØD：4.225 - 4.270 mm</div>
            <div>• 螺紋起點距離 t：(3.200) mm max (輔助值)</div>
          </div>
        </div>

        {/* Semi-Rigid Material Card */}
        <div className="bg-slate-50 p-5 rounded-xl border-2 border-purple-300 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-black text-purple-800 text-sm uppercase tracking-wider">半剛性材料 (SEMI-RIGID MATERIAL)</span>
            <span className="text-[13px] bg-purple-100 text-purple-800 font-mono font-black px-2.5 py-1 rounded-md border border-purple-300 uppercase">
              700 MPa ≤ E ≤ 3,433 MPa
            </span>
          </div>

          <p className="text-[13px] text-slate-700 leading-relaxed font-sans">
            絕大多數一次性醫療器械採用的熱塑性塑膠。受力會產生微量彈性應變與二次結晶收縮。
          </p>

          <div className="text-[13px] space-y-1 text-slate-800 border-t border-slate-200 pt-3 font-mono">
            <div>• 代表材料：聚丙烯 (PP)、聚碳酸酯 (PC)、ABS、丙烯酸酯 (Acrylic)</div>
            <div>• 母開口內徑 ØD：4.198 - 4.298 mm (建議最小 ≥ 4.225 mm)</div>
            <div>• 螺紋起點距離 t：(3.650) mm max (放寬至 3.65mm)</div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-xl text-[13px] text-amber-900 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-mono font-black uppercase text-amber-900 block mb-0.5">半剛性塑膠射出成型風險警示 (TOOLING WARNING): </strong>
          半剛性塑膠（如 PP）在高溫射出脫模冷卻後，會產生 1%-2% 的後收縮 (Post-mold Shrinkage)。若母接頭開口內徑收縮小於 4.225 mm，螺紋旋緊預緊力會大幅下降，導致抗拉拔力測試 (32-35N) 失敗或正壓水壓滴漏！
        </div>
      </div>
    </div>
  );
};
