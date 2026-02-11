import { useState, useMemo } from 'react';
import { useUser } from '@/contexts/UserContext';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { IndianRupee, TrendingUp, Target, Zap } from 'lucide-react';
import { t } from '@/lib/translations';

const Simulator = () => {
  const { user, addXP } = useUser();
  const lang = user.language;
  const [contribution, setContribution] = useState(user.monthlyContribution || 3000);
  const [returnRate, setReturnRate] = useState(10);
  const [years, setYears] = useState(60 - user.age);
  const [simulated, setSimulated] = useState(false);

  const data = useMemo(() => {
    const points = [];
    const monthlyRate = returnRate / 100 / 12;
    for (let y = 0; y <= years; y++) {
      const months = y * 12;
      const invested = contribution * months;
      const corpus = months === 0 ? 0 : Math.round(
        contribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate)
      );
      points.push({
        year: user.age + y,
        invested: Math.round(invested / 100000),
        corpus: Math.round(corpus / 100000),
      });
    }
    return points;
  }, [contribution, returnRate, years, user.age]);

  const finalCorpus = data[data.length - 1]?.corpus || 0;
  const totalInvested = data[data.length - 1]?.invested || 0;

  const handleSimulate = () => {
    if (!simulated) {
      addXP(75);
      setSimulated(true);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="gradient-primary px-5 pb-5 pt-8">
        <h1 className="mb-1 font-display text-xl font-bold text-primary-foreground">{t(lang, 'simulator.title')}</h1>
        <p className="text-xs text-primary-foreground/70">{t(lang, 'simulator.subtitle')}</p>
      </div>

      <div className="mx-auto max-w-md px-5 mt-4 space-y-4">
        {/* Inputs */}
        <div className="game-card space-y-4 animate-fade-in">
          <div>
            <label className="flex items-center justify-between text-sm font-semibold text-foreground">
              <span>{t(lang, 'simulator.monthlyContribution')}</span>
              <span className="font-display text-primary">₹{contribution.toLocaleString()}</span>
            </label>
            <input type="range" min={500} max={50000} step={500} value={contribution}
              onChange={e => setContribution(Number(e.target.value))} className="mt-2 w-full accent-primary" />
          </div>
          <div>
            <label className="flex items-center justify-between text-sm font-semibold text-foreground">
              <span>{t(lang, 'simulator.expectedReturn')}</span>
              <span className="font-display text-primary">{returnRate}%</span>
            </label>
            <input type="range" min={6} max={14} step={0.5} value={returnRate}
              onChange={e => setReturnRate(Number(e.target.value))} className="mt-2 w-full accent-primary" />
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
            <p className="font-display text-lg font-bold text-foreground">₹{totalInvested}L</p>
          </div>
          <div className="game-card text-center">
            <TrendingUp size={16} className="mx-auto mb-1 text-primary" />
            <p className="text-xs text-muted-foreground">{t(lang, 'simulator.totalCorpus')}</p>
            <p className="font-display text-lg font-bold text-primary">₹{finalCorpus}L</p>
          </div>
        </div>

        {/* CTA */}
        <Button
          onClick={handleSimulate}
          className="w-full gradient-primary text-primary-foreground rounded-xl py-5 font-bold"
        >
          <Target size={18} className="mr-2" />
          {simulated ? t(lang, 'simulator.goalSaved') : t(lang, 'simulator.setGoal')}
          {!simulated && <span className="xp-badge ml-2"><Zap size={10} /> +75 XP</span>}
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Simulator;
