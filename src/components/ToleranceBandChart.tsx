import React from 'react';
import { MaterialType } from '../types';

export interface Band {
  min: number;
  max: number;
}

export interface BandGroup {
  material: MaterialType;
  groupLabel: string;
  oldLabel: string;
  newLabel: string;
  old: Band;
  next: Band;
  /** 新版公差帶是否僅為舊版之平移（母接頭半剛性另有放寬，故為 false） */
  pureShift: boolean;
}

interface Props {
  groups: BandGroup[];
  axisMin: number;
  axisMax: number;
  tickStep: number;
  /** 位移量：公端為正、母端為負 */
  delta: number;
  activeMaterial: MaterialType;
  caption: string;
}

const X0 = 168;
const X1 = 702;
const VB_W = 720;

const fmt = (v: number) => v.toFixed(3);

/**
 * 公差帶尺標。以單一數線同時呈現兩種材料下的新舊公差帶，
 * 使「基準面位移造成數值平移、實體幾何未變」可直接目視比對。
 */
export const ToleranceBandChart: React.FC<Props> = ({
  groups,
  axisMin,
  axisMax,
  tickStep,
  delta,
  activeMaterial,
  caption
}) => {
  const x = (v: number) => X0 + ((v - axisMin) / (axisMax - axisMin)) * (X1 - X0);

  const ticks: number[] = [];
  for (let v = axisMin; v <= axisMax + 1e-9; v += tickStep) ticks.push(Number(v.toFixed(3)));

  // 每組的垂直配置
  const groupTop = (i: number) => 16 + i * 106;
  const barY = (i: number, row: 0 | 1) => groupTop(i) + 38 + row * 30;
  const axisY = groupTop(groups.length - 1) + 118;
  const vbH = axisY + 66;

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${vbH}`}
      className="w-full min-w-[660px] h-auto"
      role="img"
      aria-label={`公差帶對照尺標：${caption}`}
    >
      {groups.map((g, i) => {
        const isActive = g.material === activeMaterial;
        const top = groupTop(i);
        const yOld = barY(i, 0);
        const yNew = barY(i, 1);
        const shiftY = top + 26;

        return (
          <g key={g.material}>
            {isActive && (
              <rect x="0" y={top} width={VB_W} height="98" rx="8" fill="#0f172a" fillOpacity="0.04" />
            )}

            <text x="0" y={top + 18} fontSize="13" fontFamily="monospace" fontWeight="bold" fill="#64748b">
              {g.groupLabel}
              {isActive ? ' ●' : ''}
            </text>

            {/* 位移標註：僅在新舊公差帶為純平移時繪製 */}
            {g.pureShift && (
              <>
                <line
                  x1={x(g.old.min)}
                  y1={shiftY + 4}
                  x2={x(g.next.min)}
                  y2={shiftY + 4}
                  stroke="#b45309"
                  strokeWidth="1.4"
                />
                <path
                  d={`M${x(g.old.min)} ${shiftY + 4} l${delta > 0 ? 7 : -7} -3.5 v7 z`}
                  fill="#b45309"
                />
                <path
                  d={`M${x(g.next.min)} ${shiftY + 4} l${delta > 0 ? -7 : 7} -3.5 v7 z`}
                  fill="#b45309"
                />
                <text
                  x={(x(g.old.min) + x(g.next.min)) / 2}
                  y={shiftY}
                  fontSize="13"
                  fontFamily="monospace"
                  fontWeight="bold"
                  fill="#b45309"
                  textAnchor="middle"
                >
                  {delta > 0 ? '+' : '−'}
                  {Math.abs(delta).toFixed(3)}
                </text>
                <line
                  x1={x(g.old.min)}
                  y1={shiftY + 8}
                  x2={x(g.old.min)}
                  y2={yOld}
                  stroke="#cbd5e1"
                  strokeWidth="1"
                  strokeDasharray="3,3"
                />
                <line
                  x1={x(g.next.min)}
                  y1={shiftY + 8}
                  x2={x(g.next.min)}
                  y2={yNew}
                  stroke="#cbd5e1"
                  strokeWidth="1"
                  strokeDasharray="3,3"
                />
              </>
            )}

            {/* 舊版公差帶 */}
            <text
              x={X0 - 13}
              y={yOld + 14}
              fontSize="13"
              fontFamily="monospace"
              fill="#64748b"
              textAnchor="end"
            >
              {g.oldLabel}
            </text>
            <rect
              x={x(g.old.min)}
              y={yOld}
              width={x(g.old.max) - x(g.old.min)}
              height="20"
              rx="2"
              fill="#e2e8f0"
              stroke="#94a3b8"
              strokeWidth="1.3"
            />
            <text x={x(g.old.min) + 7} y={yOld + 14} fontSize="13" fontFamily="monospace" fontWeight="bold" fill="#475569">
              {fmt(g.old.min)}
            </text>
            <text
              x={x(g.old.max) - 7}
              y={yOld + 14}
              fontSize="13"
              fontFamily="monospace"
              fontWeight="bold"
              fill="#475569"
              textAnchor="end"
            >
              {fmt(g.old.max)}
            </text>

            {/* 新版公差帶 */}
            <text
              x={X0 - 13}
              y={yNew + 14}
              fontSize="13"
              fontFamily="monospace"
              fill="#0f766e"
              textAnchor="end"
            >
              {g.newLabel}
            </text>
            <rect
              x={x(g.next.min)}
              y={yNew}
              width={x(g.next.max) - x(g.next.min)}
              height="20"
              rx="2"
              fill="#ccfbf1"
              stroke="#0d9488"
              strokeWidth="1.3"
            />
            <text x={x(g.next.min) + 7} y={yNew + 14} fontSize="13" fontFamily="monospace" fontWeight="bold" fill="#0f766e">
              {fmt(g.next.min)}
            </text>
            <text
              x={x(g.next.max) - 7}
              y={yNew + 14}
              fontSize="13"
              fontFamily="monospace"
              fontWeight="bold"
              fill="#0f766e"
              textAnchor="end"
            >
              {fmt(g.next.max)}
            </text>

            {!g.pureShift && (
              <text x={X0} y={top + 30} fontSize="13" fontFamily="monospace" fontWeight="bold" fill="#b45309">
                公差帶另有放寬，非單純平移
              </text>
            )}
          </g>
        );
      })}

      {/* 數線 */}
      <line x1={X0} y1={axisY} x2={X1} y2={axisY} stroke="#94a3b8" strokeWidth="1" />
      {ticks.map((t) => (
        <g key={t}>
          <line x1={x(t)} y1={axisY} x2={x(t)} y2={axisY + 6} stroke="#94a3b8" strokeWidth="1" />
          <text
            x={x(t)}
            y={axisY + 22}
            fontSize="13"
            fontFamily="monospace"
            fill="#64748b"
            textAnchor="middle"
          >
            {fmt(t)}
          </text>
        </g>
      ))}
      <text x={X1} y={axisY + 42} fontSize="13" fontFamily="monospace" fill="#94a3b8" textAnchor="end">
        直徑 mm
      </text>
      <text x="0" y={axisY + 42} fontSize="13" fontFamily="monospace" fontWeight="bold" fill="#b45309">
        Δ = 0.750 × 0.06 = {delta > 0 ? '+' : '−'}
        {Math.abs(delta).toFixed(3)} mm
      </text>
    </svg>
  );
};
