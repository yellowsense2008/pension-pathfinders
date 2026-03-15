import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';

// ─── XP Ledger ───
export interface XPLedgerEntry {
  id: string;
  action: string;
  xp: number;
  timestamp: string;
}

// ─── Core user data persisted to localStorage ───
export interface UserData {
  name: string;
  age: number;
  monthlyIncome: number;
  monthlyContribution: number;
  language: 'en' | 'hi' | 'ml';
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string | null;
  totalContributions: number;
  completedMissions: string[];
  completedModules: string[];
  unlockedBadges: string[];
  xpLedger: XPLedgerEntry[];
  onboarded: boolean;
}

// ─── Derived financial state (computed, never stored) ───
export interface PensionState {
  yearsToRetirement: number;
  totalMonths: number;
  expectedReturn: number;
  monthlyRate: number;
  projectedCorpus: number;
  totalInvested: number;
  estimatedMonthlyPension: number;
  retirementReadinessScore: number;
  readinessCategory: 'low' | 'moderate' | 'good' | 'excellent';
}

const STORAGE_KEY = 'pensionquest-user';

const defaultUser: UserData = {
  name: '',
  age: 25,
  monthlyIncome: 0,
  monthlyContribution: 0,
  language: 'en',
  xp: 0,
  level: 1,
  streak: 0,
  lastActiveDate: null,
  totalContributions: 0,
  completedMissions: [],
  completedModules: [],
  unlockedBadges: [],
  xpLedger: [],
  onboarded: false,
};

const levelNames: Record<number, string> = {
  1: 'Pension Newbie',
  2: 'Savings Starter',
  3: 'Smart Saver',
  4: 'Growth Guru',
  5: 'Retirement Planner',
  6: 'Wealth Builder',
  7: 'Financial Champion',
  8: 'Pension Master',
  9: 'NPS Legend',
  10: 'Retirement Titan',
};

export const getLevelName = (level: number) => levelNames[level] || 'Pension Master';
export const getXPForLevel = (level: number) => level * 500;

// ─── Financial calculation helpers ───
function computeSIPCorpus(monthlyContribution: number, monthlyRate: number, months: number): number {
  if (monthlyContribution <= 0 || months <= 0) return 0;
  return Math.round(monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate));
}

function computeReadiness(contribution: number, income: number, yearsLeft: number, pension: number): number {
  if (income <= 0) return 0;
  if (contribution <= 0) return 0;
  const targetContribution = 0.1 * income;
  const score = Math.min(
    100,
    Math.round(
      (contribution / targetContribution) * 50 +
      (yearsLeft / 35) * 30 +
      (pension / income) * 20
    )
  );
  return Math.max(0, score);
}

function getReadinessCategory(score: number): PensionState['readinessCategory'] {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 35) return 'moderate';
  return 'low';
}

// ─── Streak helpers ───
function isSameDay(d1: Date, d2: Date) {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}

function isYesterday(d1: Date, today: Date) {
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(d1, yesterday);
}

// ─── Context type ───
interface UserContextType {
  user: UserData;
  pension: PensionState;
  setUser: React.Dispatch<React.SetStateAction<UserData>>;
  addXP: (amount: number, action: string) => void;
  completeMission: (id: string) => void;
  undoMission: (id: string) => void;
  completeModule: (id: string) => void;
  unlockBadge: (id: string) => void;
  recordActivity: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure new fields exist for existing users
        return {
          ...defaultUser,
          ...parsed,
          xpLedger: parsed.xpLedger || [],
          lastActiveDate: parsed.lastActiveDate || null,
        };
      } catch {
        return defaultUser;
      }
    }
    return defaultUser;
  });

  const save = useCallback((u: UserData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    return u;
  }, []);

  // ─── Derived financial state ───
  const pension = useMemo<PensionState>(() => {
    const expectedReturn = 0.08;
    const monthlyRate = expectedReturn / 12;
    const yearsToRetirement = Math.max(0, 60 - user.age);
    const totalMonths = yearsToRetirement * 12;
    const projectedCorpus = computeSIPCorpus(user.monthlyContribution, monthlyRate, totalMonths);
    const totalInvested = user.monthlyContribution * totalMonths;
    const estimatedMonthlyPension = projectedCorpus > 0 ? Math.round((projectedCorpus * 0.04) / 12) : 0;
    const retirementReadinessScore = computeReadiness(
      user.monthlyContribution,
      user.monthlyIncome,
      yearsToRetirement,
      estimatedMonthlyPension,
    );
    const readinessCategory = getReadinessCategory(retirementReadinessScore);

    return {
      yearsToRetirement,
      totalMonths,
      expectedReturn,
      monthlyRate,
      projectedCorpus,
      totalInvested,
      estimatedMonthlyPension,
      retirementReadinessScore,
      readinessCategory,
    };
  }, [user.age, user.monthlyContribution, user.monthlyIncome]);

  // ─── Record activity (streak) ───
  const recordActivity = useCallback(() => {
    setUser(prev => {
      const today = new Date();
      const last = prev.lastActiveDate ? new Date(prev.lastActiveDate) : null;

      if (last && isSameDay(last, today)) return prev; // already recorded today

      let newStreak = 1;
      if (last && isYesterday(last, today)) {
        newStreak = prev.streak + 1;
      }
      // If gap > 1 day, streak resets to 1

      return save({ ...prev, streak: newStreak, lastActiveDate: today.toISOString() });
    });
  }, [save]);

  // ─── XP with ledger ───
  const addXP = useCallback((amount: number, action: string) => {
    setUser(prev => {
      const entry: XPLedgerEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        action,
        xp: amount,
        timestamp: new Date().toISOString(),
      };
      const newXP = prev.xp + amount;
      const xpNeeded = getXPForLevel(prev.level);
      const levelsUp = newXP >= xpNeeded;
      const finalXP = levelsUp ? newXP - xpNeeded : newXP;
      const finalLevel = levelsUp ? prev.level + 1 : prev.level;

      return save({
        ...prev,
        xp: finalXP,
        level: finalLevel,
        xpLedger: [entry, ...prev.xpLedger].slice(0, 100), // keep last 100
      });
    });
    recordActivity();
  }, [save, recordActivity]);

  const completeMission = useCallback((id: string) => {
    setUser(prev => {
      if (prev.completedMissions.includes(id)) return prev;
      return save({ ...prev, completedMissions: [...prev.completedMissions, id] });
    });
    recordActivity();
  }, [save, recordActivity]);

  const undoMission = useCallback((id: string) => {
    setUser(prev => {
      if (!prev.completedMissions.includes(id)) return prev;
      // Also remove XP ledger entry for this mission
      const ledger = prev.xpLedger.filter(e => !e.action.includes(id));
      return save({
        ...prev,
        completedMissions: prev.completedMissions.filter(m => m !== id),
        xpLedger: ledger,
      });
    });
  }, [save]);

  const completeModule = useCallback((id: string) => {
    setUser(prev => {
      if (prev.completedModules.includes(id)) return prev;
      return save({ ...prev, completedModules: [...prev.completedModules, id] });
    });
    recordActivity();
  }, [save, recordActivity]);

  const unlockBadge = useCallback((id: string) => {
    setUser(prev => {
      if (prev.unlockedBadges.includes(id)) return prev;
      return save({ ...prev, unlockedBadges: [...prev.unlockedBadges, id] });
    });
  }, [save]);

  return (
    <UserContext.Provider value={{ user, pension, setUser, addXP, completeMission, undoMission, completeModule, unlockBadge, recordActivity }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
};
