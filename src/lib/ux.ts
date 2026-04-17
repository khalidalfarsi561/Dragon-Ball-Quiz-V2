/**
 * UX Constants and Helpers
 * Centralized logic for UI-only progression and gamification feedback.
 */

export const QUIZ_TOTAL_STEPS = 10;
export const QUIZ_WARMUP_SECONDS = 3;
export const FIRST_QUESTION_NO_TIMER = true;

export const getQuizProgressLabel = (currentStep: number, totalSteps: number) => {
  return `السؤال ${currentStep} من ${totalSteps}`;
};

export const getProgressPercent = (currentStep: number, totalSteps: number) => {
  return Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));
};

export interface Achievement {
  id: string;
  label: string;
  description: string;
  unlocked: boolean;
  icon?: string;
}

export const getAchievementBadges = (user: { power_level?: number; streak?: number; zenkai_boosts?: number }): Achievement[] => {
  const pl = user.power_level || 0;
  const streak = user.streak || 0;
  const zenkai = user.zenkai_boosts || 0;

  return [
    {
      id: 'first_power',
      label: 'بداية المحارب',
      description: 'وصلت لمستوى طاقة 10',
      unlocked: pl >= 10,
    },
    {
      id: 'rising_warrior',
      label: 'محارب صاعد',
      description: 'وصلت لمستوى طاقة 100',
      unlocked: pl >= 100,
    },
    {
      id: 'elite_fمانتر',
      label: 'مقاتل النخبة',
      description: 'وصلت لمستوى طاقة 500',
      unlocked: pl >= 500,
    },
    {
      id: 'unstoppable',
      label: 'لا يقهر',
      description: 'حققت متتالية من 3 إجابات',
      unlocked: streak >= 3,
    },
    {
      id: 'burning_spirit',
      label: 'روح مشتعلة',
      description: 'حققت متتالية من 5 إجابات',
      unlocked: streak >= 5,
    },
    {
      id: 'zenkai_survivor',
      label: 'ناجي الزنكاي',
      description: 'فعلت دفعة الزنكاي مرة واحدة على الأقل',
      unlocked: zenkai >= 1,
    },
  ];
};

export const getNextMilestone = (powerLevel: number) => {
  const milestones = [10, 50, 100, 250, 500, 1000, 5000, 10000];
  const next = milestones.find(m => m > powerLevel) || milestones[milestones.length - 1] * 2;
  const prev = [...milestones].reverse().find(m => m <= powerLevel) || 0;
  
  const progress = ((powerLevel - prev) / (next - prev)) * 100;
  
  return {
    current: powerLevel,
    next,
    percent: Math.min(100, Math.max(0, progress))
  };
};

export const getRankInsight = (currentRank: number | null, nextRankScore: number | null, currentScore: number | null) => {
  if (!currentRank) return 'ابدأ التحدي الآن لتدخل القائمة!';
  
  let text = `أنت الآن في المركز #${currentRank}`;
  if (nextRankScore && currentScore) {
    const diff = nextRankScore - currentScore;
    text += `. يفصلك ${diff} نقطة عن المركز التالي!`;
  }
  
  return text;
};
