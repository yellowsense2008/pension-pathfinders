import { useNavigate } from 'react-router-dom';
import { useUser, getLevelName } from '@/contexts/UserContext';
import XPProgressBar from '@/components/XPProgressBar';
import BottomNav from '@/components/BottomNav';
import { Target, Brain, Trophy, LineChart, Flame, TrendingUp, IndianRupee, CalendarDays } from 'lucide-react';

const Dashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const retirementAge = 60;
  const yearsLeft = retirementAge - user.age;
  const monthlyReturn = 0.1 / 12;
  const months = yearsLeft * 12;
  const futureValue = Math.round(
    user.monthlyContribution * ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn) * (1 + monthlyReturn)
  );

  const quickActions = [
    { label: "Today's Mission", icon: Target, color: 'gradient-primary', path: '/missions' },
    { label: 'Take a Quiz', icon: Brain, color: 'gradient-accent', path: '/learn' },
    { label: 'View Rewards', icon: Trophy, color: 'gradient-hero', path: '/rewards' },
    { label: 'Simulate Growth', icon: LineChart, color: 'gradient-primary', path: '/simulator' },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="gradient-hero px-5 pb-6 pt-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-primary-foreground/70">Welcome back 👋</p>
            <h1 className="font-display text-xl font-bold text-primary-foreground">
              {user.name || 'Pension Hero'}
            </h1>
          </div>
          <button onClick={() => navigate('/leaderboard')} className="rounded-xl bg-primary-foreground/10 p-2.5 backdrop-blur-sm">
            <Trophy size={20} className="text-primary-foreground" />
          </button>
        </div>
        <XPProgressBar />
      </div>

      <div className="mx-auto max-w-md px-5 -mt-2 space-y-4">
        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 animate-fade-in">
          <div className="game-card text-center">
            <div className="mb-1 flex items-center justify-center gap-1.5">
              <IndianRupee size={16} className="text-primary" />
              <span className="text-xs text-muted-foreground">Total Saved</span>
            </div>
            <p className="font-display text-xl font-bold text-foreground">
              ₹{user.totalContributions.toLocaleString()}
            </p>
          </div>
          <div className="game-card text-center">
            <div className="mb-1 flex items-center justify-center gap-1.5">
              <Flame size={16} className="text-streak" />
              <span className="text-xs text-muted-foreground">Streak</span>
            </div>
            <p className="font-display text-xl font-bold text-foreground">
              {user.streak} Months 🔥
            </p>
          </div>
        </div>

        {/* Retirement projection */}
        <div className="game-card gradient-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-1 flex items-center gap-1.5">
                <TrendingUp size={16} className="text-primary" />
                <span className="text-xs font-semibold text-muted-foreground">Retirement at {retirementAge}</span>
              </div>
              <p className="font-display text-2xl font-bold text-foreground">
                ₹{(futureValue / 100000).toFixed(1)}L
              </p>
              <p className="text-xs text-muted-foreground">
                Projected corpus • {yearsLeft} years left
              </p>
            </div>
            <div className="rounded-xl bg-success/10 p-2">
              <CalendarDays size={24} className="text-success" />
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="mb-3 font-display text-sm font-bold text-foreground">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map(({ label, icon: Icon, color, path }, i) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className="game-card flex items-center gap-3 text-left animate-fade-in-up"
                style={{ animationDelay: `${0.1 * (i + 1)}s` }}
              >
                <div className={`rounded-xl p-2.5 ${color}`}>
                  <Icon size={18} className="text-primary-foreground" />
                </div>
                <span className="text-xs font-semibold text-foreground leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Future ready */}
        <div className="rounded-2xl border border-border bg-muted/50 p-3 text-center animate-fade-in">
          <p className="text-[10px] text-muted-foreground">
            <div className="mt-4 text-center">
  <div className="w-24 h-px bg-gray-200 mx-auto mb-2"></div>
  <p className="text-[11px] text-gray-400 tracking-wide">
    Developed by YellowSense Technologies Pvt Ltd
  </p>
</div>
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
