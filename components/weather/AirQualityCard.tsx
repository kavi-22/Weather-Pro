import React from "react";
import { getAQIInfo } from "@/utils/weatherHelpers";

interface AirQualityCardProps {
  aqi: number;
}

export function AirQualityCard({ aqi }: AirQualityCardProps) {
  const aqiInfo = getAQIInfo(aqi);

  return (
    <div className="bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-6 shadow-lg">
      <h3 className="font-bold mb-4 text-white text-base">Air Quality</h3>
      <div className="flex items-center gap-4">
        <div
          className={`w-14 h-14 ${aqiInfo.color} rounded-2xl flex items-center justify-center text-white text-lg font-black shadow-lg`}
        >
          {aqi}
        </div>
        <div>
          <p className="font-semibold text-white">{aqiInfo.label}</p>
          <p className="text-xs text-slate-400">AQI Index</p>
        </div>
      </div>
      <div className="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${aqiInfo.color} rounded-full transition-all duration-500`}
          style={{ width: `${Math.min((aqi / 300) * 100, 100)}%` }}
        />
      </div>
    </div>
  );
}
