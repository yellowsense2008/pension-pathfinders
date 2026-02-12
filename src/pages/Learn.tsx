import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import BottomNav from '@/components/BottomNav';
import PageTransition from '@/components/PageTransition';
import FloatingXP from '@/components/FloatingXP';
import { BookOpen, Check, ChevronRight, Zap, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { t, TranslationKey } from '@/lib/translations';
import { motion } from 'framer-motion';

interface Module {
  id: string;
  titleKey: string;
  emoji: string;
  xp: number;
  content: string[];
  quiz: { question: string; options: string[]; answer: number }[];
}

const modules: Module[] = [
  {
    id: 'what-is-nps',
    titleKey: 'what-is-nps',
    emoji: '📘',
    xp: 100,
    content: [
      'The National Pension System (NPS) is a government-backed retirement savings scheme open to all Indian citizens aged 18–70.',
      'It helps you build a retirement corpus by investing small amounts regularly over your working life.',
      'Think of it as a SIP for your retirement — but with added tax benefits and government backing!',
    ],
    quiz: [
      { question: 'Who can invest in NPS?', options: ['Only government employees', 'All Indian citizens', 'Only salaried people'], answer: 1 },
      { question: 'NPS is backed by?', options: ['Private banks', 'Government of India', 'Foreign institutions'], answer: 1 },
      { question: 'Minimum age to join NPS?', options: ['21 years', '18 years', '25 years'], answer: 1 },
    ],
  },
  {
    id: 'tier-1-vs-2',
    titleKey: 'tier-1-vs-2',
    emoji: '⚖️',
    xp: 100,
    content: [
      'Tier I is the primary pension account with a lock-in until age 60. It offers great tax benefits under Section 80CCD.',
      'Tier II is a voluntary savings account with no lock-in. You can withdraw anytime, but tax benefits are limited.',
      'Pro tip: Start with Tier I for maximum tax savings, then use Tier II for flexible savings!',
    ],
    quiz: [
      { question: 'Which tier has a lock-in period?', options: ['Tier I', 'Tier II', 'Both'], answer: 0 },
      { question: 'Which tier offers better tax benefits?', options: ['Tier II', 'Tier I', 'Neither'], answer: 1 },
      { question: 'Can you withdraw from Tier II anytime?', options: ['No', 'Yes', 'Only after 5 years'], answer: 1 },
    ],
  },
  {
    id: 'compounding',
    titleKey: 'compounding',
    emoji: '📈',
    xp: 120,
    content: [
      'Compounding is when your returns earn returns. It\'s like a snowball effect for your money!',
      'Example: ₹5,000/month at 10% for 30 years = ₹1.13 Crore. But just 20 years = ₹38 Lakhs. Those extra 10 years add ₹75 Lakhs!',
      'The key? Start early. Even ₹1,000/month at age 25 beats ₹5,000/month starting at age 35.',
    ],
    quiz: [
      { question: 'What makes compounding powerful?', options: ['High salary', 'Returns earning returns', 'Government subsidy'], answer: 1 },
      { question: 'Starting early matters because:', options: ['More time to compound', 'Higher interest rates', 'Lower fees'], answer: 0 },
      { question: '₹5000/month for 30 yrs at 10% ≈', options: ['₹38 Lakhs', '₹1.13 Crore', '₹50 Lakhs'], answer: 1 },
    ],
  },
  {
    id: 'tax-benefits',
    titleKey: 'tax-benefits',
    emoji: '🧾',
    xp: 100,
    content: [
      'Under Section 80CCD(1), you can claim up to 10% of salary (or ₹1.5L under 80C limit).',
      'Section 80CCD(1B) gives an ADDITIONAL ₹50,000 deduction — exclusively for NPS!',
      'That means you could save up to ₹15,600 extra in tax per year (at 30% slab) just by investing in NPS. 💰',
    ],
    quiz: [
      { question: 'Additional deduction under 80CCD(1B)?', options: ['₹1 Lakh', '₹50,000', '₹2 Lakhs'], answer: 1 },
      { question: 'This benefit is exclusive to?', options: ['PPF', 'NPS', 'ELSS'], answer: 1 },
      { question: 'At 30% tax slab, you save approx?', options: ['₹5,000', '₹15,600', '₹50,000'], answer: 1 },
    ],
  },
  {
    id: 'start-early',
    titleKey: 'start-early',
    emoji: '🚀',
    xp: 100,
    content: [
      'Starting at 25 vs 35 with ₹3,000/month at 10%: By 60, early starter has ₹68L, late starter has ₹22L. That\'s 3x more!',
      'Early starters need to invest less each month to reach the same goal. Time is literally money.',
      'Your future self will thank you. Every month you delay costs you lakhs in retirement corpus.',
    ],
    quiz: [
      { question: 'Starting 10 years earlier gives approx:', options: ['2x more', '3x more', 'Same amount'], answer: 1 },
      { question: 'Early starters need to invest:', options: ['More monthly', 'Less monthly', 'Same amount'], answer: 1 },
      { question: 'Delaying NPS costs you:', options: ['Nothing', 'Lakhs in corpus', 'Only tax benefits'], answer: 1 },
    ],
  },
];

const Learn = () => {
  const { user, addXP, completeModule } = useUser();
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [quizStep, setQuizStep] = useState(-1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showXP, setShowXP] = useState(false);
  const lang = user.language;

  const handleStartQuiz = () => setQuizStep(0);

  const handleAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    if (activeModule && idx === activeModule.quiz[quizStep].answer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (!activeModule) return;
    if (quizStep < activeModule.quiz.length - 1) {
      setQuizStep(s => s + 1);
      setSelectedAnswer(null);
    } else {
      addXP(activeModule.xp);
      completeModule(activeModule.id);
      setShowXP(true);
      setTimeout(() => {
        setShowXP(false);
        setActiveModule(null);
        setQuizStep(-1);
        setScore(0);
        setSelectedAnswer(null);
      }, 1200);
    }
  };

  const handleBack = () => {
    setActiveModule(null);
    setQuizStep(-1);
    setScore(0);
    setSelectedAnswer(null);
  };

  const getModuleTitle = (mod: Module) => t(lang, `learn.moduleTitles.${mod.titleKey}` as TranslationKey);

  if (activeModule) {
    const inQuiz = quizStep >= 0;
    const q = inQuiz ? activeModule.quiz[quizStep] : null;

    return (
      <PageTransition>
        <div className="min-h-screen bg-background pb-24">
          <div className="gradient-primary px-5 pb-5 pt-8">
            <button onClick={handleBack} className="mb-2 flex items-center gap-1 text-sm text-primary-foreground/70 tap-scale">
              <ArrowLeft size={16} /> {t(lang, 'learn.back')}
            </button>
            <h1 className="font-display text-xl font-bold text-primary-foreground relative">
              {activeModule.emoji} {getModuleTitle(activeModule)}
              <FloatingXP amount={activeModule.xp} show={showXP} />
            </h1>
          </div>

          <div className="mx-auto max-w-md px-5 mt-4 space-y-4">
            {!inQuiz ? (
              <>
                {activeModule.content.map((text, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i, duration: 0.3 }}
                    className="game-card"
                  >
                    <p className="text-sm leading-relaxed text-foreground">{text}</p>
                  </motion.div>
                ))}
                <motion.div whileTap={{ scale: 0.97 }}>
                  <Button onClick={handleStartQuiz} className="w-full gradient-accent text-secondary-foreground rounded-xl py-5 font-bold">
                    {t(lang, 'learn.takeQuiz')}
                  </Button>
                </motion.div>
              </>
            ) : q ? (
              <motion.div
                key={quizStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4 text-center">
                  <span className="text-xs text-muted-foreground">{t(lang, 'learn.question')} {quizStep + 1} {t(lang, 'learn.of')} {activeModule.quiz.length}</span>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full gradient-xp"
                      initial={{ width: `${(quizStep / activeModule.quiz.length) * 100}%` }}
                      animate={{ width: `${((quizStep + 1) / activeModule.quiz.length) * 100}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>
                <h2 className="mb-4 font-display text-lg font-bold text-foreground">{q.question}</h2>
                <div className="space-y-3">
                  {q.options.map((opt, i) => {
                    const isSelected = selectedAnswer === i;
                    const isCorrect = i === q.answer;
                    const showResult = selectedAnswer !== null;

                    return (
                      <motion.button
                        key={i}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleAnswer(i)}
                        className={`w-full game-card text-left text-sm font-medium transition-all ${
                          showResult && isCorrect ? 'border-2 border-success bg-success/10' :
                          showResult && isSelected && !isCorrect ? 'border-2 border-destructive bg-destructive/10' :
                          'hover:shadow-elevated'
                        }`}
                      >
                        {opt}
                      </motion.button>
                    );
                  })}
                </div>
                {selectedAnswer !== null && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    <Button onClick={handleNext} className="mt-4 w-full gradient-primary text-primary-foreground rounded-xl py-5 font-bold tap-scale">
                      {quizStep < activeModule.quiz.length - 1 ? t(lang, 'learn.nextQuestion') : `${t(lang, 'learn.complete')} (+${activeModule.xp} XP) 🎉`}
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            ) : null}
          </div>
          <BottomNav />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-24">
        <div className="gradient-primary px-5 pb-5 pt-8">
          <h1 className="mb-1 font-display text-xl font-bold text-primary-foreground">{t(lang, 'learn.title')}</h1>
          <p className="text-xs text-primary-foreground/70">{t(lang, 'learn.subtitle')}</p>
        </div>

        <div className="mx-auto max-w-md px-5 mt-4 space-y-3">
          {modules.map((mod, i) => {
            const completed = user.completedModules.includes(mod.id);
            return (
              <motion.button
                key={mod.id}
                onClick={() => setActiveModule(mod)}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.3 }}
                className="game-card w-full text-left flex items-center gap-3"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-2xl flex-shrink-0">
                  {mod.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-foreground">{getModuleTitle(mod)}</h3>
                    {completed && <Check size={14} className="text-success" />}
                  </div>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="xp-badge text-[10px]"><Zap size={10} /> +{mod.xp} XP</span>
                    <span className="text-[10px] text-muted-foreground">3 {t(lang, 'learn.questions')}</span>
                  </div>
                </div>
                <ChevronRight size={18} className="text-muted-foreground" />
              </motion.button>
            );
          })}
        </div>

        <BottomNav />
      </div>
    </PageTransition>
  );
};

export default Learn;
