import React, { useState } from 'react';
import { ChecklistItem } from '../types';
import { generateEcoText } from '../data/checklistData';
import { X, Copy, Check, FileText } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  items: ChecklistItem[];
}

export const EcoGeneratorModal: React.FC<Props> = ({ isOpen, onClose, items }) => {
  const [docNumber, setDocNumber] = useState('ECO-2026-LUER-001');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const ecoText = generateEcoText(items, docNumber);

  const handleCopy = () => {
    navigator.clipboard.writeText(ecoText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-xl relative text-slate-900">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
          <FileText className="w-5 h-5 text-amber-600" />
          <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">工程變更單 (ECO / ECN) 範本生成器</h3>
        </div>

        <div className="mb-4">
          <label className="text-[13px] text-slate-700 font-bold uppercase block mb-1">自訂 ECO 單號 (ECO Document Number)</label>
          <input
            type="text"
            value={docNumber}
            onChange={(e) => setDocNumber(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-900 text-[13px] font-mono font-bold rounded-lg p-2.5 w-full focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-[13px] text-slate-800 h-80 overflow-y-auto whitespace-pre-wrap leading-relaxed select-all">
          {ecoText}
        </div>

        <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] font-bold uppercase font-mono text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg border border-slate-200"
          >
            關閉
          </button>
          <button
            onClick={handleCopy}
            className="px-4 py-2 text-[13px] font-black uppercase tracking-wider bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg border border-amber-400 flex items-center gap-2 shadow-xs transition-all"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? '已複製到剪貼簿！' : '複製 ECO 內容文案'}
          </button>
        </div>
      </div>
    </div>
  );
};
