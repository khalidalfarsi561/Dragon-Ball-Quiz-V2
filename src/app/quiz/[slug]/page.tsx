import { getPbServerClient } from '@/lib/pocketbase';
import { notFound, redirect } from 'next/navigation';
import { getSeriesBySlug } from '@/lib/series';
import { getRandomQuestion, sanitizeQuestionForClient } from '@/lib/questions';
import { signQuizToken } from '@/lib/quiz-session';
import crypto from 'crypto';
import QuizUI from '@/components/QuizUI';
import { UserRecord } from '@/lib/types';

export default async function QuizPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const pb = await getPbServerClient();
  const user = pb.authStore.record as unknown as UserRecord | null;
  
  if (!pb.authStore.isValid || !user) {
    redirect('/');
  }

  const series = getSeriesBySlug(params.slug);
  if (!series) {
    notFound();
  }

  const question = await getRandomQuestion(series.slug);
  const safeQuestion = sanitizeQuestionForClient(question);
  
  // Create secure quiz token
  const nonce = crypto.randomUUID();
  const token = await signQuizToken({
    userId: user.id,
    questionId: question.id,
    seriesSlug: series.slug,
    nonce
  });

  return (
    <div className="w-full max-w-3xl mx-auto py-4 sm:py-8">
      <QuizUI 
        key={safeQuestion.id}
        question={safeQuestion} 
        token={token} 
        durationSeconds={30}
        initialPowerLevel={user.power_level}
        userStreak={user.streak}
        seriesTitle={series.title}
        userDisplayName={user.display_name}
      />
    </div>
  );
}
