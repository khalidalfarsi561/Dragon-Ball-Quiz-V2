import { getPbServerClient } from '@/lib/pocketbase';
import { redirect } from 'next/navigation';
import SeriesGrid from '@/components/SeriesGrid';

export const metadata = {
  title: 'اختر السلسلة | دراغون بول كويز',
  description: 'اختر سلسلة دراغون بول المفضلة لديك وابدأ التحدي الآن!',
};

import SectionIntro from '@/components/ui/SectionIntro';
import InfoNotice from '@/components/ui/InfoNotice';
import DifficultyQuickSelect from '@/components/DifficultyQuickSelect';
import DailyChallenge from '@/components/DailyChallenge';

export default async function SeriesPage() {
  const pb = await getPbServerClient();
  
  if (!pb.authStore.isValid) {
    redirect('/');
  }

  return (
    <div className="space-y-16 animate-in fade-in duration-500">
      <SectionIntro 
        title="اختر التحدي"
        subtitle="أي جزء من القصة تريد اختباره؟ اختر السلسلة أو مستوى الصعوبة وابدأ رفع مستوى طاقتك."
        eyebrow="رحلة المقاتل"
      />
      
      <DailyChallenge />

      <div className="space-y-6">
        <h2 className="text-xl font-black font-display text-white pr-4 border-r-4 border-orange-500">بداية سريعة حسب الصعوبة</h2>
        <DifficultyQuickSelect />
      </div>

      <div className="h-px bg-slate-900" />

      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-black font-display text-white pr-4 border-r-4 border-orange-500">تصفح كافة السلاسل</h2>
          <InfoNotice tone="info" className="sm:max-w-xs">
            كل إجابة صحيحة ترفع مستوى طاقتك!
          </InfoNotice>
        </div>
        <SeriesGrid />
      </div>
    </div>
  );
}
