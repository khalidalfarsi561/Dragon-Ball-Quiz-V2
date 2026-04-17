import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface ProgressStripProps {
  value: number;
  label?: string;
  sublabel?: string;
  className?: string;
}

export default function ProgressStrip({ 
  value, 
  label, 
  sublabel,
  className 
}: ProgressStripProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {(label || sublabel) && (
        <div className="flex justify-between items-end gap-2 px-1">
          {label && <span className="text-xs font-bold text-slate-300">{label}</span>}
          {sublabel && <span className="text-[10px] font-bold text-slate-500 uppercase">{sublabel}</span>}
        </div>
      )}
      <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-[1px]">
        <motion.div 
          className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.3)]"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
