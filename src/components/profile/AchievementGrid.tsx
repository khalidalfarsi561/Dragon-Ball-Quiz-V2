import { Achievement, getAchievementBadges } from "@/lib/ux";
import { cn } from "@/lib/utils";
import { Lock, Award } from "lucide-react";
import { motion } from "motion/react";

interface AchievementGridProps {
  user: {
    power_level?: number;
    streak?: number;
    zenkai_boosts?: number;
  };
}

export default function AchievementGrid({ user }: AchievementGridProps) {
  const achievements = getAchievementBadges(user);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {achievements.map((ach, idx) => (
        <AchievementCard key={ach.id} achievement={ach} index={idx} />
      ))}
    </div>
  );
}

function AchievementCard({ achievement, index }: { achievement: Achievement; index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "relative p-5 rounded-2xl border transition-all overflow-hidden",
        achievement.unlocked 
          ? "bg-slate-900 border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.05)]" 
          : "bg-slate-900/40 border-slate-800 grayscale opacity-60"
      )}
    >
      <div className="flex items-start gap-4 relative z-10">
        <div className={cn(
          "p-3 rounded-xl shrink-0",
          achievement.unlocked ? "bg-orange-500 text-white shadow-lg" : "bg-slate-800 text-slate-500"
        )}>
          {achievement.unlocked ? <Award size={24} /> : <Lock size={24} />}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-slate-100">{achievement.label}</h4>
            <motion.div
              initial={false}
              animate={{ 
                scale: achievement.unlocked ? [1, 1.2, 1] : 1,
                rotate: achievement.unlocked ? [0, 10, -10, 0] : 0
              }}
              transition={{ duration: 0.5, repeat: achievement.unlocked ? Infinity : 0, repeatDelay: 5 }}
            >
              {achievement.unlocked ? (
                <Award size={14} className="text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
              ) : (
                <Lock size={14} className="text-slate-600" />
              )}
            </motion.div>
          </div>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">
            {achievement.description}
          </p>
        </div>
      </div>

      {/* Background flare if unlocked */}
      {achievement.unlocked && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 blur-3xl -mr-12 -mt-12 rounded-full" />
      )}
    </motion.div>
  );
}
