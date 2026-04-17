'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { submitAnswer } from '@/actions/quiz';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { QUIZ_TOTAL_STEPS, QUIZ_WARMUP_SECONDS, FIRST_QUESTION_NO_TIMER, DBQ_SESSION_SERIES_KEY, DBQ_SESSION_STEP_KEY, DBQ_SESSION_STARTED_AT_KEY } from '@/lib/ux';

import QuizWarmupOverlay from './quiz/QuizWarmupOverlay';
import QuizSessionHeader from './quiz/QuizSessionHeader';
import QuizResultPanel from './quiz/QuizResultPanel';

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
  userStreak: number;
  seriesTitle: string;
  userDisplayName: string;
}

type QuizSubmitSuccess = {
  success: true;
  isCorrect: boolean;
  correctAnswerIndex: number;
  explanation: string;
  newPowerLevel: number;
  newStreak: number;
};

type QuizSubmitError = {
  error: string;
};

type QuizSubmitResponse = QuizSubmitSuccess | QuizSubmitError;

export default function QuizUI({ 
  question, 
  token, 
  durationSeconds, 
  initialPowerLevel, 
  userStreak,
  seriesTitle,
  userDisplayName
}: QuizUIProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<QuizSubmitSuccess | null>(null);
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [warmupDone, setWarmupDone] = useState(false);
  const hasSubmittedRef = useRef(false);
  const router = useRouter();

  // Session Helpers
  const readSessionStep = useCallback((seriesSlug: string): number => {
    if (typeof window === 'undefined') return 1;
    const sessionSeries = sessionStorage.getItem(DBQ_SESSION_SERIES_KEY);
    if (sessionSeries !== seriesSlug) return 1;
    
    const savedStep = sessionStorage.getItem(DBQ_SESSION_STEP_KEY);
    const parsed = savedStep ? parseInt(savedStep, 10) : 1;
    
    if (isNaN(parsed) || parsed < 1 || parsed > QUIZ_TOTAL_STEPS) return 1;
    return parsed;
  }, []);

  const resetQuizSession = useCallback((seriesSlug: string): void => {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(DBQ_SESSION_SERIES_KEY, seriesSlug);
    sessionStorage.setItem(DBQ_SESSION_STEP_KEY, '1');
    sessionStorage.setItem(DBQ_SESSION_STARTED_AT_KEY, Date.now().toString());
  }, []);

  // Initialize Session State
  const [currentStep, setCurrentStep] = useState(() => readSessionStep(question.series_slug));

  // Handle Submission Logic
  const submit = useCallback(async (index: number) => {
    if (hasSubmittedRef.current || result) return;
    hasSubmittedRef.current = true;
    
    setIsSubmitting(true);
    setSelectedIdx(index);
    try {
      const res = await submitAnswer(token, index) as QuizSubmitResponse;
      if ('error' in res) {
        toast.error(res.error);
        hasSubmittedRef.current = false;
        setSelectedIdx(null);
      } else {
        setResult(res);
      }
    } catch {
      toast.error('حدث رمز خطأ غير معروف');
      hasSubmittedRef.current = false;
      setSelectedIdx(null);
    } finally {
      setIsSubmitting(false);
    }
  }, [token, result]);

  // Timer Logic
  useEffect(() => {
    if (!warmupDone || result || timeLeft <= 0) return;

    // First question no timer logic
    if (currentStep === 1 && FIRST_QUESTION_NO_TIMER) return;
    
    const handleTimeOut = async () => {
      if (hasSubmittedRef.current || result) return;
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
  }, [warmupDone, timeLeft, result, currentStep, submit]);

  const handleNext = () => {
    if (currentStep >= QUIZ_TOTAL_STEPS) {
      // Clean up session keys on completion
      sessionStorage.removeItem(DBQ_SESSION_STEP_KEY);
      sessionStorage.removeItem(DBQ_SESSION_SERIES_KEY);
      sessionStorage.removeItem(DBQ_SESSION_STARTED_AT_KEY);
      router.push('/quiz/leaderboard');
    } else {
      const nextStep = currentStep + 1;
      sessionStorage.setItem(DBQ_SESSION_STEP_KEY, nextStep.toString());
      
      // Reset local state for "new" question feel
      setResult(null);
      setSelectedIdx(null);
      setTimeLeft(durationSeconds);
      setWarmupDone(false);
      hasSubmittedRef.current = false;

      // Navigate to fresh question deterministically
      router.push(`/quiz/${question.series_slug}?q=${Date.now()}`);
    }
  };

  const timerEnabled = !(currentStep === 1 && FIRST_QUESTION_NO_TIMER);

  return (
    <div className="relative">
      <QuizWarmupOverlay 
        key={`warmup-${question.id}`}
        open={!warmupDone && !result} 
        seconds={QUIZ_WARMUP_SECONDS} 
        onComplete={() => setWarmupDone(true)} 
      />

      <QuizSessionHeader 
        seriesTitle={seriesTitle}
        userDisplayName={userDisplayName}
        initialPowerLevel={initialPowerLevel}
        streak={result ? result.newStreak : userStreak}
        currentStep={currentStep}
        totalSteps={QUIZ_TOTAL_STEPS}
        timerVisible={warmupDone && !result && timerEnabled}
        timeLeft={timeLeft}
      />

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden transition-all duration-500">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div 
              key={`q-${question.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {timerEnabled && (
                <div className="absolute top-0 inset-x-0 h-1 bg-slate-800">
                  <motion.div 
                    initial={{ width: '100%' }}
                    animate={{ width: `${(timeLeft / durationSeconds) * 100}%` }}
                    transition={{ duration: 1, ease: 'linear' }}
                    className={cn(
                      "h-full transition-colors duration-500",
                      timeLeft > 10 ? 'bg-orange-500' : 'bg-red-500'
                    )}
                  />
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-slate-700">
                  المستوى {question.difficulty_tier}
                </span>
                {!timerEnabled && (
                  <span className="text-xs font-bold text-slate-500">الجولة الأولى: لا يوجد وقت</span>
                )}
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white leading-relaxed text-right">
                {question.content}
              </h2>

              <div className="space-y-4">
                {question.options.map((opt, idx) => {
                  const isSelected = selectedIdx === idx;
                  return (
                    <button
                      key={idx}
                      disabled={isSubmitting || !warmupDone}
                      onClick={() => submit(idx)}
                      className={cn(
                        "w-full text-right p-4 sm:p-5 rounded-2xl border-2 transition-all font-bold text-lg group relative overflow-hidden",
                        !isSelected && "border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-300 hover:border-slate-600 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed",
                        isSelected && "border-orange-500 bg-orange-500/10 text-orange-400 ring-4 ring-orange-500/20"
                      )}
                    >
                      <div className="flex items-center justify-between relative z-10">
                        <span>{opt}</span>
                        {isSubmitting && isSelected && <Loader2 className="animate-spin text-orange-500" size={20} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <QuizResultPanel 
              isCorrect={result.isCorrect}
              explanation={result.explanation}
              powerDiff={result.newPowerLevel - initialPowerLevel}
              newPowerLevel={result.newPowerLevel}
              newStreak={result.newStreak}
              onNext={handleNext}
              onExit={() => {
                sessionStorage.removeItem(DBQ_SESSION_STEP_KEY);
                sessionStorage.removeItem(DBQ_SESSION_SERIES_KEY);
                sessionStorage.removeItem(DBQ_SESSION_STARTED_AT_KEY);
                router.push('/series');
              }}
              nextLabel={currentStep >= QUIZ_TOTAL_STEPS ? "إنهاء الجولة" : "السؤال التالي"}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
