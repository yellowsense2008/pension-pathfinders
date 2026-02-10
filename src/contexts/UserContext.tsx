import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface UserData {
  name: string;
  age: number;
  monthlyIncome: number;
  monthlyContribution: number;
  language: 'en' | 'hi';
  xp: number;
  level: number;
  streak: number;
  totalContributions: number;
  completedMissions: string[];
  completedModules: string[];
  unlockedBadges: string[];
  onboarded: boolean;
}

const defaultUser: UserData = {
  name: '',
  age: 25,
  monthlyIncome: 30000,
  monthlyContribution: 2000,
  language: 'en',
  xp: 1250,
  level: 3,
  streak: 4,
  totalContributions: 48000,
  completedMissions: ['mission-1', 'mission-3'],
  completedModules: ['what-is-nps'],
  unlockedBadges: ['first-contribution', '3-month-streak'],
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

interface UserContextType {
  user: UserData;
  setUser: React.Dispatch<React.SetStateAction<UserData>>;
  addXP: (amount: number) => void;
  completeMission: (id: string) => void;
  completeModule: (id: string) => void;
  unlockBadge: (id: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData>(() => {
    const saved = localStorage.getItem('pensionquest-user');
    return saved ? JSON.parse(saved) : defaultUser;
  });

  const save = (u: UserData) => {
    localStorage.setItem('pensionquest-user', JSON.stringify(u));
    return u;
  };

  const addXP = (amount: number) => {
    setUser(prev => {
      const newXP = prev.xp + amount;
      const xpNeeded = getXPForLevel(prev.level);
      const newLevel = newXP >= xpNeeded ? prev.level + 1 : prev.level;
      return save({ ...prev, xp: newXP >= xpNeeded ? newXP - xpNeeded : newXP, level: newLevel });
    });
  };

  const completeMission = (id: string) => {
    setUser(prev => {
      if (prev.completedMissions.includes(id)) return prev;
      return save({ ...prev, completedMissions: [...prev.completedMissions, id] });
    });
  };

  const completeModule = (id: string) => {
    setUser(prev => {
      if (prev.completedModules.includes(id)) return prev;
      return save({ ...prev, completedModules: [...prev.completedModules, id] });
    });
  };

  const unlockBadge = (id: string) => {
    setUser(prev => {
      if (prev.unlockedBadges.includes(id)) return prev;
      return save({ ...prev, unlockedBadges: [...prev.unlockedBadges, id] });
    });
  };

  return (
    <UserContext.Provider value={{ user, setUser, addXP, completeMission, completeModule, unlockBadge }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
};
