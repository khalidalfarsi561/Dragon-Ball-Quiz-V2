import { getPbServerClient } from '@/lib/pocketbase';
import { redirect } from 'next/navigation';
import AuthModal from '@/components/AuthModal';

export default async function HomePage() {
  const pb = await getPbServerClient();
  
  if (pb.authStore.isValid) {
    redirect('/series');
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center -mt-16 py-12">
      <div className="max-w-xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-400 via-orange-500 to-yellow-600 drop-shadow-sm font-display">
            دراغون بول كويز
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 font-medium max-w-md mx-auto">
            أثبت أنك السياجين الأقوى. أجب عن الأسئلة، ارفع مستوى طاقتك، وتصدر الترتيب!
          </p>
        </div>
        
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-6 shadow-xl w-full max-w-sm mx-auto space-y-8">
          <div className="grid grid-cols-2 gap-4 text-right">
            {[
              { label: 'اختر سلسلة', icon: '🎯' },
              { label: 'أجب عن الأسئلة', icon: '⚡' },
              { label: 'ارفع طاقتك', icon: '🔥' },
              { label: 'تصدر الترتيب', icon: '🏆' },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center p-2 rounded-xl bg-slate-800/30 border border-slate-700/50">
                <span className="text-2xl mb-1">{step.icon}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{step.label}</span>
              </div>
            ))}
          </div>

          <div className="h-px bg-slate-800" />
          
          <AuthModal />
        </div>
      </div>
    </div>
  );
}
