import React, { useState, useMemo } from 'react';
import { DIMENSIONS_DATA } from '../data/dimensionsData';
import { ConnectorCategory, DimensionItem } from '../types';
import { Search, Filter, AlertCircle, ArrowUpRight, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

interface Props {
  selectedCategory: ConnectorCategory;
  onSelectCategory: (cat: ConnectorCategory) => void;
}

export const DimensionTables: React.FC<Props> = ({ selectedCategory, onSelectCategory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeCategoryData = useMemo(() => {
    return DIMENSIONS_DATA.find((cat) => cat.id === selectedCategory) || DIMENSIONS_DATA[0];
  }, [selectedCategory]);

  const filteredItems = useMemo(() => {
    return activeCategoryData.items.filter((item) => {
      const matchesSearch =
        item.featureName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.featureNameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.iso80369Symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.iso594Symbol && item.iso594Symbol.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.engineeringExplanation.toLowerCase().includes(searchTerm.toLowerCase());

      if (filterType === 'all') return matchesSearch;
      if (filterType === 'datum-shift') return matchesSearch && item.changeType === 'datum-shift';
      if (filterType === 'new-feature') return matchesSearch && item.changeType === 'new-feature';
      if (filterType === 'method-change') return matchesSearch && item.changeType === 'method-change';
      if (filterType === 'relaxed-auxiliary') return matchesSearch && item.changeType === 'relaxed-auxiliary';

      return matchesSearch;
    });
  }, [activeCategoryData, searchTerm, filterType]);

  const handleCopyRow = (item: DimensionItem) => {
    const text = `【${item.featureName} (${item.iso80369Symbol})】\nISO 594: ${item.iso594Spec}\nISO 80369-7: ${item.iso80369SpecRigid}\n類型: ${item.changeTypeLabel}\n解析: ${item.engineeringExplanation}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getBadgeStyle = (type: DimensionItem['changeType']) => {
    switch (type) {
      case 'datum-shift':
        return 'bg-amber-100 text-amber-800 border-amber-300 font-bold';
      case 'new-feature':
        return 'bg-rose-100 text-rose-800 border-rose-300 font-bold';
      case 'method-change':
        return 'bg-purple-100 text-purple-800 border-purple-300 font-bold';
      case 'relaxed-auxiliary':
        return 'bg-blue-100 text-blue-800 border-blue-300 font-bold';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-6">
        <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
          <span>DIMENSIONAL SPECIFICATION AUDIT</span>
          <span className="text-[13px] font-mono font-normal text-slate-500 normal-case">
            // 接頭規格圖面對照表
          </span>
        </h2>
        <span className="text-[13px] font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 uppercase">
          ISO 80369-7 ANNEX B TABLES
        </span>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 pb-4">
        {DIMENSIONS_DATA.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              onSelectCategory(cat.id);
              setExpandedRowId(null);
            }}
            className={`px-4 py-2.5 rounded-lg text-[13px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white shadow-sm font-black'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            {cat.title}
            <span className={`text-[13px] font-mono px-2 py-0.5 rounded ${
              selectedCategory === cat.id ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {cat.items.length} 項
            </span>
          </button>
        ))}
      </div>

      {/* Category Header Banner */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-black text-slate-900 uppercase flex items-center gap-2">
            {activeCategoryData.title}
            <span className="text-[13px] text-blue-700 font-mono bg-blue-100/80 px-2.5 py-0.5 rounded border border-blue-200">
              {activeCategoryData.standardRef}
            </span>
          </h3>
          <p className="text-slate-600 text-[13px] mt-1 leading-relaxed font-sans">{activeCategoryData.description}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="搜尋尺寸名稱、國際符號 (如 ØH, N1, Øf, Datum)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-[13px] font-mono rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500 hidden sm:block" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-800 text-[13px] font-mono rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500 uppercase font-bold"
          >
            <option value="all">所有變更類型 (ALL CHANGES)</option>
            <option value="datum-shift">基準位移項 (DATUM SHIFT)</option>
            <option value="new-feature">全新管制項 (NEW FEATURE)</option>
            <option value="method-change">量測法變更 (METHOD CHANGE)</option>
            <option value="relaxed-auxiliary">輔助/放寬項 (AUXILIARY)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-[13px] text-slate-800">
          <thead className="bg-slate-100 text-slate-700 uppercase font-black tracking-wider text-[13px] border-b border-slate-200">
            <tr>
              <th className="py-3.5 px-4 w-1/5">特徵與國際符號</th>
              <th className="py-3.5 px-4 w-1/4">舊版 ISO 594 規範</th>
              <th className="py-3.5 px-4 w-1/4">新版 ISO 80369-7:2021 規範</th>
              <th className="py-3.5 px-4 w-1/6">變更分類</th>
              <th className="py-3.5 px-4 text-right">操作與詳情</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white font-sans">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-slate-500 text-[13px] font-mono">
                  沒有找到符合條件的尺寸項目。請嘗試清理搜尋關鍵字。
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => {
                const isExpanded = expandedRowId === item.id;
                return (
                  <React.Fragment key={item.id}>
                    <tr
                      className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                        isExpanded ? 'bg-slate-50 font-medium' : ''
                      }`}
                      onClick={() => setExpandedRowId(isExpanded ? null : item.id)}
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-900">{item.featureName}</span>
                          <span className="font-mono text-[13px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 font-black">
                            {item.iso80369Symbol}
                          </span>
                        </div>
                        <div className="text-[13px] font-mono text-slate-500 mt-0.5 uppercase tracking-wider">{item.featureNameEn}</div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-700 text-[13px] font-mono">
                        {item.iso594Symbol && (
                          <span className="text-slate-600 font-mono block text-[13px] uppercase mb-0.5">
                            舊符號: {item.iso594Symbol}
                          </span>
                        )}
                        <span className="font-bold text-slate-800">{item.iso594Spec}</span>
                      </td>

                      <td className="py-3.5 px-4 text-emerald-800 text-[13px] font-mono font-bold">
                        <div>{item.iso80369SpecRigid}</div>
                        {item.iso80369SpecSemiRigid && (
                          <div className="text-purple-700 text-[13px] mt-1 font-medium">
                            半剛性: {item.iso80369SpecSemiRigid}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center text-[13px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded border ${getBadgeStyle(
                            item.changeType
                          )}`}
                        >
                          {item.changeTypeLabel}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleCopyRow(item)}
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-slate-100 rounded transition-colors"
                            title="複製此列數據"
                          >
                            {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => setExpandedRowId(isExpanded ? null : item.id)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                            title="展開詳細解析"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Detail Panel */}
                    {isExpanded && (
                      <tr className="bg-slate-50 border-t border-slate-200">
                        <td colSpan={5} className="p-4">
                          <div className="space-y-3 text-[13px]">
                            {item.datumShiftNote && (
                              <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r text-amber-900 flex items-start gap-2.5">
                                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                  <strong className="font-black text-amber-900 uppercase font-mono tracking-wider block mb-0.5">
                                    測量基準剖面位移說明 (Datum Plane Shift Impact):
                                  </strong>
                                  <span className="leading-relaxed">{item.datumShiftNote}</span>
                                </div>
                              </div>
                            )}

                            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
                              <h4 className="font-black text-slate-900 uppercase tracking-wider mb-1 flex items-center gap-1.5 font-mono">
                                <ArrowUpRight className="w-3.5 h-3.5 text-blue-600" />
                                CAD 圖面修圖與品管量測解析 (Engineering Guidance)
                              </h4>
                              <p className="text-slate-700 leading-relaxed font-sans">{item.engineeringExplanation}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
