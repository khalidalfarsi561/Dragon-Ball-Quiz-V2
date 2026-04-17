'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import UserAvatar from '../UserAvatar';
import { UserRecord } from '@/lib/types';

interface HeaderNavLinksProps {
  isLoggedIn: boolean;
  user: UserRecord | null;
}

export default function HeaderNavLinks({ isLoggedIn, user }: HeaderNavLinksProps) {
  const pathname = usePathname();

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
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link 
            key={link.href} 
            href={link.href} 
            className={cn(
              "transition-all duration-200 relative py-1",
              isActive 
                ? "text-orange-400 font-bold" 
                : "text-slate-300 hover:text-white"
            )}
          >
            {link.label}
            {isActive && (
              <span className="absolute -bottom-1 inset-x-0 h-0.5 bg-orange-500 rounded-full" />
            )}
          </Link>
        );
      })}
      
      {isLoggedIn && (
        <Link href="/profile" className={cn(
          "flex items-center gap-2 group transition-all",
          pathname === '/profile' ? "text-orange-400" : "text-slate-300"
        )}>
          <UserAvatar src={user?.avatar_url} alt={user?.display_name || user?.username} size={32} />
          <span className={cn(
            "hidden sm:inline-block transition-colors group-hover:text-white",
            pathname === '/profile' && "font-bold text-orange-400"
          )}>قاعدتي</span>
        </Link>
      )}
    </nav>
  );
}
