import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Lightbulb, PartyPopper } from 'lucide-react';
import { motion } from 'framer-motion';
import type { NudgeData } from '@/services/api';

const iconMap = {
  warning: AlertTriangle,
  suggestion: Lightbulb,
  celebration: PartyPopper,
};

const styleMap = {
  warning: 'border-l-destructive bg-destructive/5',
  suggestion: 'border-l-primary bg-primary/5',
  celebration: 'border-l-success bg-success/5',
};

interface NudgeCardProps {
  nudge: NudgeData;
  message: string;
  actionLabel?: string;
}

const NudgeCard = ({ nudge, message, actionLabel }: NudgeCardProps) => {
  const navigate = useNavigate();
  const Icon = iconMap[nudge.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-start gap-3 rounded-xl border-l-4 p-3 ${styleMap[nudge.type]}`}
    >
      <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
      <div className="flex-1">
        <p className="text-xs font-medium text-foreground">{message}</p>
        {nudge.actionRoute && actionLabel && (
          <button
            onClick={() => navigate(nudge.actionRoute!)}
            className="mt-1.5 text-xs font-semibold text-primary tap-scale"
          >
            {actionLabel} →
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default NudgeCard;
