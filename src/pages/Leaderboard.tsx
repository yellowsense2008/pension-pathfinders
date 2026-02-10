import { useState } from 'react';
import BottomNav from '@/components/BottomNav';
import { Trophy, Medal, Flame, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const leaderboardData = [
  { rank: 1, name: 'Priya S.', xp: 4200, streak: 8, age: 24 },
  { rank: 2, name: 'Arjun K.', xp: 3800, streak: 6, age: 27 },
  { rank: 3, name: 'Meera R.', xp: 3450, streak: 7, age: 23 },
  { rank: 4, name: 'You', xp: 1250, streak: 4, age: 25, isUser: true },
  { rank: 5, name: 'Rahul M.', xp: 1100, streak: 3, age: 29 },
  { rank: 6, name: 'Sneha P.', xp: 950, streak: 2, age: 31 },
  { rank: 7, name: 'Vikram D.', xp: 800, streak: 5, age: 26 },
  { rank: 8, name: 'Anita G.', xp: 650, streak: 1, age: 33 },
];

const ageGroups = ['All', '21–25', '26–30', '31–35'] as const;

const Leaderboard = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'xp' | 'contributors'>('xp');
  const [ageFilter, setAgeFilter] = useState<typeof ageGroups[number]>('All');

  const filtered = leaderboardData.filter(p => {
    if (ageFilter === 'All') return true;
    if (ageFilter === '21–25') return p.age >= 21 && p.age <= 25;
    if (ageFilter === '26–30') return p.age >= 26 && p.age <= 30;
    return p.age >= 31 && p.age <= 35;
  });

  const rankIcon = (rank: number) => {
    if (rank === 1) return <span className="text-lg">🥇</span>;
    if (rank === 2) return <span className="text-lg">🥈</span>;
    if (rank === 3) return <span className="text-lg">🥉</span>;
    return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="gradient-hero px-5 pb-5 pt-8">
        <button onClick={() => navigate('/dashboard')} className="mb-2 flex items-center gap-1 text-sm text-primary-foreground/70">
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="font-display text-xl font-bold text-primary-foreground flex items-center gap-2">
          <Trophy size={22} /> Leaderboard
        </h1>
      </div>

      <div className="mx-auto max-w-md px-5 mt-4 space-y-4">
        {/* Tabs */}
        <div className="flex gap-2">
          {(['xp', 'contributors'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 rounded-full py-2 text-xs font-semibold capitalize transition-all ${
                tab === t ? 'gradient-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              {t === 'xp' ? '⚡ XP Ranking' : '💰 Top Contributors'}
            </button>
          ))}
        </div>

        {/* Age filter */}
        <div className="flex gap-2 overflow-x-auto">
          {ageGroups.map(ag => (
            <button
              key={ag}
              onClick={() => setAgeFilter(ag)}
              className={`whitespace-nowrap rounded-full px-3 py-1 text-[10px] font-semibold transition-all ${
                ageFilter === ag ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              {ag === 'All' ? 'All Ages' : ag}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-2">
          {filtered.map((person, i) => (
            <div
              key={person.rank}
              className={`game-card flex items-center gap-3 animate-fade-in-up ${
                person.isUser ? 'ring-2 ring-primary/40 gradient-card' : ''
              }`}
              style={{ animationDelay: `${0.05 * i}s` }}
            >
              <div className="flex w-8 items-center justify-center">{rankIcon(person.rank)}</div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted font-display text-sm font-bold text-foreground">
                {person.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-bold ${person.isUser ? 'text-primary' : 'text-foreground'}`}>
                  {person.name} {person.isUser && '(You)'}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">{person.xp.toLocaleString()} XP</span>
                  <span className="streak-badge text-[10px]">
                    <Flame size={10} /> {person.streak}
                  </span>
                </div>
              </div>
              {person.rank <= 3 && <Medal size={18} className="text-secondary" />}
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Leaderboard;
