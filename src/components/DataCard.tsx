import { ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface DataCardProps {
  loading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  empty?: boolean;
  emptyMessage?: string;
  className?: string;
  children: ReactNode;
}

export const DataCardSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={`game-card space-y-3 ${className}`}>
    <Skeleton className="h-3 w-24" />
    <Skeleton className="h-7 w-32" />
    <Skeleton className="h-3 w-40" />
  </div>
);

export const DataCardError = ({
  onRetry,
  message,
}: {
  onRetry?: () => void;
  message?: string;
}) => (
  <div className="game-card flex flex-col items-center gap-2 py-6 text-center">
    <AlertCircle className="h-6 w-6 text-destructive" />
    <p className="text-xs text-muted-foreground">{message || 'Something went wrong'}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-foreground tap-scale"
      >
        <RefreshCw className="h-3 w-3" />
        Retry
      </button>
    )}
  </div>
);

export const DataCardEmpty = ({ message }: { message: string }) => (
  <div className="game-card flex flex-col items-center gap-2 py-8 text-center">
    <p className="text-sm text-muted-foreground">{message}</p>
  </div>
);

const DataCard = ({ loading, error, onRetry, empty, emptyMessage, className = '', children }: DataCardProps) => {
  if (loading) return <DataCardSkeleton className={className} />;
  if (error) return <DataCardError onRetry={onRetry} />;
  if (empty) return <DataCardEmpty message={emptyMessage || 'No data available'} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default DataCard;
