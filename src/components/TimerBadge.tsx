import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TimerBadge({ timeLeft }: { timeLeft: number }) {
  return (
    <div className={cn(
      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold border transition-colors",
      timeLeft > 10 
        ? "bg-slate-800 border-slate-700 text-slate-300"
        : "bg-red-500/20 border-red-500/50 text-red-500 animate-pulse"
    )}>
      <Clock size={16} />
      <span>{timeLeft} ثانية</span>
    </div>
  );
}
