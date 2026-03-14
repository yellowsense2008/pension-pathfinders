import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  Legend,
} from 'recharts';
import { motion } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';

interface Props {
  age: number;
  monthlyContribution: number;
  returnRate: number;
  years: number;
}

interface DataPoint {
  age: number;
  expected: number;
  optimistic: number;
  risk: number;
}

// Life-event shock markers fixed relative to years into career
const SHOCK_EVENTS = [
  { offsetYr: 3,  label: '💼 Job Switch',     color: '#f97316' },
  { offsetYr: 7,  label: '🚀 Promotion',       color: '#22c55e' },
  { offsetYr: 12, label: '⏸ Career Break',     color: '#ef4444' },
];

function buildSeries(
  startAge: number,
  monthly: number,
  annualRate: number,
  years: number,
): DataPoint[] {
  const r   = annualRate / 100 / 12;
  const rOpt = (annualRate * 1.20) / 100 / 12;   // +20% optimistic

  let expected   = 0;
  let optimistic = 0;
  let risk       = 0;

  const points: DataPoint[] = [];

  for (let y = 0; y <= years; y++) {
    // Apply career-break shock: -25% at year 12 (only once)
    if (y === 12 && y <= years) {
      risk = risk * 0.75;
    }

    points.push({
      age:       startAge + y,
      expected:  Math.round(expected  / 100000),
      optimistic:Math.round(optimistic/ 100000),
      risk:      Math.round(risk      / 100000),
    });

    // Compound + contribute for next year
    for (let m = 0; m < 12; m++) {
      expected   = expected   * (1 + r)    + monthly;
      optimistic = optimistic * (1 + rOpt) + monthly;
      risk       = risk       * (1 + r)    + (y < 12 ? monthly : monthly * 0.5);
    }
  }

  return points;
}

function aiCaption(returnRate: number): string {
  if (returnRate >= 10)
    return 'Your aggressive career path introduces volatility early, but accelerates wealth creation after age 35.';
  if (returnRate >= 8)
    return 'A balanced approach gives steady compounding. Small rate improvements compound dramatically over decades.';
  return 'A conservative path prioritises capital safety — consider stepping up contributions as your income grows.';
}

const CareerPathGraph = ({ age, monthlyContribution, returnRate, years }: Props) => {
  const data = useMemo(
    () => buildSeries(age, monthlyContribution, returnRate, years),
    [age, monthlyContribution, returnRate, years],
  );

  const shockDots = SHOCK_EVENTS
    .filter(e => e.offsetYr <= years)
    .map(e => ({ ...e, age: age + e.offsetYr, corpus: data[e.offsetYr]?.expected ?? 0 }));

  const caption = aiCaption(returnRate);

  const customTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="rounded-xl border border-border/60 bg-card px-3 py-2 text-xs shadow-elevated">
        <p className="font-bold text-foreground mb-1">Age {label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} style={{ color: p.color }}>
            {p.name}: ₹{p.value}L
          </p>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      className="game-card space-y-3"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <BrainCircuit size={16} className="text-accent flex-shrink-0" />
        <h3 className="font-display text-sm font-bold text-foreground">Life Path Projection</h3>
      </div>

      {/* Legend chips */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: 'Expected',   color: 'hsl(168,60%,42%)',  dash: false },
          { label: 'Optimistic', color: 'hsl(260,55%,58%)',  dash: false },
          { label: 'Risk',       color: 'hsl(0,84%,60%)',    dash: true  },
        ].map(l => (
          <span
            key={l.label}
            className="flex items-center gap-1 rounded-full border border-border/60 px-2.5 py-0.5 text-[10px] font-medium"
            style={{ color: l.color }}
          >
            <span
              className="inline-block h-[2px] w-4 rounded"
              style={{
                background: l.color,
                borderTop: l.dash ? `2px dashed ${l.color}` : undefined,
                height: l.dash ? 0 : 2,
              }}
            />
            {l.label}
          </span>
        ))}
      </div>

      {/* Chart */}
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(160,10%,90%)" />
            <XAxis dataKey="age" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${v}L`} />
            <Tooltip content={customTooltip} />

            {/* Three paths */}
            <Line
              type="monotone"
              dataKey="expected"
              name="Expected"
              stroke="hsl(168,60%,42%)"
              strokeWidth={2.5}
              dot={false}
              animationDuration={900}
            />
            <Line
              type="monotone"
              dataKey="optimistic"
              name="Optimistic"
              stroke="hsl(260,55%,58%)"
              strokeWidth={1.5}
              strokeOpacity={0.5}
              dot={false}
              animationDuration={1000}
            />
            <Line
              type="monotone"
              dataKey="risk"
              name="Risk"
              stroke="hsl(0,84%,60%)"
              strokeWidth={1.5}
              strokeDasharray="5 4"
              dot={false}
              animationDuration={1100}
            />

            {/* Shock event dots */}
            {shockDots.map(e => (
              <ReferenceDot
                key={e.label}
                x={e.age}
                y={e.corpus}
                r={5}
                fill={e.color}
                stroke="white"
                strokeWidth={2}
                label={{ value: e.label, position: 'top', fontSize: 9, fill: e.color }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* AI Narrative Caption */}
      <motion.div
        key={caption}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-xl bg-accent/8 border border-accent/20 px-3 py-2.5 flex items-start gap-2"
      >
        <span className="text-base leading-none">🤖</span>
        <p className="text-[11px] text-muted-foreground italic leading-relaxed">{caption}</p>
      </motion.div>
    </motion.div>
  );
};

export default CareerPathGraph;
