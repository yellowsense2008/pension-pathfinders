import { useState, useMemo, useCallback } from 'react';
import { useUser } from '@/contexts/UserContext';
import BottomNav from '@/components/BottomNav';
import PageTransition from '@/components/PageTransition';
import AnimatedNumber from '@/components/AnimatedNumber';
import FloatingXP from '@/components/FloatingXP';
import CareerGrowthSimulator from '@/components/CareerGrowthSimulator';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { IndianRupee, TrendingUp, Target, Zap, Percent, Hash } from 'lucide-react';
import { t, TranslationKey } from '@/lib/translations';
import { motion } from 'framer-motion';

const Simulator = () => {
  const { user, pension, addXP } = useUser();
  const lang = user.language;

  const [contribution, setContribution] = useState(user.monthlyContribution || 3000);
  const [returnRate, setReturnRate] = useState(8);
  const [years, setYears] = useState(pension.yearsToRetirement || Math.max(5, 60 - user.age));
  const [simulated, setSimulated] = useState(false);
  const [showXP, setShowXP] = useState(false);

  // Savings mode: fixed or percentage
  const [savingsMode, setSavingsMode] = useState<'fixed' | 'percentage'>('fixed');
  const [savingsPercentage, setSavingsPercentage] = useState(10);

  // Career-driven contribution schedule
  const [careerContributions, setCareerContributions] = useState<{ age: number; contribution: number }[]>([]);

  const handleCareerUpdate = useCallback((schedule: { age: number; contribution: number }[]) => {
    setCareerContributions(schedule);
  }, []);

  // Return rate presets
  const returnPresets = [
    { label: t(lang, 'simulator.conservative' as TranslationKey), rate: 7, icon: '🛡️' },
    { label: t(lang, 'simulator.balanced' as TranslationKey), rate: 9, icon: '⚖️' },
    { label: t(lang, 'simulator.aggressive' as TranslationKey), rate: 12, icon: '🔥' },
  ];

  // Chart data — uses career schedule if in percentage mode with career data
  const data = useMemo(() => {
    const points = [];
    const monthlyRate = returnRate / 100 / 12;
    const useCareer = savingsMode === 'percentage' && careerContributions.length > 0;

    if (useCareer) {
      // Variable contribution SIP
      let corpus = 0;
      for (let y = 0; y <= years; y++) {
        const age = user.age + y;
        const careerEntry = careerContributions.find(c => c.age === age);
        const monthlyContrib = careerEntry ? careerEntry.contribution : contribution;
        
        if (y > 0) {
          for (let m = 0; m < 12; m++) {
            corpus = corpus * (1 + monthlyRate) + monthlyContrib;
          }
        }
        
        const invested = y * 12 * monthlyContrib; // approximation
        points.push({
          year: age,
          invested: Math.round(invested / 100000),
          corpus: Math.round(corpus / 100000),
        });
      }
    } else {
      for (let y = 0; y <= years; y++) {
        const months = y * 12;
        const invested = contribution * months;
        const corpus = months === 0 || contribution <= 0
          ? 0
          : Math.round(contribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate));
        points.push({
          year: user.age + y,
          invested: Math.round(invested / 100000),
          corpus: Math.round(corpus / 100000),
        });
      }
    }
    return points;
  }, [contribution, returnRate, years, user.age, savingsMode, careerContributions]);

  const finalCorpus = data[data.length - 1]?.corpus || 0;
  const totalInvested = data[data.length - 1]?.invested || 0;

  const desiredMonthlyPension = user.monthlyIncome > 0 ? Math.round(user.monthlyIncome * 0.5) : 0;
  const projectedPension = finalCorpus > 0 ? Math.round((finalCorpus * 100000 * 0.04) / 12) : 0;
  const pensionGap = Math.max(0, desiredMonthlyPension - projectedPension);

  const handleSimulate = () => {
    if (!simulated) {
      addXP(75, 'simulator');
      setSimulated(true);
      setShowXP(true);
      setTimeout(() => setShowXP(false), 1200);
    }
  };

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-24">
        <div className="gradient-primary px-5 pb-5 pt-8">
          <h1 className="mb-1 font-display text-xl font-bold text-primary-foreground">{t(lang, 'simulator.title')}</h1>
          <p className="text-xs text-primary-foreground/70">{t(lang, 'simulator.subtitle')}</p>
        </div>

        <div className="mx-auto max-w-md px-5 mt-4 space-y-4">
          {/* Savings Mode Toggle */}
          <div className="game-card space-y-3 animate-fade-in">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t(lang, 'simulator.savingsMode' as TranslationKey)}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setSavingsMode('fixed')}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition-all border ${
                  savingsMode === 'fixed'
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'border-border text-muted-foreground'
                }`}
              >
                <Hash size={14} />
                {t(lang, 'simulator.fixedAmount' as TranslationKey)}
              </button>
              <button
                onClick={() => setSavingsMode('percentage')}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition-all border ${
                  savingsMode === 'percentage'
                    ? 'bg-secondary/10 border-secondary/30 text-secondary'
                    : 'border-border text-muted-foreground'
                }`}
              >
                <Percent size={14} />
                {t(lang, 'simulator.percentOfSalary' as TranslationKey)}
              </button>
            </div>

            {savingsMode === 'percentage' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="space-y-2"
              >
                <label className="flex items-center justify-between text-sm font-semibold text-foreground">
                  <span>{t(lang, 'simulator.savingsPercent' as TranslationKey)}</span>
                  <span className="font-display text-secondary">{savingsPercentage}%</span>
                </label>
                <input
                  type="range" min={1} max={30} step={1} value={savingsPercentage}
                  onChange={e => setSavingsPercentage(Number(e.target.value))}
                  className="w-full accent-secondary"
                />
                <p className="text-[10px] text-muted-foreground italic">
                  {t(lang, 'simulator.percentHint' as TranslationKey)}
                </p>
              </motion.div>
            )}
          </div>

          {/* Inputs */}
          <div className="game-card space-y-4 animate-fade-in">
            {savingsMode === 'fixed' && (
              <div>
                <label className="flex items-center justify-between text-sm font-semibold text-foreground">
                  <span>{t(lang, 'simulator.monthlyContribution')}</span>
                  <span className="font-display text-primary">₹{contribution.toLocaleString()}</span>
                </label>
                <input type="range" min={500} max={50000} step={500} value={contribution}
                  onChange={e => setContribution(Number(e.target.value))} className="mt-2 w-full accent-primary" />
              </div>
            )}
            <div>
              <label className="flex items-center justify-between text-sm font-semibold text-foreground">
                <span>{t(lang, 'simulator.expectedReturn')}</span>
                <span className="font-display text-primary">{returnRate}%</span>
              </label>
              {/* Return rate presets */}
              <div className="flex gap-2 mt-2 mb-2">
                {returnPresets.map(p => (
                  <button
                    key={p.rate}
                    onClick={() => setReturnRate(p.rate)}
                    className={`flex-1 rounded-lg py-1.5 text-[10px] font-medium border transition-all ${
                      returnRate === p.rate
                        ? 'bg-primary/10 border-primary/30 text-primary'
                        : 'border-border text-muted-foreground'
                    }`}
                  >
                    {p.icon} {p.label}
                  </button>
                ))}
              </div>
              <input type="range" min={6} max={14} step={0.5} value={returnRate}
                onChange={e => setReturnRate(Number(e.target.value))} className="w-full accent-primary" />
            </div>
            <div>
              <label className="flex items-center justify-between text-sm font-semibold text-foreground">
                <span>{t(lang, 'simulator.yearsToRetirement')}</span>
                <span className="font-display text-primary">{years} {t(lang, 'simulator.years')}</span>
              </label>
              <input type="range" min={5} max={40} value={years}
                onChange={e => setYears(Number(e.target.value))} className="mt-2 w-full accent-primary" />
            </div>
          </div>

          {/* Career Growth Simulator */}
          <CareerGrowthSimulator
            onContributionUpdate={handleCareerUpdate}
            savingsMode={savingsMode}
            savingsPercentage={savingsPercentage}
            fixedContribution={contribution}
          />

          {/* Chart */}
          <div className="game-card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="mb-3 font-display text-sm font-bold text-foreground">{t(lang, 'simulator.growthProjection')}</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="corpusGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(168, 60%, 42%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(168, 60%, 42%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="investedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(35, 95%, 55%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(35, 95%, 55%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 10%, 90%)" />
                  <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${v}L`} />
                  <Tooltip formatter={(v: number) => [`₹${v}L`, '']} labelFormatter={l => `Age ${l}`} />
                  <Area type="monotone" dataKey="invested" stroke="hsl(35, 95%, 55%)" fill="url(#investedGrad)" strokeWidth={2} name="Invested" />
                  <Area type="monotone" dataKey="corpus" stroke="hsl(168, 60%, 42%)" fill="url(#corpusGrad)" strokeWidth={2} name="Corpus" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-2 gap-3 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <div className="game-card text-center">
              <IndianRupee size={16} className="mx-auto mb-1 text-secondary" />
              <p className="text-xs text-muted-foreground">{t(lang, 'simulator.totalInvested')}</p>
              <p className="font-display text-lg font-bold text-foreground">
                ₹<AnimatedNumber value={totalInvested} />L
              </p>
            </div>
            <div className="game-card text-center">
              <TrendingUp size={16} className="mx-auto mb-1 text-primary" />
              <p className="text-xs text-muted-foreground">{t(lang, 'simulator.totalCorpus')}</p>
              <p className="font-display text-lg font-bold text-primary">
                ₹<AnimatedNumber value={finalCorpus} />L
              </p>
            </div>
          </div>

          {/* Pension Gap */}
          {user.monthlyIncome > 0 && (
            <div className="game-card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                {t(lang, 'simulator.pensionGap')}
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-muted-foreground">{t(lang, 'simulator.projected')}</p>
                  <p className="font-display text-sm font-bold text-primary">
                    <AnimatedNumber value={projectedPension} formatter={formatCurrency} />
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-muted-foreground">{t(lang, 'simulator.desired')}</p>
                  <p className="font-display text-sm font-bold text-foreground">
                    {formatCurrency(desiredMonthlyPension)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground">{t(lang, 'simulator.gap')}</p>
                  <p className={`font-display text-sm font-bold ${pensionGap > 0 ? 'text-destructive' : 'text-primary'}`}>
                    {pensionGap > 0 ? `-${formatCurrency(pensionGap)}` : '✓'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Emotional message */}
          <div className="text-center py-1">
            <p className="text-xs text-muted-foreground italic">
              {t(lang, 'story.simulatorMessage' as TranslationKey)}
            </p>
          </div>

          {/* CTA */}
          <motion.div whileTap={{ scale: 0.97 }} className="relative">
            <Button
              onClick={handleSimulate}
              className="w-full gradient-primary text-primary-foreground rounded-xl py-5 font-bold"
            >
              <Target size={18} className="mr-2" />
              {simulated ? t(lang, 'simulator.goalSaved') : t(lang, 'simulator.setGoal')}
              {!simulated && <span className="xp-badge ml-2"><Zap size={10} /> +75 XP</span>}
            </Button>
            <FloatingXP amount={75} show={showXP} />
          </motion.div>
        </div>

        <BottomNav />
      </div>
    </PageTransition>
  );
};

export default Simulator;
