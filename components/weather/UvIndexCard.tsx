import React from "react";
import { getUVInfo } from "@/utils/weatherHelpers";

interface UvIndexCardProps {
  uvIndex: number;
}

export function UvIndexCard({ uvIndex }: UvIndexCardProps) {
  const uvInfo = getUVInfo(uvIndex);

  return (
    <div className="bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-6 shadow-lg">
      <h3 className="font-bold mb-4 text-white text-base">UV Index</h3>
      <div className="flex items-center gap-4">
        <div
          className={`w-14 h-14 ${uvInfo.color} rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg`}
        >
          {uvIndex}
        </div>
        <div>
          <p className="font-semibold text-white">{uvInfo.label}</p>
          <p className="text-xs text-slate-400">
            {uvIndex <= 2
              ? "No protection needed"
              : uvIndex <= 5
              ? "Wear sunscreen"
              : "Avoid direct sun"}
          </p>
        </div>
      </div>
      <div className="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${uvInfo.color} rounded-full transition-all duration-500`}
          style={{ width: `${Math.min((uvIndex / 11) * 100, 100)}%` }}
        />
      </div>
    </div>
  );
}
