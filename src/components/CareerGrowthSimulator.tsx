import { useState, useMemo } from 'react';
import { useUser } from '@/contexts/UserContext';
import { t, TranslationKey } from '@/lib/translations';
import AnimatedNumber from '@/components/AnimatedNumber';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Briefcase, Plus, Trash2, ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type CareerMode = 'aggressive' | 'stable' | 'late-starter' | 'unstable';

interface SalaryMilestone {
  age: number;
  salary: number;
}

const defaultMilestones: Record<CareerMode, SalaryMilestone[]> = {
  aggressive: [
    { age: 22, salary: 30000 },
    { age: 25, salary: 80000 },
    { age: 30, salary: 200000 },
    { age: 35, salary: 400000 },
    { age: 40, salary: 600000 },
    { age: 50, salary: 800000 },
  ],
  stable: [
    { age: 22, salary: 25000 },
    { age: 25, salary: 35000 },
    { age: 30, salary: 55000 },
    { age: 35, salary: 75000 },
    { age: 40, salary: 95000 },
    { age: 50, salary: 120000 },
  ],
  'late-starter': [
    { age: 22, salary: 0 },
    { age: 26, salary: 15000 },
    { age: 30, salary: 40000 },
    { age: 35, salary: 80000 },
    { age: 40, salary: 120000 },
    { age: 50, salary: 180000 },
  ],
  unstable: [
    { age: 22, salary: 30000 },
    { age: 25, salary: 50000 },
    { age: 28, salary: 20000 },
    { age: 32, salary: 70000 },
    { age: 36, salary: 40000 },
    { age: 40, salary: 90000 },
    { age: 50, salary: 100000 },
  ],
};

const careerModeConfig: Record<CareerMode, { icon: string; colorClass: string }> = {
  aggressive: { icon: '🚀', colorClass: 'bg-primary/10 border-primary/30 text-primary' },
  stable: { icon: '🏢', colorClass: 'bg-secondary/10 border-secondary/30 text-secondary' },
  'late-starter': { icon: '📚', colorClass: 'bg-accent/10 border-accent/30 text-accent' },
  unstable: { icon: '🎢', colorClass: 'bg-destructive/10 border-destructive/30 text-destructive' },
};

interface Props {
  onContributionUpdate?: (monthlyContributions: { age: number; contribution: number }[]) => void;
  savingsMode: 'fixed' | 'percentage';
  savingsPercentage: number;
  fixedContribution: number;
}

const CareerGrowthSimulator = ({ onContributionUpdate, savingsMode, savingsPercentage, fixedContribution }: Props) => {
  const { user } = useUser();
  const lang = user.language;

  const [careerMode, setCareerMode] = useState<CareerMode>('stable');
  const [milestones, setMilestones] = useState<SalaryMilestone[]>(defaultMilestones['stable']);
  const [expanded, setExpanded] = useState(false);

  const handleModeChange = (mode: CareerMode) => {
    setCareerMode(mode);
    setMilestones([...defaultMilestones[mode]]);
  };

  const addMilestone = () => {
    const lastAge = milestones[milestones.length - 1]?.age || 22;
    const newAge = Math.min(59, lastAge + 5);
    if (milestones.some(m => m.age === newAge)) return;
    const sorted = [...milestones, { age: newAge, salary: milestones[milestones.length - 1]?.salary || 30000 }]
      .sort((a, b) => a.age - b.age);
    setMilestones(sorted);
  };

  const removeMilestone = (idx: number) => {
    if (milestones.length <= 2) return;
    setMilestones(milestones.filter((_, i) => i !== idx));
  };

  const updateMilestone = (idx: number, field: 'age' | 'salary', value: number) => {
    const updated = [...milestones];
    updated[idx] = { ...updated[idx], [field]: value };
    setMilestones(updated.sort((a, b) => a.age - b.age));
  };

  // Interpolate salary for any age
  const getSalaryAtAge = (age: number): number => {
    if (milestones.length === 0) return 0;
    if (age <= milestones[0].age) return milestones[0].salary;
    if (age >= milestones[milestones.length - 1].age) return milestones[milestones.length - 1].salary;
    for (let i = 0; i < milestones.length - 1; i++) {
      if (age >= milestones[i].age && age <= milestones[i + 1].age) {
        const ratio = (age - milestones[i].age) / (milestones[i + 1].age - milestones[i].age);
        return Math.round(milestones[i].salary + ratio * (milestones[i + 1].salary - milestones[i].salary));
      }
    }
    return milestones[milestones.length - 1].salary;
  };

  // Build salary + contribution chart data
  const chartData = useMemo(() => {
    const startAge = Math.max(22, user.age);
    const points: { age: number; salary: number; contribution: number }[] = [];
    for (let age = startAge; age <= 60; age++) {
      const salary = getSalaryAtAge(age);
      const contribution = savingsMode === 'percentage'
        ? Math.round(salary * savingsPercentage / 100)
        : fixedContribution;
      points.push({ age, salary: Math.round(salary / 1000), contribution: Math.round(contribution / 1000) });
    }

    // Notify parent of contribution schedule
    if (onContributionUpdate) {
      const schedule = points.map(p => ({ age: p.age, contribution: p.contribution * 1000 }));
      onContributionUpdate(schedule);
    }

    return points;
  }, [milestones, user.age, savingsMode, savingsPercentage, fixedContribution]);

  const modes: CareerMode[] = ['aggressive', 'stable', 'late-starter', 'unstable'];

  return (
    <div className="game-card space-y-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-hero">
            <Briefcase size={16} className="text-primary-foreground" />
          </div>
          <div className="text-left">
            <h3 className="font-display text-sm font-bold text-foreground">
              {t(lang, 'career.title' as TranslationKey)}
            </h3>
            <p className="text-[10px] text-muted-foreground">
              {t(lang, `career.mode.${careerMode}` as TranslationKey)}
            </p>
          </div>
        </div>
        {expanded ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden space-y-4"
          >
            {/* Career Mode Selector */}
            <div className="grid grid-cols-2 gap-2">
              {modes.map(mode => {
                const cfg = careerModeConfig[mode];
                const isActive = careerMode === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => handleModeChange(mode)}
                    className={`rounded-xl border p-2.5 text-left transition-all text-xs font-medium ${
                      isActive ? cfg.colorClass + ' border-current' : 'border-border text-muted-foreground hover:border-muted-foreground/50'
                    }`}
                  >
                    <span className="text-base mr-1">{cfg.icon}</span>
                    {t(lang, `career.mode.${mode}` as TranslationKey)}
                  </button>
                );
              })}
            </div>

            {/* Salary Growth Chart */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                {t(lang, 'career.salaryTimeline' as TranslationKey)}
              </h4>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="salaryGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(260, 55%, 58%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(260, 55%, 58%)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="contribGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(168, 60%, 42%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(168, 60%, 42%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 10%, 90%)" />
                    <XAxis dataKey="age" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${v}K`} />
                    <Tooltip
                      formatter={(v: number, name: string) => [`₹${v}K/mo`, name === 'salary' ? 'Salary' : 'Savings']}
                      labelFormatter={l => `Age ${l}`}
                    />
                    <Area type="monotone" dataKey="salary" stroke="hsl(260, 55%, 58%)" fill="url(#salaryGrad)" strokeWidth={2} name="salary" />
                    <Area type="monotone" dataKey="contribution" stroke="hsl(168, 60%, 42%)" fill="url(#contribGrad)" strokeWidth={2} name="contribution" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Milestone Editor */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {t(lang, 'career.milestones' as TranslationKey)}
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={addMilestone}
                  className="h-7 text-xs text-primary"
                >
                  <Plus size={12} className="mr-1" /> {t(lang, 'career.addMilestone' as TranslationKey)}
                </Button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {milestones.map((m, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="text-[10px] text-muted-foreground">Age</label>
                      <input
                        type="number"
                        min={22}
                        max={59}
                        value={m.age}
                        onChange={e => updateMilestone(i, 'age', Number(e.target.value))}
                        className="w-full rounded-lg border border-input bg-background px-2 py-1.5 text-xs"
                      />
                    </div>
                    <div className="flex-[2]">
                      <label className="text-[10px] text-muted-foreground">Salary (₹/mo)</label>
                      <input
                        type="number"
                        min={0}
                        step={5000}
                        value={m.salary}
                        onChange={e => updateMilestone(i, 'salary', Number(e.target.value))}
                        className="w-full rounded-lg border border-input bg-background px-2 py-1.5 text-xs"
                      />
                    </div>
                    <button
                      onClick={() => removeMilestone(i)}
                      className="mt-3.5 p-1 text-muted-foreground hover:text-destructive transition-colors"
                      disabled={milestones.length <= 2}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Savings mode micro-copy */}
            {savingsMode === 'percentage' && (
              <div className="flex items-center gap-2 rounded-xl bg-primary/10 p-3 text-xs text-primary">
                <TrendingUp size={14} />
                <span>{t(lang, 'career.savingsGrowMessage' as TranslationKey)}</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CareerGrowthSimulator;
