import { useUser, getXPForLevel, getLevelName } from '@/contexts/UserContext';
import { Zap } from 'lucide-react';

const XPProgressBar = () => {
  const { user } = useUser();
  const xpNeeded = getXPForLevel(user.level);
  const progress = Math.min((user.xp / xpNeeded) * 100, 100);

  return (
    <div className="game-card flex items-center gap-3">
      <div className="level-badge flex-shrink-0">
        <Zap size={14} />
        Lv.{user.level}
      </div>
      <div className="flex-1">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground">{getLevelName(user.level)}</span>
          <span className="text-xs text-muted-foreground">{user.xp}/{xpNeeded} XP</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full gradient-xp transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default XPProgressBar;
