import { motion } from "motion/react";
import { CheckCircle2, XCircle, ArrowLeft, LogOut, Zap } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";

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
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-3xl p-6 sm:p-8 bg-slate-900 border border-slate-800 shadow-2xl space-y-8"
    >
      {/* Icon & Headline */}
      <div className="flex items-center gap-6">
        <div className={cn(
          "p-4 rounded-2xl shrink-0 outline outline-4 outline-offset-4",
          isCorrect 
            ? "bg-green-500/20 text-green-400 outline-green-500/10" 
            : "bg-red-500/20 text-red-400 outline-red-500/10"
        )}>
          {isCorrect ? <CheckCircle2 size={42} /> : <XCircle size={42} />}
        </div>
        <div className="space-y-1">
          <h3 className={cn(
            "text-2xl sm:text-3xl font-black font-display tracking-tight",
            isCorrect ? "text-green-400" : "text-red-400"
          )}>
            {isCorrect ? 'إجابة مذهلة!' : 'لقد أخطأت الهدف!'}
          </h3>
          <p className="text-slate-400 font-medium">
            {isCorrect ? 'زادت قوتك القتالية!' : 'فقدت بعضاً من طاقتك'}
          </p>
        </div>
      </div>

      {/* Explanation Box */}
      {explanation && (
        <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap size={40} className="text-orange-500" />
          </div>
          <p className="text-slate-300 leading-relaxed font-medium relative z-10">
            {explanation}
          </p>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 flex justify-between items-center group">
          <span className="text-sm font-bold text-slate-500">تغير الطاقة</span>
          <span className={cn(
            "font-black font-display text-lg tracking-tighter",
            powerDiff >= 0 ? "text-green-400" : "text-red-400"
          )}>
            {powerDiff >= 0 ? '+' : ''}{formatNumber(powerDiff)}
          </span>
        </div>
        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
          <span className="text-sm font-bold text-slate-500">الطاقة الحالية</span>
          <span className="font-black font-display text-lg text-white tracking-tighter">
            {formatNumber(newPowerLevel)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <button 
          onClick={onNext}
          className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-yellow-600 hover:from-orange-600 hover:to-yellow-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg active:scale-95 group"
        >
          <span>{nextLabel}</span>
          <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
        </button>
        
        {onExit && (
          <button 
            onClick={onExit}
            className="flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-4 px-8 rounded-2xl transition-all active:scale-95"
          >
            <LogOut size={20} />
            <span>إنهاء</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}
