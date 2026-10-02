import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
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

  // ── Sliding Pill：量測作用中圖示晶片位置，滑塊跟隨移動（保持原晶片視覺，僅動態化） ──
  const chipRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);

  const primaryTabs = TAB_DEFS.slice(0, PRIMARY_COUNT);
  const overflowTabs = TAB_DEFS.slice(PRIMARY_COUNT);
  const isMoreActive = overflowTabs.some((t) => t.id === activeTab);
  const activeChipIndex = primaryTabs.findIndex((t) => t.id === activeTab) >= 0
    ? primaryTabs.findIndex((t) => t.id === activeTab)
    : primaryTabs.length; // 其餘分頁 →「更多」晶片

  useLayoutEffect(() => {
    const measure = () => {
      const chip = chipRefs.current[activeChipIndex];
      const slider = sliderRef.current;
      if (!slider || !slider.parentElement) return;
      if (chip && chip.offsetWidth > 0) {
        // 按鈕本身為 positioned（relative z-10），chip.offsetLeft 相對按鈕而非格線，
        // 故以 getBoundingClientRect 對格線原點求差值取得正確座標
        const gridRect = slider.parentElement.getBoundingClientRect();
        const chipRect = chip.getBoundingClientRect();
        slider.style.left = `${chipRect.left - gridRect.left}px`;
        slider.style.top = `${chipRect.top - gridRect.top}px`;
        slider.style.width = `${chipRect.width}px`;
        slider.style.height = `${chipRect.height}px`;
        slider.style.opacity = '1';
      } else {
        slider.style.opacity = '0'; // 桌機 md:hidden 量測為 0，滑塊隱藏
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [activeChipIndex]);

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
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-lg border-t border-[var(--neo-border)] shadow-[0_-2px_12px_rgba(140,158,192,0.2)] px-3 pt-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom))]"
        style={{ background: 'var(--neo-surface)' }}
      >
        <div className="relative grid grid-cols-5 items-center max-w-md mx-auto">
          {/* 滑動指示條：跟隨作用中分頁的圖示晶片 */}
          <div
            ref={sliderRef}
            aria-hidden="true"
            className="neo-pill-active pill-slider absolute rounded-lg"
            style={{ left: 0, top: 0, width: 0, height: 0, opacity: 0, zIndex: 0 }}
          />
          {primaryTabs.map(({ id, shortLabel, icon: Icon }, idx) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => handleSelectTab(id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative z-10 flex flex-col items-center justify-center min-h-[48px] py-1 px-1 rounded-xl transition-all active:scale-[0.97] select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
                  isActive ? 'text-[var(--neo-text)] font-bold' : 'text-[var(--neo-muted)] hover:text-[var(--neo-text)]'
                }`}
              >
                <span
                  ref={(el) => { chipRefs.current[idx] = el; }}
                  className="relative z-10 p-1.5 rounded-lg"
                >
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
            className={`relative z-10 flex flex-col items-center justify-center min-h-[48px] py-1 px-1 rounded-xl transition-all active:scale-[0.97] select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
              isMoreActive ? 'text-[var(--neo-text)] font-bold' : 'text-[var(--neo-muted)] hover:text-[var(--neo-text)]'
            }`}
          >
            <span
              ref={(el) => { chipRefs.current[primaryTabs.length] = el; }}
              className="relative z-10 p-1.5 rounded-lg"
            >
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
            className="rounded-t-3xl border-t border-[var(--neo-border)] p-5 shadow-2xl max-w-lg w-full mx-auto pb-[max(1.5rem,env(safe-area-inset-bottom))] focus:outline-none"
            style={{ background: 'var(--neo-surface)' }}
          >
            <div className="w-12 h-1.5 bg-[var(--neo-inset)] rounded-full mx-auto mb-4" aria-hidden="true" />

            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--neo-border)]">
              <h3 id="more-drawer-title" className="text-base font-black text-[var(--neo-text)] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" aria-hidden="true" />
                其他工程模組
              </h3>
              <button
                onClick={() => setShowMoreDrawer(false)}
                className="p-1.5 text-[var(--neo-muted)] hover:text-[var(--neo-text)] rounded-lg hover:bg-[var(--neo-inset)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
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
                      : 'bg-[var(--neo-inset)] border-[var(--neo-border)] text-[var(--neo-text)] hover:brightness-95'
                  }`}
                >
                  <span className="p-2 bg-[var(--neo-header)] text-white rounded-lg">
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-bold">{label}</span>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-[var(--neo-border)] space-y-3">
              <PwaInstallPrompt variant="banner" />
              <div className="text-center text-[13px] text-[var(--neo-muted)] font-sans space-y-0.5 pt-1">
                <div>
                  Developed by <strong className="text-[var(--neo-text)] font-semibold">Wesley Chang</strong> @Mouldex, Aug-2026.
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
