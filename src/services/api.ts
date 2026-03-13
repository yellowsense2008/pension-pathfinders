/**
 * Mock API service layer — ready to swap with real backend endpoints.
 * Each function simulates network latency and returns typed data.
 */

export interface UserProfile {
  name: string;
  age: number;
  monthlyIncome: number;
  monthlyContribution: number;
  language: 'en' | 'hi';
  level: number;
  xp: number;
}

export interface ContributionData {
  totalContributions: number;
  currentCorpus: number;
  estimatedPension: number;
  lastContributionDate: string;
}

export interface ProjectionData {
  projectedCorpus: number;
  monthlyPension: number;
  yearsToRetirement: number;
  readinessScore: number; // 0-100
  readinessCategory: 'low' | 'moderate' | 'good' | 'excellent';
}

export interface StreakData {
  currentStreak: number;
  lastActivityDate: string;
  longestStreak: number;
  isActiveToday: boolean;
}

export interface MissionData {
  id: string;
  titleKey: string;
  descKey: string;
  xp: number;
  type: 'daily' | 'weekly';
  completed: boolean;
  syncState: 'synced' | 'pending' | 'failed';
  maintainsStreak: boolean;
}

export interface XPLedgerEntry {
  id: string;
  amount: number;
  source: string;
  sourceKey: string;
  timestamp: string;
}

export interface NudgeData {
  id: string;
  type: 'warning' | 'suggestion' | 'celebration';
  messageKey: string;
  messageParams?: Record<string, string>;
  actionKey?: string;
  actionRoute?: string;
}

// Simulate network delay
const delay = (ms = 600) => new Promise(resolve => setTimeout(resolve, ms + Math.random() * 400));

// Simulate random failures for testing error states (5% chance)
const maybeThrow = () => {
  if (Math.random() < 0.05) throw new Error('NETWORK_ERROR');
};

export async function fetchUserProfile(): Promise<UserProfile> {
  await delay();
  maybeThrow();
  const saved = localStorage.getItem('pensionquest-user');
  if (!saved) throw new Error('NO_USER');
  const u = JSON.parse(saved);
  return {
    name: u.name,
    age: u.age,
    monthlyIncome: u.monthlyIncome,
    monthlyContribution: u.monthlyContribution,
    language: u.language,
    level: u.level,
    xp: u.xp,
  };
}

export async function fetchContributions(): Promise<ContributionData> {
  await delay();
  maybeThrow();
  const saved = localStorage.getItem('pensionquest-user');
  const u = saved ? JSON.parse(saved) : null;
  const total = u?.totalContributions || 0;
  const monthly = u?.monthlyContribution || 2000;
  const age = u?.age || 25;
  const yearsLeft = Math.max(0, 60 - age);
  const months = yearsLeft * 12;
  const r = 0.08 / 12;
  const corpus = months > 0
    ? Math.round(monthly * ((Math.pow(1 + r, months) - 1) / r))
    : total;

  return {
    totalContributions: total,
    currentCorpus: Math.round(total * 1.08), // simulated growth
    estimatedPension: Math.round((corpus * 0.04) / 12),
    lastContributionDate: new Date(Date.now() - 5 * 86400000).toISOString(),
  };
}

export async function fetchProjection(): Promise<ProjectionData> {
  await delay(400);
  maybeThrow();
  const saved = localStorage.getItem('pensionquest-user');
  const u = saved ? JSON.parse(saved) : null;
  const age = u?.age || 25;
  const monthly = u?.monthlyContribution || 2000;
  const yearsLeft = Math.max(0, 60 - age);
  const months = yearsLeft * 12;
  const r = 0.08 / 12;
  const corpus = months > 0
    ? Math.round(monthly * ((Math.pow(1 + r, months) - 1) / r))
    : monthly * months;

  // Readiness score: based on contribution-to-income ratio and years left
  const income = u?.monthlyIncome || 30000;
  const ratio = monthly / income;
  let score = Math.min(100, Math.round(ratio * 300 + yearsLeft * 1.5));
  score = Math.max(5, Math.min(100, score));

  const category: ProjectionData['readinessCategory'] =
    score >= 80 ? 'excellent' : score >= 60 ? 'good' : score >= 35 ? 'moderate' : 'low';

  return {
    projectedCorpus: corpus,
    monthlyPension: Math.round((corpus * 0.04) / 12),
    yearsToRetirement: yearsLeft,
    readinessScore: score,
    readinessCategory: category,
  };
}

export async function fetchStreak(): Promise<StreakData> {
  await delay(300);
  maybeThrow();
  const saved = localStorage.getItem('pensionquest-user');
  const u = saved ? JSON.parse(saved) : null;
  return {
    currentStreak: u?.streak || 0,
    lastActivityDate: new Date(Date.now() - 86400000).toISOString(),
    longestStreak: Math.max(u?.streak || 0, 6),
    isActiveToday: Math.random() > 0.3,
  };
}

export async function fetchMissions(): Promise<MissionData[]> {
  await delay(500);
  maybeThrow();
  const saved = localStorage.getItem('pensionquest-user');
  const u = saved ? JSON.parse(saved) : null;
  const completed = u?.completedMissions || [];

  const missions = [
    { id: 'mission-1', titleKey: 'learn-compounding', descKey: 'learn-compounding', xp: 50, type: 'daily' as const, maintainsStreak: true },
    { id: 'mission-2', titleKey: 'nps-tier-quiz', descKey: 'nps-tier-quiz', xp: 100, type: 'daily' as const, maintainsStreak: true },
    { id: 'mission-3', titleKey: 'simulate-growth', descKey: 'simulate-growth', xp: 75, type: 'daily' as const, maintainsStreak: false },
    { id: 'mission-4', titleKey: 'log-contribution', descKey: 'log-contribution', xp: 150, type: 'weekly' as const, maintainsStreak: true },
    { id: 'mission-5', titleKey: 'tax-benefits', descKey: 'tax-benefits', xp: 80, type: 'weekly' as const, maintainsStreak: false },
    { id: 'mission-6', titleKey: 'share-friend', descKey: 'share-friend', xp: 200, type: 'weekly' as const, maintainsStreak: false },
  ];

  return missions.map(m => ({
    ...m,
    completed: completed.includes(m.id),
    syncState: 'synced' as const,
  }));
}

export async function fetchXPLedger(): Promise<XPLedgerEntry[]> {
  await delay(400);
  maybeThrow();
  const now = Date.now();
  return [
    { id: '1', amount: 50, source: 'Mission: Learn Compounding', sourceKey: 'xpLedger.mission', timestamp: new Date(now - 3600000).toISOString() },
    { id: '2', amount: 75, source: 'Simulator Used', sourceKey: 'xpLedger.simulator', timestamp: new Date(now - 86400000).toISOString() },
    { id: '3', amount: 100, source: 'Quiz Completed', sourceKey: 'xpLedger.quiz', timestamp: new Date(now - 172800000).toISOString() },
    { id: '4', amount: 150, source: 'Log Contribution', sourceKey: 'xpLedger.contribution', timestamp: new Date(now - 259200000).toISOString() },
    { id: '5', amount: 200, source: 'Share with Friend', sourceKey: 'xpLedger.share', timestamp: new Date(now - 345600000).toISOString() },
  ];
}

export async function fetchNudges(): Promise<NudgeData[]> {
  await delay(350);
  const saved = localStorage.getItem('pensionquest-user');
  const u = saved ? JSON.parse(saved) : null;
  const nudges: NudgeData[] = [];

  // Check if contribution is low
  const monthly = u?.monthlyContribution || 2000;
  const income = u?.monthlyIncome || 30000;
  if (monthly / income < 0.1) {
    nudges.push({
      id: 'nudge-increase',
      type: 'suggestion',
      messageKey: 'nudge.increaseContribution',
      messageParams: { amount: '500' },
      actionKey: 'nudge.adjustNow',
      actionRoute: '/snapshot',
    });
  }

  // Streak at risk
  const streak = u?.streak || 0;
  if (streak > 0) {
    nudges.push({
      id: 'nudge-streak',
      type: 'warning',
      messageKey: 'nudge.streakAtRisk',
      actionKey: 'nudge.completeMission',
      actionRoute: '/missions',
    });
  }

  // Celebration
  if (streak >= 3) {
    nudges.push({
      id: 'nudge-celebrate',
      type: 'celebration',
      messageKey: 'nudge.streakCelebration',
      messageParams: { count: String(streak) },
    });
  }

  return nudges;
}
