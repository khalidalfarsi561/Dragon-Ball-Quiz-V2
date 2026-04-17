import { cn } from "@/lib/utils";

interface SectionIntroProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  align?: "start" | "center";
  className?: string;
}

export default function SectionIntro({ 
  title, 
  subtitle, 
  eyebrow, 
  align = "start",
  className 
}: SectionIntroProps) {
  return (
    <div className={cn(
      "space-y-2 mb-8",
      align === "center" && "text-center",
      className
    )}>
      {eyebrow && (
        <span className="text-orange-500 font-bold text-xs uppercase tracking-widest block font-display">
          {eyebrow}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-slate-400 font-medium max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
