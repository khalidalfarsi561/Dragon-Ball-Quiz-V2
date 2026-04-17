'use client';

import { useState, useRef } from 'react';
import { updateProfileAction } from '@/actions/profile';
import { toast } from 'sonner';
import { Loader2, Camera, Save } from 'lucide-react';
import UserAvatar from './UserAvatar';

interface ProfileFormProps {
  user: {
    display_name: string;
    bio: string;
    avatar_url: string;
    show_on_leaderboard: boolean;
  }
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [pending, setPending] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('حجم الصورة يجب أن لا يتجاوز 5 ميجابايت');
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    const formData = new FormData(e.currentTarget);
    
    // Checkbox edge case in FormData
    formData.set('show_on_leaderboard', (e.currentTarget.elements.namedItem('show_on_leaderboard') as HTMLInputElement).checked ? 'true' : 'false');
    
    const res = await updateProfileAction(formData);
    setPending(false);

    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success('تم حفظ التغييرات بنجاح');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <UserAvatar 
            src={previewAvatar || user.avatar_url} 
            alt="صورة الملف الشخصي" 
            size={100}
            className="border-2 border-orange-500 group-hover:opacity-80 transition-opacity"
          />
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="text-white" />
          </div>
          <input 
            type="file" 
            name="avatar_file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        
        <div className="flex-1 w-full space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="display_name">
              الاسم (الظاهر للآخرين)
            </label>
            <input 
              type="text" 
              id="display_name" 
              name="display_name" 
              defaultValue={user.display_name}
              required
              maxLength={50}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-right" 
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="bio">
          نبذة عنك (Bio)
        </label>
        <textarea 
          id="bio" 
          name="bio" 
          defaultValue={user.bio}
          maxLength={200}
          rows={3}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-right resize-none" 
        />
      </div>

      <div className="flex items-center gap-3 bg-slate-800/50 p-4 rounded-xl border border-slate-800">
        <input 
          type="checkbox" 
          id="show_on_leaderboard" 
          name="show_on_leaderboard"
          defaultChecked={user.show_on_leaderboard}
          className="w-5 h-5 accent-orange-500 bg-slate-700 border-slate-600 rounded"
        />
        <label htmlFor="show_on_leaderboard" className="text-sm text-slate-300 select-none cursor-pointer">
          إظهار اسمي وطاقتي في لوحة الشرف
        </label>
      </div>

      <button 
        type="submit" 
        disabled={pending}
        className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-yellow-600 hover:from-orange-600 hover:to-yellow-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {pending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
        <span>حفظ الإعدادات</span>
      </button>
    </form>
  );
}
