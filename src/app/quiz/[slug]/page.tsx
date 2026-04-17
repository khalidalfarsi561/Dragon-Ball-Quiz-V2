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
    <div className="w-full max-w-3xl mx-auto py-8">
      <div className="mb-8 flex items-center justify-between text-slate-300">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">{series.title}</h1>
          <p className="text-sm">سؤال جديد لك يا {user.display_name}!</p>
        </div>
        <div className="text-left" dir="ltr">
          <div className="text-orange-500 font-bold">الطاقة: {user.power_level}</div>
          <div className="text-yellow-500 text-sm">المتتاليات: {user.streak}🔥</div>
        </div>
      </div>
      
      <QuizUI 
        question={safeQuestion} 
        token={token} 
        durationSeconds={30}
        initialPowerLevel={user.power_level}
      />
    </div>
  );
}
