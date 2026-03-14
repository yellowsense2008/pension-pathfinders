import { useMemo } from 'react';
import { useUser } from '@/contexts/UserContext';
import { t, TranslationKey } from '@/lib/translations';
import { motion } from 'framer-motion';

import strugglingImg from '@/assets/lifestyle-struggling.png';
import basicImg from '@/assets/lifestyle-basic.png';
import comfortableImg from '@/assets/lifestyle-comfortable.png';
import premiumImg from '@/assets/lifestyle-premium.png';

type LifestyleTier = 'struggling' | 'basic' | 'comfortable' | 'premium';

interface Props {
  corpus: number;
  monthlyPension: number;
}

const tierConfig: Record<LifestyleTier, {
  image: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
}> = {
  struggling: {
    image: strugglingImg,
    bgClass: 'bg-destructive/5',
    borderClass: 'border-destructive/20',
    textClass: 'text-destructive',
  },
  basic: {
    image: basicImg,
    bgClass: 'bg-muted',
    borderClass: 'border-border',
    textClass: 'text-muted-foreground',
  },
  comfortable: {
    image: comfortableImg,
    bgClass: 'bg-primary/5',
    borderClass: 'border-primary/20',
    textClass: 'text-primary',
  },
  premium: {
    image: premiumImg,
    bgClass: 'bg-secondary/5',
    borderClass: 'border-secondary/20',
    textClass: 'text-secondary',
  },
};

const LifestyleOutcome = ({ corpus, monthlyPension }: Props) => {
  const { user } = useUser();
  const lang = user.language;

  const tier: LifestyleTier = useMemo(() => {
    if (corpus >= 5000000) return 'premium';
    if (corpus >= 2000000) return 'comfortable';
    if (corpus >= 500000) return 'basic';
    return 'struggling';
  }, [corpus]);

  const cfg = tierConfig[tier];

  const allTiers: LifestyleTier[] = ['struggling', 'basic', 'comfortable', 'premium'];

  return (
    <div className="space-y-3">
      {/* Active Lifestyle Card */}
      <motion.div
        key={tier}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`game-card border ${cfg.borderClass} ${cfg.bgClass} overflow-hidden`}
      >
        <div className="flex items-center gap-4">
          <img
            src={cfg.image}
            alt={t(lang, `lifestyle.${tier}.title` as TranslationKey)}
            className="h-24 w-24 object-contain rounded-xl"
          />
          <div className="flex-1 space-y-1">
            <span className={`text-xs font-bold uppercase tracking-wider ${cfg.textClass}`}>
              {t(lang, `lifestyle.${tier}.title` as TranslationKey)}
            </span>
            <p className="text-sm font-medium text-foreground">
              {t(lang, `lifestyle.${tier}.meme` as TranslationKey)}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {t(lang, `lifestyle.${tier}.context` as TranslationKey)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tier Progress Indicators */}
      <div className="flex gap-1.5">
        {allTiers.map((t_tier) => {
          const isActive = t_tier === tier;
          const isPast = allTiers.indexOf(t_tier) <= allTiers.indexOf(tier);
          return (
            <div
              key={t_tier}
              className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                isActive ? 'bg-primary' : isPast ? 'bg-primary/40' : 'bg-muted'
              }`}
            />
          );
        })}
      </div>

      {/* Emotional Narrative */}
      <div className="text-center py-2">
        <p className="text-xs text-muted-foreground italic">
          {t(lang, `lifestyle.${tier}.narrative` as TranslationKey)}
        </p>
      </div>
    </div>
  );
};

export default LifestyleOutcome;
