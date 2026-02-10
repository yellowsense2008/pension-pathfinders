import { useUser } from '@/contexts/UserContext';
import BottomNav from '@/components/BottomNav';
import XPProgressBar from '@/components/XPProgressBar';
import { Lock, CheckCircle } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  requirement: string;
}

const badges: Badge[] = [
  { id: 'first-contribution', name: 'First Contribution', emoji: '🌱', description: 'Made your first NPS contribution', requirement: 'Make 1 contribution' },
  { id: '3-month-streak', name: '3 Month Streak', emoji: '🔥', description: 'Contributed 3 months in a row', requirement: '3 month streak' },
  { id: '6-month-streak', name: '6 Month Streak', emoji: '⚡', description: 'Half a year of consistency!', requirement: '6 month streak' },
  { id: 'knowledge-champion', name: 'Knowledge Champion', emoji: '🧠', description: 'Completed all learning modules', requirement: 'Complete all modules' },
  { id: 'retirement-planner-5', name: 'Retirement Planner Lv.5', emoji: '🏆', description: 'Reached level 5 in your journey', requirement: 'Reach Level 5' },
  { id: 'compounding-master', name: 'Compounding Master', emoji: '📈', description: 'Mastered the power of compounding', requirement: 'Complete compounding module + sim' },
  { id: 'social-starter', name: 'Social Starter', emoji: '👥', description: 'Invited a friend to PensionQuest', requirement: 'Share with 1 friend' },
  { id: '1-year-streak', name: '1 Year Streak', emoji: '💎', description: 'A full year of NPS contributions!', requirement: '12 month streak' },
];

const Rewards = () => {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="gradient-hero px-5 pb-5 pt-8">
        <h1 className="mb-3 font-display text-xl font-bold text-primary-foreground">Rewards & Badges</h1>
        <XPProgressBar />
      </div>

      <div className="mx-auto max-w-md px-5 mt-4 space-y-3">
        {/* Stats */}
        <div className="game-card flex items-center justify-around text-center animate-fade-in">
          <div>
            <p className="font-display text-2xl font-bold text-primary">{user.unlockedBadges.length}</p>
            <p className="text-xs text-muted-foreground">Unlocked</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div>
            <p className="font-display text-2xl font-bold text-muted-foreground">{badges.length - user.unlockedBadges.length}</p>
            <p className="text-xs text-muted-foreground">Locked</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div>
            <p className="font-display text-2xl font-bold text-foreground">{user.level}</p>
            <p className="text-xs text-muted-foreground">Level</p>
          </div>
        </div>

        {/* Badge grid */}
        <div className="grid grid-cols-2 gap-3">
          {badges.map((badge, i) => {
            const unlocked = user.unlockedBadges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`game-card text-center animate-fade-in-up ${!unlocked ? 'opacity-50 grayscale' : ''}`}
                style={{ animationDelay: `${0.05 * i}s` }}
              >
                <div className="mb-2 text-4xl">{badge.emoji}</div>
                <h3 className="text-xs font-bold text-foreground">{badge.name}</h3>
                <p className="mt-1 text-[10px] text-muted-foreground">{badge.description}</p>
                <div className="mt-2">
                  {unlocked ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-success">
                      <CheckCircle size={12} /> Unlocked
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Lock size={12} /> {badge.requirement}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Rewards;
