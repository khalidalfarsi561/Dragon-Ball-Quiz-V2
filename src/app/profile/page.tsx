import { getPbServerClient } from '@/lib/pocketbase';
import { redirect } from 'next/navigation';
import ProfileForm from '@/components/ProfileForm';
import { getPowerLevelTitle } from '@/lib/gamification';
import { LogOut, Trophy, Zap, Gamepad2, Settings } from 'lucide-react';
import { logoutAction } from '@/actions/auth';
import { formatNumber } from '@/lib/utils';
import { UserRecord } from '@/lib/types';
import ScouterModal from '@/components/ScouterModal';
import SharePowerButton from '@/components/SharePowerButton';

export const metadata = {
  title: 'الملف الشخصي | دراغون بول كويز',
  description: 'إعدادات الملف الشخصي ومستوى الطاقة.',
};

export default async function ProfilePage() {
  const pb = await getPbServerClient();
  const user = pb.authStore.record as unknown as UserRecord | null;
  
  if (!pb.authStore.isValid || !user) {
    redirect('/');
  }

  const title = getPowerLevelTitle(user.power_level);

  return (
    <div className="max-w-5xl mx-auto w-full py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black font-display text-white mb-2">قاعدتك الخاصة</h1>
          <p className="text-slate-400">تابع إحصائياتك وعدل ملفك الشخصي.</p>
        </div>
        
        <form action={logoutAction}>
          <button type="submit" className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors bg-red-400/10 px-4 py-2 rounded-lg font-bold">
            <LogOut size={16} />
            <span className="hidden sm:inline">تسجيل الخروج</span>
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
            
            <h2 className="text-xl font-bold font-display text-white flex items-center gap-2 mb-6">
              <Gamepad2 className="text-orange-500" />
              <span>إحصائيات المعركة</span>
            </h2>
            
            <div className="flex flex-col gap-3 mb-6">
               <ScouterModal powerLevel={user.power_level} />
               <SharePowerButton powerLevel={user.power_level} />
            </div>

            <div className="space-y-4">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-500/20 p-2 rounded-lg"><Zap className="text-orange-500" size={20} /></div>
                  <span className="text-slate-300 font-medium">مستوى الطاقة</span>
                </div>
                <div className="font-black text-xl text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500 font-mono">
                  {formatNumber(user.power_level)}
                </div>
              </div>
              
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-500/20 p-2 rounded-lg"><Trophy className="text-yellow-500" size={20} /></div>
                  <span className="text-slate-300 font-medium">اللقب</span>
                </div>
                <div className="font-bold text-white text-sm bg-slate-700 px-3 py-1 rounded-full text-center">
                  {title}
                </div>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-red-500/20 p-2 rounded-lg text-xl">🔥</div>
                  <span className="text-slate-300 font-medium">أعلى متتالية</span>
                </div>
                <div className="font-black text-xl text-white font-mono">
                  {user.streak}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <h2 className="text-xl font-bold font-display text-white flex items-center gap-2 mb-8">
              <Settings className="text-slate-400" />
              <span>إعدادات المقاتل</span>
            </h2>
            
            <ProfileForm 
              user={{
                display_name: user.display_name,
                bio: user.bio,
                avatar_url: user.avatar_url,
                show_on_leaderboard: user.show_on_leaderboard
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
