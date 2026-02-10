import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Globe } from 'lucide-react';
import heroImage from '@/assets/onboarding-hero.png';

const Onboarding = () => {
  const { setUser, user } = useUser();
  const navigate = useNavigate();
  const [age, setAge] = useState(25);
  const [income, setIncome] = useState(30000);
  const [contribution, setContribution] = useState(2000);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  const handleSubmit = () => {
    const updated = {
      ...user,
      age,
      monthlyIncome: income,
      monthlyContribution: contribution,
      language,
      onboarded: true,
    };
    localStorage.setItem('pensionquest-user', JSON.stringify(updated));
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
          Start Your Retirement Game Early
        </h1>
        <p className="text-sm text-primary-foreground/80 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          Turn pension planning into an exciting journey
        </p>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-md px-5 -mt-4">
        <div className="game-card space-y-5 animate-slide-up">
          {/* Language toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe size={16} />
              Language
            </div>
            <div className="flex rounded-full bg-muted p-0.5">
              {(['en', 'hi'] as const).map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
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
            <label className="mb-2 block text-sm font-semibold text-foreground">Your Age</label>
            <input
              type="range"
              min={21}
              max={35}
              value={age}
              onChange={e => setAge(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="mt-1 text-center font-display text-2xl font-bold text-primary">{age} years</div>
          </div>

          {/* Income */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">Monthly Income (₹)</label>
            <input
              type="number"
              value={income}
              onChange={e => setIncome(Number(e.target.value))}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="₹30,000"
            />
          </div>

          {/* NPS Contribution */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-foreground">Monthly NPS Contribution (₹)</label>
            <p className="mb-2 text-xs text-muted-foreground">Optional — you can set this later</p>
            <input
              type="number"
              value={contribution}
              onChange={e => setContribution(Number(e.target.value))}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="₹2,000"
            />
          </div>

          {/* CTA */}
          <Button
            onClick={handleSubmit}
            className="w-full gradient-primary text-primary-foreground rounded-xl py-6 text-base font-bold shadow-glow animate-pulse-glow"
          >
            Start My Pension Journey
            <ArrowRight size={18} className="ml-2" />
          </Button>

          <p className="text-center text-[10px] text-muted-foreground">
            🔒 Secure & compliant architecture ready • API-ready for NPS ecosystem
          </p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
