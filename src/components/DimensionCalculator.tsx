import React, { useState, useMemo } from 'react';
import { ConnectorCategory, CalculatorInput, CalculationResult } from '../types';
import { Calculator, CheckCircle2, XCircle, AlertTriangle, RotateCcw, Info } from 'lucide-react';

export const DimensionCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<CalculatorInput>({
    category: 'male-slip',
    material: 'semi-rigid',
    tipOD_d: 3.97,
    openID_D: 4.225,
    throughBore_f: 2.8,
    firstThread_t: 3.1,
    lugLeading_N1: 1.1,
    lugTrailing_N2: 1.9,
    lugRoot_J: 6.2,
    taperLength_e: 8.5,
    measuredAt075Offset: true
  });

  const handleInputChange = (field: keyof CalculatorInput, value: any) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Evaluation Logic
  const results = useMemo<CalculationResult[]>(() => {
    const list: CalculationResult[] = [];
    const isRigid = inputs.material === 'rigid';
    const isAtOffset = inputs.measuredAt075Offset;

    // Helper for Male Slip Tip OD Ød
    if (inputs.category === 'male-slip' || inputs.category === 'male-lock') {
      if (inputs.tipOD_d !== undefined && !isNaN(inputs.tipOD_d)) {
        let evalVal = inputs.tipOD_d;
        let datumNote = false;

        // If user measured at 0.00mm face, convert to 0.75mm plane for ISO 80369-7 check
        if (!isAtOffset) {
          evalVal = inputs.tipOD_d + 0.045; // 0.75 * 0.06
          datumNote = true;
        }

        const iso594Min = 3.925;
        const iso594Max = isRigid ? 3.99 : 4.027;

        const iso80369Min = 3.97;
        const iso80369Max = isRigid ? 4.035 : 4.072;

        const pass594 = inputs.tipOD_d >= iso594Min && inputs.tipOD_d <= iso594Max;
        const pass80369 = evalVal >= iso80369Min && evalVal <= iso80369Max;

        list.push({
          paramId: 'tipOD',
          paramName: '公錐體前端外徑 (Ød)',
          measuredValue: inputs.tipOD_d,
          measuredAtOffset: isAtOffset,
          iso594Status: pass594 ? 'pass' : 'fail',
          iso594Range: `${iso594Min} - ${iso594Max} mm (極端面)`,
          iso80369Status: pass80369 ? 'pass' : 'fail',
          iso80369Range: `${iso80369Min} - ${iso80369Max} mm (0.75mm剖面)`,
          datumShiftApplied: datumNote,
          advice: !pass80369
            ? '測量數值超出 ISO 80369-7 規範！請檢查模具公錐外徑縮模量。'
            : datumNote
            ? '已由端面實測值換算為 0.75mm 剖面估算值 (+0.045mm)。'
            : '符合 ISO 80369-7 剖面外徑規範。'
        });
      }

      if (inputs.throughBore_f !== undefined && !isNaN(inputs.throughBore_f)) {
        const pass594 = true; // ISO 594 had no upper limit
        const pass80369 = inputs.throughBore_f <= 2.9;

        list.push({
          paramId: 'bore_f',
          paramName: '前端內孔直徑 (Øf)',
          measuredValue: inputs.throughBore_f,
          measuredAtOffset: true,
          iso594Status: 'pass',
          iso594Range: '無上限限制',
          iso80369Status: pass80369 ? 'pass' : 'fail',
          iso80369Range: '≤ 2.900 mm (最大上限)',
          datumShiftApplied: false,
          advice: !pass80369
            ? '🔴 嚴重違規！內孔 Øf 大於 2.900 mm，無法通過防錯接 (Misconnection) 驗證！'
            : '符合 ISO 80369-7 防錯接內孔上限要求。'
        });
      }
    }

    // Helper for Female Opening ID ØD
    if (inputs.category === 'female-slip' || inputs.category === 'female-lock') {
      if (inputs.openID_D !== undefined && !isNaN(inputs.openID_D)) {
        let evalVal = inputs.openID_D;
        let datumNote = false;

        if (!isAtOffset) {
          evalVal = inputs.openID_D - 0.045; // 0.75 * 0.06 inside
          datumNote = true;
        }

        const iso594Min = 4.27;
        const iso594Max = 4.315;

        const iso80369Min = isRigid ? 4.225 : 4.198;
        const iso80369Max = isRigid ? 4.27 : 4.298;

        const pass594 = inputs.openID_D >= iso594Min && inputs.openID_D <= iso594Max;
        const pass80369 = evalVal >= iso80369Min && evalVal <= iso80369Max;

        list.push({
          paramId: 'openID',
          paramName: '母錐開口內徑 (ØD)',
          measuredValue: inputs.openID_D,
          measuredAtOffset: isAtOffset,
          iso594Status: pass594 ? 'pass' : 'fail',
          iso594Range: `${iso594Min} - ${iso594Max} mm (極端面)`,
          iso80369Status: pass80369 ? 'pass' : 'fail',
          iso80369Range: `${iso80369Min} - ${iso80369Max} mm (0.75mm內縮剖面)`,
          datumShiftApplied: datumNote,
          advice: !pass80369
            ? '開口內徑不符合 ISO 80369-7。半剛性材料建議最小保持在 4.225mm 以上以防滲漏。'
            : '符合母接頭開口內徑規範。'
        });
      }
    }

    // Male Lock First Thread Start t
    if (inputs.category === 'male-lock') {
      if (inputs.firstThread_t !== undefined && !isNaN(inputs.firstThread_t)) {
        const pass594 = inputs.firstThread_t <= 3.2;
        const max80369 = isRigid ? 3.2 : 3.65;
        const pass80369 = inputs.firstThread_t <= max80369;

        list.push({
          paramId: 'firstThread_t',
          paramName: '至第一圈螺紋起點距離 (t)',
          measuredValue: inputs.firstThread_t,
          measuredAtOffset: true,
          iso594Status: pass594 ? 'pass' : 'fail',
          iso594Range: '≤ 3.200 mm (強制極限)',
          iso80369Status: pass80369 ? 'pass' : 'warning',
          iso80369Range: `(${max80369.toFixed(3)}) mm max (輔助參考值)`,
          datumShiftApplied: false,
          advice:
            inputs.firstThread_t > 3.2 && inputs.firstThread_t <= 3.65
              ? '⚠️ 舊版判退，但 ISO 80369-7 半剛性放寬至 3.65mm 輔助尺寸，改由軸向拉拔測試 (32-35N) 驗證。'
              : pass80369
              ? '符合第一圈螺紋起點輔助參考值。'
              : '距離過長，可能影響旋緊咬合圈數。'
        });
      }
    }

    // Female Lock Lug N1 & N2
    if (inputs.category === 'female-lock') {
      if (inputs.lugLeading_N1 !== undefined && !isNaN(inputs.lugLeading_N1)) {
        const pass80369 = inputs.lugLeading_N1 <= 1.2;
        list.push({
          paramId: 'lugN1',
          paramName: '凸耳前緣定位距離 (N1)',
          measuredValue: inputs.lugLeading_N1,
          measuredAtOffset: true,
          iso594Status: 'not-applicable',
          iso594Range: '舊版無 N1 規格 (舊為 F=0.2mm)',
          iso80369Status: pass80369 ? 'pass' : 'fail',
          iso80369Range: '≤ 1.200 mm (最大上限)',
          datumShiftApplied: false,
          advice: !pass80369
            ? '🔴 凸耳前端 N1 超過 1.200mm，旋緊時可能導致螺紋預緊卡死！'
            : '符合凸耳前端螺旋進程規範。'
        });
      }

      if (inputs.lugTrailing_N2 !== undefined && !isNaN(inputs.lugTrailing_N2)) {
        const pass80369 = inputs.lugTrailing_N2 <= 2.07;
        list.push({
          paramId: 'lugN2',
          paramName: '凸耳後緣定位距離 (N2)',
          measuredValue: inputs.lugTrailing_N2,
          measuredAtOffset: true,
          iso594Status: 'not-applicable',
          iso594Range: '舊版無 N2 規格',
          iso80369Status: pass80369 ? 'pass' : 'fail',
          iso80369Range: '≤ 2.070 mm (最大上限)',
          datumShiftApplied: false,
          advice: !pass80369 ? '🔴 凸耳後緣 N2 超過 2.070mm 上限！' : '符合凸耳後緣螺旋進程規範。'
        });
      }

      if (inputs.lugRoot_J !== undefined && !isNaN(inputs.lugRoot_J)) {
        const pass80369 = inputs.lugRoot_J >= 5.515 && inputs.lugRoot_J <= 6.73;
        list.push({
          paramId: 'lugRoot_J',
          paramName: '凸耳根部直徑 (ØJ)',
          measuredValue: inputs.lugRoot_J,
          measuredAtOffset: true,
          iso594Status: 'not-applicable',
          iso594Range: '舊版採弦長 V≥3.5mm 間接管制',
          iso80369Status: pass80369 ? 'pass' : 'fail',
          iso80369Range: '5.515 - 6.730 mm',
          datumShiftApplied: false,
          advice: !pass80369 ? '凸耳根部直徑超出 5.515-6.730mm 範圍！' : '符合 ISO 80369-7 凸耳根部直徑管制。'
        });
      }
    }

    return list;
  }, [inputs]);

  const resetDefaults = () => {
    setInputs({
      category: 'male-slip',
      material: 'semi-rigid',
      tipOD_d: 3.97,
      openID_D: 4.225,
      throughBore_f: 2.8,
      firstThread_t: 3.1,
      lugLeading_N1: 1.1,
      lugTrailing_N2: 1.9,
      lugRoot_J: 6.2,
      taperLength_e: 8.5,
      measuredAt075Offset: true
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 mb-6">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-600" />
            實測 / CAD 尺寸合規線上評估計算器 (Inspection Calculator)
          </h2>
          <p className="text-slate-600 text-[13px] mt-1">
            輸入您的 CAD 實體數據或二次元量測值，自動帶入基準位移與雙標準合規比對。
          </p>
        </div>
        <button
          onClick={resetDefaults}
          className="text-[13px] font-mono font-bold uppercase bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5 self-start sm:self-auto transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" /> 重置預設數值
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Parameters Panel */}
        <div className="lg:col-span-5 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
          <h3 className="text-[13px] font-black uppercase tracking-wider text-amber-900 font-mono flex items-center gap-1.5 pb-2 border-b border-slate-200">
            <Info className="w-4 h-4 text-amber-600" />
            1. 設定接頭條件與測量基準
          </h3>

          {/* Category Picker */}
          <div>
            <label className="text-[13px] text-slate-800 font-bold uppercase block mb-1">接頭類型 (Connector Category)</label>
            <select
              value={inputs.category}
              onChange={(e) => handleInputChange('category', e.target.value as ConnectorCategory)}
              className="w-full bg-white border border-slate-300 text-slate-900 text-[13px] font-mono font-bold rounded-lg p-2.5 focus:border-blue-500 focus:outline-none"
            >
              <option value="male-slip">公滑套 (Male Luer Slip)</option>
              <option value="female-slip">母滑套 (Female Luer Slip)</option>
              <option value="male-lock">公鎖固 (Male Luer Lock)</option>
              <option value="female-lock">母鎖固 (Female Luer Lock Variant A)</option>
            </select>
          </div>

          {/* Material Picker */}
          <div>
            <label className="text-[13px] text-slate-800 font-bold uppercase block mb-1">材料剛性類別 (Material Rigidity)</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleInputChange('material', 'semi-rigid')}
                className={`py-2 px-3 rounded-lg text-[13px] font-black uppercase tracking-wider border text-center transition-all ${
                  inputs.material === 'semi-rigid'
                    ? 'bg-purple-100 text-purple-900 border-purple-500 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                半剛性 (PP/PC)
              </button>
              <button
                type="button"
                onClick={() => handleInputChange('material', 'rigid')}
                className={`py-2 px-3 rounded-lg text-[13px] font-black uppercase tracking-wider border text-center transition-all ${
                  inputs.material === 'rigid'
                    ? 'bg-blue-100 text-blue-900 border-blue-500 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                剛性 (金屬/玻璃)
              </button>
            </div>
          </div>

          {/* Measurement Plane Toggle */}
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <label className="text-[13px] text-slate-800 font-bold uppercase block mb-1.5">
              量測剖面點 (Measurement Plane)
            </label>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="datumMode"
                  checked={inputs.measuredAt075Offset}
                  onChange={() => handleInputChange('measuredAt075Offset', true)}
                  className="text-blue-600 focus:ring-0"
                />
                <span>ISO 80369-7 規範剖面：距端面 <strong className="text-slate-900">0.75 mm</strong> 處</span>
              </label>
              <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="datumMode"
                  checked={!inputs.measuredAt075Offset}
                  onChange={() => handleInputChange('measuredAt075Offset', false)}
                  className="text-blue-600 focus:ring-0"
                />
                <span>舊版 ISO 594 剖面：最極端面 <strong className="text-slate-900">0.00 mm</strong> 處</span>
              </label>
            </div>
          </div>

          {/* Dynamic Numeric Inputs */}
          <div className="pt-2 border-t border-slate-200 space-y-3">
            <h4 className="text-[13px] font-black uppercase tracking-wider text-slate-800 font-mono">2. 輸入測量數值 (Dimensions in mm)</h4>

            {(inputs.category === 'male-slip' || inputs.category === 'male-lock') && (
              <>
                <div>
                  <div className="flex justify-between text-[13px] mb-1">
                    <span className="text-slate-800 font-bold">公錐外徑 Ød (Tip OD)</span>
                    <span className="text-slate-500 font-mono text-[13px]">ISO 80369: 3.970-4.035</span>
                  </div>
                  <input
                    type="number"
                    step="0.001"
                    value={inputs.tipOD_d || ''}
                    onChange={(e) => handleInputChange('tipOD_d', parseFloat(e.target.value))}
                    className="w-full bg-white border border-slate-300 text-slate-900 text-[13px] rounded-lg p-2 font-mono font-bold focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[13px] mb-1">
                    <span className="text-slate-800 font-bold">前端內孔 Øf (Through Bore)</span>
                    <span className="text-rose-700 font-mono text-[13px] font-black">上限 ≤ 2.900 mm</span>
                  </div>
                  <input
                    type="number"
                    step="0.001"
                    value={inputs.throughBore_f || ''}
                    onChange={(e) => handleInputChange('throughBore_f', parseFloat(e.target.value))}
                    className="w-full bg-white border border-slate-300 text-slate-900 text-[13px] rounded-lg p-2 font-mono font-bold focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </>
            )}

            {(inputs.category === 'female-slip' || inputs.category === 'female-lock') && (
              <div>
                <div className="flex justify-between text-[13px] mb-1">
                  <span className="text-slate-800 font-bold">母錐開口內徑 ØD (Opening ID)</span>
                  <span className="text-slate-500 font-mono text-[13px]">ISO 80369: 4.225-4.270</span>
                </div>
                <input
                  type="number"
                  step="0.001"
                  value={inputs.openID_D || ''}
                  onChange={(e) => handleInputChange('openID_D', parseFloat(e.target.value))}
                  className="w-full bg-white border border-slate-300 text-slate-900 text-[13px] rounded-lg p-2 font-mono font-bold focus:border-blue-500 focus:outline-none"
                />
              </div>
            )}

            {inputs.category === 'male-lock' && (
              <div>
                <div className="flex justify-between text-[13px] mb-1">
                  <span className="text-slate-800 font-bold">至第一圈螺紋距離 t (1st Thread)</span>
                  <span className="text-slate-500 font-mono text-[13px]">輔助: (3.200) / (3.650)</span>
                </div>
                <input
                  type="number"
                  step="0.001"
                  value={inputs.firstThread_t || ''}
                  onChange={(e) => handleInputChange('firstThread_t', parseFloat(e.target.value))}
                  className="w-full bg-white border border-slate-300 text-slate-900 text-[13px] rounded-lg p-2 font-mono font-bold focus:border-blue-500 focus:outline-none"
                />
              </div>
            )}

            {inputs.category === 'female-lock' && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[13px] text-slate-800 font-bold block mb-1">凸耳前緣 N1 (≤1.200)</label>
                    <input
                      type="number"
                      step="0.001"
                      value={inputs.lugLeading_N1 || ''}
                      onChange={(e) => handleInputChange('lugLeading_N1', parseFloat(e.target.value))}
                      className="w-full bg-white border border-slate-300 text-slate-900 text-[13px] rounded-lg p-2 font-mono font-bold focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[13px] text-slate-800 font-bold block mb-1">凸耳後緣 N2 (≤2.070)</label>
                    <input
                      type="number"
                      step="0.001"
                      value={inputs.lugTrailing_N2 || ''}
                      onChange={(e) => handleInputChange('lugTrailing_N2', parseFloat(e.target.value))}
                      className="w-full bg-white border border-slate-300 text-slate-900 text-[13px] rounded-lg p-2 font-mono font-bold focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[13px] mb-1">
                    <span className="text-slate-800 font-bold">凸耳根部直徑 ØJ (Root OD)</span>
                    <span className="text-slate-500 font-mono text-[13px]">5.515 - 6.730 mm</span>
                  </div>
                  <input
                    type="number"
                    step="0.001"
                    value={inputs.lugRoot_J || ''}
                    onChange={(e) => handleInputChange('lugRoot_J', parseFloat(e.target.value))}
                    className="w-full bg-white border border-slate-300 text-slate-900 text-[13px] rounded-lg p-2 font-mono font-bold focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-[13px] font-black uppercase tracking-wider text-emerald-800 font-mono flex items-center gap-1.5 pb-2 border-b border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            3. 合規審查判定報告 (Compliance Evaluation Output)
          </h3>

          <div className="space-y-3">
            {results.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-[13px] bg-slate-50 font-mono rounded-xl border border-slate-200">
                請在左側輸入實測數據以檢視審查結果。
              </div>
            ) : (
              results.map((res) => (
                <div
                  key={res.paramId}
                  className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <div>
                      <span className="font-black text-slate-900 text-sm">{res.paramName}</span>
                      <span className="text-[13px] text-slate-700 font-mono ml-2">
                        實測值: <strong className="text-amber-800 font-black">{res.measuredValue} mm</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[13px] px-2.5 py-1 rounded-md font-mono font-black uppercase tracking-wider border flex items-center gap-1 ${
                          res.iso80369Status === 'pass'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : res.iso80369Status === 'warning'
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-rose-100 text-rose-900 border-rose-300'
                        }`}
                      >
                        {res.iso80369Status === 'pass' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        ) : res.iso80369Status === 'warning' ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-700" />
                        )}
                        ISO 80369-7: {res.iso80369Status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[13px] font-mono">
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block text-[13px] uppercase font-bold">舊版 ISO 594 許容範圍:</span>
                      <span className="text-slate-800 font-bold">{res.iso594Range}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block text-[13px] uppercase font-bold">新版 ISO 80369-7 許容範圍:</span>
                      <span className="text-emerald-800 font-bold">{res.iso80369Range}</span>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-[13px] text-slate-800 font-sans leading-relaxed">
                    <strong className="text-amber-800 font-mono font-black uppercase">處置建議: </strong> {res.advice}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
