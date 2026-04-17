export const calculatePowerLevelGain = (
  baseScore: number, 
  streak: number, 
  difficultyMultiplier: number, 
  zenkaiMultiplier: number = 1
) => {
  const streakBonus = Math.floor(streak * 1.5);
  return Math.floor((baseScore * difficultyMultiplier) + streakBonus) * zenkaiMultiplier;
};

export const checkZenkaiBoost = (consecutiveWrong: number) => {
  // If the user gets 3 or more wrong in a row, they are eligible for a Zenkai attempt
  return consecutiveWrong >= 3;
};

export const calculateLossPenalty = (currentPower: number) => {
  // Loose 1% of power or at least 10
  return Math.max(10, Math.floor(currentPower * 0.01));
};

export const getPowerLevelTitle = (powerLevel: number) => {
  if (powerLevel < 1000) return 'إنسان عادي'; // Regular Human
  if (powerLevel < 10000) return 'مقاتل زِد'; // Z Fighter
  if (powerLevel < 50000) return 'محارب السايان'; // Saiyan Warrior
  if (powerLevel < 250000) return 'سوبر سايان'; // Super Saiyan
  if (powerLevel < 1000000) return 'سوبر سايان 2'; // SSJ2
  if (powerLevel < 5000000) return 'سوبر سايان 3'; // SSJ3
  if (powerLevel < 20000000) return 'سوبر سايان غود'; // SSJ God
  if (powerLevel < 100000000) return 'سوبر سايان بلو'; // SSJ Blue
  return 'حاكم دمار'; // God of Destruction
};
