export const translations = {
  en: {
    // Onboarding
    'onboarding.title': 'Start Your Retirement Game Early',
    'onboarding.subtitle': 'Turn pension planning into an exciting journey',
    'onboarding.age': 'Your Age',
    'onboarding.income': 'Monthly Income (₹)',
    'onboarding.contribution': 'Monthly NPS Contribution (₹)',
    'onboarding.contributionHint': 'Optional — you can set this later',
    'onboarding.cta': 'Start My Pension Journey',
    'onboarding.footer': '🔒 Secure & compliant architecture ready • API-ready for NPS ecosystem',
    'onboarding.years': 'years',
    'onboarding.language': 'Language',

    // Dashboard
    'dashboard.welcome': 'Welcome back 👋',
    'dashboard.hero': 'Pension Hero',
    'dashboard.totalSaved': 'Total Saved',
    'dashboard.streak': 'Streak',
    'dashboard.months': 'Months 🔥',
    'dashboard.retirementAt': 'Retirement at',
    'dashboard.projectedCorpus': 'Projected corpus',
    'dashboard.yearsLeft': 'years left',
    'dashboard.quickActions': 'Quick Actions',
    'dashboard.todaysMission': "Today's Mission",
    'dashboard.takeQuiz': 'Take a Quiz',
    'dashboard.viewRewards': 'View Rewards',
    'dashboard.simulateGrowth': 'Simulate Growth',
    'dashboard.developedBy': 'Developed by YellowSense Technologies Pvt Ltd',
    'dashboard.logout': 'Logout',

    // Bottom Nav
    'nav.home': 'Home',
    'nav.missions': 'Missions',
    'nav.learn': 'Learn',
    'nav.simulate': 'Simulate',
    'nav.rewards': 'Rewards',
  },
  hi: {
    // Onboarding
    'onboarding.title': 'अपनी सेवानिवृत्ति की योजना जल्दी शुरू करें',
    'onboarding.subtitle': 'पेंशन योजना को एक रोमांचक यात्रा में बदलें',
    'onboarding.age': 'आपकी उम्र',
    'onboarding.income': 'मासिक आय (₹)',
    'onboarding.contribution': 'मासिक NPS योगदान (₹)',
    'onboarding.contributionHint': 'वैकल्पिक — आप इसे बाद में सेट कर सकते हैं',
    'onboarding.cta': 'मेरी पेंशन यात्रा शुरू करें',
    'onboarding.footer': '🔒 सुरक्षित और अनुपालन वास्तुकला तैयार • NPS पारिस्थितिकी तंत्र के लिए API-तैयार',
    'onboarding.years': 'वर्ष',
    'onboarding.language': 'भाषा',

    // Dashboard
    'dashboard.welcome': 'वापस स्वागत है 👋',
    'dashboard.hero': 'पेंशन हीरो',
    'dashboard.totalSaved': 'कुल बचत',
    'dashboard.streak': 'स्ट्रीक',
    'dashboard.months': 'महीने 🔥',
    'dashboard.retirementAt': 'सेवानिवृत्ति',
    'dashboard.projectedCorpus': 'अनुमानित कोष',
    'dashboard.yearsLeft': 'साल शेष',
    'dashboard.quickActions': 'त्वरित कार्य',
    'dashboard.todaysMission': 'आज का मिशन',
    'dashboard.takeQuiz': 'क्विज़ लें',
    'dashboard.viewRewards': 'पुरस्कार देखें',
    'dashboard.simulateGrowth': 'विकास सिमुलेट करें',
    'dashboard.developedBy': 'YellowSense Technologies Pvt Ltd द्वारा विकसित',
    'dashboard.logout': 'लॉग आउट',

    // Bottom Nav
    'nav.home': 'होम',
    'nav.missions': 'मिशन',
    'nav.learn': 'सीखें',
    'nav.simulate': 'सिमुलेट',
    'nav.rewards': 'पुरस्कार',
  },
} as const;

export type Language = 'en' | 'hi';
export type TranslationKey = keyof typeof translations.en;

export const t = (lang: Language, key: TranslationKey): string => {
  return translations[lang][key] || translations.en[key] || key;
};
