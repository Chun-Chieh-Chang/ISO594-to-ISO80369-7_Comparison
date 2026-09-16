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
    <header
      className="sticky top-0 z-30 border-b border-[rgba(255,255,255,0.08)]"
      style={{ background: 'var(--neo-header)', boxShadow: '0 2px 20px rgba(10,35,20,0.35)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[13px] font-semibold bg-[rgba(255,255,255,0.12)] text-[#8fc8a8] border border-[rgba(255,255,255,0.15)] font-mono">
                ISO 594 ➔ ISO 80369-7:2021
              </span>
              <span className="text-[#6a9e82] text-[13px] font-mono hidden lg:inline-block">
                v1.3.0 ENGINEERING AUDIT
              </span>
            </div>

            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2 truncate">
              魯爾接頭圖面轉版工程審查系統
              <span className="hidden sm:inline-block text-[13px] font-medium text-[#6a9e82] font-sans">
                Luer Medical Connector Audit Suite
              </span>
            </h1>
          </div>

          <nav aria-label="主導覽" className="hidden md:flex items-center gap-3">
            <div
              className="flex items-center p-1 rounded-xl gap-0.5"
              style={{
                background: 'rgba(0,0,0,0.25)',
                boxShadow: 'inset 2px 2px 6px rgba(0,0,0,0.3), inset -2px -2px 6px rgba(255,255,255,0.04)'
              }}
            >
              {TAB_DEFS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  aria-current={activeTab === id ? 'page' : undefined}
                  className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(255,255,255,0.3)] ${
                    activeTab === id
                      ? 'bg-[rgba(255,255,255,0.16)] text-white font-bold shadow-[3px_3px_8px_rgba(0,0,0,0.25),-3px_-3px_8px_rgba(255,255,255,0.04)]'
                      : 'text-[#7aac8f] hover:text-white hover:bg-[rgba(255,255,255,0.08)]'
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
