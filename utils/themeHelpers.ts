import { ThemeMode, WeatherTheme } from "@/types/theme";

export const WEATHER_THEMES: Record<string, WeatherTheme> = {
  Clear: {
    id: "Clear",
    name: "Sunny & Clear",
    bgImage: "https://images.unsplash.com/photo-1601297183305-6df142704ea2?q=80&w=1920&auto=format&fit=crop",
    gradientOverlay: "from-amber-950/80 via-slate-950/85 to-slate-950/95",
    heroGradient: "from-amber-500 via-orange-500 to-amber-600",
    panelBg: "bg-slate-900/60 backdrop-blur-xl border-amber-500/20",
    accentText: "text-amber-400",
  },
  Clouds: {
    id: "Clouds",
    name: "Cloudy Sky",
    bgImage: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=1920&auto=format&fit=crop",
    gradientOverlay: "from-slate-950/80 via-slate-900/90 to-slate-950/95",
    heroGradient: "from-slate-600 via-blue-700 to-slate-800",
    panelBg: "bg-slate-900/60 backdrop-blur-xl border-slate-400/20",
    accentText: "text-slate-300",
  },
  Rain: {
    id: "Rain",
    name: "Rainy Mood",
    bgImage: "https://images.unsplash.com/photo-1519692933481-e162a57d6721?q=80&w=1920&auto=format&fit=crop",
    gradientOverlay: "from-blue-950/85 via-slate-950/90 to-slate-950/95",
    heroGradient: "from-blue-600 via-cyan-700 to-slate-900",
    panelBg: "bg-slate-900/60 backdrop-blur-xl border-blue-500/20",
    accentText: "text-blue-400",
  },
  Drizzle: {
    id: "Drizzle",
    name: "Light Rain",
    bgImage: "https://images.unsplash.com/photo-1519692933481-e162a57d6721?q=80&w=1920&auto=format&fit=crop",
    gradientOverlay: "from-cyan-950/85 via-slate-950/90 to-slate-950/95",
    heroGradient: "from-cyan-600 via-blue-600 to-slate-900",
    panelBg: "bg-slate-900/60 backdrop-blur-xl border-cyan-500/20",
    accentText: "text-cyan-400",
  },
  Thunderstorm: {
    id: "Thunderstorm",
    name: "Electric Storm",
    bgImage: "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?q=80&w=1920&auto=format&fit=crop",
    gradientOverlay: "from-purple-950/85 via-slate-950/90 to-slate-950/95",
    heroGradient: "from-purple-700 via-indigo-800 to-slate-950",
    panelBg: "bg-slate-900/60 backdrop-blur-xl border-purple-500/20",
    accentText: "text-purple-400",
  },
  Snow: {
    id: "Snow",
    name: "Winter Snow",
    bgImage: "https://images.unsplash.com/photo-1491002052546-bf38f186af56?q=80&w=1920&auto=format&fit=crop",
    gradientOverlay: "from-sky-950/80 via-slate-950/90 to-slate-950/95",
    heroGradient: "from-sky-500 via-blue-600 to-slate-800",
    panelBg: "bg-slate-900/60 backdrop-blur-xl border-sky-400/20",
    accentText: "text-sky-300",
  },
  Mist: {
    id: "Mist",
    name: "Misty & Foggy",
    bgImage: "https://images.unsplash.com/photo-1487621167305-5d248087c724?q=80&w=1920&auto=format&fit=crop",
    gradientOverlay: "from-gray-950/85 via-slate-950/90 to-slate-950/95",
    heroGradient: "from-slate-500 via-gray-600 to-slate-800",
    panelBg: "bg-slate-900/60 backdrop-blur-xl border-slate-400/20",
    accentText: "text-slate-300",
  },
  Fog: {
    id: "Fog",
    name: "Misty & Foggy",
    bgImage: "https://images.unsplash.com/photo-1487621167305-5d248087c724?q=80&w=1920&auto=format&fit=crop",
    gradientOverlay: "from-gray-950/85 via-slate-950/90 to-slate-950/95",
    heroGradient: "from-slate-500 via-gray-600 to-slate-800",
    panelBg: "bg-slate-900/60 backdrop-blur-xl border-slate-400/20",
    accentText: "text-slate-300",
  },
};

export function getEffectiveTheme(themeMode: ThemeMode, weatherCondition?: string): WeatherTheme {
  const conditionKey = themeMode === "auto" ? (weatherCondition || "Clear") : themeMode;
  return WEATHER_THEMES[conditionKey] || WEATHER_THEMES["Clear"];
}
