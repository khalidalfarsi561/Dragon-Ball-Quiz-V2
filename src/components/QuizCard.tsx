import Link from 'next/link';
import Image from 'next/image';
import { SeriesConfig } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Play } from 'lucide-react';

export default function QuizCard({ series }: { series: SeriesConfig }) {
  return (
    <Link 
      href={`/series/${series.slug}`}
      className="group relative flex flex-col h-full bg-slate-900 border border-slate-800 hover:border-orange-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
    >
      <div className="relative h-48 w-full overflow-hidden bg-slate-800">
        <Image 
          src={series.image}
          alt={series.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
        
        <div className="absolute inset-x-0 bottom-0 p-4">
          <span className={cn(
            "inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider mb-2 text-white bg-gradient-to-r",
            series.color
          )}>
            {series.questionCount} سؤال
          </span>
          <h2 className="text-2xl font-black text-white font-display leading-tight">{series.title}</h2>
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col justify-between">
        <p className="text-slate-400 text-sm mb-4 leading-relaxed line-clamp-2">
          {series.subtitle}
        </p>
        
        <div className="mt-auto flex items-center text-orange-500 font-bold text-sm group-hover:text-orange-400 transition-colors">
          <span>التفاصيل وبدء الاختبار</span>
          <Play size={16} className="mr-1.5 fill-current" />
        </div>
      </div>
    </Link>
  );
}
