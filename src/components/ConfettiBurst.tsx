import { motion, AnimatePresence } from 'framer-motion';

const particles = Array.from({ length: 12 }, (_, i) => {
  const angle = (i / 12) * 360;
  const rad = (angle * Math.PI) / 180;
  return {
    x: Math.cos(rad) * (30 + Math.random() * 20),
    y: Math.sin(rad) * (30 + Math.random() * 20),
    color: ['hsl(168,60%,42%)', 'hsl(35,95%,55%)', 'hsl(45,100%,50%)', 'hsl(260,55%,58%)'][i % 4],
    size: 4 + Math.random() * 3,
  };
});

const ConfettiBurst = ({ show }: { show: boolean }) => (
  <AnimatePresence>
    {show && (
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{ opacity: 0, x: p.x, y: p.y, scale: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute rounded-full"
            style={{ width: p.size, height: p.size, background: p.color }}
          />
        ))}
      </div>
    )}
  </AnimatePresence>
);

export default ConfettiBurst;
