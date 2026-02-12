import { useNavigate } from 'react-router-dom';
import { useUser, getLevelName } from '@/contexts/UserContext';
import XPProgressBar from '@/components/XPProgressBar';
import BottomNav from '@/components/BottomNav';
import PageTransition from '@/components/PageTransition';
import AnimatedNumber from '@/components/AnimatedNumber';
import { Target, Brain, Trophy, LineChart, Flame, TrendingUp, IndianRupee, CalendarDays, LogOut } from 'lucide-react';
import { t } from '@/lib/translations';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const lang = user.language;

  const retirementAge = 60;
  const yearsLeft = Math.max(retirementAge - user.age, 0);
  const monthlyReturn = 0.1 / 12;
  const months = yearsLeft * 12;
  const futureValue = months > 0
    ? Math.round(
        user.monthlyContribution * ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn) * (1 + monthlyReturn)
      )
    : user.totalContributions;

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
          {/* Stats row */}
          <div className="grid grid-cols-2 gap-3 animate-fade-in">
            <div className="game-card text-center">
              <div className="mb-1 flex items-center justify-center gap-1.5">
                <IndianRupee size={16} className="text-primary" />
                <span className="text-xs text-muted-foreground">{t(lang, 'dashboard.totalSaved')}</span>
              </div>
              <p className="font-display text-xl font-bold text-foreground">
                ₹<AnimatedNumber value={user.totalContributions} />
              </p>
            </div>
            <div className="game-card text-center animate-streak-glow">
              <div className="mb-1 flex items-center justify-center gap-1.5">
                <Flame size={16} className="text-streak" />
                <span className="text-xs text-muted-foreground">{t(lang, 'dashboard.streak')}</span>
              </div>
              <p className="font-display text-xl font-bold text-foreground">
                {user.streak} {t(lang, 'dashboard.months')}
              </p>
            </div>
          </div>

          {/* Retirement projection */}
          <div className="game-card gradient-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-start justify-between">
              <div>
                <div className="mb-1 flex items-center gap-1.5">
                  <TrendingUp size={16} className="text-primary" />
                  <span className="text-xs font-semibold text-muted-foreground">{t(lang, 'dashboard.retirementAt')} {retirementAge}</span>
                </div>
                <p className="font-display text-2xl font-bold text-foreground">
                  ₹{(futureValue / 100000).toFixed(1)}L
                </p>
                <p className="text-xs text-muted-foreground">
                  {t(lang, 'dashboard.projectedCorpus')} • {yearsLeft} {t(lang, 'dashboard.yearsLeft')}
                </p>
              </div>
              <div className="rounded-xl bg-success/10 p-2">
                <CalendarDays size={24} className="text-success" />
              </div>
            </div>
          </div>

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

          {/* Future ready */}
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
