import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import BottomNav from '@/components/BottomNav';
import XPProgressBar from '@/components/XPProgressBar';
import { Check, Zap, Clock, Star } from 'lucide-react';
import { t, TranslationKey } from '@/lib/translations';

interface Mission {
  id: string;
  titleKey: string;
  descKey: string;
  xp: number;
  type: 'daily' | 'weekly';
}

const missions: Mission[] = [
  { id: 'mission-1', titleKey: 'learn-compounding', descKey: 'learn-compounding', xp: 50, type: 'daily' },
  { id: 'mission-2', titleKey: 'nps-tier-quiz', descKey: 'nps-tier-quiz', xp: 100, type: 'daily' },
  { id: 'mission-3', titleKey: 'simulate-growth', descKey: 'simulate-growth', xp: 75, type: 'daily' },
  { id: 'mission-4', titleKey: 'log-contribution', descKey: 'log-contribution', xp: 150, type: 'weekly' },
  { id: 'mission-5', titleKey: 'tax-benefits', descKey: 'tax-benefits', xp: 80, type: 'weekly' },
  { id: 'mission-6', titleKey: 'share-friend', descKey: 'share-friend', xp: 200, type: 'weekly' },
];

const filterKeys: Record<string, TranslationKey> = {
  all: 'missions.all',
  daily: 'missions.daily',
  weekly: 'missions.weekly',
};

const Missions = () => {
  const { user, addXP, completeMission } = useUser();
  const [celebrating, setCelebrating] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'daily' | 'weekly'>('all');
  const lang = user.language;

  const handleComplete = (mission: Mission) => {
    if (user.completedMissions.includes(mission.id)) return;
    setCelebrating(mission.id);
    addXP(mission.xp);
    completeMission(mission.id);
    setTimeout(() => setCelebrating(null), 1500);
  };

  const filtered = missions.filter(m => filter === 'all' || m.type === filter);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="gradient-primary px-5 pb-5 pt-8">
        <h1 className="mb-3 font-display text-xl font-bold text-primary-foreground">{t(lang, 'missions.title')}</h1>
        <XPProgressBar />
      </div>

      <div className="mx-auto max-w-md px-5 mt-4 space-y-4">
        {/* Filter tabs */}
        <div className="flex gap-2">
          {(['all', 'daily', 'weekly'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-all ${
                filter === f
                  ? 'gradient-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {t(lang, filterKeys[f])}
            </button>
          ))}
        </div>

        {/* Mission cards */}
        {filtered.map((mission, i) => {
          const completed = user.completedMissions.includes(mission.id);
          const isCelebrating = celebrating === mission.id;

          return (
            <div
              key={mission.id}
              className={`game-card animate-fade-in-up ${completed ? 'opacity-70' : ''} ${isCelebrating ? 'animate-scale-in' : ''}`}
              style={{ animationDelay: `${0.05 * i}s` }}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleComplete(mission)}
                  disabled={completed}
                  className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    completed
                      ? 'border-success bg-success text-success-foreground'
                      : 'border-primary/30 hover:border-primary hover:bg-primary/10'
                  }`}
                >
                  {completed && <Check size={16} />}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-sm font-bold ${completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                      {t(lang, `missions.missionTitles.${mission.titleKey}` as TranslationKey)}
                    </h3>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      mission.type === 'daily' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'
                    }`}>
                      {mission.type === 'daily' ? <Clock size={10} className="inline mr-0.5" /> : <Star size={10} className="inline mr-0.5" />}
                      {t(lang, filterKeys[mission.type])}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {t(lang, `missions.missionDescs.${mission.descKey}` as TranslationKey)}
                  </p>
                </div>
                <div className="xp-badge flex-shrink-0">
                  <Zap size={12} />
                  +{mission.xp} XP
                </div>
              </div>

              {isCelebrating && (
                <div className="mt-3 rounded-xl bg-success/10 p-2 text-center animate-xp-pop">
                  <span className="text-sm font-bold text-success">🎉 +{mission.xp} {t(lang, 'missions.xpEarned')}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
};

export default Missions;
