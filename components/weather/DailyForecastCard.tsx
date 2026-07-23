import React from "react";
import { Calendar, Droplets, Wind } from "lucide-react";
import { DailyForecast, TempUnit } from "@/types/weather";
import { convertTemp } from "@/utils/weatherHelpers";
import { WeatherIcon } from "./WeatherIcon";

interface DailyForecastCardProps {
  daily: DailyForecast[];
  unit: TempUnit;
}

export function DailyForecastCard({ daily, unit }: DailyForecastCardProps) {
  return (
    <div className="bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-6 shadow-lg">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-white">
        <Calendar size={18} className="text-blue-400" /> 7-Day Forecast
      </h3>
      <div className="space-y-3">
        {daily.map((day, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-700/50"
          >
            <div className="flex items-center gap-4 w-32">
              <span className="font-semibold text-sm text-slate-200">{day.day}</span>
            </div>
            <div className="flex items-center gap-2">
              <WeatherIcon condition={day.condition} size={22} />
            </div>
            <div className="flex items-center gap-4 flex-1 justify-end">
              <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                <Droplets size={14} className="text-cyan-400" />
                {day.humidity}%
              </div>
              <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                <Wind size={14} className="text-blue-400" />
                {day.wind}km/h
              </div>
              <div className="flex items-center gap-3 w-24">
                <span className="text-xs text-slate-400">{convertTemp(day.min, unit)}°</span>
                <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 to-amber-400 rounded-full"
                    style={{ width: `${Math.min(Math.max(((day.max - day.min) / 20) * 100, 20), 100)}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-100">{convertTemp(day.max, unit)}°</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
