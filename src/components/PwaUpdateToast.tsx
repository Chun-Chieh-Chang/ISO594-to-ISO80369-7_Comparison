import React, { useEffect, useRef, useState } from 'react';
import { RefreshCw, Sparkles, X } from 'lucide-react';

export const PwaUpdateToast: React.FC = () => {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [showUpdate, setShowUpdate] = useState(false);
  /** 跨 effect 執行共用，避免 StrictMode 二次掛載時重複 reload */
  const refreshing = useRef(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    let cancelled = false;
    const cleanups: (() => void)[] = [];

    const onControllerChange = () => {
      if (refreshing.current) return;
      refreshing.current = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
    cleanups.push(() =>
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange)
    );

    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`)
      .then((registration) => {
        if (cancelled) return;

        if (registration.waiting) {
          setWaitingWorker(registration.waiting);
          setShowUpdate(true);
        }

        const onUpdateFound = () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          const onStateChange = () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setWaitingWorker(newWorker);
              setShowUpdate(true);
            }
          };
          newWorker.addEventListener('statechange', onStateChange);
          cleanups.push(() => newWorker.removeEventListener('statechange', onStateChange));
        };
        registration.addEventListener('updatefound', onUpdateFound);
        cleanups.push(() => registration.removeEventListener('updatefound', onUpdateFound));
      })
      .catch((error) => {
        console.warn('Service Worker registration failed:', error);
      });

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
    };
  }, []);

  const handleUpdate = () => {
    waitingWorker?.postMessage({ type: 'SKIP_WAITING' });
    setShowUpdate(false);
  };

  if (!showUpdate) return null;

  return (
    <aside
      role="status"
      aria-live="polite"
      className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:max-w-md z-50"
    >
      <div className="bg-slate-900/95 text-slate-100 backdrop-blur-md border-2 border-blue-500/80 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-blue-600/30 text-blue-300 rounded-xl shrink-0">
            <Sparkles className="w-5 h-5" aria-hidden="true" />
          </span>
          <div>
            <div className="text-[13px] font-black text-white">已有新版本可更新</div>
            <div className="text-[13px] text-slate-300">包含最新 ISO 80369-7 規格數據與計算修正</div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleUpdate}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[13px] font-black rounded-lg shadow transition-all flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>立即更新</span>
          </button>
          <button
            onClick={() => setShowUpdate(false)}
            aria-label="關閉更新提示"
            className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
