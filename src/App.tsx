import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { DatumShiftVisualizer } from './components/DatumShiftVisualizer';
import { DimensionTables } from './components/DimensionTables';
import { DimensionCalculator } from './components/DimensionCalculator';
import { TestRequirementsTable } from './components/TestRequirementsTable';
import { ActionChecklist } from './components/ActionChecklist';
import { MaterialGuide } from './components/MaterialGuide';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PwaUpdateToast } from './components/PwaUpdateToast';
import { ConnectorCategory } from './types';
import { ArrowRight, AlertOctagon } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('tables');
  const [selectedCategory, setSelectedCategory] = useState<ConnectorCategory>('male-slip');

  // Handle URL query parameter for PWA shortcuts (e.g. ?tab=calculator)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') as ActiveTab;
    const validTabs: ActiveTab[] = ['tables', 'visualizer', 'calculator', 'tests', 'materials', 'checklist'];
    if (tabParam && validTabs.includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col selection:bg-blue-500 selection:text-white">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 md:pb-8">
        {/* Engineering Migration Technical Overview Banner */}
        <section className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  技術審查指引
                </span>
                <span className="text-xs font-mono text-slate-500">
                  ISO 594 ➔ ISO 80369-7 轉換核心變更
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                魯爾接頭圖面轉版工程審查要點
              </h2>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                圖面轉版需實質校驗幾何尺寸與量測方法，請務必依循以下四項核心技術變更進行審查：
              </p>
            </div>

            <button
              onClick={() => setActiveTab('checklist')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-all shrink-0 self-start lg:self-auto"
            >
              開啟 R&amp;D 審查清單
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 4-Pillar Engineering Changes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-5">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-slate-300 transition-all">
              <div className="text-xs font-mono font-bold text-amber-700 uppercase tracking-wider mb-1">
                變更 01 // 基準面平移
              </div>
              <div className="text-sm font-bold text-slate-900 mb-1">
                0.75mm 基準位移
              </div>
              <p className="text-xs text-slate-600 leading-normal">
                基準面自接頭末端內移 0.75mm，名義外徑由 4.000mm 調為 4.045mm。
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-slate-300 transition-all">
              <div className="text-xs font-mono font-bold text-rose-700 uppercase tracking-wider mb-1">
                變更 02 // 內孔規格約束
              </div>
              <div className="text-sm font-bold text-slate-900 mb-1">
                內孔上限 Øf ≤ 2.900mm
              </div>
              <p className="text-xs text-slate-600 leading-normal">
                強制限制內徑上限，防止誤插入非相容管路，需同步確認流阻與模具針徑。
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-slate-300 transition-all">
              <div className="text-xs font-mono font-bold text-indigo-700 uppercase tracking-wider mb-1">
                變更 03 // 母凸耳標註重構
              </div>
              <div className="text-sm font-bold text-slate-900 mb-1">
                改採 N1/N2/ØJ 座標定義
              </div>
              <p className="text-xs text-slate-600 leading-normal">
                廢除原 ISO 594 的 F/V 弦長標註，改由三維幾何外徑與厚度精準約束。
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-slate-300 transition-all">
              <div className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider mb-1">
                變更 04 // 檢測方法升級
              </div>
              <div className="text-sm font-bold text-slate-900 mb-1">
                定量氣密與負壓測試
              </div>
              <p className="text-xs text-slate-600 leading-normal">
                全面廢除傳統金屬塞規手動手感檢測，改採定量壓力衰減自動化驗證。
              </p>
            </div>
          </div>
        </section>

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

      {/* Mobile Bottom Navigation Bar (< md screens) */}
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* PWA Update Toast Notification */}
      <PwaUpdateToast />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-6 text-center text-xs text-slate-500 font-sans">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[11px] sm:text-xs text-slate-600 font-semibold">
            <div>
              ISO 594-1 / ISO 594-2 ➔ ISO 80369-7:2021 AUDIT SUITE
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <span>ISO 80369-7:2021 Table B.1 - B.6</span>
              <span>•</span>
              <span>FDA Recognized Consensus Standard</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-1 text-[11px] text-slate-400">
            <div>
              Developed by <strong className="text-slate-700 font-semibold">Wesley Chang</strong> @Mouldex, Aug-2026.
            </div>
            <div>
              © 2026 Mouldex. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

