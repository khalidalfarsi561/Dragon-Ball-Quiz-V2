import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { CheckCircle2, XCircle, ArrowLeft, LogOut, Zap } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { useEffect, useState } from "react";

interface QuizResultPanelProps {
  isCorrect: boolean;
  explanation?: string;
  powerDiff: number;
  newPowerLevel: number;
  newStreak: number;
  onNext: () => void;
  onExit?: () => void;
  nextLabel?: string;
}

export default function QuizResultPanel({
  isCorrect,
  explanation,
  powerDiff,
  newPowerLevel,
  onNext,
  onExit,
  nextLabel = "السؤال التالي"
}: QuizResultPanelProps) {
  const count = useMotionValue(newPowerLevel - powerDiff);
  const rounded = useTransform(count, (latest) => formatNumber(Math.round(latest)));
  
  const [displayPower, setDisplayPower] = useState(formatNumber(newPowerLevel - powerDiff));

  useEffect(() => {
    const animation = animate(count, newPowerLevel, { 
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayPower(formatNumber(Math.round(latest)))
    });
    return animation.stop;
  }, [newPowerLevel, count]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-3xl p-6 sm:p-8 bg-slate-900 border border-slate-800 shadow-2xl shadow-black/40 space-y-8 relative overflow-hidden"
    >
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent opacity-50" />

      {/* Icon & Headline */}
      <div className="flex items-center gap-6">
        <motion.div 
          initial={{ rotate: -20, scale: 0.5 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
          className={cn(
            "p-4 rounded-2xl shrink-0 outline outline-4 outline-offset-4 shadow-2xl",
            isCorrect 
              ? "bg-green-500/20 text-green-400 outline-green-500/10 shadow-green-500/20" 
              : "bg-red-500/20 text-red-400 outline-red-500/10 shadow-red-500/20"
          )}
        >
          {isCorrect ? <CheckCircle2 size={42} /> : <XCircle size={42} />}
        </motion.div>
        <div className="space-y-1">
          <motion.h3 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={cn(
              "text-2xl sm:text-3xl font-black font-display tracking-tight",
              isCorrect ? "text-green-400" : "text-red-400"
            )}
          >
            {isCorrect ? 'إجابة مذهلة!' : 'لقد أخطأت الهدف!'}
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-slate-400 font-medium"
          >
            {isCorrect ? 'زادت قوتك القتالية!' : 'فقدت بعضاً من طاقتك'}
          </motion.p>
        </div>
      </div>

      {/* Explanation Box */}
      {explanation && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap size={40} className="text-orange-500" />
          </div>
          <p className="text-slate-300 leading-relaxed font-medium relative z-10">
            {explanation}
          </p>
        </motion.div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800 flex flex-col gap-1 items-center justify-center group relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest">تغير الطاقة</span>
          <span className={cn(
            "font-black font-display text-3xl tracking-tighter",
            powerDiff >= 0 ? "text-green-400" : "text-red-400"
          )}>
            {powerDiff >= 0 ? '+' : ''}{formatNumber(powerDiff)}
          </span>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800 flex flex-col gap-1 items-center justify-center relative overflow-hidden"
        >
          <motion.div 
            animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-orange-500/20 to-transparent pointer-events-none" 
          />
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest">الطاقة الحالية</span>
          <span className="font-black font-display text-3xl text-white tracking-widest font-mono">
            {displayPower}
          </span>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col sm:flex-row gap-4 pt-2"
      >
        <button 
          onClick={onNext}
          className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-yellow-600 hover:from-orange-600 hover:to-yellow-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-orange-950/20 active:scale-95 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
          <span className="relative z-10">{nextLabel}</span>
          <ArrowLeft size={20} className="relative z-10 transition-transform group-hover:-translate-x-1" />
        </button>
        
        {onExit && (
          <button 
            onClick={onExit}
            className="flex items-center justify-center gap-3 bg-slate-800/80 hover:bg-slate-800 text-slate-300 font-bold py-4 px-8 rounded-2xl transition-all active:scale-95 border border-slate-700/50"
          >
            <LogOut size={20} />
            <span>إنهاء</span>
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}
