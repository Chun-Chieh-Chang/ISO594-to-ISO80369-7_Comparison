import React from 'react';
import { Cpu, Calculator, Gauge, Layers, CheckSquare, AlertTriangle } from 'lucide-react';

export type ActiveTab = 'tables' | 'visualizer' | 'calculator' | 'tests' | 'materials' | 'checklist';

interface Props {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Header: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="bg-white text-slate-900 border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Logo & Main Title */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="bg-red-50 text-red-700 text-[13px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded border border-red-200 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> High Risk Standard Migration
              </span>
              <span className="bg-blue-50 text-blue-700 text-[13px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded border border-blue-200 font-mono">
                ISO 594-1/2 ➔ ISO 80369-7:2021
              </span>
              <span className="text-slate-600 text-[13px] font-mono uppercase tracking-wider hidden sm:inline-block">
                // REV 1.04 ENGINEERING AUDIT
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase leading-tight text-slate-900">
              Engineering Standards Audit
              <span className="block text-sm sm:text-base font-bold text-slate-600 font-sans tracking-normal mt-0.5">
                魯爾接頭圖面轉版比對與工程審查系統
              </span>
            </h1>
          </div>

          {/* Tab Navigation */}
          <nav className="flex flex-wrap items-center bg-slate-100 p-1.5 rounded-xl border border-slate-200 gap-1">
            <button
              onClick={() => setActiveTab('tables')}
              className={`px-3 py-2 rounded-lg text-[13px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === 'tables'
                  ? 'bg-blue-600 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-current" /> 逐一尺寸比對
            </button>

            <button
              onClick={() => setActiveTab('visualizer')}
              className={`px-3 py-2 rounded-lg text-[13px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === 'visualizer'
                  ? 'bg-amber-600 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-current" /> 基準位移圖解
            </button>

            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-3 py-2 rounded-lg text-[13px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === 'calculator'
                  ? 'bg-emerald-600 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-current" /> CAD 評估計算器
            </button>

            <button
              onClick={() => setActiveTab('tests')}
              className={`px-3 py-2 rounded-lg text-[13px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === 'tests'
                  ? 'bg-purple-600 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
              }`}
            >
              <Gauge className="w-3.5 h-3.5 text-current" /> 測試 SOP 變更
            </button>

            <button
              onClick={() => setActiveTab('materials')}
              className={`px-3 py-2 rounded-lg text-[13px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === 'materials'
                  ? 'bg-indigo-600 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-current" /> 材料剛性矩陣
            </button>

            <button
              onClick={() => setActiveTab('checklist')}
              className={`px-3 py-2 rounded-lg text-[13px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === 'checklist'
                  ? 'bg-emerald-600 text-white shadow-sm font-black'
                  : 'text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100/60'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5 text-current" /> R&amp;D 行動清單
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
