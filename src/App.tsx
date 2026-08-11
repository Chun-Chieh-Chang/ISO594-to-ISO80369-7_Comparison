import React, { useState } from 'react';
import { Header, ActiveTab } from './components/Header';
import { DatumShiftVisualizer } from './components/DatumShiftVisualizer';
import { DimensionTables } from './components/DimensionTables';
import { DimensionCalculator } from './components/DimensionCalculator';
import { TestRequirementsTable } from './components/TestRequirementsTable';
import { ActionChecklist } from './components/ActionChecklist';
import { MaterialGuide } from './components/MaterialGuide';
import { ConnectorCategory } from './types';
import { ArrowRight, AlertOctagon } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('tables');
  const [selectedCategory, setSelectedCategory] = useState<ConnectorCategory>('male-slip');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col selection:bg-blue-500 selection:text-white">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Executive Summary Alert Banner */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-5 shadow-sm mb-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-amber-500 text-white rounded-lg font-black shrink-0 mt-0.5 shadow-sm">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[13px] font-mono font-black uppercase tracking-wider text-amber-800 bg-amber-200/80 px-2.5 py-0.5 rounded-full border border-amber-300">
                    CRITICAL WARNING // 4 FATAL AUDIT BLIND SPOTS
                  </span>
                </div>
                <h2 className="text-base font-black text-slate-900 uppercase tracking-tight">
                  工程部門圖面轉版四大致命盲點警告 (Engineering Audit Alert)
                </h2>
                <p className="text-[13px] text-slate-700 mt-1.5 leading-relaxed max-w-4xl">
                  工程單位若「直接在圖面上將 ISO 594 改寫為 ISO 80369-7」，將面臨法規退件或召回風險！<br />
                  <strong className="text-amber-800 uppercase font-black font-mono">盲點一：</strong>0.75mm 基準位移導致剖面數值增加 (+0.045mm)。
                  <strong className="text-rose-800 uppercase font-black font-mono"> 盲點二：</strong>公接頭內孔 Øf 強制限制 ≤ 2.900mm。
                  <strong className="text-purple-800 uppercase font-black font-mono"> 盲點三：</strong>母鎖固凸耳廢除 F 及 V 弦長改為 N1/N2/ØJ。
                  <strong className="text-emerald-800 uppercase font-black font-mono"> 盲點四：</strong>廢除金屬塞規，採真空/氣壓定量檢測。
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('checklist')}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[13px] uppercase tracking-wider rounded-lg flex items-center gap-2 shrink-0 shadow-sm transition-all self-start md:self-auto"
            >
              開啟 R&amp;D 圖面審查 Checklist
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab View Switching - MECE Strict Single View Rendering */}
        {activeTab === 'tables' && (
          <div>
            <DimensionTables
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
        )}

        {activeTab === 'visualizer' && (
          <div>
            <DatumShiftVisualizer />
          </div>
        )}

        {activeTab === 'calculator' && (
          <div>
            <DimensionCalculator />
          </div>
        )}

        {activeTab === 'tests' && (
          <div>
            <TestRequirementsTable />
          </div>
        )}

        {activeTab === 'materials' && (
          <div>
            <MaterialGuide />
          </div>
        )}

        {activeTab === 'checklist' && (
          <div>
            <ActionChecklist />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-[13px] text-slate-600 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-bold">
          <div>
            ISO 594-1 / ISO 594-2 ➔ ISO 80369-7:2021 AUDIT SUITE
          </div>
          <div className="flex items-center gap-4 text-slate-500 text-[13px]">
            <span>ISO 80369-7:2021 Table B.1 - B.6</span>
            <span>•</span>
            <span>FDA Recognized Consensus Standard</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
