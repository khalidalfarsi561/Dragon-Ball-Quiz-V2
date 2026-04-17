import { QuestionRecord } from './types';
import { getPbServerClient } from './pocketbase';

// Fallback questions for the demo if pocketbase answers empty
export const FALLBACK_QUESTIONS: QuestionRecord[] = [
  {
    id: 'q_db_1',
    content: 'من هو المعلم الأول لغوكو؟',
    options: ['جاكي تشون', 'المعلم روشي', 'تشان تشو', 'كوريلين'],
    correct_answer: 1, // المعلم روشي
    difficulty_tier: 1,
    explanation: 'المعلم روشي (ماستر روشي) هو من درّب غوكو وكوريلين في بداية القصة وأسس أسلوب السلحفاة.',
    series_slug: 'dragon-ball',
  },
  {
    id: 'q_dbz_1',
    content: 'ما هو اسم كوكب السايان الأصلي قبل أن يدمره فريزا؟',
    options: ['بلانت', 'فيجيتا', 'ناميك', 'سادالا'],
    correct_answer: 1, // فيجيتا
    difficulty_tier: 2,
    explanation: 'كوكب فيجيتا كان مسقط رأس السايانز، وسُمي على اسم ملكهم، قبل أن يدمره فريزا بالكامل.',
    series_slug: 'dragon-ball-z',
  },
  {
    id: 'q_dbs_1',
    content: 'من هو حاكم الدمار للكون السابع؟',
    options: ['تشامبا', 'بيروس', 'ويس', 'زين او ساما'],
    correct_answer: 1, // بيروس
    difficulty_tier: 1,
    explanation: 'بيروس هو حاكم الدمار الخاص بالكون السابع، وهو الكون الذي ينتمي إليه غوكو وأصدقاؤه.',
    series_slug: 'dragon-ball-super',
  }
];

export async function getRandomQuestion(seriesSlug: string): Promise<QuestionRecord> {
  try {
    const pb = await getPbServerClient();
    
    // Attempt to fetch from pocketbase
    // We would use an admin client or a server client.
    // If not found, throw error to catch and use fallback
    const result = await pb.collection('questions').getList<QuestionRecord>(1, 50, {
      filter: `series_slug = "${seriesSlug}"`,
      $autoCancel: false,
    });
    
    if (result.items.length > 0) {
      const randomItem = result.items[Math.floor(Math.random() * result.items.length)];
      return randomItem;
    }
  } catch (error) {
    console.log('Failed to load from PocketBase or no questions found, using fallback.');
  }
  
  // Try fallback
  const fallbacks = FALLBACK_QUESTIONS.filter(q => q.series_slug === seriesSlug);
  if (fallbacks.length > 0) {
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
  
  // Generic fallback if series match fails
  return FALLBACK_QUESTIONS[0];
}

// Ensure the client never gets the correct answer or explanation directly in the payload!
export function sanitizeQuestionForClient(q: QuestionRecord) {
  return {
    id: q.id,
    content: q.content,
    options: q.options,
    series_slug: q.series_slug,
    difficulty_tier: q.difficulty_tier,
  };
}
