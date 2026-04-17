import Link from 'next/link';
import { getPbServerClient } from '@/lib/pocketbase';
import HeaderNavLinks from './header/HeaderNavLinks';

export default async function Header() {
  const pb = await getPbServerClient();
  const isLoggedIn = pb.authStore.isValid;
  const user = pb.authStore.record;

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="font-display font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500 hover:scale-105 transition-transform">
          DBQ
        </Link>
        <HeaderNavLinks isLoggedIn={isLoggedIn} user={user} />
      </div>
    </header>
  );
}
