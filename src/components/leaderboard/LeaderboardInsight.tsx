import { getRankInsight } from "@/lib/ux";
import { TrendingUp, Target } from "lucide-react";
import { motion } from "motion/react";

interface LeaderboardInsightProps {
  currentUserScore?: number | null;
  currentUserRank?: number | null;
  nextRankScore?: number | null;
}

export default function LeaderboardInsight({
  currentUserRank,
  nextRankScore,
  currentUserScore
}: LeaderboardInsightProps) {
  const insightText = getRankInsight(currentUserRank || null, nextRankScore || null, currentUserScore || null);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-slate-900 via-slate-900 to-orange-950/20 border border-orange-500/20 rounded-2xl p-6 mb-8 shadow-xl"
    >
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="bg-orange-500/10 p-4 rounded-full text-orange-400 shrink-0">
          {currentUserRank ? <TrendingUp size={32} /> : <Target size={32} />}
        </div>
        <div className="space-y-2 text-center sm:text-right">
          <h3 className="text-xl font-black text-white font-display">
            {currentUserRank ? 'نظرة على مستواك' : 'ابدأ المنافسة'}
          </h3>
          <p className="text-slate-300 font-medium leading-relaxed max-w-xl">
            {insightText}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
