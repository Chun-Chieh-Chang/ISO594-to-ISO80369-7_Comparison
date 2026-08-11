import React, { useState, useEffect } from 'react';
import { ChecklistItem } from '../types';
import { INITIAL_CHECKLIST_ITEMS } from '../data/checklistData';
import { EcoGeneratorModal } from './EcoGeneratorModal';
import { CheckSquare, Square, Filter, FileText, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';

export const ActionChecklist: React.FC = () => {
  const [items, setItems] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem('iso_luer_checklist_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_CHECKLIST_ITEMS;
      }
    }
    return INITIAL_CHECKLIST_ITEMS;
  });

  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isEcoModalOpen, setIsEcoModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('iso_luer_checklist_v1', JSON.stringify(items));
  }, [items]);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const resetChecklist = () => {
    if (window.confirm('確定要將所有自檢清單狀態重置嗎？')) {
      setItems(INITIAL_CHECKLIST_ITEMS);
    }
  };

  const completedCount = items.filter((i) => i.completed).length;
  const progressPercent = Math.round((completedCount / items.length) * 100);

  const filteredItems = items.filter((item) => {
    if (roleFilter === 'all') return true;
    return item.category === roleFilter;
  });

  return (
    <div className="bg-white border-2 border-emerald-500/40 rounded-xl p-6 shadow-sm mb-8 relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded text-[13px] font-mono font-black uppercase tracking-wider bg-emerald-600 text-white mb-2 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5" /> ACTION CHECKLIST // AUDIT SUITE
          </div>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-slate-900">
            給 R&amp;D / 繪圖工程師的 Immediate Action Checklist
          </h2>
          <p className="text-slate-600 text-[13px] mt-1 leading-relaxed">
            對照 2D/3D CAD 圖檔逐一盤點。勾選進度自動儲存於瀏覽器，可一鍵匯出 ECO 變更文字。
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEcoModalOpen(true)}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[13px] uppercase tracking-wider rounded-lg flex items-center gap-2 shadow-xs transition-all border border-amber-400"
          >
            <FileText className="w-4 h-4" />
            生成 ECO 變更單文案
          </button>
          <button
            onClick={resetChecklist}
            className="p-2.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
            title="重置清單狀態"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 space-y-2">
        <div className="flex justify-between text-[13px] font-black uppercase tracking-wider font-mono">
          <span className="text-slate-800">轉版審查完成進度 (AUDIT COMPLETION)</span>
          <span className="text-emerald-700 font-black">{progressPercent}% ({completedCount} / {items.length} 項)</span>
        </div>
        <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden border border-slate-300">
          <div
            className="bg-emerald-600 h-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6 font-mono text-[13px] font-black uppercase">
        <button
          onClick={() => setRoleFilter('all')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            roleFilter === 'all'
              ? 'bg-slate-900 text-white font-black'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
          }`}
        >
          全部部門 (ALL ROLES)
        </button>
        <button
          onClick={() => setRoleFilter('R&D CAD')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            roleFilter === 'R&D CAD'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
          }`}
        >
          R&amp;D / CAD 製圖
        </button>
        <button
          onClick={() => setRoleFilter('QA/QC')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            roleFilter === 'QA/QC'
              ? 'bg-purple-600 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
          }`}
        >
          QA / QC 品管
        </button>
        <button
          onClick={() => setRoleFilter('Mold & Tooling')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            roleFilter === 'Mold & Tooling'
              ? 'bg-amber-600 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
          }`}
        >
          模具廠 / 射出成型
        </button>
        <button
          onClick={() => setRoleFilter('RA Regulatory')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            roleFilter === 'RA Regulatory'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
          }`}
        >
          RA 法規註冊
        </button>
      </div>

      {/* Checklist Grid */}
      <div className="space-y-3">
        {filteredItems.map((item, idx) => {
          return (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                item.completed
                  ? 'bg-emerald-50/80 border-emerald-400 text-slate-700'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-900'
              }`}
            >
              <div className="w-6 h-6 bg-emerald-600 flex items-center justify-center text-white font-black text-[13px] rounded-md shrink-0 font-mono mt-0.5 shadow-2xs">
                {String(idx + 1).padStart(2, '0')}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`font-black text-sm ${
                      item.completed ? 'line-through text-slate-500' : 'text-slate-900'
                    }`}
                  >
                    {item.title}
                  </span>

                  <span className="text-[13px] px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 font-mono uppercase font-bold">
                    {item.category}
                  </span>

                  <span className="text-[13px] px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-mono uppercase font-bold">
                    {item.isoClauseRef}
                  </span>
                </div>

                <p className="text-[13px] text-slate-600 leading-relaxed font-sans">{item.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

      <EcoGeneratorModal
        isOpen={isEcoModalOpen}
        onClose={() => setIsEcoModalOpen(false)}
        items={items}
      />
    </div>
  );
};
