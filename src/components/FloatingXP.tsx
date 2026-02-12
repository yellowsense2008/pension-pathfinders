import { motion, AnimatePresence } from 'framer-motion';

interface FloatingXPProps {
  amount: number;
  show: boolean;
}

const FloatingXP = ({ amount, show }: FloatingXPProps) => (
  <AnimatePresence>
    {show && (
      <motion.span
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 0, y: -32 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="absolute -top-2 right-0 text-sm font-bold pointer-events-none"
        style={{ color: 'hsl(45, 100%, 50%)' }}
      >
        +{amount} XP
      </motion.span>
    )}
  </AnimatePresence>
);

export default FloatingXP;
