import Image from 'next/image';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

interface UserAvatarProps {
  src?: string | null;
  alt?: string | null;
  size?: number;
  className?: string;
}

export default function UserAvatar({ src, alt, size = 40, className }: UserAvatarProps) {
  return (
    <div 
      className={cn("relative overflow-hidden rounded-full bg-slate-800 flex items-center justify-center border-2 border-slate-700 shrink-0", className)}
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt || "الصورة الرمزية"}
          fill
          referrerPolicy="no-referrer"
          className="object-cover"
          sizes={`${size}px`}
        />
      ) : (
        <User className="text-slate-500" size={Math.round(size * 0.6)} />
      )}
    </div>
  );
}
