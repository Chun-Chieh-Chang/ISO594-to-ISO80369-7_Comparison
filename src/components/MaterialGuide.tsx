import React from 'react';
import { MaterialType } from '../types';
import { Layers, ShieldAlert, Ban } from 'lucide-react';

interface Props {
  material: MaterialType;
  onSelectMaterial: (mat: MaterialType) => void;
}

const CARDS = [
  {
    id: 'rigid' as MaterialType,
    title: '剛性材料 (Rigid Material)',
    modulus: 'E > 3 433 MPa',
    accent: 'blue',
    summary: '彎曲或拉伸彈性模數大於 3 433 MPa。變形量極小，適用於精密咬合與高壓注入場合。',
    examples: '316L 不鏽鋼、黃銅、玻璃、加纖 PEEK、高性能聚合物',
    rows: [
      ['母錐開口內徑 ØD', '4.225 – 4.270 mm'],
      ['母錐底部內徑 ØG', '3.820 – 3.865 mm'],
      ['公錐前端外徑 Ød', '3.970 – 4.035 mm'],
      ['螺紋起點距離 t', '(3.200) mm max — 輔助']
    ]
  },
  {
    id: 'semi-rigid' as MaterialType,
    title: '半剛性材料 (Semi-rigid Material)',
    modulus: '700 MPa ≤ E ≤ 3 433 MPa',
    accent: 'purple',
    summary: '絕大多數一次性醫療器械採用的熱塑性塑膠。受力會產生微量彈性應變，成型後另有收縮變異。',
    examples: '聚丙烯 (PP)、聚碳酸酯 (PC)、ABS、壓克力 (PMMA)',
    rows: [
      ['母錐開口內徑 ØD', '4.198 – 4.298 mm（建議 ≥ 4.225）'],
      ['母錐底部內徑 ØG', '3.793 – 3.893 mm（建議 ≥ 3.820）'],
      ['公錐前端外徑 Ød', '3.970 – 4.072 mm'],
      ['螺紋起點距離 t', '(3.650) mm max — 建議仍維持 3.200']
    ]
  }
];

const ACCENT: Record<string, { border: string; activeBorder: string; chip: string; title: string }> = {
  blue: {
    border: 'border-slate-200',
    activeBorder: 'border-blue-500 ring-2 ring-blue-500/20',
    chip: 'bg-blue-100 text-blue-800 border-blue-300',
    title: 'text-blue-800'
  },
  purple: {
    border: 'border-slate-200',
    activeBorder: 'border-purple-500 ring-2 ring-purple-500/20',
    chip: 'bg-purple-100 text-purple-800 border-purple-300',
    title: 'text-purple-800'
  }
};

export const MaterialGuide: React.FC<Props> = ({ material, onSelectMaterial }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-8">
      <div className="pb-4 border-b border-slate-200 mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded text-[13px] font-mono font-black tracking-wider bg-purple-600 text-white mb-2">
          <Layers className="w-3.5 h-3.5" aria-hidden="true" /> ISO 80369-7:2021 Clause 3.7 / 3.8
        </div>
        <h2 className="text-xl font-black tracking-tight text-slate-900">材料彈性模數分類</h2>
        <p className="text-slate-600 text-[13px] mt-1 leading-relaxed max-w-3xl">
          舊版 ISO 594 僅以「玻璃與金屬為典型剛性材料、多數塑膠可視為半剛性」定性舉例；新版於術語定義中以彈性模數量化分界，並據此為部分尺寸給出兩組公差。點選卡片可切換全站的材料類別。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {CARDS.map((card) => {
          const isActive = material === card.id;
          const accent = ACCENT[card.accent];
          return (
            <button
              key={card.id}
              onClick={() => onSelectMaterial(card.id)}
              aria-pressed={isActive}
              className={`text-left bg-slate-50 p-5 rounded-xl border-2 space-y-3 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
                isActive ? accent.activeBorder : `${accent.border} hover:border-slate-400`
              }`}
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className={`font-black text-sm tracking-wider ${accent.title}`}>{card.title}</span>
                <span
                  className={`text-[13px] font-mono font-black px-2.5 py-1 rounded-md border tabular-nums ${accent.chip}`}
                >
                  {card.modulus}
                </span>
              </div>

              <p className="text-[13px] text-slate-700 leading-relaxed">{card.summary}</p>

              <div className="text-[13px] text-slate-700 border-t border-slate-200 pt-3">
                <span className="font-bold text-slate-800">代表材料：</span>
                {card.examples}
              </div>

              <table className="w-full text-[13px] font-mono tabular-nums">
                <tbody>
                  {card.rows.map(([label, value]) => (
                    <tr key={label} className="border-t border-slate-200/70">
                      <td className="py-1.5 text-slate-600 pr-2">{label}</td>
                      <td className="py-1.5 text-right font-bold text-slate-900">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {isActive && (
                <div className="text-[13px] font-mono font-bold text-emerald-700">● 目前全站套用此類別</div>
              )}
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        <div className="bg-slate-50 border border-slate-300 p-4 rounded-xl text-[13px] text-slate-700 flex items-start gap-3">
          <Ban className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="leading-relaxed">
            <strong className="font-mono font-black text-slate-900 block mb-0.5">彈性模數低於 700 MPa：不在標準範圍內</strong>
            ISO 594-1 與 ISO 80369-7 皆明確排除更柔軟或彈性體材料。Annex A 特別說明：以彈性體密封面構成的
            Luer 活化器材 (LAD，如無針接頭閥) 因材料較半剛性更軟且未完全符合 Clause 5 尺寸，並非本標準定義的
            Luer 接頭；標準建議此類產品仍應盡量採用防錯接特徵（材料 ≥ 700 MPa、ØH／ØJ／ØD／ØG 尺寸符合），
            並依 ISO 80369-1 Annex B 進行防錯接測試。
          </div>
        </div>

        <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-xl text-[13px] text-amber-900 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="leading-relaxed">
            <strong className="font-mono font-black text-amber-900 block mb-0.5">半剛性成型收縮風險</strong>
            半剛性塑膠（如 PP）自模具脫模冷卻後仍會持續收縮。若母接頭開口內徑 ØD 收縮至 4.225 mm 以下，
            雖仍落在半剛性公差帶內，但依 Annex A 的分析，錐面可能提前抵住而使螺紋咬合深度不足——此時連接
            強度等同滑套接頭，無法取得鎖固的額外保持力，並可能導致 6.4 抗軸向分離（鎖固型 32 – 35 N）失敗
            或正壓洩漏。建議在模流與試模階段即以 4.225 mm 為內控下限。
          </div>
        </div>
      </div>
    </div>
  );
};
