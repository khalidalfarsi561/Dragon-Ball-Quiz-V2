'use server';

import { verifyQuizToken } from '@/lib/quiz-session';
import { isNonceUsed, markNonceUsed } from '@/lib/anti-replay';
import { getPbServerClient, getPbAdminClient } from '@/lib/pocketbase';
import { FALLBACK_QUESTIONS, sanitizeQuestionForClient } from '@/lib/questions';
import { calculatePowerLevelGain, calculateLossPenalty, checkZenkaiBoost } from '@/lib/gamification';
import { revalidatePath } from 'next/cache';
import { QuestionRecord, UserRecord, LeaderboardRecord } from '@/lib/types';

export async function submitAnswer(token: string, selectedOptionIndex: number) {
  const pb = await getPbServerClient();
  if (!pb.authStore.isValid) {
    return { error: 'غير مصرح لك بأداء الاختبار.' };
  }

  const payload = await verifyQuizToken(token);
  if (!payload) {
    return { error: 'انتهى الوقت أو الرمز غير صالح.' };
  }

  const { questionId, nonce } = payload;

  if (await isNonceUsed(nonce)) {
    return { error: 'لقد تم إرسال هذه الإجابة بالفعل (Replay attack prevention).' };
  }

  const adminClient = await getPbAdminClient();
  let question: QuestionRecord | undefined;

  try {
    // Try pocketbase first
    question = await adminClient.collection('questions').getOne<QuestionRecord>(questionId);
  } catch {
    // Fallback
    question = FALLBACK_QUESTIONS.find(q => q.id === questionId);
  }

  if (!question) {
    return { error: 'السؤال غير موجود مسبقاً.' };
  }

  const user = pb.authStore.record as unknown as UserRecord;
  const isCorrect = question.correct_answer === selectedOptionIndex;

  // Retrieve existing leaderboard to get true consecutive_wrong state
  let lbRecord: LeaderboardRecord | undefined;
  try {
    const records = await adminClient.collection('leaderboard').getList<LeaderboardRecord>(1, 1, {
      filter: `user = "${user.id}"`,
    });
    if (records.items.length > 0) {
      lbRecord = records.items[0];
    }
  } catch (err) {
    // silently ignore leaderboard fetch fail
  }

  let newPowerLevel = user.power_level;
  let newStreak = user.streak;
  let activeZenkaiMultiplier = user.active_zenkai_multiplier || 1;
  let zenkaiBoosts = user.zenkai_boosts || 0;
  
  let consecutive_wrong = lbRecord ? (lbRecord.consecutive_wrong || 0) : 0;

  if (isCorrect) {
    consecutive_wrong = 0;
    newStreak += 1;
    const gain = calculatePowerLevelGain(10, newStreak, question.difficulty_tier, activeZenkaiMultiplier);
    newPowerLevel += gain;
    activeZenkaiMultiplier = 1; // Reset after use
  } else {
    consecutive_wrong += 1;
    newStreak = 0;
    const penalty = calculateLossPenalty(newPowerLevel);
    newPowerLevel = Math.max(5, newPowerLevel - penalty);
    activeZenkaiMultiplier = 1; // Reset if they fail even with multiplier
    
    // Check Zenkai rules based on true history
    if (checkZenkaiBoost(consecutive_wrong)) {
      activeZenkaiMultiplier = 2; // Activate x2 multiplier for next try
      zenkaiBoosts += 1;
      consecutive_wrong = 0; // Reset to avoid infinite boosts
    }
  }

  // Update user in DB
  try {
    await adminClient.collection('users').update(user.id, {
      power_level: newPowerLevel,
      streak: newStreak,
      active_zenkai_multiplier: activeZenkaiMultiplier,
      zenkai_boosts: zenkaiBoosts,
    });

    // NOW we can safely consume the nonce because the primary state change (User) succeeded.
    // If we fail here, the nonce is consumed and user cannot replay.
    // If we failed BEFORE the update, the user could potentially retry.
    await markNonceUsed(nonce);
    
    // Attempt updating leaderboard (side-effect, non-critical for core success)
    try {
      if (lbRecord) {
        await adminClient.collection('leaderboard').update(lbRecord.id, {
          score: newPowerLevel,
          streak: newStreak > lbRecord.streak ? newStreak : lbRecord.streak, // highest streak
          consecutive_wrong: consecutive_wrong
        });
      } else {
        await adminClient.collection('leaderboard').create({
          user: user.id,
          score: newPowerLevel,
          streak: newStreak,
          consecutive_wrong: consecutive_wrong
        });
      }
    } catch(err) {
      console.warn('Leaderboard update failed', err);
    }
  } catch (error) {
    console.error('Failed to update user stats in Pocketbase', error);
  }

  revalidatePath('/quiz/leaderboard');
  revalidatePath('/profile');
  
  return {
    success: true,
    isCorrect,
    correctAnswerIndex: question.correct_answer, // send back to reveal to user
    explanation: question.explanation,
    newPowerLevel,
    newStreak
  };
}
