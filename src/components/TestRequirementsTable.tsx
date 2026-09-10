import React, { useMemo, useState } from 'react';
import { TEST_REQUIREMENTS_DATA } from '../data/dimensionsData';
import { ImpactArea, TestSeverity } from '../types';
import { Gauge, Flame, AlertTriangle, Info, Minus, Filter } from 'lucide-react';

const SEVERITY_META: Record<
  TestSeverity,
  { label: string; chip: string; stripe: string; icon: React.ReactNode }
> = {
  critical: {
    label: '關鍵',
    chip: 'bg-rose-100 text-rose-900 border-rose-300',
    stripe: 'border-l-rose-500',
    icon: <Flame className="w-3.5 h-3.5" aria-hidden="true" />
  },
  high: {
    label: '高',
    chip: 'bg-amber-100 text-amber-900 border-amber-300',
    stripe: 'border-l-amber-500',
    icon: <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
  },
  medium: {
    label: '中',
    chip: 'bg-sky-100 text-sky-900 border-sky-300',
    stripe: 'border-l-sky-500',
    icon: <Info className="w-3.5 h-3.5" aria-hidden="true" />
  },
  low: {
    label: '低',
    chip: 'bg-slate-100 text-slate-700 border-slate-300',
    stripe: 'border-l-slate-400',
    icon: <Minus className="w-3.5 h-3.5" aria-hidden="true" />
  }
};

const SEVERITY_ORDER: TestSeverity[] = ['critical', 'high', 'medium', 'low'];

const IMPACT_AREAS: ImpactArea[] = [
  'QA/QC Lab',
  'R&D Verification',
  'Equipment Purchase',
  'Mold & Tooling'
];

export const TestRequirementsTable: React.FC = () => {
  const [severityFilter, setSeverityFilter] = useState<TestSeverity | 'all'>('all');
  const [impactFilter, setImpactFilter] = useState<ImpactArea | 'all'>('all');

  const severityCounts = useMemo(() => {
    const counts = new Map<TestSeverity, number>();
    TEST_REQUIREMENTS_DATA.forEach((t) => counts.set(t.severity, (counts.get(t.severity) ?? 0) + 1));
    return counts;
  }, []);

  const impactCounts = useMemo(() => {
    const counts = new Map<ImpactArea, number>();
    TEST_REQUIREMENTS_DATA.forEach((t) => counts.set(t.impactArea, (counts.get(t.impactArea) ?? 0) + 1));
    return counts;
  }, []);

  const rows = useMemo(
    () =>
      TEST_REQUIREMENTS_DATA.filter(
        (t) =>
          (severityFilter === 'all' || t.severity === severityFilter) &&
          (impactFilter === 'all' || t.impactArea === impactFilter)
      ),
    [severityFilter, impactFilter]
  );

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-8">
      <div className="pb-4 border-b border-slate-200 mb-5">
        <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded text-[13px] font-mono font-black tracking-wider bg-rose-600 text-white mb-2">
          <Gauge className="w-3.5 h-3.5" aria-hidden="true" /> QA/QC &amp; DV 實驗室 SOP
        </div>
        <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
          效能與測試要求比對
        </h2>
        <p className="text-slate-600 text-[13px] mt-1 leading-relaxed max-w-4xl">
          ISO 80369-7 引用 ISO 80369-20 之通用測試方法。舊版欄位依接頭型式分別列出{' '}
          <strong className="text-slate-900">ISO 594-1（滑套）</strong>與{' '}
          <strong className="text-slate-900">ISO 594-2（鎖固）</strong> —— 兩者對同一項目常有不同數值，
          查對時須依接頭型式引用正確的一本。
        </p>
      </div>

      {/* 篩選 */}
      <div className="flex flex-wrap items-center gap-4 mb-5 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-slate-500" aria-hidden="true" />
          <span className="text-[13px] font-bold text-slate-700">嚴重度</span>
          <button
            onClick={() => setSeverityFilter('all')}
            aria-pressed={severityFilter === 'all'}
            className={`px-2.5 py-1 rounded-md text-[13px] font-mono font-bold border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
              severityFilter === 'all'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
            }`}
          >
            全部 ({TEST_REQUIREMENTS_DATA.length})
          </button>
          {SEVERITY_ORDER.map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              aria-pressed={severityFilter === sev}
              className={`px-2.5 py-1 rounded-md text-[13px] font-mono font-bold border transition-colors inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
                severityFilter === sev
                  ? 'bg-slate-900 text-white border-slate-900'
                  : SEVERITY_META[sev].chip + ' hover:brightness-95'
              }`}
            >
              {SEVERITY_META[sev].icon}
              {SEVERITY_META[sev].label} ({severityCounts.get(sev) ?? 0})
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="impact-filter" className="text-[13px] font-bold text-slate-700">
            影響區域
          </label>
          <select
            id="impact-filter"
            value={impactFilter}
            onChange={(e) => setImpactFilter(e.target.value as ImpactArea | 'all')}
            className="bg-slate-50 border border-slate-300 text-slate-800 text-[13px] font-mono rounded-lg px-3 py-1.5 font-bold focus:outline-none focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/40"
          >
            <option value="all">全部 ({TEST_REQUIREMENTS_DATA.length})</option>
            {IMPACT_AREAS.map((area) => (
              <option key={area} value={area}>
                {area} ({impactCounts.get(area) ?? 0})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-[13px] text-slate-800">
          <caption className="sr-only">ISO 594 與 ISO 80369-7 之效能與測試要求比對</caption>
          <thead className="bg-slate-100 text-slate-700 font-black tracking-wider text-[13px] border-b border-slate-200">
            <tr>
              <th scope="col" className="py-3.5 px-4 w-1/5">
                檢測項目
              </th>
              <th scope="col" className="py-3.5 px-4 w-1/4">
                舊版 ISO 594-1 / 594-2
              </th>
              <th scope="col" className="py-3.5 px-4 w-1/3">
                新版 ISO 80369-7:2021
              </th>
              <th scope="col" className="py-3.5 px-4 w-1/5">
                差異與影響
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-slate-500 text-[13px] font-mono">
                  沒有符合條件的檢測項目。
                </td>
              </tr>
            ) : (
              rows.map((item) => {
                const meta = SEVERITY_META[item.severity];
                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className={`py-4 px-4 border-l-4 ${meta.stripe}`}>
                      <div className="font-black text-slate-900 text-sm">{item.testName}</div>
                      <div className="text-[13px] font-mono text-slate-500 mt-0.5">{item.testNameEn}</div>
                      <span
                        className={`inline-flex items-center gap-1 mt-2 text-[13px] px-2 py-0.5 rounded border font-mono font-bold ${meta.chip}`}
                      >
                        {meta.icon}
                        {meta.label}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-slate-700 text-[13px] leading-relaxed bg-slate-50/50">
                      {item.iso594Spec}
                    </td>

                    <td className="py-4 px-4 text-emerald-900 text-[13px] leading-relaxed font-medium bg-emerald-50/30">
                      {item.iso80369Spec}
                    </td>

                    <td className="py-4 px-4 text-[13px]">
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                        <span className="text-slate-800 leading-relaxed block">{item.keyDifference}</span>
                        <span className="text-slate-600 block pt-2 border-t border-slate-200">
                          影響區域：<strong className="text-slate-900 font-bold">{item.impactArea}</strong>
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
