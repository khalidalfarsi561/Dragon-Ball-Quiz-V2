import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

interface QuizWarmupOverlayProps {
  open: boolean;
  seconds?: number;
  onComplete: () => void;
}

export default function QuizWarmupOverlay({ 
  open, 
  seconds = 3, 
  onComplete 
}: QuizWarmupOverlayProps) {
  const [count, setCount] = useState(seconds);

  useEffect(() => {
    if (!open) return;
    if (count <= 0) {
      const timer = setTimeout(onComplete, 500);
      return () => clearTimeout(timer);
    }

    const interval = setInterval(() => {
      setCount(c => c - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [open, count, onComplete]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md"
        >
          <div className="text-center space-y-8">
            <motion.h3 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-2xl font-black text-slate-400 font-display"
            >
              استعد للتحدي
            </motion.h3>
            
            <motion.div 
              key={count}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-8xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-orange-400 to-yellow-600 font-display drop-shadow-[0_0_20px_rgba(249,115,22,0.5)]"
            >
              {count > 0 ? count : "انطلق!"}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
