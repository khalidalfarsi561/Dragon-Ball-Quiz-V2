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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 lg:p-10 shadow-xl space-y-6">
          <h2 className="text-2xl font-black font-display text-white border-b border-slate-800 pb-4">قواعد التحدي</h2>
          <ul className="space-y-4 text-slate-300">
            <li className="flex gap-4 items-start">
              <span className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
              <span className="leading-relaxed">كل إجابة صحيحة تزيد من مستوى طاقتك!</span>
            </li>
            <li className="flex gap-4 items-start">
              <span className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
              <span className="leading-relaxed">الإجابات المتتالية الصحيحة (Streak) تمنحك مضاعف نقاط.</span>
            </li>
            <li className="flex gap-4 items-start">
              <span className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
              <span className="leading-relaxed">احذر! الإجابة الخاطئة ستفقدك جزءاً من طاقتك.</span>
            </li>
            <li className="flex gap-4 items-start">
              <span className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
              <span className="leading-relaxed">لديك وقت محدد لكل سؤال، السرعة تلعب دوراً كبيراً.</span>
            </li>
          </ul>
        </div>

        <div className="bg-orange-500/5 border border-orange-500/10 rounded-3xl p-8 lg:p-10 shadow-xl space-y-6">
          <h2 className="text-2xl font-black font-display text-orange-400 border-b border-orange-500/10 pb-4">ماذا ينتظرك؟</h2>
          <ul className="space-y-6 text-slate-300">
            <li className="flex gap-4 items-start">
              <span className="shrink-0 w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-black text-sm border border-orange-500/20">1</span>
              <span className="leading-relaxed">سيبدأ التحدي بعد عد تنازلي قصير للاستعداد والتركيز.</span>
            </li>
            <li className="flex gap-4 items-start">
              <span className="shrink-0 w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-black text-sm border border-orange-500/20">2</span>
              <span className="leading-relaxed">سترى تقدمك في كل سؤال حتى تنهي الجولة الكاملة من التحدي.</span>
            </li>
            <li className="flex gap-4 items-start">
              <span className="shrink-0 w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-black text-sm border border-orange-500/20">3</span>
              <span className="leading-relaxed">بعد كل إجابة، ستحصل على شرح مفصل وتحديث لحظي لترتيبك في لوحة الشرف.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
