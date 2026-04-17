'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import UserAvatar from '../UserAvatar';
import { UserRecord } from '@/lib/types';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';
import { audioController } from '@/lib/audio';
import { useState, useEffect } from 'react';

interface HeaderNavLinksProps {
  isLoggedIn: boolean;
  user: UserRecord | null;
}

export default function HeaderNavLinks({ isLoggedIn, user }: HeaderNavLinksProps) {
  const pathname = usePathname();
  const [soundsEnabled, setSoundsEnabled] = useState(true);

  // Initialize sounds state after mount to avoid hydration mismatch
  useEffect(() => {
    const isEnabled = audioController.isEnabled();
    if (isEnabled !== soundsEnabled) {
      // Defer state update to satisfy synchronous effect rule
      Promise.resolve().then(() => {
        setSoundsEnabled(isEnabled);
      });
    }
  }, [soundsEnabled]);

  const toggleSounds = () => {
    const newState = audioController.toggle();
    setSoundsEnabled(newState);
  };

  const links = isLoggedIn 
    ? [
        { href: '/series', label: 'السلاسل' },
        { href: '/quiz/leaderboard', label: 'الترتيب' },
      ]
    : [
        { href: '/quiz/leaderboard', label: 'الترتيب' },
      ];

  return (
    <nav className="flex items-center gap-4 sm:gap-6 text-sm font-medium">
      <button 
        onClick={toggleSounds}
        className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-orange-500 hover:border-orange-500/50 transition-all active:scale-90"
        title={soundsEnabled ? 'كتم الأصوات' : 'تفعيل الأصوات'}
      >
        {soundsEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>

      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link 
            key={link.href} 
            href={link.href} 
            onClick={() => audioController.play('click')}
            className={cn(
              "transition-all duration-300 relative py-1 px-2 rounded-lg hover:bg-white/5 group",
              isActive 
                ? "text-white font-black drop-shadow-[0_0_8px_rgba(249,115,22,0.5)] bg-white/5" 
                : "text-slate-400 hover:text-white"
            )}
          >
            <span className="relative z-10 block group-hover:scale-110 transition-transform">
              {link.label}
            </span>
            {isActive && (
              <motion.span 
                layoutId="nav-underline"
                className="absolute -bottom-1 inset-x-0 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full" 
              />
            )}
          </Link>
        );
      })}
      
      {isLoggedIn && (
        <Link 
          href="/profile" 
          onClick={() => audioController.play('click')}
          className={cn(
          "flex items-center gap-2 group transition-all relative py-1 px-1",
          pathname === '/profile' ? "text-white" : "text-slate-400 hover:text-slate-200"
        )}>
          <div className={cn(
            "rounded-full p-0.5 transition-all",
            pathname === '/profile' ? "bg-gradient-to-r from-orange-500 to-yellow-500" : "bg-transparent"
          )}>
            <UserAvatar src={user?.avatar_url} alt={user?.display_name || user?.username} size={28} />
          </div>
          <span className={cn(
            "hidden sm:inline-block transition-all",
            pathname === '/profile' && "font-black drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]"
          )}>قاعدتي</span>
          {pathname === '/profile' && (
            <motion.span 
              layoutId="nav-underline"
              className="absolute -bottom-1 inset-x-0 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full" 
            />
          )}
        </Link>
      )}
    </nav>
  );
}
