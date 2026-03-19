import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import BottomNav from '@/components/BottomNav';
import PageTransition from '@/components/PageTransition';
import FloatingXP from '@/components/FloatingXP';
import EducationalTopics from '@/components/EducationalTopics';
import { Check, ChevronRight, Zap, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { t, TranslationKey } from '@/lib/translations';
import { motion } from 'framer-motion';

type Lang = 'en' | 'hi' | 'ml';
type LangText = Record<Lang, string>;
type LangTexts = Record<Lang, string[]>;

interface QuizQuestion {
  question: LangText;
  options: LangTexts;
  answer: number;
}

interface Module {
  id: string;
  titleKey: string;
  emoji: string;
  xp: number;
  content: LangTexts;
  quiz: QuizQuestion[];
}

const txt = (obj: LangText | LangTexts, lang: Lang): string | string[] => {
  if (Array.isArray((obj as LangTexts).en)) {
    const o = obj as LangTexts;
    return o[lang] || o.en;
  }
  const o = obj as LangText;
  return o[lang] || o.en;
};

const modules: Module[] = [
  {
    id: 'what-is-nps',
    titleKey: 'what-is-nps',
    emoji: '📘',
    xp: 100,
    content: {
      en: [
        'The National Pension System (NPS) is a government-backed retirement savings scheme open to all Indian citizens aged 18–70.',
        'It helps you build a retirement corpus by investing small amounts regularly over your working life.',
        'Think of it as a SIP for your retirement — but with added tax benefits and government backing!',
      ],
      hi: [
        'राष्ट्रीय पेंशन प्रणाली (NPS) एक सरकारी सेवानिवृत्ति बचत योजना है जो 18–70 वर्ष के सभी भारतीय नागरिकों के लिए खुली है।',
        'यह आपके कामकाजी जीवन में नियमित रूप से छोटी राशि निवेश करके सेवानिवृत्ति कोष बनाने में मदद करता है।',
        'इसे अपनी सेवानिवृत्ति के लिए SIP समझें — लेकिन अतिरिक्त टैक्स लाभ और सरकारी समर्थन के साथ!',
      ],
      ml: [
        'നാഷണൽ പെൻഷൻ സിസ്റ്റം (NPS) 18–70 വയസ്സുള്ള എല്ലാ ഇന്ത്യൻ പൗരന്മാർക്കും ലഭ്യമായ ഒരു സർക്കാർ പിന്തുണയുള്ള റിട്ടയർമെന്റ് സേവിംഗ്സ് പദ്ധതിയാണ്.',
        'നിങ്ങളുടെ ജോലി ജീവിതത്തിൽ ചെറിയ തുകകൾ ക്രമമായി നിക്ഷേപിച്ച് റിട്ടയർമെന്റ് ഫണ്ട് കെട്ടിപ്പടുക്കാൻ ഇത് സഹായിക്കുന്നു.',
        'ഇതിനെ നിങ്ങളുടെ റിട്ടയർമെന്റിനുള്ള SIP ആയി കരുതൂ — നികുതി ആനുകൂല്യങ്ങളും സർക്കാർ പിന്തുണയും ഉള്ളത്!',
      ],
    },
    quiz: [
      {
        question: { en: 'Who can invest in NPS?', hi: 'NPS में कौन निवेश कर सकता है?', ml: 'NPS-ൽ ആർക്കൊക്കെ നിക്ഷേപിക്കാം?' },
        options: {
          en: ['Only government employees', 'All Indian citizens', 'Only salaried people'],
          hi: ['केवल सरकारी कर्मचारी', 'सभी भारतीय नागरिक', 'केवल वेतनभोगी लोग'],
          ml: ['സർക്കാർ ജീവനക്കാർ മാത്രം', 'എല്ലാ ഇന്ത്യൻ പൗരന്മാരും', 'ശമ്പളക്കാർ മാത്രം'],
        },
        answer: 1,
      },
      {
        question: { en: 'NPS is backed by?', hi: 'NPS किसके द्वारा समर्थित है?', ml: 'NPS-നെ പിന്തുണയ്ക്കുന്നത്?' },
        options: {
          en: ['Private banks', 'Government of India', 'Foreign institutions'],
          hi: ['निजी बैंक', 'भारत सरकार', 'विदेशी संस्थाएं'],
          ml: ['സ്വകാര്യ ബാങ്കുകൾ', 'ഇന്ത്യാ ഗവൺമെന്റ്', 'വിദേശ സ്ഥാപനങ്ങൾ'],
        },
        answer: 1,
      },
      {
        question: { en: 'Minimum age to join NPS?', hi: 'NPS में शामिल होने की न्यूनतम उम्र?', ml: 'NPS-ൽ ചേരാനുള്ള കുറഞ്ഞ പ്രായം?' },
        options: {
          en: ['21 years', '18 years', '25 years'],
          hi: ['21 साल', '18 साल', '25 साल'],
          ml: ['21 വയസ്സ്', '18 വയസ്സ്', '25 വയസ്സ്'],
        },
        answer: 1,
      },
    ],
  },
  {
    id: 'tier-1-vs-2',
    titleKey: 'tier-1-vs-2',
    emoji: '⚖️',
    xp: 100,
    content: {
      en: [
        'Tier I is the primary pension account with a lock-in until age 60. It offers great tax benefits under Section 80CCD.',
        'Tier II is a voluntary savings account with no lock-in. You can withdraw anytime, but tax benefits are limited.',
        'Pro tip: Start with Tier I for maximum tax savings, then use Tier II for flexible savings!',
      ],
      hi: [
        'टियर I प्राथमिक पेंशन खाता है जिसमें 60 वर्ष तक लॉक-इन है। यह धारा 80CCD के तहत बेहतरीन टैक्स लाभ देता है।',
        'टियर II एक स्वैच्छिक बचत खाता है जिसमें कोई लॉक-इन नहीं है। आप कभी भी निकाल सकते हैं, लेकिन टैक्स लाभ सीमित हैं।',
        'सुझाव: अधिकतम टैक्स बचत के लिए टियर I से शुरू करें, फिर लचीली बचत के लिए टियर II का उपयोग करें!',
      ],
      ml: [
        'ടിയർ I 60 വയസ്സ് വരെ ലോക്ക്-ഇൻ ഉള്ള പ്രാഥമിക പെൻഷൻ അക്കൗണ്ടാണ്. സെക്ഷൻ 80CCD പ്രകാരം മികച്ച നികുതി ആനുകൂല്യങ്ങൾ ലഭിക്കും.',
        'ടിയർ II ലോക്ക്-ഇൻ ഇല്ലാത്ത ഒരു സ്വമേധയാ ഉള്ള സേവിംഗ്സ് അക്കൗണ്ടാണ്. എപ്പോൾ വേണമെങ്കിലും പിൻവലിക്കാം, പക്ഷേ നികുതി ആനുകൂല്യങ്ങൾ പരിമിതമാണ്.',
        'നുറുങ്ങ്: പരമാവധി നികുതി ലാഭത്തിന് ടിയർ I-ൽ തുടങ്ങുക, പിന്നെ ഫ്ലെക്സിബിൾ സേവിംഗ്സിന് ടിയർ II ഉപയോഗിക്കുക!',
      ],
    },
    quiz: [
      {
        question: { en: 'Which tier has a lock-in period?', hi: 'किस टियर में लॉक-इन अवधि है?', ml: 'ഏത് ടിയറിനാണ് ലോക്ക്-ഇൻ കാലാവധി?' },
        options: {
          en: ['Tier I', 'Tier II', 'Both'],
          hi: ['टियर I', 'टियर II', 'दोनों'],
          ml: ['ടിയർ I', 'ടിയർ II', 'രണ്ടും'],
        },
        answer: 0,
      },
      {
        question: { en: 'Which tier offers better tax benefits?', hi: 'कौन सा टियर बेहतर टैक्स लाभ देता है?', ml: 'ഏത് ടിയറാണ് മികച്ച നികുതി ആനുകൂല്യം നൽകുന്നത്?' },
        options: {
          en: ['Tier II', 'Tier I', 'Neither'],
          hi: ['टियर II', 'टियर I', 'कोई नहीं'],
          ml: ['ടിയർ II', 'ടിയർ I', 'ഒന്നുമില്ല'],
        },
        answer: 1,
      },
      {
        question: { en: 'Can you withdraw from Tier II anytime?', hi: 'क्या आप टियर II से कभी भी निकाल सकते हैं?', ml: 'ടിയർ II-ൽ നിന്ന് എപ്പോൾ വേണമെങ്കിലും പിൻവലിക്കാമോ?' },
        options: {
          en: ['No', 'Yes', 'Only after 5 years'],
          hi: ['नहीं', 'हां', 'केवल 5 साल बाद'],
          ml: ['ഇല്ല', 'അതെ', '5 വർഷത്തിന് ശേഷം മാത്രം'],
        },
        answer: 1,
      },
    ],
  },
  {
    id: 'compounding',
    titleKey: 'compounding',
    emoji: '📈',
    xp: 120,
    content: {
      en: [
        'Compounding is when your returns earn returns. It\'s like a snowball effect for your money!',
        'Example: ₹5,000/month at 10% for 30 years = ₹1.13 Crore. But just 20 years = ₹38 Lakhs. Those extra 10 years add ₹75 Lakhs!',
        'The key? Start early. Even ₹1,000/month at age 25 beats ₹5,000/month starting at age 35.',
      ],
      hi: [
        'चक्रवृद्धि ब्याज तब होता है जब आपके रिटर्न पर भी रिटर्न मिलता है। यह आपके पैसे के लिए स्नोबॉल इफेक्ट जैसा है!',
        'उदाहरण: ₹5,000/महीना 10% पर 30 साल = ₹1.13 करोड़। लेकिन 20 साल = ₹38 लाख। वो अतिरिक्त 10 साल ₹75 लाख जोड़ते हैं!',
        'कुंजी? जल्दी शुरू करें। 25 साल की उम्र में ₹1,000/महीना भी 35 साल में शुरू किए ₹5,000/महीना से बेहतर है।',
      ],
      ml: [
        'കൂട്ടുപലിശ എന്നാൽ നിങ്ങളുടെ ലാഭത്തിന് മേൽ വീണ്ടും ലാഭം ലഭിക്കുന്നതാണ്. ഇത് നിങ്ങളുടെ പണത്തിന്റെ സ്നോബോൾ ഇഫക്ട് പോലെയാണ്!',
        'ഉദാഹരണം: ₹5,000/മാസം 10%-ൽ 30 വർഷം = ₹1.13 കോടി. 20 വർഷം മാത്രമാണെങ്കിൽ = ₹38 ലക്ഷം. ആ 10 വർഷം കൂടി ₹75 ലക്ഷം ചേർക്കുന്നു!',
        'രഹസ്യം? നേരത്തെ തുടങ്ങുക. 25 വയസ്സിൽ ₹1,000/മാസം പോലും 35 വയസ്സിൽ തുടങ്ങുന്ന ₹5,000/മാസത്തേക്കാൾ മികച്ചതാണ്.',
      ],
    },
    quiz: [
      {
        question: { en: 'What makes compounding powerful?', hi: 'चक्रवृद्धि को शक्तिशाली क्या बनाता है?', ml: 'കൂട്ടുപലിശയെ ശക്തമാക്കുന്നത് എന്താണ്?' },
        options: {
          en: ['High salary', 'Returns earning returns', 'Government subsidy'],
          hi: ['ज्यादा सैलरी', 'रिटर्न पर रिटर्न', 'सरकारी सब्सिडी'],
          ml: ['ഉയർന്ന ശമ്പളം', 'ലാഭത്തിന് മേൽ ലാഭം', 'സർക്കാർ സബ്സിഡി'],
        },
        answer: 1,
      },
      {
        question: { en: 'Starting early matters because:', hi: 'जल्दी शुरू करना महत्वपूर्ण क्योंकि:', ml: 'നേരത്തെ തുടങ്ങുന്നത് പ്രധാനം കാരണം:' },
        options: {
          en: ['More time to compound', 'Higher interest rates', 'Lower fees'],
          hi: ['चक्रवृद्धि के लिए ज्यादा समय', 'ज्यादा ब्याज दर', 'कम शुल्क'],
          ml: ['കൂട്ടുപലിശയ്ക്ക് കൂടുതൽ സമയം', 'ഉയർന്ന പലിശ നിരക്ക്', 'കുറഞ്ഞ ഫീസ്'],
        },
        answer: 0,
      },
      {
        question: { en: '₹5000/month for 30 yrs at 10% ≈', hi: '₹5000/महीना 30 साल 10% पर ≈', ml: '₹5000/മാസം 30 വർഷം 10%-ൽ ≈' },
        options: {
          en: ['₹38 Lakhs', '₹1.13 Crore', '₹50 Lakhs'],
          hi: ['₹38 लाख', '₹1.13 करोड़', '₹50 लाख'],
          ml: ['₹38 ലക്ഷം', '₹1.13 കോടി', '₹50 ലക്ഷം'],
        },
        answer: 1,
      },
    ],
  },
  {
    id: 'tax-benefits',
    titleKey: 'tax-benefits',
    emoji: '🧾',
    xp: 100,
    content: {
      en: [
        'Under Section 80CCD(1), you can claim up to 10% of salary (or ₹1.5L under 80C limit).',
        'Section 80CCD(1B) gives an ADDITIONAL ₹50,000 deduction — exclusively for NPS!',
        'That means you could save up to ₹15,600 extra in tax per year (at 30% slab) just by investing in NPS. 💰',
      ],
      hi: [
        'धारा 80CCD(1) के तहत, आप वेतन का 10% तक (या 80C सीमा के तहत ₹1.5 लाख) क्लेम कर सकते हैं।',
        'धारा 80CCD(1B) एक अतिरिक्त ₹50,000 की कटौती देता है — विशेष रूप से NPS के लिए!',
        'इसका मतलब है कि NPS में निवेश करके आप हर साल ₹15,600 अतिरिक्त टैक्स बचा सकते हैं (30% स्लैब पर)। 💰',
      ],
      ml: [
        'സെക്ഷൻ 80CCD(1) പ്രകാരം, ശമ്പളത്തിന്റെ 10% വരെ (അല്ലെങ്കിൽ 80C പരിധിയിൽ ₹1.5 ലക്ഷം) ക്ലെയിം ചെയ്യാം.',
        'സെക്ഷൻ 80CCD(1B) NPS-നായി മാത്രം ₹50,000 അധിക കിഴിവ് നൽകുന്നു!',
        'അതായത് NPS-ൽ നിക്ഷേപിച്ചാൽ പ്രതിവർഷം ₹15,600 അധിക നികുതി ലാഭിക്കാം (30% സ്ലാബിൽ). 💰',
      ],
    },
    quiz: [
      {
        question: { en: 'Additional deduction under 80CCD(1B)?', hi: '80CCD(1B) के तहत अतिरिक्त कटौती?', ml: '80CCD(1B) പ്രകാരം അധിക കിഴിവ്?' },
        options: {
          en: ['₹1 Lakh', '₹50,000', '₹2 Lakhs'],
          hi: ['₹1 लाख', '₹50,000', '₹2 लाख'],
          ml: ['₹1 ലക്ഷം', '₹50,000', '₹2 ലക്ഷം'],
        },
        answer: 1,
      },
      {
        question: { en: 'This benefit is exclusive to?', hi: 'यह लाभ किसके लिए विशेष है?', ml: 'ഈ ആനുകൂല്യം ഏതിന് മാത്രമുള്ളതാണ്?' },
        options: {
          en: ['PPF', 'NPS', 'ELSS'],
          hi: ['PPF', 'NPS', 'ELSS'],
          ml: ['PPF', 'NPS', 'ELSS'],
        },
        answer: 1,
      },
      {
        question: { en: 'At 30% tax slab, you save approx?', hi: '30% टैक्स स्लैब पर आप लगभग बचाते हैं?', ml: '30% നികുതി സ്ലാബിൽ ഏകദേശം എത്ര ലാഭിക്കാം?' },
        options: {
          en: ['₹5,000', '₹15,600', '₹50,000'],
          hi: ['₹5,000', '₹15,600', '₹50,000'],
          ml: ['₹5,000', '₹15,600', '₹50,000'],
        },
        answer: 1,
      },
    ],
  },
  {
    id: 'start-early',
    titleKey: 'start-early',
    emoji: '🚀',
    xp: 100,
    content: {
      en: [
        'Starting at 25 vs 35 with ₹3,000/month at 10%: By 60, early starter has ₹68L, late starter has ₹22L. That\'s 3x more!',
        'Early starters need to invest less each month to reach the same goal. Time is literally money.',
        'Your future self will thank you. Every month you delay costs you lakhs in retirement corpus.',
      ],
      hi: [
        '25 बनाम 35 पर ₹3,000/महीना 10% पर शुरू करें: 60 तक, जल्दी शुरू करने वाले के पास ₹68 लाख, देर से शुरू करने वाले के पास ₹22 लाख। यह 3 गुना ज्यादा है!',
        'जल्दी शुरू करने वालों को समान लक्ष्य तक पहुंचने के लिए हर महीने कम निवेश करना पड़ता है। समय सचमुच पैसा है।',
        'आपका भविष्य का स्वयं आपको धन्यवाद देगा। हर महीने की देरी आपके सेवानिवृत्ति कोष में लाखों की कमी करती है।',
      ],
      ml: [
        '25 vs 35 വയസ്സിൽ ₹3,000/മാസം 10%-ൽ തുടങ്ങിയാൽ: 60 ആകുമ്പോൾ നേരത്തെ തുടങ്ങിയവർക്ക് ₹68 ലക്ഷം, വൈകി തുടങ്ങിയവർക്ക് ₹22 ലക്ഷം. 3 മടങ്ങ് കൂടുതൽ!',
        'നേരത്തെ തുടങ്ങുന്നവർക്ക് അതേ ലക്ഷ്യത്തിലെത്താൻ ഓരോ മാസവും കുറവ് നിക്ഷേപിച്ചാൽ മതി. സമയം തന്നെയാണ് പണം.',
        'നിങ്ങളുടെ ഭാവി സ്വയം നിങ്ങൾക്ക് നന്ദി പറയും. ഓരോ മാസത്തെ കാലതാമസവും നിങ്ങളുടെ റിട്ടയർമെന്റ് ഫണ്ടിൽ ലക്ഷങ്ങൾ നഷ്ടപ്പെടുത്തുന്നു.',
      ],
    },
    quiz: [
      {
        question: { en: 'Starting 10 years earlier gives approx:', hi: '10 साल पहले शुरू करने से लगभग मिलता है:', ml: '10 വർഷം മുമ്പ് തുടങ്ങിയാൽ ഏകദേശം ലഭിക്കുന്നത്:' },
        options: {
          en: ['2x more', '3x more', 'Same amount'],
          hi: ['2 गुना ज्यादा', '3 गुना ज्यादा', 'समान राशि'],
          ml: ['2 മടങ്ങ് കൂടുതൽ', '3 മടങ്ങ് കൂടുതൽ', 'അതേ തുക'],
        },
        answer: 1,
      },
      {
        question: { en: 'Early starters need to invest:', hi: 'जल्दी शुरू करने वालों को निवेश करना होगा:', ml: 'നേരത്തെ തുടങ്ങുന്നവർക്ക് നിക്ഷേപിക്കേണ്ടത്:' },
        options: {
          en: ['More monthly', 'Less monthly', 'Same amount'],
          hi: ['ज्यादा मासिक', 'कम मासिक', 'समान राशि'],
          ml: ['കൂടുതൽ പ്രതിമാസം', 'കുറവ് പ്രതിമാസം', 'അതേ തുക'],
        },
        answer: 1,
      },
      {
        question: { en: 'Delaying NPS costs you:', hi: 'NPS में देरी करने से आपको:', ml: 'NPS വൈകിപ്പിക്കുന്നത് നിങ്ങൾക്ക്:' },
        options: {
          en: ['Nothing', 'Lakhs in corpus', 'Only tax benefits'],
          hi: ['कुछ नहीं', 'कोष में लाखों', 'केवल टैक्स लाभ'],
          ml: ['ഒന്നുമില്ല', 'ഫണ്ടിൽ ലക്ഷങ്ങൾ', 'നികുതി ആനുകൂല്യങ്ങൾ മാത്രം'],
        },
        answer: 1,
      },
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
      addXP(activeModule.xp, `learn:${activeModule.id}`);
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
    const contentTexts = txt(activeModule.content, lang) as string[];

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
                {contentTexts.map((text, i) => (
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
                <h2 className="mb-4 font-display text-lg font-bold text-foreground">
                  {(q.question[lang] || q.question.en)}
                </h2>
                <div className="space-y-3">
                  {(q.options[lang] || q.options.en).map((opt, i) => {
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

          <EducationalTopics lang={lang} />
        </div>

        <BottomNav />
      </div>
    </PageTransition>
  );
};

export default Learn;
