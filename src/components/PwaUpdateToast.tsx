import React, { useState, useEffect } from 'react';
import { RefreshCw, Sparkles, X } from 'lucide-react';

export const PwaUpdateToast: React.FC = () => {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').then((registration) => {
        // If there's an active waiting worker, show prompt
        if (registration.waiting) {
          setWaitingWorker(registration.waiting);
          setShowUpdate(true);
        }

        // Listen for new updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setWaitingWorker(newWorker);
                setShowUpdate(true);
              }
            });
          }
        });
      }).catch((error) => {
        console.warn('Service Worker registration error:', error);
      });

      // Reload page when new worker takes control
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
    setShowUpdate(false);
  };

  if (!showUpdate) {
    return null;
  }

  return (
    <aside
      role="status"
      aria-live="polite"
      aria-label="系統更新提示"
      className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:max-w-md z-50 animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-slate-900/95 text-slate-100 backdrop-blur-md border-2 border-blue-500/80 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/30 text-blue-400 rounded-xl shrink-0 animate-pulse">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[13px] font-black text-white flex items-center gap-1.5">
              <span>發現新版本系統與資料</span>
            </div>
            <div className="text-[12px] text-slate-300">
              包含最新 ISO 80369-7 規格數據與計算優化
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleUpdate}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-[12px] font-black rounded-lg shadow transition-all flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>立即更新</span>
          </button>
          <button
            onClick={() => setShowUpdate(false)}
            aria-label="關閉更新提示"
            className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
