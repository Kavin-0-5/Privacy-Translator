import { motion } from "motion/react";

interface RiskMeterProps {
  score: number;
  level: string;
}

export default function RiskMeter({ score, level }: RiskMeterProps) {
  // Color calculation
  const getColors = (s: number) => {
    if (s < 30) return { bg: "bg-emerald-500", text: "text-emerald-700", border: "border-emerald-200", light: "bg-emerald-50" };
    if (s < 60) return { bg: "bg-amber-500", text: "text-amber-700", border: "border-amber-200", light: "bg-amber-50" };
    if (s < 85) return { bg: "bg-orange-600", text: "text-orange-700", border: "border-orange-200", light: "bg-orange-50" };
    return { bg: "bg-red-600", text: "text-red-700", border: "border-red-200", light: "bg-red-50" };
  };

  const colors = getColors(score);

  return (
    <div className={`p-8 rounded-3xl border-2 ${colors.border} ${colors.light} flex flex-col items-center justify-center space-y-4 shadow-sm`}>
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="80"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            className="text-white/40"
          />
          <motion.circle
            cx="96"
            cy="96"
            r="80"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            strokeDasharray={502.4}
            initial={{ strokeDashoffset: 502.4 }}
            animate={{ strokeDashoffset: 502.4 - (502.4 * score) / 100 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={colors.text}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-black tracking-tighter text-slate-900">{score}</span>
          <span className="text-xs uppercase font-bold tracking-widest text-slate-500">Risk Score</span>
        </div>
      </div>
      <div className="text-center">
        <h3 className={`text-2xl font-bold ${colors.text}`}>{level}</h3>
        <p className="text-sm text-slate-600 max-w-[200px]">Overall privacy risk assessment based on AI analysis.</p>
      </div>
    </div>
  );
}
