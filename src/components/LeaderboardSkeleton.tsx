import { Trophy } from 'lucide-react';

export default function LeaderboardSkeleton() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-pulse">
      <div className="p-6 sm:p-8 border-b border-slate-800 bg-slate-800/30">
        <h2 className="text-2xl font-bold font-display text-slate-700 flex items-center gap-3">
          <Trophy className="text-slate-700" />
          <div className="h-6 w-48 bg-slate-700/50 rounded-lg"></div>
        </h2>
      </div>
      <div className="divide-y divide-slate-800/50">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="p-4 sm:p-6 flex items-center gap-4">
            <div className="w-8 flex justify-center shrink-0">
              <div className="h-6 w-6 bg-slate-800 rounded-full"></div>
            </div>
            
            <div className="w-12 h-12 rounded-full bg-slate-800 shrink-0 border-2 border-slate-700"></div>
            
            <div className="flex-1 min-w-0">
              <div className="h-5 w-32 bg-slate-800 rounded-md mb-2"></div>
              <div className="h-4 w-24 bg-slate-800/70 rounded-md"></div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <div className="h-6 w-16 bg-slate-800 rounded-md"></div>
              <div className="h-3 w-12 bg-slate-800/70 rounded-md"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
