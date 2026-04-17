import LeaderboardServer from '@/components/LeaderboardServer';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

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
      
      <Suspense fallback={
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-24 flex items-center justify-center">
          <Loader2 className="animate-spin text-orange-500" size={48} />
        </div>
      }>
        <LeaderboardServer />
      </Suspense>
    </div>
  );
}
