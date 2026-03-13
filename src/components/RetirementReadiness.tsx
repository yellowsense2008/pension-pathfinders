import { useMemo } from 'react';
import { motion } from 'framer-motion';
import AnimatedNumber from '@/components/AnimatedNumber';

interface RetirementReadinessProps {
  score: number; // 0-100
  category: 'low' | 'moderate' | 'good' | 'excellent';
  categoryLabel: string;
}

const categoryColors: Record<string, string> = {
  low: 'hsl(0, 84%, 60%)',
  moderate: 'hsl(35, 95%, 55%)',
  good: 'hsl(168, 60%, 42%)',
  excellent: 'hsl(145, 60%, 45%)',
};

const RetirementReadiness = ({ score, category, categoryLabel }: RetirementReadinessProps) => {
  const color = categoryColors[category] || categoryColors.moderate;
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="game-card flex flex-col items-center gap-3 py-5">
      <div className="relative h-32 w-32">
        <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60" cy="60" r="54"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
          />
          <motion.circle
            cx="60" cy="60" r="54"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl font-bold text-foreground">
            <AnimatedNumber value={score} />
          </span>
          <span className="text-[10px] text-muted-foreground">/100</span>
        </div>
      </div>
      <span
        className="rounded-full px-3 py-1 text-xs font-semibold"
        style={{ backgroundColor: `${color}20`, color }}
      >
        {categoryLabel}
      </span>
    </div>
  );
};

export default RetirementReadiness;
