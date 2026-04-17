'use client';

import { motion } from 'motion/react';
import { Calendar, Flame, Trophy, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { audioController } from '@/lib/audio';

export default function DailyChallenge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group overflow-hidden rounded-3xl bg-slate-900 border border-orange-500/20 p-8 shadow-2xl"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent opacity-50 transition-opacity group-hover:opacity-100" />
      
      {/* Animated Sparkles/Particles concept using CSS */}
      <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform">
        <Flame size={120} className="text-orange-500 animate-pulse" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-right">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3 bg-orange-500/10 w-fit px-4 py-1 rounded-full border border-orange-500/20">
            <Calendar size={14} className="text-orange-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">تحدي اليوم الحصري</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black text-white font-display tracking-tight">
              تحدي معركة الأكوان
            </h2>
            <p className="text-slate-400 max-w-lg leading-relaxed">
              أجِب عن 10 أسئلة عشوائية من مختلف السلاسل في وقت قياسي لتربح 5000 نقطة طاقة إضافية ولقب &quot;المقاتل اليومي&quot;.
            </p>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-500 mb-1">المكافأة</span>
              <div className="flex items-center gap-2 text-yellow-500 font-black">
                <Trophy size={16} />
                <span>+5,000 PL</span>
              </div>
            </div>
            <div className="w-px h-10 bg-slate-800" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-500 mb-1">الزمن المتبقي</span>
              <span className="text-white font-mono font-bold">14:22:05</span>
            </div>
          </div>
        </div>

        <Link 
          href="/quiz/dragon-ball-z"
          onClick={() => audioController.play('submit')}
          className="shrink-0 group/btn relative flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-600 text-slate-950 font-black px-12 py-5 rounded-2xl transition-all shadow-xl shadow-orange-950/20 active:scale-95 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
          <span className="relative z-10 text-xl">ابدأ التحدي الآن</span>
          <ArrowLeft size={24} className="relative z-10 group-hover/btn:-translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
