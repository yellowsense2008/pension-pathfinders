import { useState, useMemo, useRef, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { t, TranslationKey } from '@/lib/translations';
import BottomNav from '@/components/BottomNav';
import PageTransition from '@/components/PageTransition';
import AnimatedNumber from '@/components/AnimatedNumber';
import LifestyleOutcome from '@/components/LifestyleOutcome';
import { Slider } from '@/components/ui/slider';
import { TrendingUp, ArrowUp, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Snapshot = () => {
  const { user, pension } = useUser();
  const lang = user.language;
  const [contribution, setContribution] = useState(user.monthlyContribution || 2000);

  const annualRate = pension.expectedReturn;
  const monthlyRate = annualRate / 12;
  const retirementAge = 60;
  const yearsLeft = Math.max(0, retirementAge - user.age);
  const totalMonths = yearsLeft * 12;
  const pastRetirement = user.age >= 60;

  const corpus = useMemo(() => {
    if (pastRetirement || totalMonths <= 0 || contribution <= 0) return 0;
    return Math.round(contribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate));
  }, [contribution, totalMonths, monthlyRate, pastRetirement]);

  const monthlyPension = useMemo(() => corpus > 0 ? Math.round((corpus * 0.04) / 12) : 0, [corpus]);

  const extraCorpus = useMemo(() => {
    if (pastRetirement || totalMonths <= 0) return 0;
    return Math.round((contribution + 1000) * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate)) - corpus;
  }, [contribution, totalMonths, monthlyRate, corpus, pastRetirement]);

  const confidenceScore = useMemo(() => {
    if (user.monthlyIncome <= 0 || contribution <= 0) return 0;
    const targetContribution = 0.1 * user.monthlyIncome;
    return Math.min(100, Math.max(0, Math.round(
      (contribution / targetContribution) * 50 +
      (yearsLeft / 35) * 30 +
      (monthlyPension / user.monthlyIncome) * 20
    )));
  }, [contribution, user.monthlyIncome, yearsLeft, monthlyPension]);

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const hasData = user.onboarded && contribution > 0;

  // Emotional narrative based on career path
  const narrativeKey = useMemo(() => {
    if (user.age < 25) return 'story.earlyStarter';
    if (user.age < 30) return 'story.primeYears';
    if (user.age < 40) return 'story.midCareer';
    return 'story.experiencedPro';
  }, [user.age]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-24">
        {/* Hero */}
        <div className="gradient-hero px-5 pb-8 pt-12 text-center">
          <h1 className="font-display text-2xl font-bold text-primary-foreground">
            {t(lang, 'snapshot.title')}
          </h1>
          <p className="mt-1 text-sm text-primary-foreground/80">
            {t(lang, 'snapshot.subtitle')}
          </p>
        </div>

        <div className="mx-auto max-w-lg space-y-4 px-4 -mt-4">
          {!hasData && (
            <div className="game-card text-center py-6">
              <p className="text-sm text-muted-foreground">{t(lang, 'dashboard.emptyState')}</p>
            </div>
          )}

          {pastRetirement && (
            <div className="game-card border border-secondary/30 text-center">
              <p className="text-sm text-muted-foreground">{t(lang, 'snapshot.pastRetirement')}</p>
            </div>
          )}

          {hasData && (
            <>
              {/* Lifestyle Outcome Visualization */}
              <LifestyleOutcome corpus={corpus} monthlyPension={monthlyPension} />

              {/* Corpus + Pension Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="game-card text-center">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {t(lang, 'snapshot.corpus')}
                  </p>
                  <p className="font-display text-xl font-bold text-foreground mt-1">
                    <AnimatedNumber value={corpus} formatter={formatCurrency} />
                  </p>
                </div>
                <div className="game-card text-center">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {t(lang, 'snapshot.monthlyPension')}
                  </p>
                  <p className="font-display text-xl font-bold text-primary mt-1">
                    <AnimatedNumber value={monthlyPension} formatter={formatCurrency} />
                  </p>
                </div>
              </div>

              {/* Retirement Confidence */}
              <div className="game-card text-center">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                  {t(lang, 'snapshot.confidence')}
                </p>
                <p className="font-display text-3xl font-bold text-primary">
                  <AnimatedNumber value={confidenceScore} />
                  <span className="text-lg text-muted-foreground">/100</span>
                </p>
              </div>

              {/* Emotional Narrative */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="game-card flex items-start gap-3 bg-primary/5 border border-primary/10"
              >
                <Sparkles size={18} className="mt-0.5 text-primary flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    {t(lang, narrativeKey as TranslationKey)}
                  </p>
                  <p className="text-[11px] text-muted-foreground italic">
                    {t(lang, 'snapshot.futureYou')}
                  </p>
                </div>
              </motion.div>
            </>
          )}

          {/* Contribution Slider */}
          <div className="game-card space-y-4">
            <label className="text-sm font-semibold text-foreground">
              {t(lang, 'snapshot.adjustContribution')}
            </label>
            <Slider
              value={[contribution]}
              onValueChange={([v]) => setContribution(v)}
              min={0}
              max={50000}
              step={500}
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>₹0</span>
              <span className="font-semibold text-foreground">₹{contribution.toLocaleString('en-IN')}</span>
              <span>₹50,000</span>
            </div>
            {!pastRetirement && hasData && (
              <div className="flex items-center gap-2 rounded-xl bg-primary/10 p-3 text-xs text-primary">
                <ArrowUp className="h-4 w-4" />
                <span>
                  {t(lang, 'snapshot.extraImpact').replace('{amount}', formatCurrency(extraCorpus))}
                </span>
              </div>
            )}
          </div>
        </div>

        <BottomNav />
      </div>
    </PageTransition>
  );
};

export default Snapshot;
