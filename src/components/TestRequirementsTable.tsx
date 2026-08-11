import React from 'react';
import { TEST_REQUIREMENTS_DATA } from '../data/dimensionsData';
import { ShieldCheck, Flame, Gauge, AlertOctagon, Microscope } from 'lucide-react';

export const TestRequirementsTable: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded text-[13px] font-mono font-black uppercase tracking-wider bg-rose-600 text-white mb-2 shadow-2xs">
            <Gauge className="w-3.5 h-3.5" /> QA/QC &amp; DV LAB SOP REVISION
          </div>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
            物理與功能性檢測要求深度比對 (Performance &amp; Test Methods)
          </h2>
          <p className="text-slate-600 text-[13px] mt-1 leading-relaxed">
            ISO 80369-7 引用 ISO 80369-20 通用測試方法，全面取代 ISO 594 的目測與人工水壓操作。
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-[13px] text-slate-800">
          <thead className="bg-slate-100 text-slate-700 uppercase font-black tracking-wider text-[13px] border-b border-slate-200">
            <tr>
              <th className="py-3.5 px-4 w-1/5">檢測項目名稱</th>
              <th className="py-3.5 px-4 w-1/4">舊版 ISO 594 做法 (需淘汰)</th>
              <th className="py-3.5 px-4 w-1/3">新版 ISO 80369-7:2021 要求</th>
              <th className="py-3.5 px-4 w-1/5">實驗室 SOP 與設備升級影響</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white font-sans">
            {TEST_REQUIREMENTS_DATA.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-4">
                  <div className="font-black text-slate-900 flex items-center gap-2 text-sm">
                    {item.severity === 'critical' && (
                      <Flame className="w-4 h-4 text-rose-600 shrink-0" title="關鍵高風險項目" />
                    )}
                    {item.testName}
                  </div>
                  <div className="text-[13px] font-mono text-slate-500 mt-0.5 uppercase tracking-wider">{item.testNameEn}</div>
                </td>

                <td className="py-4 px-4 text-slate-700 text-[13px] leading-relaxed bg-slate-50/50 font-sans">
                  {item.iso594Spec}
                </td>

                <td className="py-4 px-4 text-emerald-900 text-[13px] leading-relaxed font-bold bg-emerald-50/30 font-sans">
                  {item.iso80369Spec}
                </td>

                <td className="py-4 px-4 text-[13px] font-sans">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                    <span className="text-amber-800 font-mono font-black uppercase block">{item.keyDifference}</span>
                    <span className="text-slate-600 text-[13px] block">
                      影響區域: <strong className="text-slate-900 font-bold">{item.impactArea}</strong>
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
