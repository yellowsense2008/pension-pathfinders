import { useMemo } from 'react';
import { useUser } from '@/contexts/UserContext';
import { t, TranslationKey } from '@/lib/translations';
import { motion, AnimatePresence, type TargetAndTransition } from 'framer-motion';
import { BackendProjectionResponse } from '@/services/api';

import strugglingImg from '@/assets/lifestyle-struggling.png';
import basicImg from '@/assets/lifestyle-basic.png';
import comfortableImg from '@/assets/lifestyle-comfortable.png';
import premiumImg from '@/assets/lifestyle-premium.png';

type LifestyleTier = 'struggling' | 'basic' | 'comfortable' | 'premium';
type LifestyleCategory = 'luxury' | 'comfortable' | 'basic' | 'struggle';

// Frontend-owned: maps backend lifestyle_category → public image path
const categoryImageMap: Record<LifestyleCategory, string> = {
  luxury:      '/future/rich.jpg',
  comfortable: '/future/comfortable.jpg',
  basic:       '/future/basic.jpg',
  struggle:    '/future/poor.jpg',
};

// Badge accent colour per tier
const categoryAccent: Record<LifestyleCategory, { badge: string; bar: string }> = {
  struggle:    { badge: 'bg-red-500/80',    bar: '#ef4444' },
  basic:       { badge: 'bg-orange-500/80', bar: '#f97316' },
  comfortable: { badge: 'bg-emerald-500/80',bar: '#22c55e' },
  luxury:      { badge: 'bg-yellow-500/80', bar: '#eab308' },
};

interface Props {
  corpus: number;
  monthlyPension: number;
  backendData?: BackendProjectionResponse | null;
  sliderCategory?: LifestyleCategory;
}

// Corpus-based fallback tier
const tierConfig: Record<LifestyleTier, { image: string }> = {
  struggling:  { image: strugglingImg },
  basic:       { image: basicImg },
  comfortable: { image: comfortableImg },
  premium:     { image: premiumImg },
};

const tierToCategory: Record<LifestyleTier, LifestyleCategory> = {
  struggling: 'struggle',
  basic:      'basic',
  comfortable:'comfortable',
  premium:    'luxury',
};

const categoryToTier: Record<LifestyleCategory, LifestyleTier> = {
  struggle:    'struggling',
  basic:       'basic',
  comfortable: 'comfortable',
  luxury:      'premium',
};

const categoryLabels: Record<LifestyleCategory, string> = {
  struggle:    'Struggle',
  basic:       'Basic',
  comfortable: 'Comfortable',
  luxury:      'Luxury',
};

const LifestyleOutcome = ({ corpus, monthlyPension: _mp, backendData, sliderCategory }: Props) => {
  const { user } = useUser();
  const lang = user.language;

  // Corpus-based fallback tier
  const tier: LifestyleTier = useMemo(() => {
    if (corpus >= 5000000) return 'premium';
    if (corpus >= 2000000) return 'comfortable';
    if (corpus >= 500000)  return 'basic';
    return 'struggling';
  }, [corpus]);

  // Priority: slider (live) → backend → corpus fallback
  const activeCategory: LifestyleCategory =
    sliderCategory ?? backendData?.lifestyle_category ?? tierToCategory[tier];

  const accent = categoryAccent[activeCategory];

  // Image resolution
  const resolvedImage: string =
    sliderCategory
      ? categoryImageMap[sliderCategory]
      : backendData
        ? categoryImageMap[backendData.lifestyle_category]
        : tierConfig[tier].image;

  // Effective tier to use for translations — always tracks the active category
  const effectiveTier: LifestyleTier = categoryToTier[activeCategory];

  // Text content
  const labelText     = categoryLabels[activeCategory];
  const memeText      = backendData ? backendData.message : t(lang, `lifestyle.${effectiveTier}.meme`      as TranslationKey);
  const contextText   = backendData ? `Confidence: ${backendData.confidence_score}` : t(lang, `lifestyle.${effectiveTier}.context` as TranslationKey);
  const narrativeText = t(lang, `lifestyle.${effectiveTier}.narrative` as TranslationKey);

  const allCategories: LifestyleCategory[] = ['struggle', 'basic', 'comfortable', 'luxury'];
  const activeIdx = allCategories.indexOf(activeCategory);

  // Per-tier transition variants
  interface TierVariant { initial: TargetAndTransition; animate: TargetAndTransition; exit: TargetAndTransition; }
  const tierVariants: Record<LifestyleCategory, TierVariant> = {
    struggle: {
      initial: { opacity: 0, filter: 'grayscale(1) brightness(0.7)' },
      animate: { opacity: 1, filter: 'grayscale(0) brightness(1)',
        transition: { duration: 0.55, ease: 'easeOut' } },
      exit:    { opacity: 0, filter: 'grayscale(1) brightness(0.7)',
        transition: { duration: 0.3 } },
    },
    basic: {
      initial: { opacity: 0, filter: 'sepia(0.7) brightness(0.85)' },
      animate: { opacity: 1, filter: 'sepia(0) brightness(1)',
        transition: { duration: 0.5, ease: 'easeOut' } },
      exit:    { opacity: 0, filter: 'sepia(0.7)',
        transition: { duration: 0.3 } },
    },
    comfortable: {
      initial: { opacity: 0, boxShadow: '0 0 0px 0px #22c55e00' },
      animate: { opacity: 1,
        boxShadow: ['0 0 0px 0px #22c55e00', '0 0 28px 6px #22c55e55', '0 0 12px 2px #22c55e22'],
        transition: { duration: 0.7, ease: 'easeOut' } },
      exit:    { opacity: 0, transition: { duration: 0.3 } },
    },
    luxury: {
      initial: { opacity: 0, filter: 'brightness(1.5) saturate(0)' },
      animate: { opacity: 1, filter: ['brightness(1.5) saturate(0)', 'brightness(1.3) saturate(1.2)', 'brightness(1) saturate(1)'],
        transition: { duration: 0.65, ease: 'easeOut' } },
      exit:    { opacity: 0, filter: 'brightness(1.4)',
        transition: { duration: 0.3 } },
    },
  };

  const v = tierVariants[activeCategory];

  return (
    <div className="space-y-3">

      {/* ── Cinematic Hero Card ─────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory + '-card'}
          className="relative w-full overflow-hidden rounded-3xl shadow-2xl"
          style={{ height: 'clamp(220px, 38vh, 400px)' }}
          initial={v.initial}
          animate={v.animate}
          exit={v.exit}
        >
        {/* Crossfade image */}
        <AnimatePresence mode="wait">
          <motion.img
            key={resolvedImage}
            src={resolvedImage}
            alt={labelText}
            className="absolute inset-0 h-full w-full object-cover object-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          />
        </AnimatePresence>

        {/* Bottom gradient scrim for text readability */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 50%, transparent 100%)',
          }}
        />

        {/* Category badge — top-left glassmorphism */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory + '-badge'}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className={`absolute top-3 left-3 ${accent.badge} backdrop-blur-md rounded-full px-3 py-1`}
          >
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-white">
              {labelText}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Text overlay — bottom-left storytelling banner */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory + '-text'}
            className="absolute bottom-0 left-0 right-0 p-4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="rounded-2xl px-4 py-3 space-y-1"
              style={{ backdropFilter: 'blur(12px)', background: 'rgba(0,0,0,0.35)' }}
            >
              <p className="text-base font-bold text-white leading-snug">
                {memeText}
              </p>
              <p className="text-[11px] text-white/70">
                {contextText}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* ── Tier Progress Bar ───────────────────────────────────────── */}
      <div className="flex gap-1.5 px-0.5">
        {allCategories.map((cat, idx) => (
          <div
            key={cat}
            className="flex-1 h-1.5 rounded-full transition-all duration-500"
            style={{
              backgroundColor: idx === activeIdx
                ? accent.bar
                : idx < activeIdx
                  ? accent.bar + '66'
                  : undefined,
            }}
            // use Tailwind bg-muted for inactive
            data-inactive={idx > activeIdx ? 'true' : undefined}
          />
        ))}
      </div>
      {/* muted fallback via a second layer — simpler to just inline */}
      <style>{`
        [data-inactive="true"] { background-color: hsl(var(--muted)); }
      `}</style>

      {/* ── Emotional Narrative ─────────────────────────────────────── */}
      <div className="text-center py-1">
        <p className="text-xs text-muted-foreground italic">{narrativeText}</p>
      </div>
    </div>
  );
};

export default LifestyleOutcome;
