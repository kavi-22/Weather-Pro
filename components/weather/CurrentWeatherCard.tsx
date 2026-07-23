import React from "react";
import { MapPin, Navigation, Thermometer, ArrowUp, ArrowDown } from "lucide-react";
import { WeatherData, TempUnit } from "@/types/weather";
import { WeatherTheme } from "@/types/theme";
import { convertTemp } from "@/utils/weatherHelpers";
import { WeatherIcon } from "./WeatherIcon";

interface CurrentWeatherCardProps {
  weather: WeatherData;
  unit: TempUnit;
  favorites: string[];
  onToggleFavorite: (city: string) => void;
  theme: WeatherTheme;
}

export function CurrentWeatherCard({
  weather,
  unit,
  favorites,
  onToggleFavorite,
  theme,
}: CurrentWeatherCardProps) {
  const isFavorite = favorites.includes(weather.city);

  return (
    <div
      className={`bg-gradient-to-br ${theme.heroGradient} rounded-3xl p-8 text-white mb-8 relative overflow-hidden shadow-2xl border border-white/10 transition-all duration-700`}
    >
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin size={22} className="text-white/90 shrink-0" />
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {weather.fullLocation}
              </h2>
            </div>
            <p className="text-white/80 text-sm capitalize font-medium">{weather.description}</p>
          </div>
          <button
            onClick={() => onToggleFavorite(weather.city)}
            className="p-2.5 bg-white/15 backdrop-blur-md rounded-full hover:bg-white/30 transition-all shadow-sm shrink-0"
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Navigation size={18} className={isFavorite ? "fill-white text-white" : "text-white"} />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-6 justify-between">
          <div className="flex items-center gap-6">
            <div className="text-7xl font-black tracking-tighter drop-shadow-md">
              {convertTemp(weather.temp, unit)}°
            </div>
            <div className="space-y-1 text-white/90 text-sm font-medium">
              <div className="flex items-center gap-2">
                <Thermometer size={16} />
                <span>Feels like {convertTemp(weather.feelsLike, unit)}°</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <ArrowUp size={15} className="text-emerald-300" /> H: {convertTemp(weather.daily[0].max, unit)}°
                </span>
                <span className="flex items-center gap-1">
                  <ArrowDown size={15} className="text-blue-200" /> L: {convertTemp(weather.daily[0].min, unit)}°
                </span>
              </div>
            </div>
          </div>
          <div className="ml-auto drop-shadow-xl animate-pulse">
            <WeatherIcon condition={weather.condition} size={88} />
          </div>
        </div>
      </div>
    </div>
  );
}
