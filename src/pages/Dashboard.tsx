import { useNavigate } from 'react-router-dom';
import { useUser, getLevelName } from '@/contexts/UserContext';
import XPProgressBar from '@/components/XPProgressBar';
import BottomNav from '@/components/BottomNav';
import PageTransition from '@/components/PageTransition';
import AnimatedNumber from '@/components/AnimatedNumber';
import RetirementReadiness from '@/components/RetirementReadiness';
import NudgeCard from '@/components/NudgeCard';
import { Target, Brain, Trophy, LineChart, Flame, TrendingUp, IndianRupee, CalendarDays, LogOut, Clock } from 'lucide-react';
import { t, TranslationKey } from '@/lib/translations';
import { motion } from 'framer-motion';
import type { NudgeData } from '@/services/api';
import { useMemo } from 'react';

const Dashboard = () => {
  const { user, pension } = useUser();
  const navigate = useNavigate();
  const lang = user.language;

  const hasData = user.onboarded && user.monthlyContribution > 0;

  // ─── Dynamic nudges derived from state ───
  const nudges = useMemo<NudgeData[]>(() => {
    const list: NudgeData[] = [];
    if (!user.onboarded) return list;

    if (user.monthlyIncome > 0 && user.monthlyContribution / user.monthlyIncome < 0.1) {
      list.push({
        id: 'nudge-increase',
        type: 'suggestion',
        messageKey: 'nudge.increaseContribution',
        messageParams: { amount: '500' },
        actionKey: 'nudge.adjustNow',
        actionRoute: '/snapshot',
      });
    }

    if (user.monthlyContribution === 0 && user.onboarded) {
      list.push({
        id: 'nudge-zero',
        type: 'warning',
        messageKey: 'nudge.zeroContribution',
        actionKey: 'nudge.adjustNow',
        actionRoute: '/snapshot',
      });
    }

    if (user.streak > 0) {
      list.push({
        id: 'nudge-streak',
        type: 'celebration',
        messageKey: 'nudge.streakCelebration',
        messageParams: { count: String(user.streak) },
      });
    }

    return list;
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('pensionquest-user');
    localStorage.removeItem('pensionquest-language');
    navigate('/onboarding', { replace: true });
  };

  const quickActions = [
    { label: t(lang, 'dashboard.todaysMission'), icon: Target, color: 'gradient-primary', path: '/missions' },
    { label: t(lang, 'dashboard.takeQuiz'), icon: Brain, color: 'gradient-accent', path: '/learn' },
    { label: t(lang, 'dashboard.viewRewards'), icon: Trophy, color: 'gradient-hero', path: '/rewards' },
    { label: t(lang, 'dashboard.simulateGrowth'), icon: LineChart, color: 'gradient-primary', path: '/simulator' },
  ];

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const readinessCategoryLabels: Record<string, TranslationKey> = {
    low: 'dashboard.readiness.low',
    moderate: 'dashboard.readiness.moderate',
    good: 'dashboard.readiness.good',
    excellent: 'dashboard.readiness.excellent',
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-24">
        {/* Header */}
        <div className="gradient-hero px-5 pb-6 pt-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-primary-foreground/70">{t(lang, 'dashboard.welcome')}</p>
              <h1 className="font-display text-xl font-bold text-primary-foreground">
                {user.name || t(lang, 'dashboard.hero')}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => navigate('/leaderboard')} className="rounded-xl bg-primary-foreground/10 p-2.5 backdrop-blur-sm tap-scale">
                <Trophy size={20} className="text-primary-foreground" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-xl bg-primary-foreground/10 px-3 py-2 backdrop-blur-sm text-primary-foreground text-xs font-medium tap-scale"
              >
                <LogOut size={16} />
                {t(lang, 'dashboard.logout')}
              </button>
            </div>
          </div>
          <XPProgressBar />
        </div>

        <div className="mx-auto max-w-md px-5 -mt-2 space-y-4">
          {/* Savings Tracker — dynamic from PensionState */}
          <div className="game-card space-y-3 animate-fade-in">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t(lang, 'dashboard.savingsTracker')}
            </h2>
            {hasData ? (
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="text-[10px] text-muted-foreground">{t(lang, 'dashboard.totalContributions')}</p>
                  <p className="font-display text-sm font-bold text-foreground">
                    <AnimatedNumber value={pension.totalInvested} formatter={formatCurrency} />
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-muted-foreground">{t(lang, 'dashboard.currentCorpus')}</p>
                  <p className="font-display text-sm font-bold text-primary">
                    <AnimatedNumber value={pension.projectedCorpus} formatter={formatCurrency} />
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-muted-foreground">{t(lang, 'dashboard.estPension')}</p>
                  <p className="font-display text-sm font-bold text-foreground">
                    <AnimatedNumber value={pension.estimatedMonthlyPension} formatter={formatCurrency} />
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                {t(lang, 'dashboard.emptyState')}
              </p>
            )}
          </div>

          {/* Stats row: Streak + Behaviour */}
          <div className="grid grid-cols-2 gap-3">
            <div className="game-card text-center animate-streak-glow">
              <div className="mb-1 flex items-center justify-center gap-1.5">
                <Flame size={16} className="text-streak" />
                <span className="text-xs text-muted-foreground">{t(lang, 'dashboard.streak')}</span>
              </div>
              <p className="font-display text-xl font-bold text-foreground">
                {user.streak} {t(lang, 'dashboard.days')}
              </p>
              {user.lastActiveDate && (
                <div className="mt-1.5 flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
                  <Clock size={10} />
                  {t(lang, 'dashboard.lastActivity')}: {new Date(user.lastActiveDate).toLocaleDateString()}
                </div>
              )}
            </div>

            <div className="game-card text-center animate-fade-in">
              <div className="mb-1 flex items-center justify-center gap-1.5">
                <IndianRupee size={16} className="text-primary" />
                <span className="text-xs text-muted-foreground">{t(lang, 'dashboard.totalSaved')}</span>
              </div>
              <p className="font-display text-xl font-bold text-foreground">
                {hasData ? (
                  <AnimatedNumber value={pension.totalInvested} formatter={formatCurrency} />
                ) : (
                  '₹0'
                )}
              </p>
            </div>
          </div>

          {/* Smart Nudge Engine — deterministic from state */}
          {nudges.length > 0 && (
            <div className="space-y-2 animate-fade-in">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t(lang, 'dashboard.smartNudges')}
              </h2>
              {nudges.map((nudge) => {
                let message = t(lang, nudge.messageKey as TranslationKey);
                if (nudge.messageParams) {
                  Object.entries(nudge.messageParams).forEach(([k, v]) => {
                    message = message.replace(`{${k}}`, v);
                  });
                }
                const actionLabel = nudge.actionKey ? t(lang, nudge.actionKey as TranslationKey) : undefined;
                return <NudgeCard key={nudge.id} nudge={nudge} message={message} actionLabel={actionLabel} />;
              })}
            </div>
          )}

          {/* Retirement Readiness Score — deterministic */}
          <div className="animate-fade-in">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t(lang, 'dashboard.readinessTitle')}
            </h2>
            {hasData ? (
              <RetirementReadiness
                score={pension.retirementReadinessScore}
                category={pension.readinessCategory}
                categoryLabel={t(lang, readinessCategoryLabels[pension.readinessCategory])}
              />
            ) : (
              <div className="game-card text-center py-6">
                <p className="text-sm text-muted-foreground">{t(lang, 'dashboard.emptyState')}</p>
              </div>
            )}
          </div>

          {/* Retirement projection — deterministic */}
          {hasData && (
            <div className="game-card gradient-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-1 flex items-center gap-1.5">
                    <TrendingUp size={16} className="text-primary" />
                    <span className="text-xs font-semibold text-muted-foreground">{t(lang, 'dashboard.retirementAt')} 60</span>
                  </div>
                  <p className="font-display text-2xl font-bold text-foreground">
                    <AnimatedNumber value={pension.projectedCorpus} formatter={formatCurrency} />
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t(lang, 'dashboard.projectedCorpus')} • {pension.yearsToRetirement} {t(lang, 'dashboard.yearsLeft')}
                  </p>
                </div>
                <div className="rounded-xl bg-success/10 p-2">
                  <CalendarDays size={24} className="text-success" />
                </div>
              </div>
            </div>
          )}

          {/* Quick actions */}
          <div>
            <h2 className="mb-3 font-display text-sm font-bold text-foreground">{t(lang, 'dashboard.quickActions')}</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map(({ label, icon: Icon, color, path }, i) => (
                <motion.button
                  key={label}
                  onClick={() => navigate(path)}
                  whileTap={{ scale: 0.97 }}
                  className="game-card flex items-center gap-3 text-left animate-fade-in-up"
                  style={{ animationDelay: `${0.1 * (i + 1)}s` }}
                >
                  <div className={`rounded-xl p-2.5 ${color}`}>
                    <Icon size={18} className="text-primary-foreground" />
                  </div>
                  <span className="text-xs font-semibold text-foreground leading-tight">{label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="rounded-2xl border border-border bg-muted/50 p-3 text-center animate-fade-in">
            <div className="mt-4 text-center">
              <div className="w-24 h-px bg-border mx-auto mb-2"></div>
              <p className="text-[11px] text-muted-foreground tracking-wide">
                {t(lang, 'dashboard.developedBy')}
              </p>
            </div>
          </div>
        </div>

        <BottomNav />
      </div>
    </PageTransition>
  );
};

export default Dashboard;
