import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

/** 捲動超過此距離才浮現（頁首區塊不需要返回） */
const SCROLL_THRESHOLD = 480;

/** 回到頁首浮動鈕（Frontend-Terms: back-to-top）
 *  手機端定位須避開 MobileBottomNav（bottom-24 ≥ 底列高度 + safe-area） */
export const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="回到頁首"
      tabIndex={visible ? 0 : -1}
      className={`neo-card fixed right-4 bottom-24 md:right-6 md:bottom-8 z-30 w-11 h-11 rounded-full grid place-items-center text-[var(--neo-accent)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
      }`}
    >
      <ArrowUp className="w-5 h-5" aria-hidden="true" />
    </button>
  );
};
