import Link from 'next/link';
import Image from 'next/image';
import { SeriesConfig } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Play } from 'lucide-react';

export default function QuizCard({ series }: { series: SeriesConfig }) {
  return (
    <Link 
      href={`/series/${series.slug}`}
      className="group relative flex flex-col h-full bg-slate-900 border border-slate-800 hover:border-orange-500/50 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_rgba(249,115,22,0.15)] hover:-translate-y-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/50 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950 scale-100 hover:scale-[1.02] active:scale-[0.98]"
    >
      <div className="relative h-48 w-full overflow-hidden bg-slate-800">
        <Image 
          src={series.image}
          alt={series.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
        
        <div className="absolute inset-x-0 bottom-0 p-4">
          <span className={cn(
            "inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider mb-2 text-white bg-gradient-to-r shadow-lg shadow-black/20",
            series.color
          )}>
            {series.questionCount} سؤال
          </span>
          <h2 className="text-2xl font-black text-white font-display leading-tight drop-shadow-md">{series.title}</h2>
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col justify-between">
        <p className="text-slate-400 text-sm mb-4 leading-relaxed line-clamp-2">
          {series.subtitle}
        </p>
        
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-800/50">
          <div className="flex items-center text-orange-500 font-black text-sm group-hover:text-orange-400 transition-all gap-3 group/link">
            <span className="relative overflow-hidden">
              <span className="block group-hover/link:-translate-y-full transition-transform duration-300">التفاصيل وبدء الاختبار</span>
              <span className="absolute inset-0 block translate-y-full group-hover/link:translate-y-0 transition-transform duration-300 text-white">اتخاذ القرار الآن!</span>
            </span>
            <div className="p-2 rounded-xl bg-orange-500/10 group-hover:bg-orange-500 group-hover:text-slate-950 transition-all shadow-[0_0_15px_rgba(249,115,22,0)] group-hover:shadow-[0_0_15px_rgba(249,115,22,0.4)] group-hover:scale-110">
              <Play size={12} className="fill-current" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
