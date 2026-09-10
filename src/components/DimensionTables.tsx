import React, { useState, useMemo } from 'react';
import { DIMENSIONS_DATA } from '../data/dimensionsData';
import {
  CHANGE_TYPE_META,
  ChangeType,
  ConnectorCategory,
  DimensionItem,
  MaterialType
} from '../types';
import {
  Search,
  Filter,
  AlertCircle,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  CornerDownRight,
  Lock
} from 'lucide-react';

interface Props {
  selectedCategory: ConnectorCategory;
  onSelectCategory: (cat: ConnectorCategory) => void;
  material: MaterialType;
  onSelectMaterial: (mat: MaterialType) => void;
}

const BADGE_STYLE: Record<ChangeType, string> = {
  identical: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  'datum-shift': 'bg-amber-100 text-amber-900 border-amber-300',
  'limit-added': 'bg-sky-100 text-sky-900 border-sky-300',
  'new-feature': 'bg-rose-100 text-rose-800 border-rose-300',
  downgraded: 'bg-violet-100 text-violet-900 border-violet-300',
  removed: 'bg-slate-200 text-slate-700 border-slate-400'
};

const META_BY_ID = new Map(CHANGE_TYPE_META.map((m) => [m.id, m]));

export const DimensionTables: React.FC<Props> = ({
  selectedCategory,
  onSelectCategory,
  material,
  onSelectMaterial
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<ChangeType | 'all'>('all');
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copyFailedId, setCopyFailedId] = useState<string | null>(null);

  const activeCategoryData = useMemo(
    () => DIMENSIONS_DATA.find((cat) => cat.id === selectedCategory) || DIMENSIONS_DATA[0],
    [selectedCategory]
  );

  const parentCategory = useMemo(
    () =>
      activeCategoryData.inheritsFrom
        ? DIMENSIONS_DATA.find((c) => c.id === activeCategoryData.inheritsFrom)
        : undefined,
    [activeCategoryData]
  );

  const effectiveMaterial: MaterialType = activeCategoryData.rigidOnly ? 'rigid' : material;

  const filteredItems = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return activeCategoryData.items.filter((item) => {
      if (filterType !== 'all' && item.changeType !== filterType) return false;
      if (!q) return true;
      const haystack = [
        item.featureName,
        item.featureNameEn,
        item.iso80369Symbol,
        item.iso594Symbol ?? '',
        item.iso594Spec,
        item.iso80369SpecRigid,
        item.iso80369SpecSemiRigid ?? '',
        item.changeTypeNote ?? '',
        META_BY_ID.get(item.changeType)?.label ?? '',
        item.engineeringExplanation
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [activeCategoryData, searchTerm, filterType]);

  /** 每個變更分類在本分頁中的項目數，讓篩選器本身就揭露分佈 */
  const countsByType = useMemo(() => {
    const counts = new Map<ChangeType, number>();
    activeCategoryData.items.forEach((i) => counts.set(i.changeType, (counts.get(i.changeType) ?? 0) + 1));
    return counts;
  }, [activeCategoryData]);

  const handleCopyRow = async (item: DimensionItem) => {
    const meta = META_BY_ID.get(item.changeType);
    const text = [
      `【${item.featureName}】`,
      `ISO 594 符號: ${item.iso594Symbol ?? '無'}　→　ISO 80369-7 符號: ${item.iso80369Symbol}`,
      `ISO 594: ${item.iso594Spec}`,
      `ISO 80369-7 (剛性): ${item.iso80369SpecRigid}`,
      item.iso80369SpecSemiRigid ? `ISO 80369-7 (半剛性): ${item.iso80369SpecSemiRigid}` : null,
      `圖面動作: ${meta?.label ?? item.changeType}${item.changeTypeNote ? ` — ${item.changeTypeNote}` : ''}`,
      item.datumShiftNote ? `基準位移: ${item.datumShiftNote}` : null,
      `解析: ${item.engineeringExplanation}`,
      `依據: ${activeCategoryData.standardRef}`
    ]
      .filter(Boolean)
      .join('\n');

    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
      await navigator.clipboard.writeText(text);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setCopyFailedId(item.id);
      setTimeout(() => setCopyFailedId(null), 3000);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-6">
        <h2 className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-2 flex-wrap">
          <span>尺寸規格對照</span>
          <span className="text-[13px] font-mono font-normal text-slate-500">
            Dimensional Specification Audit
          </span>
        </h2>
        <span className="text-[13px] font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
          ISO 80369-7 Annex B · Table B.1 – B.8 全數收錄
        </span>
      </div>

      {/* 分類頁籤 —— 與 ISO 80369-7 Clause 5 之八組圖表一對一 */}
      <div className="flex flex-wrap gap-2 mb-4 border-b border-slate-200 pb-4">
        {DIMENSIONS_DATA.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              onSelectCategory(cat.id);
              setExpandedRowId(null);
            }}
            aria-pressed={selectedCategory === cat.id}
            className={`px-3.5 py-2 rounded-lg text-[13px] font-bold tracking-wide transition-all flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white shadow-sm font-black'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            {cat.tabLabel}
            <span
              className={`text-[13px] font-mono px-1.5 py-0.5 rounded ${
                selectedCategory === cat.id ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {cat.items.length}
            </span>
          </button>
        ))}
      </div>

      {/* 分類說明 + 材料切換 */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2 flex-wrap">
              {activeCategoryData.title}
              <span className="text-[13px] text-blue-700 font-mono bg-blue-100/80 px-2.5 py-0.5 rounded border border-blue-200">
                {activeCategoryData.standardRef}
              </span>
              {activeCategoryData.rigidOnly && (
                <span className="text-[13px] text-slate-700 font-mono bg-slate-200 px-2.5 py-0.5 rounded border border-slate-300 inline-flex items-center gap-1">
                  <Lock className="w-3 h-3" /> 僅剛性材料
                </span>
              )}
            </h3>
            <p className="text-slate-600 text-[13px] mt-1 leading-relaxed">{activeCategoryData.description}</p>
          </div>

          <div className="shrink-0">
            <span className="text-[13px] text-slate-700 font-bold block mb-1">材料類別（全站連動）</span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => onSelectMaterial('semi-rigid')}
                disabled={activeCategoryData.rigidOnly}
                aria-pressed={effectiveMaterial === 'semi-rigid'}
                className={`px-3 py-1.5 rounded-lg text-[13px] font-bold border transition-all disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
                  effectiveMaterial === 'semi-rigid'
                    ? 'bg-purple-100 text-purple-900 border-purple-500'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                半剛性
              </button>
              <button
                type="button"
                onClick={() => onSelectMaterial('rigid')}
                aria-pressed={effectiveMaterial === 'rigid'}
                className={`px-3 py-1.5 rounded-lg text-[13px] font-bold border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
                  effectiveMaterial === 'rigid'
                    ? 'bg-blue-100 text-blue-900 border-blue-500'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                剛性
              </button>
            </div>
          </div>
        </div>

        {/* Annex B 繼承條款 */}
        {parentCategory && (
          <button
            onClick={() => {
              onSelectCategory(parentCategory.id);
              setExpandedRowId(null);
            }}
            className="w-full text-left bg-white border border-sky-200 rounded-lg px-3.5 py-2.5 flex items-start gap-2.5 hover:border-sky-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
          >
            <CornerDownRight className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <span className="text-[13px] text-slate-700 leading-relaxed">
              <strong className="text-sky-900 font-black">Annex B 繼承條款：</strong>
              本表僅列出差異項目。依標準規定，本分類另完整適用{' '}
              <strong className="text-sky-900">{parentCategory.title}</strong>（{parentCategory.items.length} 項）
              之全部尺寸與公差，惟本表所列者覆寫之。<span className="text-sky-700 font-bold">點此檢視 →</span>
            </span>
          </button>
        )}
      </div>

      {/* 搜尋與篩選 */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" aria-hidden="true" />
          <label htmlFor="dim-search" className="sr-only">
            搜尋尺寸項目
          </label>
          <input
            id="dim-search"
            type="search"
            placeholder="搜尋名稱、符號、數值或說明（如 ØH、N1、2.900、弦長）"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-[13px] font-mono rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:border-blue-500 focus:bg-white focus-visible:ring-2 focus-visible:ring-blue-500/40 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500 hidden sm:block" aria-hidden="true" />
          <label htmlFor="dim-filter" className="sr-only">
            依圖面動作篩選
          </label>
          <select
            id="dim-filter"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as ChangeType | 'all')}
            className="bg-slate-50 border border-slate-300 text-slate-800 text-[13px] font-mono rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/40 font-bold"
          >
            <option value="all">全部圖面動作 ({activeCategoryData.items.length})</option>
            {CHANGE_TYPE_META.map((meta) => (
              <option key={meta.id} value={meta.id}>
                {meta.optionLabel} ({countsByType.get(meta.id) ?? 0})
              </option>
            ))}
          </select>
        </div>
      </div>

      {filterType !== 'all' && (
        <p className="text-[13px] text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 mb-4">
          <strong className="text-slate-900">{META_BY_ID.get(filterType)?.label}：</strong>{' '}
          {META_BY_ID.get(filterType)?.action}
        </p>
      )}

      {/* 對照表 */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-[13px] text-slate-800">
          <caption className="sr-only">
            {activeCategoryData.title} 之 ISO 594 與 ISO 80369-7 尺寸對照
          </caption>
          <thead className="bg-slate-100 text-slate-700 font-black tracking-wider text-[13px] border-b border-slate-200">
            <tr>
              <th scope="col" className="py-3.5 px-4 w-1/5">
                特徵與符號
              </th>
              <th scope="col" className="py-3.5 px-4 w-1/4">
                舊版 ISO 594
              </th>
              <th scope="col" className="py-3.5 px-4 w-1/4">
                新版 ISO 80369-7:2021
              </th>
              <th scope="col" className="py-3.5 px-4 w-1/6">
                圖面動作
              </th>
              <th scope="col" className="py-3.5 px-4 text-right">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-slate-500 text-[13px] font-mono">
                  沒有符合條件的尺寸項目。
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => {
                const isExpanded = expandedRowId === item.id;
                const meta = META_BY_ID.get(item.changeType);
                const detailId = `detail-${item.id}`;
                return (
                  <React.Fragment key={item.id}>
                    <tr className={isExpanded ? 'bg-slate-50' : 'hover:bg-slate-50/80 transition-colors'}>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm text-slate-900">{item.featureName}</span>
                          {/* 不可加 uppercase：ISO 符號大小寫具區別意義 (d≠D, e≠E, α≠Α, β≠Β, σ≠Σ) */}
                          <span className="font-mono text-[13px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 font-black">
                            {item.iso80369Symbol}
                          </span>
                        </div>
                        <div className="text-[13px] font-mono text-slate-500 mt-0.5">{item.featureNameEn}</div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-700 text-[13px] font-mono">
                        {item.iso594Symbol && (
                          <span className="text-slate-600 font-mono block text-[13px] mb-0.5">
                            舊符號: {item.iso594Symbol}
                          </span>
                        )}
                        <span className="font-bold text-slate-800">{item.iso594Spec}</span>
                      </td>

                      <td className="py-3.5 px-4 text-[13px] font-mono">
                        <div
                          className={
                            effectiveMaterial === 'rigid'
                              ? 'text-emerald-800 font-bold'
                              : 'text-slate-400 font-medium'
                          }
                        >
                          <span className="text-[13px] not-italic">剛性：</span>
                          {item.iso80369SpecRigid}
                        </div>
                        {item.iso80369SpecSemiRigid && (
                          <div
                            className={`mt-1 ${
                              effectiveMaterial === 'semi-rigid'
                                ? 'text-purple-800 font-bold'
                                : 'text-slate-400 font-medium'
                            }`}
                          >
                            <span className="text-[13px]">半剛性：</span>
                            {item.iso80369SpecSemiRigid}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center text-[13px] font-black tracking-wider px-2.5 py-0.5 rounded border ${
                            BADGE_STYLE[item.changeType]
                          }`}
                        >
                          {meta?.label}
                        </span>
                        {item.changeTypeNote && (
                          <div className="text-[13px] text-slate-500 mt-1 leading-snug">{item.changeTypeNote}</div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleCopyRow(item)}
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-slate-100 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                            aria-label={`複製 ${item.featureName} 的對照內容`}
                            title={copyFailedId === item.id ? '複製失敗，請手動選取' : '複製此列數據'}
                          >
                            {copiedId === item.id ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : copyFailedId === item.id ? (
                              <AlertCircle className="w-4 h-4 text-rose-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => setExpandedRowId(isExpanded ? null : item.id)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                            aria-expanded={isExpanded}
                            aria-controls={detailId}
                            aria-label={`${isExpanded ? '收合' : '展開'} ${item.featureName} 的工程解析`}
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="bg-slate-50 border-t border-slate-200" id={detailId}>
                        <td colSpan={5} className="p-4">
                          <div className="space-y-3 text-[13px]">
                            {item.datumShiftNote && (
                              <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r text-amber-900 flex items-start gap-2.5">
                                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                                <div>
                                  <strong className="font-black text-amber-900 font-mono tracking-wider block mb-0.5">
                                    基準面位移說明
                                  </strong>
                                  <span className="leading-relaxed">{item.datumShiftNote}</span>
                                </div>
                              </div>
                            )}

                            <div className="bg-white p-4 rounded-lg border border-slate-200">
                              <h4 className="font-black text-slate-900 tracking-wider mb-1 flex items-center gap-1.5 font-mono">
                                <ArrowUpRight className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
                                CAD 修圖與品管量測解析
                              </h4>
                              <p className="text-slate-700 leading-relaxed">{item.engineeringExplanation}</p>
                              {meta && (
                                <p className="text-slate-500 mt-2 pt-2 border-t border-slate-100 leading-relaxed">
                                  <strong className="text-slate-700 font-mono">圖面動作（{meta.label}）：</strong>{' '}
                                  {meta.action}
                                </p>
                              )}
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
