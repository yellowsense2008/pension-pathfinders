import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Globe } from 'lucide-react';
import { t } from '@/lib/translations';
import heroImage from '@/assets/onboarding-hero.png';

const Onboarding = () => {
  const { setUser, user } = useUser();
  const navigate = useNavigate();
  const [age, setAge] = useState(25);
  const [income, setIncome] = useState<number | ''>('');
  const [contribution, setContribution] = useState<number | ''>('');
  const [language, setLanguage] = useState<'en' | 'hi'>(() => {
    const saved = localStorage.getItem('pensionquest-language');
    return (saved === 'hi' ? 'hi' : 'en');
  });

  const handleLanguageChange = (lang: 'en' | 'hi') => {
    setLanguage(lang);
    localStorage.setItem('pensionquest-language', lang);
  };

  const handleSubmit = () => {
    const updated = {
      ...user,
      age,
      monthlyIncome: Number(income) || 0,
      monthlyContribution: Number(contribution) || 0,
      language,
      onboarded: true,
      // Reset financial tracking for fresh onboarding
      totalContributions: 0,
      xp: 0,
      level: 1,
      streak: 0,
      lastActiveDate: new Date().toISOString(),
      completedMissions: [] as string[],
      completedModules: [] as string[],
      unlockedBadges: [] as string[],
      xpLedger: [] as any[],
    };
    localStorage.setItem('pensionquest-user', JSON.stringify(updated));
    localStorage.setItem('pensionquest-language', language);
    setUser(updated);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero section */}
      <div className="gradient-hero px-6 pb-8 pt-12 text-center">
        <div className="mx-auto mb-4 flex justify-center">
          <img src={heroImage} alt="PensionQuest hero" className="h-40 w-40 animate-fade-in rounded-3xl object-cover" />
        </div>
        <h1 className="mb-2 font-display text-2xl font-bold text-primary-foreground animate-fade-in">
          {t(language, 'onboarding.title')}
        </h1>
        <p className="text-sm text-primary-foreground/80 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {t(language, 'onboarding.subtitle')}
        </p>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-md px-5 -mt-4">
        <div className="game-card space-y-5 animate-slide-up">
          {/* Language toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe size={16} />
              {t(language, 'onboarding.language')}
            </div>
            <div className="flex rounded-full bg-muted p-0.5">
              {(['en', 'hi'] as const).map(lang => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                    language === lang
                      ? 'gradient-primary text-primary-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  {lang === 'en' ? 'English' : 'हिंदी'}
                </button>
              ))}
            </div>
          </div>

          {/* Age */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">{t(language, 'onboarding.age')}</label>
            <input
              type="range"
              min={18}
              max={70}
              value={age}
              onChange={e => setAge(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="mt-1 text-center font-display text-2xl font-bold text-primary">{age} {t(language, 'onboarding.years')}</div>
          </div>

          {/* Income */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">{t(language, 'onboarding.income')}</label>
            <input
              type="number"
              value={income}
              onChange={e => setIncome(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="e.g. 30000"
            />
          </div>

          {/* NPS Contribution */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-foreground">{t(language, 'onboarding.contribution')}</label>
            <p className="mb-2 text-xs text-muted-foreground">{t(language, 'onboarding.contributionHint')}</p>
            <input
              type="number"
              value={contribution}
              onChange={e => setContribution(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="e.g. 2000"
            />
          </div>

          {/* CTA */}
          <Button
            onClick={handleSubmit}
            className="w-full gradient-primary text-primary-foreground rounded-xl py-6 text-base font-bold shadow-glow animate-pulse-glow"
          >
            {t(language, 'onboarding.cta')}
            <ArrowRight size={18} className="ml-2" />
          </Button>

           <div className="mt-4 text-center">
          <div className="w-20 h-px bg-border mx-auto mb-2"></div>
        <p className="text-[11px] text-muted-foreground tracking-wide">
         Developed by YellowSense Technologies Pvt Ltd
       </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
