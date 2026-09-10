import React, { useEffect, useMemo, useState } from 'react';
import { ChecklistItem, ConnectorCategory, RiskLevel } from '../types';
import { CHECKLIST_STORAGE_KEY, INITIAL_CHECKLIST_ITEMS } from '../data/checklistData';
import { DIMENSIONS_DATA } from '../data/dimensionsData';
import { EcoGeneratorModal } from './EcoGeneratorModal';
import { CheckSquare, Square, FileText, RotateCcw, ShieldCheck, Filter } from 'lucide-react';

interface Props {
  selectedCategory: ConnectorCategory;
}

const RISK_META: Record<RiskLevel, { label: string; chip: string; stripe: string }> = {
  critical: { label: '關鍵', chip: 'bg-rose-100 text-rose-900 border-rose-300', stripe: 'border-l-rose-500' },
  high: { label: '高', chip: 'bg-amber-100 text-amber-900 border-amber-300', stripe: 'border-l-amber-500' },
  medium: { label: '中', chip: 'bg-sky-100 text-sky-900 border-sky-300', stripe: 'border-l-sky-500' },
  low: { label: '低', chip: 'bg-slate-100 text-slate-700 border-slate-300', stripe: 'border-l-slate-400' }
};

const ROLE_FILTERS: { id: ChecklistItem['category'] | 'all'; label: string; active: string }[] = [
  { id: 'all', label: '全部部門', active: 'bg-slate-900 text-white border-slate-900' },
  { id: 'R&D CAD', label: 'R&D / CAD 製圖', active: 'bg-blue-600 text-white border-blue-600' },
  { id: 'QA/QC', label: 'QA / QC 品管', active: 'bg-purple-600 text-white border-purple-600' },
  { id: 'Mold & Tooling', label: '模具 / 射出成型', active: 'bg-amber-600 text-white border-amber-600' },
  { id: 'RA Regulatory', label: 'RA 法規註冊', active: 'bg-emerald-600 text-white border-emerald-600' }
];

/** 讀取已儲存的勾選狀態；僅沿用仍存在於目前清單中的項目，避免版本間資料漂移 */
function loadItems(): ChecklistItem[] {
  try {
    const saved = localStorage.getItem(CHECKLIST_STORAGE_KEY);
    if (!saved) return INITIAL_CHECKLIST_ITEMS;
    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) return INITIAL_CHECKLIST_ITEMS;
    const completedIds = new Set(
      parsed
        .filter((i): i is { id: string; completed: boolean } => !!i && typeof i === 'object' && 'id' in i)
        .filter((i) => i.completed)
        .map((i) => i.id)
    );
    return INITIAL_CHECKLIST_ITEMS.map((item) => ({ ...item, completed: completedIds.has(item.id) }));
  } catch {
    return INITIAL_CHECKLIST_ITEMS;
  }
}

export const ActionChecklist: React.FC<Props> = ({ selectedCategory }) => {
  const [items, setItems] = useState<ChecklistItem[]>(loadItems);
  const [roleFilter, setRoleFilter] = useState<ChecklistItem['category'] | 'all'>('all');
  const [onlyCurrentConnector, setOnlyCurrentConnector] = useState(false);
  const [isEcoModalOpen, setIsEcoModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(
        CHECKLIST_STORAGE_KEY,
        JSON.stringify(items.map(({ id, completed }) => ({ id, completed })))
      );
    } catch {
      /* 私密瀏覽或封鎖站台資料時忽略：勾選狀態僅存於本次工作階段 */
    }
  }, [items]);

  const toggleItem = (id: string) =>
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)));

  const resetChecklist = () => {
    if (window.confirm('確定要清除所有勾選狀態嗎？')) setItems(INITIAL_CHECKLIST_ITEMS);
  };

  const completedCount = items.filter((i) => i.completed).length;
  const progressPercent = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;
  const openCritical = items.filter((i) => !i.completed && i.riskLevel === 'critical').length;

  const categoryLabel = useMemo(
    () => DIMENSIONS_DATA.find((c) => c.id === selectedCategory)?.tabLabel ?? selectedCategory,
    [selectedCategory]
  );

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        if (roleFilter !== 'all' && item.category !== roleFilter) return false;
        if (onlyCurrentConnector && item.targetConnector !== 'all' && item.targetConnector !== selectedCategory)
          return false;
        return true;
      }),
    [items, roleFilter, onlyCurrentConnector, selectedCategory]
  );

  return (
    <div className="bg-white border-2 border-emerald-500/40 rounded-xl p-6 shadow-sm mb-8">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-slate-200 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded text-[13px] font-mono font-black tracking-wider bg-emerald-600 text-white mb-2">
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" /> 行動查核清單
          </div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
            R&amp;D / 繪圖工程師轉版查核清單
          </h2>
          <p className="text-slate-600 text-[13px] mt-1 leading-relaxed max-w-3xl">
            對照 2D / 3D CAD 圖檔逐一盤點。勾選狀態自動儲存於本機瀏覽器，並可依實際勾選內容產生 ECO
            工程變更單 —— 未勾選的項目不會被寫入變更內容。
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsEcoModalOpen(true)}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[13px] tracking-wider rounded-lg flex items-center gap-2 shadow-xs transition-all border border-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
          >
            <FileText className="w-4 h-4" aria-hidden="true" />
            產生 ECO 變更單
          </button>
          <button
            onClick={resetChecklist}
            className="p-2.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
            aria-label="清除所有勾選狀態"
            title="清除所有勾選狀態"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 進度 */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-5 space-y-2">
        <div className="flex justify-between text-[13px] font-black tracking-wider font-mono flex-wrap gap-2">
          <span className="text-slate-800">轉版查核完成進度</span>
          <span className="text-emerald-700 tabular-nums">
            {progressPercent}% ({completedCount} / {items.length} 項)
          </span>
        </div>
        <div
          className="w-full bg-slate-200 h-3 rounded-full overflow-hidden border border-slate-300"
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="查核完成進度"
        >
          <div className="bg-emerald-600 h-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
        </div>
        {openCritical > 0 && (
          <p className="text-[13px] text-rose-800 font-bold">
            尚有 {openCritical} 項<span className="font-mono">關鍵風險</span>項目未完成，未完成前不建議放行本次轉版。
          </p>
        )}
      </div>

      {/* 篩選 */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <Filter className="w-4 h-4 text-slate-500" aria-hidden="true" />
        {ROLE_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setRoleFilter(f.id)}
            aria-pressed={roleFilter === f.id}
            className={`px-3 py-1.5 rounded-lg text-[13px] font-mono font-black border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
              roleFilter === f.id ? f.active : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}

        <label className="ml-auto flex items-center gap-2 text-[13px] text-slate-700 font-bold cursor-pointer bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
          <input
            type="checkbox"
            checked={onlyCurrentConnector}
            onChange={(e) => setOnlyCurrentConnector(e.target.checked)}
            className="accent-blue-600"
          />
          僅顯示目前接頭類型（{categoryLabel}）
        </label>
      </div>

      {/* 清單 */}
      <ul className="space-y-3 list-none">
        {filteredItems.length === 0 ? (
          <li className="text-center py-8 text-slate-500 text-[13px] font-mono bg-slate-50 rounded-xl border border-slate-200">
            目前篩選條件下沒有查核項目。
          </li>
        ) : (
          filteredItems.map((item) => {
            const risk = RISK_META[item.riskLevel];
            const targetLabel =
              item.targetConnector === 'all'
                ? '全部接頭'
                : DIMENSIONS_DATA.find((c) => c.id === item.targetConnector)?.tabLabel ?? item.targetConnector;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={item.completed}
                  onClick={() => toggleItem(item.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 border-l-4 transition-all flex items-start gap-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
                    risk.stripe
                  } ${
                    item.completed
                      ? 'bg-emerald-50/80 border-emerald-400 text-slate-700'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-900'
                  }`}
                >
                  <span className="shrink-0 mt-0.5">
                    {item.completed ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400" aria-hidden="true" />
                    )}
                  </span>

                  <span className="flex-1 space-y-1.5 min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <span
                        className={`font-black text-sm ${
                          item.completed ? 'line-through text-slate-500' : 'text-slate-900'
                        }`}
                      >
                        {item.id.replace('chk-', '#')} {item.title}
                      </span>
                      <span
                        className={`text-[13px] px-2 py-0.5 rounded border font-mono font-bold ${risk.chip}`}
                      >
                        {risk.label}
                      </span>
                      <span className="text-[13px] px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 font-mono font-bold">
                        {item.category}
                      </span>
                      <span className="text-[13px] px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200 font-mono">
                        {targetLabel}
                      </span>
                      <span className="text-[13px] px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-mono">
                        {item.isoClauseRef}
                      </span>
                    </span>

                    <span className="block text-[13px] text-slate-600 leading-relaxed">{item.detail}</span>
                  </span>
                </button>
              </li>
            );
          })
        )}
      </ul>

      <EcoGeneratorModal isOpen={isEcoModalOpen} onClose={() => setIsEcoModalOpen(false)} items={items} />
    </div>
  );
};
