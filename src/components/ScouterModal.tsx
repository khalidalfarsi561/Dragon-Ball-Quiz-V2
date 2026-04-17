'use client';

import { useState } from 'react';
import { Target, X } from 'lucide-react';
import { cn, formatNumber } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface ScouterModalProps {
  powerLevel: number;
}

export default function ScouterModal({ powerLevel }: ScouterModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-green-500/10 text-green-400 hover:bg-green-500/20 px-4 py-2 rounded-xl transition-colors font-bold border border-green-500/30"
      >
        <Target size={18} />
        <span>قياس الطاقة (Scouter)</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-green-950/80 border-2 border-green-500/50 rounded-full w-64 h-64 flex flex-col items-center justify-center relative shadow-[0_0_50px_rgba(34,197,94,0.3)] z-10"
              style={{
                boxShadow: 'inset 0 0 40px rgba(34,197,94,0.2), 0 0 50px rgba(34,197,94,0.3)'
              }}
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-green-500 hover:text-green-300 transition-colors"
              >
                <X size={24} />
              </button>

              <div className="text-green-500 font-mono text-sm mb-2 opacity-80 tracking-widest">
                TARGET AQ.
              </div>
              <div className="text-4xl font-black font-mono text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]">
                {formatNumber(powerLevel)}
              </div>
              
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="none" stroke="#22c55e" strokeWidth="1" strokeDasharray="4 4" />
                <path d="M 50 10 L 50 90 M 10 50 L 90 50" stroke="#22c55e" strokeWidth="0.5" />
              </svg>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
