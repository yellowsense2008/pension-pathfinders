import { useState, useMemo, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { t, TranslationKey } from '@/lib/translations';
import BottomNav from '@/components/BottomNav';
import PageTransition from '@/components/PageTransition';
import AnimatedNumber from '@/components/AnimatedNumber';
import LifestyleOutcome from '@/components/LifestyleOutcome';
import { Slider } from '@/components/ui/slider';
import { ArrowUp, Sparkles } from 'lucide-react';
import { fetchBackendProjection, BackendProjectionResponse } from '@/services/api';
import { motion } from 'framer-motion';

const SLIDER_MAX = 50000;

// Segmented mapping: slider % → lifestyle_category (instant, no API wait)
type LifestyleCategory = 'luxury' | 'comfortable' | 'basic' | 'struggle';

function sliderPctToCategory(pct: number): LifestyleCategory {
  if (pct >= 70) return 'luxury';
  if (pct >= 45) return 'comfortable';
  if (pct >= 20) return 'basic';
  return 'struggle';
}

const Snapshot = () => {
  const { user, pension } = useUser();
  const lang = user.language;
  const [contribution, setContribution] = useState(user.monthlyContribution || 2000);
  const [backendData, setBackendData] = useState<BackendProjectionResponse | null>(null);

  useEffect(() => {
    fetchBackendProjection({
      age: user.age,
      monthly_contribution: user.monthlyContribution,
      monthly_income: user.monthlyIncome,
    }).then(setBackendData).catch(() => setBackendData(null));
  }, [user.age, user.monthlyContribution, user.monthlyIncome]);

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

  // Slider-driven live category — declared here so confidenceScore can depend on it
  const sliderPct = (contribution / SLIDER_MAX) * 100;
  const sliderCategory = sliderPctToCategory(sliderPct);

  const confidenceScore = useMemo(() => {
    const lifestyleWeight: Record<ReturnType<typeof sliderPctToCategory>, number> = {
      struggle:    0.4,
      basic:       0.6,
      comfortable: 0.8,
      luxury:      1.0,
    };

    const corpusScore        = Math.min(corpus / 20000000, 1);            // 2 Cr target
    const contributionScore  = Math.min(contribution / 20000, 1);         // ₹20k/mo target
    const incomeScore        = Math.min(user.monthlyIncome / 100000, 1);  // ₹1L/mo target

    const raw =
      (corpusScore * 0.5 +
       contributionScore * 0.3 +
       incomeScore * 0.2) *
      lifestyleWeight[sliderCategory];

    return Math.min(100, Math.max(5, Math.round(raw * 100)));
  }, [corpus, contribution, user.monthlyIncome, sliderCategory]);

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

  // Segment colour stops (left-edge % of SLIDER_MAX)
  const segments = [
    { label: 'Struggle', colour: '#ef4444', start: 0, end: 20 },
    { label: 'Basic',    colour: '#f97316', start: 20, end: 45 },
    { label: 'Comfort',  colour: '#22c55e', start: 45, end: 70 },
    { label: 'Luxury',   colour: '#eab308', start: 70, end: 100 },
  ];

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
              <LifestyleOutcome
                corpus={corpus}
                monthlyPension={monthlyPension}
                backendData={backendData}
                sliderCategory={sliderCategory}
              />

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

              {/* Retirement Confidence — animated radial meter */}
              {(() => {
                const R = 40;
                const circ = 2 * Math.PI * R;
                const pct  = confidenceScore / 100;
                const dash = pct * circ;

                const meterColor =
                  confidenceScore >= 70 ? '#22c55e'
                  : confidenceScore >= 40 ? '#f59e0b'
                  : '#ef4444';

                return (
                  <motion.div
                    key={confidenceScore}
                    className="game-card flex flex-col items-center gap-2 py-4"
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                  >
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {t(lang, 'snapshot.confidence')}
                    </p>
                    <div className="relative flex items-center justify-center" style={{ width: 108, height: 108 }}>
                      <svg width="108" height="108" style={{ transform: 'rotate(-90deg)' }}>
                        {/* Track */}
                        <circle
                          cx="54" cy="54" r={R}
                          fill="none"
                          stroke="hsl(160,10%,90%)"
                          strokeWidth="10"
                        />
                        {/* Animated arc */}
                        <motion.circle
                          cx="54" cy="54" r={R}
                          fill="none"
                          stroke={meterColor}
                          strokeWidth="10"
                          strokeLinecap="round"
                          strokeDasharray={`${circ}`}
                          initial={{ strokeDashoffset: circ }}
                          animate={{
                            strokeDashoffset: circ - dash,
                            stroke: meterColor,
                          }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          style={{
                            filter: `drop-shadow(0 0 6px ${meterColor}88)`,
                          }}
                        />
                      </svg>
                      {/* Score in centre */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span
                          className="font-display text-2xl font-bold tabular-nums"
                          style={{ color: meterColor }}
                        >
                          {confidenceScore}
                        </span>
                        <span className="text-[10px] text-muted-foreground">/100</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })()}

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

            {/* Segmented colour-zone track */}
            <div className="relative">
              <div className="flex h-1.5 w-full rounded-full overflow-hidden mb-3">
                {segments.map((seg) => (
                  <div
                    key={seg.label}
                    style={{
                      width: `${seg.end - seg.start}%`,
                      backgroundColor: seg.colour,
                      opacity: sliderCategory === seg.label.toLowerCase()
                        || (seg.label === 'Comfort' && sliderCategory === 'comfortable')
                        || (seg.label === 'Struggle' && sliderCategory === 'struggle')
                        || (seg.label === 'Basic' && sliderCategory === 'basic')
                        || (seg.label === 'Luxury' && sliderCategory === 'luxury')
                        ? 1 : 0.3,
                      transition: 'opacity 0.2s',
                    }}
                  />
                ))}
              </div>

              <Slider
                value={[contribution]}
                onValueChange={([v]) => setContribution(v)}
                min={0}
                max={SLIDER_MAX}
                step={500}
              />

              {/* Tick labels */}
              <div className="flex justify-between mt-2">
                {segments.map((seg) => (
                  <span
                    key={seg.label}
                    className="text-[10px] font-medium transition-all duration-200"
                    style={{
                      color: sliderCategory === seg.label.toLowerCase()
                        || (seg.label === 'Comfort' && sliderCategory === 'comfortable')
                        || (seg.label === 'Struggle' && sliderCategory === 'struggle')
                        || (seg.label === 'Basic' && sliderCategory === 'basic')
                        || (seg.label === 'Luxury' && sliderCategory === 'luxury')
                        ? seg.colour : '#94a3b8',
                      fontWeight: sliderCategory === seg.label.toLowerCase()
                        || (seg.label === 'Comfort' && sliderCategory === 'comfortable')
                        || (seg.label === 'Struggle' && sliderCategory === 'struggle')
                        || (seg.label === 'Basic' && sliderCategory === 'basic')
                        || (seg.label === 'Luxury' && sliderCategory === 'luxury')
                        ? 700 : 400,
                    }}
                  >
                    {seg.label}
                  </span>
                ))}
              </div>
            </div>

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
