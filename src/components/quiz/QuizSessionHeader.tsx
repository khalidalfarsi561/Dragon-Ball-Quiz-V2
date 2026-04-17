import { Zap, Flame, Trophy } from "lucide-react";
import StatPill from "../ui/StatPill";
import ProgressStrip from "../ui/ProgressStrip";
import TimerBadge from "../TimerBadge";
import { getProgressPercent, getQuizProgressLabel } from "@/lib/ux";
import { formatNumber } from "@/lib/utils";

interface QuizSessionHeaderProps {
  seriesTitle: string;
  userDisplayName: string;
  initialPowerLevel: number;
  streak: number;
  currentStep: number;
  totalSteps: number;
  timerVisible: boolean;
  timeLeft?: number;
}

export default function QuizSessionHeader({
  seriesTitle,
  initialPowerLevel,
  streak,
  currentStep,
  totalSteps,
  timerVisible,
  timeLeft
}: QuizSessionHeaderProps) {
  return (
    <div className="space-y-6 mb-8">
      {/* Top Contextual Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-orange-500">
            <Trophy size={16} className="shrink-0" />
            <span className="text-xs font-black uppercase tracking-widest font-display">تحدي السلسلة</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display leading-none">
            {seriesTitle}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <StatPill 
            label="مستوى الطاقة" 
            value={formatNumber(initialPowerLevel)} 
            icon={<Zap size={14} fill="currentColor" />} 
          />
          <StatPill 
            label="المتتالية" 
            value={`${streak}🔥`} 
            icon={<Flame size={14} fill="currentColor" />} 
          />
          {timerVisible && typeof timeLeft === 'number' && (
            <TimerBadge timeLeft={timeLeft} />
          )}
        </div>
      </div>

      {/* Visible Session Progress */}
      <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl shadow-inner">
        <ProgressStrip 
          value={getProgressPercent(currentStep, totalSteps)}
          label={getQuizProgressLabel(currentStep, totalSteps)}
          sublabel="تقدم الجولة"
        />
      </div>
    </div>
  );
}
