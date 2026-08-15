import React, { useState } from 'react';
import { ActiveTab } from './Header';
import { Cpu, Layers, Calculator, Gauge, MoreHorizontal, CheckSquare, Sparkles, X, Download } from 'lucide-react';
import { PwaInstallPrompt } from './PwaInstallPrompt';

interface Props {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const MobileBottomNav: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  const [showMoreDrawer, setShowMoreDrawer] = useState(false);

  const mainNavItems = [
    { id: 'tables' as ActiveTab, label: '尺寸比對', icon: Cpu },
    { id: 'visualizer' as ActiveTab, label: '基準位移', icon: Layers },
    { id: 'calculator' as ActiveTab, label: 'CAD計算', icon: Calculator },
    { id: 'tests' as ActiveTab, label: '測試SOP', icon: Gauge },
  ];

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setShowMoreDrawer(false);
  };

  const isMoreActive = activeTab === 'materials' || activeTab === 'checklist';

  return (
    <>
      {/* Fixed Bottom Navigation Bar for Mobile (< md) */}
      <nav
        aria-label="手機版快速導航"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-t border-slate-200/80 shadow-[0_-2px_12px_rgba(0,0,0,0.04)] px-3 pt-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom))]"
      >
        <div className="grid grid-cols-5 items-center max-w-md mx-auto">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`flex flex-col items-center justify-center min-h-[48px] py-1 px-1 rounded-xl transition-all select-none active:scale-95 ${
                  isActive
                    ? 'text-slate-900 font-bold'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg transition-colors ${
                    isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-500'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[11px] leading-tight tracking-tight mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* More Drawer Trigger */}
          <button
            onClick={() => setShowMoreDrawer(true)}
            className={`flex flex-col items-center justify-center min-h-[48px] py-1 px-1 rounded-xl transition-all select-none active:scale-95 ${
              isMoreActive
                ? 'text-slate-900 font-bold'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <div
              className={`p-1.5 rounded-lg transition-colors ${
                isMoreActive ? 'bg-slate-100 text-slate-900' : 'text-slate-500'
              }`}
            >
              <MoreHorizontal className="w-5 h-5" />
            </div>
            <span className={`text-[11px] leading-tight tracking-tight mt-0.5 ${isMoreActive ? 'font-bold' : 'font-medium'}`}>
              更多
            </span>
          </button>
        </div>
      </nav>

      {/* More Options Drawer Modal */}
      {showMoreDrawer && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            onClick={() => setShowMoreDrawer(false)}
            className="flex-1 w-full"
            aria-hidden="true"
          />
          <div className="bg-white rounded-t-3xl border-t border-slate-200 p-5 shadow-2xl max-w-lg w-full mx-auto pb-[max(1.5rem,env(safe-area-inset-bottom))] animate-in slide-in-from-bottom-6 duration-200">
            {/* Drawer Handle */}
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                全系統工程模組與工具
              </h3>
              <button
                onClick={() => setShowMoreDrawer(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                aria-label="關閉選單"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 mb-4">
              <button
                onClick={() => handleSelectTab('materials')}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                  activeTab === 'materials'
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-900 font-bold'
                    : 'bg-slate-50 border-slate-200/80 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-600 text-white rounded-lg">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">材料剛性矩陣指南</div>
                    <div className="text-xs text-slate-500">剛性 vs 半剛性材料在 ISO 80369-7 下的尺寸規範差異</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleSelectTab('checklist')}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                  activeTab === 'checklist'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-bold'
                    : 'bg-slate-50 border-slate-200/80 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-600 text-white rounded-lg">
                    <CheckSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">R&amp;D 行動清單 &amp; ECO 生成器</div>
                    <div className="text-xs text-slate-500">工程轉版查驗項目與一鍵產生 ECO 變更申請單</div>
                  </div>
                </div>
              </button>
            </div>

            {/* PWA Install Banner inside Drawer */}
            <div className="pt-2 border-t border-slate-100">
              <PwaInstallPrompt variant="banner" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
