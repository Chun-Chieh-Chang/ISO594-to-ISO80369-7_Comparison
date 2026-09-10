import React from 'react';
import { Cpu, Calculator, Gauge, Layers, CheckSquare, MoveHorizontal, LucideIcon } from 'lucide-react';
import { PwaInstallPrompt } from './PwaInstallPrompt';

export const ACTIVE_TABS = ['tables', 'visualizer', 'calculator', 'tests', 'materials', 'checklist'] as const;
export type ActiveTab = (typeof ACTIVE_TABS)[number];

interface TabDef {
  id: ActiveTab;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
}

/** 單一分頁定義來源：桌機導覽、手機底部列與「更多」抽屜皆由此衍生 */
export const TAB_DEFS: TabDef[] = [
  { id: 'tables', label: '尺寸比對', shortLabel: '尺寸比對', icon: Cpu },
  { id: 'visualizer', label: '基準位移', shortLabel: '基準位移', icon: MoveHorizontal },
  { id: 'calculator', label: 'CAD 計算器', shortLabel: 'CAD計算', icon: Calculator },
  { id: 'tests', label: '測試 SOP', shortLabel: '測試SOP', icon: Gauge },
  { id: 'materials', label: '材料剛性', shortLabel: '材料剛性', icon: Layers },
  { id: 'checklist', label: 'R&D 清單', shortLabel: 'R&D清單', icon: CheckSquare }
];

interface Props {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Header: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="bg-white/95 backdrop-blur-md text-slate-900 border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[13px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                ISO 594 ➔ ISO 80369-7:2021
              </span>
              <span className="text-slate-400 text-[13px] font-mono hidden lg:inline-block">
                v1.2.0 ENGINEERING AUDIT
              </span>
            </div>

            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2 truncate">
              魯爾接頭圖面轉版工程審查系統
              <span className="hidden sm:inline-block text-[13px] font-medium text-slate-500 font-sans">
                Luer Medical Connector Audit Suite
              </span>
            </h1>
          </div>

          <nav aria-label="主導覽" className="hidden md:flex items-center gap-3">
            <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/70 gap-0.5">
              {TAB_DEFS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  aria-current={activeTab === id ? 'page' : undefined}
                  className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
                    activeTab === id
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" /> {label}
                </button>
              ))}
            </div>
          </nav>

          <div className="shrink-0">
            <PwaInstallPrompt />
          </div>
        </div>
      </div>
    </header>
  );
};
