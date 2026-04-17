import LeaderboardServer from '@/components/LeaderboardServer';
import LeaderboardSkeleton from '@/components/LeaderboardSkeleton';
import { Suspense } from 'react';

export const metadata = {
  title: 'لوحة الشرف | دراغون بول كويز',
  description: 'أقوى مقاتلي دراغون بول مرتبين حسب مستوى الطاقة.',
};

export default function LeaderboardPage() {
  return (
    <div className="max-w-4xl mx-auto w-full py-8 space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black font-display text-transparent bg-clip-text bg-gradient-to-tr from-yellow-300 to-orange-500">
          بطولة الكون
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          المقاتلون الأقوى يتصدرون المشهد. أثبت جدارتك وتسلق الترتيب!
        </p>
      </div>
      
      <Suspense fallback={<LeaderboardSkeleton />}>
        <LeaderboardServer />
      </Suspense>
    </div>
  );
}
