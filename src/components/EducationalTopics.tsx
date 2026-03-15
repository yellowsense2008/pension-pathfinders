import { useState } from 'react';
import { BookOpen, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { t, Language, TranslationKey } from '@/lib/translations';
import { motion, AnimatePresence } from 'framer-motion';

interface Topic {
  id: string;
  emoji: string;
}

const topics: Topic[] = [
  { id: 'nps-benefits', emoji: '🏦' },
  { id: 'compounding', emoji: '📈' },
  { id: 'retirement-basics', emoji: '🏡' },
  { id: 'financial-discipline', emoji: '💪' },
];

interface EducationalTopicsProps {
  lang: Language;
}

const EducationalTopics = ({ lang }: EducationalTopicsProps) => {
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);

  if (activeTopic) {
    const contentKey = `learn.topic.${activeTopic.id}.content` as TranslationKey;
    const closingKey = `learn.topic.closing.${activeTopic.id}` as TranslationKey;
    const titleKey = `learn.topic.${activeTopic.id}.title` as TranslationKey;
    const paragraphs = t(lang, contentKey).split('\n\n');

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        <button
          onClick={() => setActiveTopic(null)}
          className="flex items-center gap-1 text-sm text-muted-foreground tap-scale"
        >
          <ArrowLeft size={16} /> {t(lang, 'learn.back')}
        </button>

        <h2 className="font-display text-lg font-bold text-foreground">
          {activeTopic.emoji} {t(lang, titleKey)}
        </h2>

        {paragraphs.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * i, duration: 0.3 }}
            className="game-card"
          >
            <p className="text-sm leading-relaxed text-foreground">{p}</p>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 * paragraphs.length, duration: 0.3 }}
          className="game-card border-2 border-primary/20 bg-primary/5 text-center"
        >
          <p className="text-sm font-semibold text-primary">{t(lang, closingKey)}</p>
        </motion.div>

        <Button
          onClick={() => setActiveTopic(null)}
          variant="outline"
          className="w-full rounded-xl py-5"
        >
          <ArrowLeft size={16} className="mr-2" />
          {t(lang, 'learn.back')}
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="mt-6 mb-2">
        <h2 className="font-display text-base font-bold text-foreground">
          {t(lang, 'learn.topicsTitle')}
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {t(lang, 'learn.topicsSubtitle')}
        </p>
      </div>

      {topics.map((topic, i) => {
        const titleKey = `learn.topic.${topic.id}.title` as TranslationKey;
        const subtitleKey = `learn.topic.${topic.id}.subtitle` as TranslationKey;

        return (
          <motion.button
            key={topic.id}
            onClick={() => setActiveTopic(topic)}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.3 }}
            className="game-card w-full text-left flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-2xl flex-shrink-0">
              {topic.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-foreground">{t(lang, titleKey)}</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                {t(lang, subtitleKey)}
              </p>
            </div>
            <ChevronRight size={18} className="text-muted-foreground flex-shrink-0" />
          </motion.button>
        );
      })}
    </div>
  );
};

export default EducationalTopics;
