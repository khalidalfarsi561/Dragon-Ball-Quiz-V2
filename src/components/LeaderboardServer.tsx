import { getPbServerClient, getPbAdminClient } from '@/lib/pocketbase';
import { LeaderboardRecord, UserRecord } from '@/lib/types';
import UserAvatar from './UserAvatar';
import { getPowerLevelTitle } from '@/lib/gamification';
import { formatNumber } from '@/lib/utils';
import { Trophy, Medal, Crown } from 'lucide-react';

import LeaderboardInsight from './leaderboard/LeaderboardInsight';

export default async function LeaderboardServer() {
  const adminClient = await getPbAdminClient();
  const pb = await getPbServerClient();
  const currentUser = pb.authStore.record as unknown as UserRecord | null;

  let leaderboard: LeaderboardRecord[] = [];
  
  try {
    // Requires users relation to be expanded to show names/avatars 
    // and handle logic where show_on_leaderboard = true
    const records = await adminClient.collection('leaderboard').getList<LeaderboardRecord>(1, 50, {
      sort: '-score',
      expand: 'user',
    });
    
    // Filter out opted-out or null users
    leaderboard = records.items.filter(entry => 
      entry.expand?.user && entry.expand.user.show_on_leaderboard !== false
    );
  } catch (error: any) {
    const isConnErr = error?.message?.includes('fetch failed') || error?.originalError?.cause?.code === 'ECONNREFUSED' || error?.status === 0;
    if (isConnErr) {
      console.warn('[Leaderboard] Cannot connect to PocketBase.');
    } else {
      console.error('[Leaderboard] fetch error', error?.message || error);
    }
  }

  // Determine current user rank and next rank insight
  let currentUserRank: number | null = null;
  let nextRankScore: number | null = null;
  let currentUserScore: number | null = null;

  if (currentUser) {
    const userIndex = leaderboard.findIndex(entry => entry.user === currentUser.id);
    if (userIndex !== -1) {
      currentUserRank = userIndex + 1;
      currentUserScore = leaderboard[userIndex].score;
      if (userIndex > 0) {
        nextRankScore = leaderboard[userIndex - 1].score;
      }
    }
  }

  if (leaderboard.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
        <Trophy className="mx-auto text-slate-700 mb-4" size={48} />
        <p className="text-lg">لا توجد أرقام قياسية بعد. كن الأول!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <LeaderboardInsight 
        currentUserRank={currentUserRank}
        currentUserScore={currentUserScore}
        nextRankScore={nextRankScore}
      />

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 sm:p-8 border-b border-slate-800 bg-slate-800/30">
          <h2 className="text-2xl font-bold font-display text-white flex items-center gap-3">
            <Trophy className="text-yellow-500" />
            <span>أقوى محاربي الكون</span>
          </h2>
        </div>
        <div className="divide-y divide-slate-800/50">
          {leaderboard.map((entry, index) => {
          const user = entry.expand?.user;
          const isCurrentUser = currentUser?.id === user?.id;
          
          return (
            <div 
              key={entry.id} 
              className={`p-4 sm:p-6 flex items-center gap-4 hover:bg-slate-800/50 transition-colors ${isCurrentUser ? 'bg-orange-500/5 border-l-4 border-l-orange-500' : ''}`}
            >
              <div className="w-8 flex justify-center shrink-0">
                {index === 0 ? <Crown className="text-yellow-400" size={24} /> :
                 index === 1 ? <Medal className="text-slate-300" size={24} /> :
                 index === 2 ? <Medal className="text-amber-600" size={24} /> :
                 <span className="font-bold text-slate-500 text-lg">#{index + 1}</span>}
              </div>
              
              <UserAvatar src={user?.avatar_url} alt={user?.display_name || user?.username} size={48} />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white truncate text-lg">
                    {user?.display_name || 'مقاتل مجهول'}
                  </h3>
                  {isCurrentUser && (
                    <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      أنت
                    </span>
                  )}
                </div>
                <div className="text-sm text-slate-400">
                  {getPowerLevelTitle(user?.power_level || entry.score)}
                </div>
              </div>
              
              <div className="text-left" dir="ltr">
                <div className="font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500 text-xl">
                  {formatNumber(entry.score)}
                </div>
                {entry.streak >= 3 && (
                  <div className="text-xs font-bold text-yellow-500">
                    {entry.streak} متتالية 🔥
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
  );
}
