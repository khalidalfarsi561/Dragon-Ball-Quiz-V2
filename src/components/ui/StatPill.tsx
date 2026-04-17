import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatPillProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export default function StatPill({ 
  label, 
  value, 
  icon,
  className 
}: StatPillProps) {
  return (
    <div className={cn(
      "flex items-center gap-2.5 bg-slate-900/80 border border-slate-800 rounded-full px-4 py-2 shadow-sm",
      className
    )}>
      {icon && <div className="text-orange-500">{icon}</div>}
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter leading-none mb-1">
          {label}
        </span>
        <span className="text-sm font-black text-white leading-none">
          {value}
        </span>
      </div>
    </div>
  );
}
