import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Info, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";

interface InfoNoticeProps {
  title?: string;
  children: ReactNode;
  tone?: "default" | "info" | "success" | "warning";
  className?: string;
}

export default function InfoNotice({ 
  title, 
  children, 
  tone = "default",
  className 
}: InfoNoticeProps) {
  const icons = {
    default: Info,
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
  };

  const tones = {
    default: "bg-slate-900 border-slate-800 text-slate-300",
    info: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    success: "bg-green-500/10 border-green-500/20 text-green-400",
    warning: "bg-orange-500/10 border-orange-500/20 text-orange-400",
  };

  const Icon = icons[tone];

  return (
    <div className={cn(
      "flex gap-4 p-4 rounded-xl border",
      tones[tone],
      className
    )}>
      <Icon className="shrink-0 mt-0.5" size={18} />
      <div className="space-y-1">
        {title && <h4 className="font-bold text-sm">{title}</h4>}
        <div className="text-sm leading-relaxed opacity-90">
          {children}
        </div>
      </div>
    </div>
  );
}
