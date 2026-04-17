'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction, signupAction } from '@/actions/auth';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function AuthModal() {
  const [isLogin, setIsLogin] = useState(true);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    
    const formData = new FormData(e.currentTarget);
    const result = isLogin ? await loginAction(formData) : await signupAction(formData);
    
    setPending(false);

    if (result.error) {
      toast.error(result.error);
    } else if (result.success) {
      toast.success(isLogin ? 'تم تسجيل الدخول بنجاح!' : 'تم إنشاء الحساب بنجاح!');
      router.push('/series');
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold font-display text-white text-center">
        {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="email">
            البريد الإلكتروني
          </label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            dir="ltr"
            required
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 text-left" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="password">
            كلمة المرور
          </label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            dir="ltr"
            required
            minLength={6}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 text-left tracking-widest" 
          />
        </div>
        
        <button 
          type="submit" 
          disabled={pending}
          className="w-full bg-gradient-to-r from-orange-500 to-yellow-600 hover:from-orange-600 hover:to-yellow-700 text-white font-bold py-2.5 rounded-lg transition-all shadow-lg shadow-orange-900/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {pending && <Loader2 className="animate-spin" size={18} />}
          <span>{isLogin ? 'ابدأ التحدي' : 'انضم الآن'}</span>
        </button>
      </form>
      
      <div className="text-center">
        <button 
          onClick={() => setIsLogin(!isLogin)} 
          className="text-sm text-slate-400 hover:text-orange-400 transition-colors"
          type="button"
        >
          {isLogin ? 'لا تملك حساباً؟ سجل الآن' : 'لديك حساب أصلًا؟ سجل دخولك'}
        </button>
      </div>
    </div>
  );
}
