import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import BottomNav from '@/components/BottomNav';
import XPProgressBar from '@/components/XPProgressBar';
import PageTransition from '@/components/PageTransition';
import ConfettiBurst from '@/components/ConfettiBurst';
import { Lock, CheckCircle } from 'lucide-react';
import { t, TranslationKey } from '@/lib/translations';
import { motion } from 'framer-motion';

const badgeIds = [
  'first-contribution',
  '3-month-streak',
  '6-month-streak',
  'knowledge-champion',
  'retirement-planner-5',
  'compounding-master',
  'social-starter',
  '1-year-streak',
];

const badgeEmojis: Record<string, string> = {
  'first-contribution': '🌱',
  '3-month-streak': '🔥',
  '6-month-streak': '⚡',
  'knowledge-champion': '🧠',
  'retirement-planner-5': '🏆',
  'compounding-master': '📈',
  'social-starter': '👥',
  '1-year-streak': '💎',
};

const Rewards = () => {
  const { user } = useUser();
  const lang = user.language;
  const [celebratingBadge, setCelebratingBadge] = useState<string | null>(null);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-24">
        <div className="gradient-hero px-5 pb-5 pt-8">
          <h1 className="mb-3 font-display text-xl font-bold text-primary-foreground">{t(lang, 'rewards.title')}</h1>
          <XPProgressBar />
        </div>

        <div className="mx-auto max-w-md px-5 mt-4 space-y-3">
          {/* Stats */}
          <div className="game-card flex items-center justify-around text-center animate-fade-in">
            <div>
              <p className="font-display text-2xl font-bold text-primary">{user.unlockedBadges.length}</p>
              <p className="text-xs text-muted-foreground">{t(lang, 'rewards.unlocked')}</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <p className="font-display text-2xl font-bold text-muted-foreground">{badgeIds.length - user.unlockedBadges.length}</p>
              <p className="text-xs text-muted-foreground">{t(lang, 'rewards.locked')}</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <p className="font-display text-2xl font-bold text-foreground">{user.level}</p>
              <p className="text-xs text-muted-foreground">{t(lang, 'rewards.level')}</p>
            </div>
          </div>

          {/* Badge grid */}
          <div className="grid grid-cols-2 gap-3">
            {badgeIds.map((id, i) => {
              const unlocked = user.unlockedBadges.includes(id);
              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: unlocked ? 1 : 0.5, scale: 1 }}
                  transition={{ delay: 0.05 * i, duration: 0.3 }}
                  className={`game-card text-center relative overflow-hidden ${!unlocked ? 'grayscale' : ''}`}
                  onClick={() => {
                    if (unlocked && celebratingBadge !== id) {
                      setCelebratingBadge(id);
                      setTimeout(() => setCelebratingBadge(null), 1000);
                    }
                  }}
                >
                  <ConfettiBurst show={celebratingBadge === id} />
                  <div className="mb-2 text-4xl">{badgeEmojis[id]}</div>
                  <h3 className="text-xs font-bold text-foreground">
                    {t(lang, `rewards.badgeNames.${id}` as TranslationKey)}
                  </h3>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {t(lang, `rewards.badgeDescs.${id}` as TranslationKey)}
                  </p>
                  <div className="mt-2">
                    {unlocked ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-success">
                        <CheckCircle size={12} /> {t(lang, 'rewards.unlocked')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Lock size={12} /> {t(lang, `rewards.badgeReqs.${id}` as TranslationKey)}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <BottomNav />
      </div>
    </PageTransition>
  );
};

export default Rewards;
