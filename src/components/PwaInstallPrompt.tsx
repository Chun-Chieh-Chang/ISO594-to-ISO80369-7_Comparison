import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { Download, Share2, PlusSquare, X, Smartphone, CheckCircle2 } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

/**
 * beforeinstallprompt 事件每個分頁只會觸發一次，且 prompt() 只能呼叫一次。
 * 元件可能同時掛載多份（頁首、手機抽屜），故將事件保存在模組層級的單一來源，
 * 由所有實例共用，避免重複呼叫 prompt() 而拋錯。
 */
let deferredPrompt: BeforeInstallPromptEvent | null = null;
let installed = false;
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((fn) => fn());

const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

const getSnapshot = () => (installed ? 'installed' : deferredPrompt ? 'ready' : 'idle');
const getServerSnapshot = () => 'idle' as const;

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    notify();
  });
  window.addEventListener('appinstalled', () => {
    installed = true;
    deferredPrompt = null;
    notify();
  });
}

interface Props {
  className?: string;
  variant?: 'button' | 'banner';
}

export const PwaInstallPrompt: React.FC<Props> = ({ className = '', variant = 'button' }) => {
  const promptState = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(display-mode: standalone)');
    const check = () =>
      setIsStandalone(
        mq.matches || (window.navigator as unknown as { standalone?: boolean }).standalone === true
      );
    check();
    mq.addEventListener('change', check);

    const ua = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));

    return () => mq.removeEventListener('change', check);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      const evt = deferredPrompt;
      deferredPrompt = null; // prompt() 僅能呼叫一次，先行清除避免競態
      notify();
      try {
        await evt.prompt();
        const choice = await evt.userChoice;
        if (choice.outcome === 'accepted') {
          installed = true;
          notify();
        }
      } catch {
        setShowGuide(true);
      }
      return;
    }
    // 無原生安裝事件（iOS Safari、桌面 Firefox 等）時改以圖文引導
    setShowGuide(true);
  };

  if (isStandalone || promptState === 'installed') return null;

  return (
    <>
      {variant === 'button' ? (
        <button
          onClick={handleInstallClick}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-bold tracking-wider transition-all bg-blue-600 hover:bg-blue-700 text-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${className}`}
        >
          <Download className="w-3.5 h-3.5" aria-hidden="true" />
          <span>安裝 App</span>
        </button>
      ) : (
        <div
          className={`bg-slate-900 text-white p-3 rounded-xl border border-slate-700 shadow-md flex items-center justify-between gap-3 ${className}`}
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/20 text-blue-300 rounded-lg shrink-0">
              <Smartphone className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="text-[13px] font-bold text-slate-100">安裝為離線工程 App</div>
              <div className="text-[13px] text-slate-300">首次連網載入後即可於無網路環境查驗</div>
            </div>
          </div>
          <button
            onClick={handleInstallClick}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[13px] font-black rounded-lg shrink-0 shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            立即安裝
          </button>
        </div>
      )}

      {showGuide && <InstallGuideDialog isIOS={isIOS} onClose={() => setShowGuide(false)} />}
    </>
  );
};

const InstallGuideDialog: React.FC<{ isIOS: boolean; onClose: () => void }> = ({ isIOS, onClose }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="install-guide-title"
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 text-slate-100 border border-slate-700 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative focus:outline-none"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600/20 text-blue-300 rounded-lg">
              <Smartphone className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 id="install-guide-title" className="text-base font-black text-white">
              安裝至主畫面
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            aria-label="關閉"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4 text-sm text-slate-300">
          <p className="text-[13px] text-slate-300 leading-relaxed">
            安裝為 PWA 後可享全螢幕顯示，並在首次連網載入後於無網路環境使用：
          </p>

          {isIOS ? (
            <ol className="space-y-3 bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 list-none">
              {[
                <>
                  點擊 Safari 下方工具列的「<strong>分享</strong>」按鈕
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 ml-1 bg-slate-700 rounded text-blue-300">
                    <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
                  </span>
                </>,
                <>
                  在選單中向下滑動，選擇「<strong>加入主畫面</strong>」
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 ml-1 bg-slate-700 rounded text-emerald-300">
                    <PlusSquare className="w-3.5 h-3.5" aria-hidden="true" />
                  </span>
                </>,
                <>
                  點擊右上角的「<strong>新增</strong>」即完成安裝。
                </>
              ].map((content, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-[13px] font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div>{content}</div>
                </li>
              ))}
            </ol>
          ) : (
            <div className="space-y-2.5 bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  點擊瀏覽器網址列右側或選單中的「<strong>安裝應用程式</strong>」或「<strong>加到主畫面</strong>」。
                  部分瀏覽器（如桌面版 Firefox）不支援 PWA 安裝。
                </span>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          我知道了
        </button>
      </div>
    </div>
  );
};
