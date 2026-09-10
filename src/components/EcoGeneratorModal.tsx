import React, { useEffect, useRef, useState } from 'react';
import { ChecklistItem } from '../types';
import { generateEcoText } from '../data/checklistData';
import { X, Copy, Check, FileText, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  items: ChecklistItem[];
}

export const EcoGeneratorModal: React.FC<Props> = ({ isOpen, onClose, items }) => {
  const [docNumber, setDocNumber] = useState(`ECO-${new Date().getFullYear()}-LUER-001`);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const completedCount = items.filter((i) => i.completed).length;
  const ecoText = generateEcoText(items, docNumber);

  const handleCopy = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
      await navigator.clipboard.writeText(ecoText);
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 2000);
    } catch {
      setCopyState('failed');
      setTimeout(() => setCopyState('idle'), 3000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="eco-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-xl relative text-slate-900 focus:outline-none"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
          aria-label="關閉"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200 pr-10">
          <FileText className="w-5 h-5 text-amber-600" aria-hidden="true" />
          <h3 id="eco-modal-title" className="text-lg font-black tracking-tight text-slate-900">
            工程變更單 (ECO) 產生器
          </h3>
        </div>

        {completedCount === 0 && (
          <div className="mb-4 flex items-start gap-2.5 bg-amber-50 border border-amber-300 rounded-lg px-3.5 py-2.5 text-[13px] text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
            <span className="leading-relaxed">
              目前尚無勾選項目，因此本變更單不含任何變更內容。ECO 內容完全依查核清單的實際勾選狀態產生，
              以維持工程變更的可追溯性。
            </span>
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="eco-doc-number" className="text-[13px] text-slate-700 font-bold block mb-1">
            ECO 單號
          </label>
          <input
            id="eco-doc-number"
            type="text"
            value={docNumber}
            onChange={(e) => setDocNumber(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-900 text-[13px] font-mono font-bold rounded-lg p-2.5 w-full focus:border-amber-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40"
          />
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-[13px] text-slate-800 h-80 overflow-y-auto whitespace-pre-wrap leading-relaxed select-all">
          {ecoText}
        </div>

        <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-200 flex-wrap">
          <span className="text-[13px] text-slate-500 font-mono">
            已完成 {completedCount} / {items.length} 項
          </span>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-[13px] font-bold font-mono text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg border border-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
            >
              關閉
            </button>
            <button
              onClick={handleCopy}
              className="px-4 py-2 text-[13px] font-black tracking-wider bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg border border-amber-400 flex items-center gap-2 shadow-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
            >
              {copyState === 'copied' ? (
                <Check className="w-4 h-4" aria-hidden="true" />
              ) : copyState === 'failed' ? (
                <AlertCircle className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Copy className="w-4 h-4" aria-hidden="true" />
              )}
              {copyState === 'copied'
                ? '已複製到剪貼簿'
                : copyState === 'failed'
                ? '複製失敗，請手動選取'
                : '複製 ECO 內容'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
