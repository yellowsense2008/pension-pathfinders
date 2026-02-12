import { useState, useMemo, useRef, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { t } from '@/lib/translations';
import BottomNav from '@/components/BottomNav';
import PageTransition from '@/components/PageTransition';
import AnimatedNumber from '@/components/AnimatedNumber';
import { Slider } from '@/components/ui/slider';
import { TrendingUp, Award, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Snapshot = () => {
  const { user } = useUser();
  const lang = user.language;
  const [contribution, setContribution] = useState(user.monthlyContribution || 2000);
  const prevBadgeRef = useRef('');

  const annualRate = 0.08;
  const monthlyRate = annualRate / 12;
  const retirementAge = 60;
  const yearsLeft = Math.max(0, retirementAge - user.age);
  const totalMonths = yearsLeft * 12;
  const pastRetirement = user.age >= 60;

  const corpus = useMemo(() => {
    if (pastRetirement || totalMonths <= 0) return contribution * totalMonths || 0;
    return Math.round(contribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate));
  }, [contribution, totalMonths, monthlyRate, pastRetirement]);

  const monthlyPension = useMemo(() => Math.round((corpus * 0.04) / 12), [corpus]);

  const lateMonths = Math.max(0, (yearsLeft - 5)) * 12;
  const lateCorpus = useMemo(() => {
    if (lateMonths <= 0) return 0;
    return Math.round(contribution * ((Math.pow(1 + monthlyRate, lateMonths) - 1) / monthlyRate));
  }, [contribution, lateMonths, monthlyRate]);
  const corpusDiff = corpus - lateCorpus;

  const extraCorpus = useMemo(() => {
    if (pastRetirement || totalMonths <= 0) return 0;
    return Math.round((contribution + 1000) * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate)) - corpus;
  }, [contribution, totalMonths, monthlyRate, corpus, pastRetirement]);

  const lifestyleBadge = corpus >= 5000000 ? 'premium' : corpus >= 2000000 ? 'comfortable' : 'basic';
  const [badgeChanged, setBadgeChanged] = useState(false);

  useEffect(() => {
    if (prevBadgeRef.current && prevBadgeRef.current !== lifestyleBadge) {
      setBadgeChanged(true);
      const timer = setTimeout(() => setBadgeChanged(false), 600);
      return () => clearTimeout(timer);
    }
    prevBadgeRef.current = lifestyleBadge;
  }, [lifestyleBadge]);

  const badgeStyles = {
    basic: 'bg-muted text-muted-foreground',
    comfortable: 'bg-primary/15 text-primary',
    premium: 'bg-secondary/15 text-secondary',
  };

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

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
          {pastRetirement && (
            <div className="game-card border border-secondary/30 text-center">
              <p className="text-sm text-muted-foreground">{t(lang, 'snapshot.pastRetirement')}</p>
            </div>
          )}

          {/* Corpus Card */}
          <div className="game-card text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t(lang, 'snapshot.corpus')}
            </p>
            <p className="font-display text-4xl font-bold text-foreground mt-2">
              <AnimatedNumber value={corpus} formatter={formatCurrency} />
            </p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <motion.span
                key={lifestyleBadge}
                animate={badgeChanged ? { scale: [1, 1.15, 1] } : {}}
                transition={{ duration: 0.4 }}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeStyles[lifestyleBadge]}`}
              >
                {t(lang, `snapshot.${lifestyleBadge}` as any)}
              </motion.span>
            </div>
          </div>

          {/* Pension Card */}
          <div className="game-card flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
              <TrendingUp className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t(lang, 'snapshot.monthlyPension')}</p>
              <p className="font-display text-xl font-bold text-foreground">
                <AnimatedNumber value={monthlyPension} formatter={formatCurrency} />
              </p>
            </div>
          </div>

          {/* Contribution Slider */}
          <div className="game-card space-y-4">
            <label className="text-sm font-semibold text-foreground">
              {t(lang, 'snapshot.adjustContribution')}
            </label>
            <Slider
              value={[contribution]}
              onValueChange={([v]) => setContribution(v)}
              min={1000}
              max={50000}
              step={500}
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>₹1,000</span>
              <span className="font-semibold text-foreground">₹{contribution.toLocaleString('en-IN')}</span>
              <span>₹50,000</span>
            </div>
            {!pastRetirement && (
              <div className="flex items-center gap-2 rounded-xl bg-primary/10 p-3 text-xs text-primary">
                <ArrowUp className="h-4 w-4" />
                <span>
                  {t(lang, 'snapshot.extraImpact').replace('{amount}', formatCurrency(extraCorpus))}
                </span>
              </div>
            )}
          </div>

          {/* Emotional Hook */}
          {!pastRetirement && (
            <div className="game-card flex items-start gap-3">
              <Award className="mt-0.5 h-5 w-5 text-secondary" />
              <div className="space-y-1">
                {user.age < 30 ? (
                  <p className="text-sm font-medium text-foreground">{t(lang, 'snapshot.aheadMessage')}</p>
                ) : (
                  <p className="text-sm font-medium text-foreground">
                    {t(lang, 'snapshot.lateMessage').replace('{amount}', formatCurrency(corpusDiff))}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <BottomNav />
      </div>
    </PageTransition>
  );
};

export default Snapshot;
