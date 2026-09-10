import React, { useEffect, useRef, useState } from 'react';
import { ActiveTab, TAB_DEFS } from './Header';
import { MoreHorizontal, Sparkles, X } from 'lucide-react';
import { PwaInstallPrompt } from './PwaInstallPrompt';

interface Props {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

/** 底部列直接顯示前四項，其餘收進「更多」抽屜 —— 兩者合起來窮盡 TAB_DEFS */
const PRIMARY_COUNT = 4;

export const MobileBottomNav: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  const [showMoreDrawer, setShowMoreDrawer] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  const primaryTabs = TAB_DEFS.slice(0, PRIMARY_COUNT);
  const overflowTabs = TAB_DEFS.slice(PRIMARY_COUNT);
  const isMoreActive = overflowTabs.some((t) => t.id === activeTab);

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setShowMoreDrawer(false);
  };

  useEffect(() => {
    if (!showMoreDrawer) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowMoreDrawer(false);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    drawerRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [showMoreDrawer]);

  return (
    <>
      <nav
        aria-label="手機版快速導覽"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 shadow-[0_-2px_12px_rgba(0,0,0,0.04)] px-3 pt-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom))]"
      >
        <div className="grid grid-cols-5 items-center max-w-md mx-auto">
          {primaryTabs.map(({ id, shortLabel, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => handleSelectTab(id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex flex-col items-center justify-center min-h-[48px] py-1 px-1 rounded-xl transition-all select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
                  isActive ? 'text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <span className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-slate-100' : ''}`}>
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </span>
                <span className={`text-[13px] leading-tight mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {shortLabel}
                </span>
              </button>
            );
          })}

          <button
            onClick={() => setShowMoreDrawer(true)}
            aria-expanded={showMoreDrawer}
            aria-haspopup="dialog"
            className={`flex flex-col items-center justify-center min-h-[48px] py-1 px-1 rounded-xl transition-all select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
              isMoreActive ? 'text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <span className={`p-1.5 rounded-lg transition-colors ${isMoreActive ? 'bg-slate-100' : ''}`}>
              <MoreHorizontal className="w-5 h-5" aria-hidden="true" />
            </span>
            <span className={`text-[13px] leading-tight mt-0.5 ${isMoreActive ? 'font-bold' : 'font-medium'}`}>
              更多
            </span>
          </button>
        </div>
      </nav>

      {showMoreDrawer && (
        <div
          className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/60 backdrop-blur-xs"
          onClick={() => setShowMoreDrawer(false)}
        >
          <div
            ref={drawerRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="more-drawer-title"
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-t-3xl border-t border-slate-200 p-5 shadow-2xl max-w-lg w-full mx-auto pb-[max(1.5rem,env(safe-area-inset-bottom))] focus:outline-none"
          >
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4" aria-hidden="true" />

            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <h3 id="more-drawer-title" className="text-base font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" aria-hidden="true" />
                其他工程模組
              </h3>
              <button
                onClick={() => setShowMoreDrawer(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                aria-label="關閉選單"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 mb-4">
              {overflowTabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => handleSelectTab(id)}
                  aria-current={activeTab === id ? 'page' : undefined}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
                    activeTab === id
                      ? 'bg-blue-50 border-blue-200 text-blue-900 font-bold'
                      : 'bg-slate-50 border-slate-200/80 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <span className="p-2 bg-slate-900 text-white rounded-lg">
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-bold">{label}</span>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-3">
              <PwaInstallPrompt variant="banner" />
              <div className="text-center text-[13px] text-slate-400 font-sans space-y-0.5 pt-1">
                <div>
                  Developed by <strong className="text-slate-600 font-semibold">Wesley Chang</strong> @Mouldex, Aug-2026.
                </div>
                <div>© 2026 Mouldex. All rights reserved.</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
