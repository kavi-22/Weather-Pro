import React from "react";
import { Sunrise, Sunset } from "lucide-react";

interface SunMoonCardProps {
  sunrise: string;
  sunset: string;
}

export function SunMoonCard({ sunrise, sunset }: SunMoonCardProps) {
  return (
    <div className="bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-6 shadow-lg">
      <h3 className="font-bold mb-4 text-white text-base">Sun & Moon</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center">
              <Sunrise size={18} className="text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Sunrise</p>
              <p className="font-semibold text-white">{sunrise}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center justify-center">
              <Sunset size={18} className="text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Sunset</p>
              <p className="font-semibold text-white">{sunset}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
