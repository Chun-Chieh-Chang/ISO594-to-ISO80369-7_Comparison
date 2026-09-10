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

/**
 * 深色圖表區專用色票（SkillsBuilder Dark Mode）。
 * 本元件恆為深色，不隨全站淺色配色變動，故色值直接寫在此處而非沿用 Tailwind 類別。
 */
const C = {
  border: '#334155',
  muted: '#94A3B8',
  dim: '#64748B',
  oldFill: '#334155',
  oldStroke: '#64748B',
  oldText: '#E2E8F0',
  newFill: '#134E4A',
  newStroke: '#34D399',
  newText: '#6EE7B7',
  amber: '#FBBF24',
  highlight: 'rgba(241, 245, 249, 0.05)'
} as const;

const X0 = 168;
const X1 = 702;
const VB_W = 720;

/** ISO 標準原文採逗號作為小數點，本圖表區沿用該記法 */
const iso = (v: number, digits = 3) => v.toFixed(digits).replace('.', ',');

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

  const groupTop = (i: number) => 16 + i * 106;
  const barY = (i: number, row: 0 | 1) => groupTop(i) + 38 + row * 30;
  const axisY = groupTop(groups.length - 1) + 118;
  const vbH = axisY + 62;

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
        const noteY = top + 30;
        // 位移標註只畫一次（首組為代表），其餘組別僅在偏離純平移時才加註
        const showShiftArrow = i === 0 && g.pureShift;

        return (
          <g key={g.material}>
            {isActive && (
              <rect x="0" y={top} width={VB_W} height="98" rx="8" fill={C.highlight} />
            )}

            <text x="0" y={top + 18} fontSize="13" fontFamily="monospace" fontWeight="bold" fill={C.muted}>
              {g.groupLabel}
              {isActive ? ' ●' : ''}
            </text>

            {showShiftArrow && (
              <>
                <line
                  x1={x(g.old.min)}
                  y1={noteY + 4}
                  x2={x(g.next.min)}
                  y2={noteY + 4}
                  stroke={C.amber}
                  strokeWidth="1.4"
                />
                <path d={`M${x(g.old.min)} ${noteY + 4} l${delta > 0 ? 7 : -7} -3.5 v7 z`} fill={C.amber} />
                <path d={`M${x(g.next.min)} ${noteY + 4} l${delta > 0 ? -7 : 7} -3.5 v7 z`} fill={C.amber} />
                <text
                  x={(x(g.old.min) + x(g.next.min)) / 2}
                  y={noteY}
                  fontSize="13"
                  fontFamily="monospace"
                  fontWeight="bold"
                  fill={C.amber}
                  textAnchor="middle"
                >
                  {delta > 0 ? '+' : '−'}
                  {iso(Math.abs(delta))}
                </text>
                <line
                  x1={x(g.old.min)}
                  y1={noteY + 8}
                  x2={x(g.old.min)}
                  y2={yOld}
                  stroke={C.border}
                  strokeWidth="1"
                  strokeDasharray="3,3"
                />
                <line
                  x1={x(g.next.min)}
                  y1={noteY + 8}
                  x2={x(g.next.min)}
                  y2={yNew}
                  stroke={C.border}
                  strokeWidth="1"
                  strokeDasharray="3,3"
                />
              </>
            )}

            {!g.pureShift && (
              <text x={X0} y={noteY} fontSize="13" fontFamily="monospace" fontWeight="bold" fill={C.amber}>
                公差帶另有放寬，非單純平移
              </text>
            )}

            {i > 0 && g.pureShift && (
              <text x={X0} y={noteY} fontSize="13" fontFamily="monospace" fill={C.dim}>
                位移量同上
              </text>
            )}

            {/* 舊版公差帶 */}
            <text x={X0 - 13} y={yOld + 14} fontSize="13" fontFamily="monospace" fill={C.muted} textAnchor="end">
              {g.oldLabel}
            </text>
            <rect
              x={x(g.old.min)}
              y={yOld}
              width={x(g.old.max) - x(g.old.min)}
              height="20"
              rx="2"
              fill={C.oldFill}
              stroke={C.oldStroke}
              strokeWidth="1.3"
            />
            <text x={x(g.old.min) + 7} y={yOld + 14} fontSize="13" fontFamily="monospace" fontWeight="bold" fill={C.oldText}>
              {iso(g.old.min)}
            </text>
            <text
              x={x(g.old.max) - 7}
              y={yOld + 14}
              fontSize="13"
              fontFamily="monospace"
              fontWeight="bold"
              fill={C.oldText}
              textAnchor="end"
            >
              {iso(g.old.max)}
            </text>

            {/* 新版公差帶 */}
            <text x={X0 - 13} y={yNew + 14} fontSize="13" fontFamily="monospace" fill={C.newStroke} textAnchor="end">
              {g.newLabel}
            </text>
            <rect
              x={x(g.next.min)}
              y={yNew}
              width={x(g.next.max) - x(g.next.min)}
              height="20"
              rx="2"
              fill={C.newFill}
              stroke={C.newStroke}
              strokeWidth="1.3"
            />
            <text x={x(g.next.min) + 7} y={yNew + 14} fontSize="13" fontFamily="monospace" fontWeight="bold" fill={C.newText}>
              {iso(g.next.min)}
            </text>
            <text
              x={x(g.next.max) - 7}
              y={yNew + 14}
              fontSize="13"
              fontFamily="monospace"
              fontWeight="bold"
              fill={C.newText}
              textAnchor="end"
            >
              {iso(g.next.max)}
            </text>
          </g>
        );
      })}

      {/* 數線 */}
      <line x1={X0} y1={axisY} x2={X1} y2={axisY} stroke={C.dim} strokeWidth="1" />
      {ticks.map((t) => (
        <g key={t}>
          <line x1={x(t)} y1={axisY} x2={x(t)} y2={axisY + 6} stroke={C.dim} strokeWidth="1" />
          <text x={x(t)} y={axisY + 22} fontSize="13" fontFamily="monospace" fill={C.muted} textAnchor="middle">
            {iso(t)}
          </text>
        </g>
      ))}
      <text x={X1} y={axisY + 42} fontSize="13" fontFamily="monospace" fill={C.dim} textAnchor="end">
        直徑 mm
      </text>
      <text x="0" y={axisY + 42} fontSize="13" fontFamily="monospace" fontWeight="bold" fill={C.amber}>
        Δ = {iso(0.75)} × {iso(0.06, 2)} = {delta > 0 ? '+' : '−'}
        {iso(Math.abs(delta))} mm
      </text>
    </svg>
  );
};
