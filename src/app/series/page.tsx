import { getPbServerClient } from '@/lib/pocketbase';
import { redirect } from 'next/navigation';
import SeriesGrid from '@/components/SeriesGrid';

export const metadata = {
  title: 'اختر السلسلة | دراغون بول كويز',
  description: 'اختر سلسلة دراغون بول المفضلة لديك وابدأ التحدي الآن!',
};

export default async function SeriesPage() {
  const pb = await getPbServerClient();
  
  if (!pb.authStore.isValid) {
    redirect('/');
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-black font-display text-white">اختر التحدي</h1>
        <p className="text-slate-400">أي جزء من القصة تريد اختباره؟ اختر السلسلة وابدأ رفع مستوى طاقتك.</p>
      </div>
      
      <SeriesGrid />
    </div>
  );
}
