import { SERIES, getSeriesBySlug } from '@/lib/series';
import { getPbServerClient } from '@/lib/pocketbase';
import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';

export async function generateStaticParams() {
  return SERIES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const series = getSeriesBySlug(params.slug);
  
  if (!series) return { title: 'غير موجود' };
  
  return {
    title: `${series.title} | التحدي`,
    description: series.subtitle,
  };
}

export default async function SeriesDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const series = getSeriesBySlug(params.slug);
  const pb = await getPbServerClient();
  
  if (!series) {
    notFound();
  }
  
  if (!pb.authStore.isValid) {
    redirect('/');
  }

  return (
    <div className="max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="relative h-64 sm:h-80 w-full rounded-3xl overflow-hidden mb-8 border border-slate-800 shadow-2xl">
        <Image 
          src={series.image}
          alt={series.title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1024px) 100vw, 1024px"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
        
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold tracking-wider mb-4 text-white shadow-lg bg-gradient-to-r ${series.color}`}>
              {series.questionCount} تحديات متاحة
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white font-display mb-2 drop-shadow-md">
              {series.title}
            </h1>
            <p className="text-lg text-slate-300 max-w-xl">
              {series.subtitle}
            </p>
          </div>
          
          <Link 
            href={`/quiz/${series.slug}`}
            className="shrink-0 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 text-slate-950 font-black px-8 py-4 rounded-xl transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105"
          >
            <Play fill="currentColor" size={20} />
            <span>ابدأ الاختبار الآن</span>
          </Link>
        </div>
      </div>
      
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <h2 className="text-xl font-bold font-display text-white mb-4">قواعد التحدي</h2>
        <ul className="space-y-3 text-slate-300">
          <li className="flex gap-3">
            <span className="text-orange-500 font-bold">•</span>
            <span>كل إجابة صحيحة تزيد من مستوى طاقتك!</span>
          </li>
          <li className="flex gap-3">
            <span className="text-orange-500 font-bold">•</span>
            <span>الإجابات المتتالية الصحيحة (Streak) تمنحك مضاعف نقاط.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-orange-500 font-bold">•</span>
            <span>احذر! الإجابة الخاطئة ستفقدك جزءاً من طاقتك.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-orange-500 font-bold">•</span>
            <span>لديك وقت محدد لكل سؤال، السرعة تلعب دوراً.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
