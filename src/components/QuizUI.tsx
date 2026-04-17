'use client';

import { useState, useEffect } from 'react';
import { submitAnswer } from '@/actions/quiz';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import TimerBadge from './TimerBadge';
import { motion, AnimatePresence } from 'motion/react';

interface QuizUIProps {
  question: {
    id: string;
    content: string;
    options: string[];
    series_slug: string;
    difficulty_tier: number;
  };
  token: string;
  durationSeconds: number;
  initialPowerLevel: number;
}

export default function QuizUI({ question, token, durationSeconds, initialPowerLevel }: QuizUIProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const router = useRouter();
  
  const submit = async (index: number) => {
    setIsSubmitting(true);
    setSelectedIdx(index);
    try {
      const res = await submitAnswer(token, index);
      if (res.error) {
        toast.error(res.error);
      } else {
        setResult(res);
      }
    } catch {
      toast.error('حدث رمز خطأ غير معروف');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (result || timeLeft <= 0) return;
    
    const handleTimeOut = async () => {
      if (isSubmitting || result) return;
      toast.error('انتهى الوقت!');
      await submit(-1);
    };

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timeLeft, result, isSubmitting]);

  const getOptionState = (idx: number) => {
    if (!result) {
      return selectedIdx === idx ? 'selected' : 'default';
    }
    if (result.correctAnswerIndex === idx) return 'correct';
    if (selectedIdx === idx && !result.isCorrect) return 'wrong';
    return 'disabled';
  };

  const powerDiff = result ? result.newPowerLevel - initialPowerLevel : 0;
  // Calculate relative percentages for the progress bar
  const totalBarValue = result ? Math.max(initialPowerLevel, result.newPowerLevel) * 1.1 : initialPowerLevel * 1.1;
  const initialPercent = totalBarValue > 0 ? (initialPowerLevel / totalBarValue) * 100 : 0;
  const newPercent = result && totalBarValue > 0 ? (result.newPowerLevel / totalBarValue) * 100 : initialPercent;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
      {!result && (
        <div className="absolute top-0 inset-x-0 h-1.5 bg-slate-800">
          <motion.div 
            initial={{ width: '100%' }}
            animate={{ width: `${(timeLeft / durationSeconds) * 100}%` }}
            transition={{ duration: 1, ease: 'linear' }}
            className={cn(
              "h-full",
              timeLeft > 10 ? 'bg-orange-500' : 'bg-red-500'
            )}
          />
        </div>
      )}

      <div className="flex justify-between items-center mb-8 pt-4">
        <span className="bg-slate-800 text-slate-300 text-xs font-bold px-3 py-1.5 rounded-full">
          الصعوبة: المستوى {question.difficulty_tier}
        </span>
        {!result && <TimerBadge timeLeft={timeLeft} />}
      </div>
      
      <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-8 leading-relaxed">
        {question.content}
      </h2>

      <div className="space-y-4 mb-8">
        {question.options.map((opt, idx) => {
          const state = getOptionState(idx);
          return (
            <button
              key={idx}
              disabled={isSubmitting || !!result}
              onClick={() => submit(idx)}
              className={cn(
                "w-full text-right p-4 sm:p-5 rounded-2xl border-2 transition-all font-medium text-lg",
                state === 'default' && "border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-200 hover:border-slate-600",
                state === 'selected' && "border-orange-500 bg-orange-500/10 text-orange-400",
                state === 'correct' && "border-green-500 bg-green-500/20 text-green-400",
                state === 'wrong' && "border-red-500 bg-red-500/20 text-red-500",
                state === 'disabled' && "border-slate-800 bg-slate-900/30 text-slate-600 opacity-50 cursor-not-allowed"
              )}
            >
              <div className="flex items-center justify-between">
                <span>{opt}</span>
                {state === 'correct' && <CheckCircle2 className="text-green-500" />}
                {state === 'wrong' && <XCircle className="text-red-500" />}
                {isSubmitting && state === 'selected' && <Loader2 className="animate-spin text-orange-500" />}
              </div>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-6 bg-slate-800/80 border border-slate-700"
          >
            <div className="flex items-start gap-4">
              <div className={cn(
                "p-3 rounded-full shrink-0",
                result.isCorrect ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
              )}>
                {result.isCorrect ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={cn(
                  "font-bold font-display text-xl mb-2",
                  result.isCorrect ? "text-green-400" : "text-red-400"
                )}>
                  {result.isCorrect ? 'إجابة مذهلة!' : 'لقد أخطأت الهدف!'}
                </h3>
                <p className="text-slate-300 leading-relaxed mb-6">
                  {result.explanation}
                </p>

                {/* Animated Power Level Progress Bar */}
                <div className="mb-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold text-slate-400">مستوى الطاقة</span>
                    <div className="flex flex-col items-end" dir="ltr">
                      <span className={cn(
                        "text-xs font-bold mb-1",
                        powerDiff > 0 ? "text-green-400" : "text-red-400"
                      )}>
                        {powerDiff > 0 ? '+' : ''}{formatNumber(powerDiff)}
                      </span>
                      <span className="font-mono text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500">
                        {formatNumber(result.newPowerLevel)}
                      </span>
                    </div>
                  </div>
                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden relative" dir="ltr">
                    {/* The base bar (initial power) */}
                    <motion.div 
                      className="absolute top-0 bottom-0 left-0 bg-slate-600 rounded-full"
                      initial={{ width: `${initialPercent}%` }}
                      animate={{ 
                        width: powerDiff < 0 ? `${newPercent}%` : `${initialPercent}%`,
                        opacity: powerDiff < 0 ? 0.5 : 1
                      }}
                      transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
                    />
                    {/* The change bar (increase or decrease overlay) */}
                    <motion.div 
                      className={cn(
                        "absolute top-0 bottom-0 rounded-full",
                        powerDiff > 0 ? "bg-green-500" : "bg-red-500"
                      )}
                      initial={{ 
                        left: powerDiff > 0 ? `${initialPercent}%` : `${newPercent}%`,
                        width: powerDiff > 0 ? '0%' : `${initialPercent - newPercent}%`
                      }}
                      animate={{ 
                        width: powerDiff > 0 ? `${newPercent - initialPercent}%` : '0%',
                        opacity: powerDiff > 0 ? 1 : 0
                      }}
                      transition={{ duration: 1, ease: "easeInOut", delay: 0.5 }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm font-bold mt-4">
                  <div className="bg-slate-900 px-4 py-2 rounded-lg text-yellow-500 border border-slate-800">
                    المتتالية: {result.newStreak}🔥
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-white text-slate-950 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors"
            >
              <span>السؤال التالي</span>
              <ArrowLeft size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function formatNumber(num: number) {
  return new Intl.NumberFormat('en-US').format(num);
}
