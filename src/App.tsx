import { useState, useEffect, useMemo, useCallback } from 'react';
import { Header, ActiveTab, ACTIVE_TABS } from './components/Header';
import { DatumShiftVisualizer } from './components/DatumShiftVisualizer';
import { DimensionTables } from './components/DimensionTables';
import { DimensionCalculator } from './components/DimensionCalculator';
import { TestRequirementsTable } from './components/TestRequirementsTable';
import { ActionChecklist } from './components/ActionChecklist';
import { MaterialGuide } from './components/MaterialGuide';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PwaUpdateToast } from './components/PwaUpdateToast';
import { BackToTop } from './components/BackToTop';
import { DIMENSIONS_DATA } from './data/dimensionsData';
import { CHANGE_TYPE_META, ChangeType, ConnectorCategory, MaterialType } from './types';
import { ArrowRight } from 'lucide-react';

const CARD_ACCENT: Record<ChangeType, string> = {
  identical: 'text-emerald-700',
  'datum-shift': 'text-amber-700',
  'limit-added': 'text-sky-700',
  'new-feature': 'text-rose-700',
  downgraded: 'text-violet-700',
  removed: 'text-slate-600'
};

/** 數字滾動（Frontend-Terms: count-up）— 掛載時 0 → target，偏好減少動態時直接顯示終值 */
function useCountUp(target: number, duration = 700): number {
  const prefersReduced = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [value, setValue] = useState(() => (prefersReduced() ? target : 0));

  useEffect(() => {
    if (prefersReduced()) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

const CountUp = ({ value, duration = 700 }: { value: number; duration?: number }) => {
  const display = useCountUp(value, duration);
  return <>{display}</>;
};

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('tables');
  // 接頭類型與材料類別為全站共用軸線，避免各分頁各自為政
  const [selectedCategory, setSelectedCategory] = useState<ConnectorCategory>('male-slip');
  const [material, setMaterial] = useState<MaterialType>('semi-rigid');

  // 初次載入時讀取 ?tab=（供 PWA 捷徑與深連結使用）
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam && (ACTIVE_TABS as readonly string[]).includes(tabParam)) {
      setActiveTab(tabParam as ActiveTab);
    }
  }, []);

  // 切換分頁時同步網址，讓上一頁與分享連結可用
  const changeTab = useCallback((tab: ActiveTab) => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.replaceState({}, '', url);
  }, []);

  /** 全部八張表的圖面動作分佈 —— 與尺寸表的篩選器共用同一組分類 */
  const changeSummary = useMemo(() => {
    const counts = new Map<ChangeType, number>();
    DIMENSIONS_DATA.forEach((cat) =>
      cat.items.forEach((i) => counts.set(i.changeType, (counts.get(i.changeType) ?? 0) + 1))
    );
    const total = DIMENSIONS_DATA.reduce((n, c) => n + c.items.length, 0);
    return { counts, total };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--neo-bg)] text-[var(--neo-text)] font-sans antialiased flex flex-col selection:bg-blue-500 selection:text-white">
      <Header activeTab={activeTab} setActiveTab={changeTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 md:pb-8">
        <section className="neo-card rounded-2xl p-5 sm:p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[var(--neo-border)]">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[13px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  技術審查指引
                </span>
                <span className="text-[13px] font-mono text-[var(--neo-muted)]">
                  ISO 594 ➔ ISO 80369-7 轉換核心變更
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[var(--neo-text)] tracking-tight">
                魯爾接頭圖面轉版工程審查要點
              </h2>
              <p className="text-[13px] text-[var(--neo-muted)] mt-1 leading-relaxed max-w-3xl">
                Annex B 全部八張表共 <strong className="text-[var(--neo-text)] font-mono"><CountUp value={changeSummary.total} /></strong> 項尺寸，
                依「2D 圖面必須採取的動作」分為以下六類。此分類同時是尺寸比對表的篩選軸，兩處必然一致。
              </p>
            </div>

            <button
              onClick={() => changeTab('checklist')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--neo-text)] hover:opacity-90 text-white text-[13px] font-bold tracking-wider rounded-xl shadow-sm transition-all shrink-0 self-start lg:self-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
            >
              開啟 R&amp;D 審查清單
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-5">
            {CHANGE_TYPE_META.map((meta, idx) => (
              <button
                key={meta.id}
                onClick={() => changeTab('tables')}
                className="stagger-card neo-pressable spotlight-card text-left p-3.5 rounded-xl neo-tray transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                style={{ animationDelay: `${idx * 0.08}s` }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
                  e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
                }}
              >
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <span className={`text-[13px] font-mono font-bold tracking-wider ${CARD_ACCENT[meta.id]}`}>
                    {meta.optionLabel.split(' (')[1]?.replace(')', '') ?? meta.id}
                  </span>
                  <span className="font-mono text-lg font-black text-[var(--neo-text)] tabular-nums">
                    <CountUp value={changeSummary.counts.get(meta.id) ?? 0} />
                  </span>
                </div>
                <div className="text-sm font-bold text-[var(--neo-text)] mb-1">{meta.label}</div>
                <p className="text-[13px] text-[var(--neo-muted)] leading-normal">{meta.action}</p>
              </button>
            ))}
          </div>
        </section>

        {/* key 變更 → unmount/remount → pageIn 動畫自動播放（無需動畫庫） */}
        <div key={activeTab} className="page-transition">
          {activeTab === 'tables' && (
            <DimensionTables
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              material={material}
              onSelectMaterial={setMaterial}
            />
          )}

          {activeTab === 'visualizer' && <DatumShiftVisualizer material={material} onSelectMaterial={setMaterial} />}

          {activeTab === 'calculator' && (
            <DimensionCalculator
              category={selectedCategory}
              material={material}
              onSelectCategory={setSelectedCategory}
              onSelectMaterial={setMaterial}
            />
          )}

          {activeTab === 'tests' && <TestRequirementsTable />}

          {activeTab === 'materials' && <MaterialGuide material={material} onSelectMaterial={setMaterial} />}

          {activeTab === 'checklist' && <ActionChecklist selectedCategory={selectedCategory} />}
        </div>
      </main>

      <MobileBottomNav activeTab={activeTab} setActiveTab={changeTab} />

      <BackToTop />

      <PwaUpdateToast />

      <footer className="border-t border-[var(--neo-border)] py-6 text-center text-[13px] text-[var(--neo-muted)] font-sans" style={{ background: 'var(--neo-surface)' }}>
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[13px] text-[var(--neo-text)] font-semibold">
            <div>ISO 594-1 / ISO 594-2 ➔ ISO 80369-7:2021 AUDIT SUITE</div>
            <div className="flex items-center gap-3 text-[var(--neo-muted)] flex-wrap justify-center">
              <span>Annex B Table B.1 – B.8 全數收錄</span>
              <span aria-hidden="true">•</span>
              <span>FDA Recognized Consensus Standard</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[var(--neo-border)] flex flex-col sm:flex-row items-center justify-between gap-1 text-[13px] text-[var(--neo-muted)]">
            <div>
              Developed by <strong className="text-[var(--neo-text)] font-semibold">Wesley Chang</strong> @Mouldex, Aug-2026.
            </div>
            <div>© 2026 Mouldex. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
