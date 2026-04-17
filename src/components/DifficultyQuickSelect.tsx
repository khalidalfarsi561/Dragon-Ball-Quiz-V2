'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Zap, Target, Star } from 'lucide-react';

const DIFFICULTIES = [
  { level: 'easy', label: 'مستوى سهل', sub: 'Dragon Ball (كلاسيك)', href: '/series/dragon-ball', color: 'bg-green-500', icon: Star },
  { level: 'medium', label: 'مستوى متوسط', sub: 'Dragon Ball Z', href: '/series/dragon-ball-z', color: 'bg-orange-500', icon: Zap },
  { level: 'hard', label: 'مستوى صعب', sub: 'Dragon Ball Super', href: '/series/dragon-ball-super', color: 'bg-red-600', icon: Target },
  { level: 'legendary', label: 'مستوى أسطوري', sub: 'Dragon Ball Movies', href: '/series/dragon-ball-movies', color: 'bg-purple-600', icon: Zap },
];

export default function DifficultyQuickSelect() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {DIFFICULTIES.map((d, i) => (
        <motion.div
          key={d.level}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
        >
          <Link 
            href={d.href}
            className="group block relative p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-orange-500/50 transition-all hover:shadow-2xl hover:-translate-y-1 overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 ${d.color} opacity-5 blur-3xl -mr-12 -mt-12`} />
            
            <div className="flex flex-col items-center text-center space-y-3 relative z-10">
              <div className={`p-4 rounded-2xl ${d.color}/20 text-white shrink-0 shadow-lg`}>
                <d.icon size={28} className={d.level === 'easy' ? 'text-green-400' : d.level === 'medium' ? 'text-orange-400' : 'text-red-400'} />
              </div>
              <div>
                <h3 className="font-black text-white text-lg font-display">{d.label}</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{d.sub}</p>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
