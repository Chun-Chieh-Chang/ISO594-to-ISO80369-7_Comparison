import React, { useState, useEffect } from 'react';
import { Download, Share2, PlusSquare, X, Smartphone, CheckCircle2 } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface Props {
  className?: string;
  variant?: 'button' | 'banner';
}

export const PwaInstallPrompt: React.FC<Props> = ({ className = '', variant = 'button' }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      setIsStandalone(isStandaloneMode);
    };

    checkStandalone();

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as unknown as { MSStream?: boolean }).MSStream;
    setIsIOS(isIosDevice);

    // Listen for beforeinstallprompt event (Android / Chromium)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      setShowIOSModal(true);
    }
  };

  // If already installed in standalone mode, hide the button
  if (isStandalone || isInstalled) {
    return null;
  }

  return (
    <>
      {variant === 'button' ? (
        <button
          onClick={handleInstallClick}
          aria-label="安裝應用程式"
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-bold tracking-wider transition-all bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm hover:shadow active:scale-95 ${className}`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>安裝 App</span>
        </button>
      ) : (
        <div className={`bg-slate-900 text-white p-3 rounded-xl border border-slate-700 shadow-md flex items-center justify-between gap-3 ${className}`}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[13px] font-bold text-slate-100">安裝為離線工程 App</div>
              <div className="text-[11px] text-slate-400">支援無塵室/廠房零網路環境查驗</div>
            </div>
          </div>
          <button
            onClick={handleInstallClick}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[12px] font-black rounded-lg shrink-0 shadow-sm transition-all"
          >
            立即安裝
          </button>
        </div>
      )}

      {/* iOS / Fallback Installation Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-slate-900 text-slate-100 border border-slate-700 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black text-white">安裝至手機主畫面</h3>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                aria-label="關閉"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Instruction Steps */}
            <div className="py-4 space-y-4 text-sm text-slate-300">
              <p className="text-xs text-slate-400 leading-relaxed">
                將此審查系統安裝為 PWA 應用程式，即可享有<strong>全螢幕顯示</strong>與<strong>無網路離線計算</strong>功能：
              </p>

              {isIOS ? (
                <div className="space-y-3 bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
                  <div className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      點擊 Safari 下方工具列的「<strong>分享</strong>」按鈕
                      <span className="inline-flex items-center justify-center px-1.5 py-0.5 ml-1 bg-slate-700 rounded text-blue-400">
                        <Share2 className="w-3.5 h-3.5 inline" />
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      在選單中向下滑動，選擇「<strong>加入主畫面</strong>」
                      <span className="inline-flex items-center justify-center px-1.5 py-0.5 ml-1 bg-slate-700 rounded text-emerald-400">
                        <PlusSquare className="w-3.5 h-3.5 inline" />
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold shrink-0 mt-0.5">
                      3
                    </span>
                    <div>
                      點擊右上角的「<strong>新增</strong>」即完成安裝。
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5 bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>點擊瀏覽器網址列右側或選單中的「<strong>安裝應用程式</strong>」或「<strong>加到主畫面</strong>」。</span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Button */}
            <div className="pt-2">
              <button
                onClick={() => setShowIOSModal(false)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-98"
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
