'use client';

import { Share2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SharePowerButton({ powerLevel }: { powerLevel: number }) {
  const handleShare = async () => {
    const text = `مستوى طاقتي في دراغون بول كويز هو ${new Intl.NumberFormat('en-US').format(powerLevel)}! هل يمكنك هزيمتي؟`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'دراغون بول كويز',
          text,
          url: window.location.origin
        });
      } catch (err) {
        // user cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(`${text} ${window.location.origin}`);
      toast.success('تم نسخ الرابط والمستوى بنجاح!');
    }
  };

  return (
    <button 
      onClick={handleShare}
      className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-xl transition-colors font-bold border border-slate-700"
    >
      <Share2 size={18} />
      <span>مشاركة القوة</span>
    </button>
  );
}
