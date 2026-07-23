import React from "react";
import { LucideIcon } from "lucide-react";

interface WeatherStatProps {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
  bg: string;
  sub?: string;
}

export function WeatherStat({ icon: Icon, label, value, color, bg, sub }: WeatherStatProps) {
  return (
    <div className="bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-4 hover:border-slate-700 hover:bg-slate-900/80 transition-all shadow-lg">
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center shadow-inner`}>
          <Icon size={20} className={color} />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400">{label}</p>
          <p className="text-lg font-bold text-white tracking-tight">{value}</p>
          {sub && <p className="text-xs text-slate-400">{sub}</p>}
        </div>
      </div>
    </div>
  );
}
