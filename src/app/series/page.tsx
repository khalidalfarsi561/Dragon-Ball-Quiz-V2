import { getPbServerClient } from '@/lib/pocketbase';
import { redirect } from 'next/navigation';
import SeriesGrid from '@/components/SeriesGrid';

export const metadata = {
  title: 'اختر السلسلة | دراغون بول كويز',
  description: 'اختر سلسلة دراغون بول المفضلة لديك وابدأ التحدي الآن!',
};

import SectionIntro from '@/components/ui/SectionIntro';
import InfoNotice from '@/components/ui/InfoNotice';

export default async function SeriesPage() {
  const pb = await getPbServerClient();
  
  if (!pb.authStore.isValid) {
    redirect('/');
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <SectionIntro 
        title="اختر التحدي"
        subtitle="أي جزء من القصة تريد اختباره؟ اختر السلسلة وابدأ رفع مستوى طاقتك."
        eyebrow="رحلة المقاتل"
      />
      
      <InfoNotice tone="info" className="max-w-3xl">
        ابدأ بالسلسلة التي تعرفها أكثر. كل إجابة صحيحة ترفع مستوى طاقتك وتقربك من تصدر لوحة الشرف العالمية!
      </InfoNotice>

      <SeriesGrid />
    </div>
  );
}
