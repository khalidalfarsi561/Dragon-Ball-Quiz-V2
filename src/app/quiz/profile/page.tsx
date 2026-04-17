import { getPbServerClient } from '@/lib/pocketbase';
import { redirect } from 'next/navigation';
import UserAvatar from '@/components/UserAvatar';
import { getPowerLevelTitle } from '@/lib/gamification';
import { formatNumber } from '@/lib/utils';
import { UserRecord } from '@/lib/types';
import Link from 'next/link';

export const metadata = {
  title: 'بطاقة المقاتل | دراغون بول كويز',
};

import ProgressStrip from '@/components/ui/ProgressStrip';
import { getNextMilestone } from '@/lib/ux';

export default async function QuizProfilePage() {
  const pb = await getPbServerClient();
  const user = pb.authStore.record as unknown as UserRecord | null;
  
  if (!pb.authStore.isValid || !user) {
    redirect('/');
  }

  const title = getPowerLevelTitle(user.power_level);
  const milestone = getNextMilestone(user.power_level);

  return (
    <div className="max-w-md mx-auto w-full py-12 px-4 animate-in fade-in duration-500">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 shadow-2xl shadow-orange-900/20 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-orange-500/20 to-transparent" />
        
        <div className="relative flex justify-center mb-6">
          <UserAvatar 
            src={user.avatar_url} 
            alt={user.display_name} 
            size={120} 
            className="border-4 border-slate-800 shadow-xl"
          />
        </div>
        
        <h1 className="text-2xl font-black font-display text-white mb-2">
          {user.display_name}
        </h1>
        <p className="text-orange-400 font-bold mb-8">{title}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
            <div className="text-slate-400 text-sm mb-1">الطاقة</div>
            <div className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500 font-mono">
              {formatNumber(user.power_level)}
            </div>
          </div>
          <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
            <div className="text-slate-400 text-sm mb-1">المتتالية</div>
            <div className="text-xl font-black text-white font-mono" dir="ltr">
              {user.streak}🔥
            </div>
          </div>
        </div>

        <div className="mb-10 text-right">
          <ProgressStrip 
            value={milestone.percent}
            label={`لـلـهـدف ${milestone.next}`}
            sublabel={`${Math.round(milestone.percent)}%`}
          />
        </div>

        <Link 
          href="/profile"
          className="block w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors border border-slate-600"
        >
          تعديل الملف الشخصي
        </Link>
      </div>
    </div>
  );
}
