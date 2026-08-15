import React from 'react';
import { Cpu, Calculator, Gauge, Layers, CheckSquare, AlertTriangle } from 'lucide-react';
import { PwaInstallPrompt } from './PwaInstallPrompt';

export type ActiveTab = 'tables' | 'visualizer' | 'calculator' | 'tests' | 'materials' | 'checklist';

interface Props {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Header: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="bg-white/95 backdrop-blur-md text-slate-900 border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Main Title */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                ISO 594 ➔ ISO 80369-7:2021
              </span>
              <span className="text-slate-400 text-[11px] font-mono hidden lg:inline-block">
                REV 1.04 ENGINEERING AUDIT
              </span>
            </div>

            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2 truncate">
              魯爾接頭圖面轉版工程審查系統
              <span className="hidden sm:inline-block text-xs font-medium text-slate-500 font-sans">
                Luer Medical Connector Audit Suite
              </span>
            </h1>
          </div>

          {/* Desktop Tab Navigation + PWA Install Button */}
          <div className="hidden md:flex items-center gap-3">
            <nav className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/70 gap-0.5">
              <button
                onClick={() => setActiveTab('tables')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-normal transition-all flex items-center gap-1.5 ${
                  activeTab === 'tables'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-current" /> 尺寸比對
              </button>

              <button
                onClick={() => setActiveTab('visualizer')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-normal transition-all flex items-center gap-1.5 ${
                  activeTab === 'visualizer'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-current" /> 基準位移
              </button>

              <button
                onClick={() => setActiveTab('calculator')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-normal transition-all flex items-center gap-1.5 ${
                  activeTab === 'calculator'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Calculator className="w-3.5 h-3.5 text-current" /> CAD 計算器
              </button>

              <button
                onClick={() => setActiveTab('tests')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-normal transition-all flex items-center gap-1.5 ${
                  activeTab === 'tests'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Gauge className="w-3.5 h-3.5 text-current" /> 測試 SOP
              </button>

              <button
                onClick={() => setActiveTab('materials')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-normal transition-all flex items-center gap-1.5 ${
                  activeTab === 'materials'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-current" /> 材料剛性
              </button>

              <button
                onClick={() => setActiveTab('checklist')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-normal transition-all flex items-center gap-1.5 ${
                  activeTab === 'checklist'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5 text-current" /> R&amp;D 清單
              </button>
            </nav>

            {/* Desktop Install Button */}
            <PwaInstallPrompt />
          </div>

          {/* Mobile Install Button Header Anchor */}
          <div className="flex md:hidden items-center shrink-0">
            <PwaInstallPrompt />
          </div>
        </div>
      </div>
    </header>
  );
};

