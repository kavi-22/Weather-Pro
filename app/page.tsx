"use client";

import React, { useState, useEffect, useMemo } from "react";
import Head from "next/head";
import {
  Search, MapPin, Wind, Droplets, Eye, Gauge, Sunrise, Sunset,
  Cloud, CloudRain, Sun, Snowflake, CloudLightning, CloudFog,
  Thermometer, Navigation, Calendar, TrendingUp, ArrowUp, ArrowDown
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from "recharts";

// ============================================
// MOCK DATA (Replace with real OpenWeatherMap API)
// ============================================
const MOCK_CITIES = [
  { name: "London", country: "GB", lat: 51.5074, lon: -0.1278 },
  { name: "New York", country: "US", lat: 40.7128, lon: -74.0060 },
  { name: "Tokyo", country: "JP", lat: 35.6762, lon: 139.6503 },
  { name: "Sydney", country: "AU", lat: -33.8688, lon: 151.2093 },
  { name: "Paris", country: "FR", lat: 48.8566, lon: 2.3522 },
  { name: "Mumbai", country: "IN", lat: 19.0760, lon: 72.8777 },
  { name: "Dubai", country: "AE", lat: 25.2048, lon: 55.2708 },
  { name: "Singapore", country: "SG", lat: 1.3521, lon: 103.8198 },
];

interface WeatherData {
  city: string;
  country: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDeg: number;
  pressure: number;
  visibility: number;
  description: string;
  condition: string;
  sunrise: string;
  sunset: string;
  uvIndex: number;
  hourly: { time: string; temp: number; humidity: number }[];
  daily: { day: string; min: number; max: number; condition: string; humidity: number; wind: number }[];
  aqi: number;
}

function generateMockWeather(city: string): WeatherData {
  const baseTemp = city === "Dubai" ? 35 : city === "Mumbai" ? 30 : city === "London" ? 15 : city === "New York" ? 20 : 25;
  const conditions = ["Clear", "Clouds", "Rain", "Drizzle", "Thunderstorm", "Snow", "Mist"];
  const condition = conditions[Math.floor(Math.random() * conditions.length)];

  const hourly = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    temp: Math.round(baseTemp + Math.sin((i - 6) * Math.PI / 12) * 8 + Math.random() * 3),
    humidity: Math.round(50 + Math.random() * 40),
  }));

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date().getDay();
  const daily = Array.from({ length: 7 }, (_, i) => {
    const dayIndex = (today + i) % 7;
    return {
      day: i === 0 ? "Today" : days[dayIndex],
      min: Math.round(baseTemp - 5 + Math.random() * 3),
      max: Math.round(baseTemp + 5 + Math.random() * 3),
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      humidity: Math.round(40 + Math.random() * 50),
      wind: Math.round(5 + Math.random() * 20),
    };
  });

  return {
    city,
    country: MOCK_CITIES.find((c) => c.name === city)?.country || "",
    temp: Math.round(baseTemp + Math.random() * 5),
    feelsLike: Math.round(baseTemp + Math.random() * 3 - 2),
    humidity: Math.round(40 + Math.random() * 50),
    windSpeed: Math.round(5 + Math.random() * 20),
    windDeg: Math.round(Math.random() * 360),
    pressure: Math.round(1000 + Math.random() * 30),
    visibility: Math.round(5 + Math.random() * 10),
    description: condition === "Clear" ? "clear sky" : condition === "Clouds" ? "scattered clouds" : condition === "Rain" ? "light rain" : "few clouds",
    condition,
    sunrise: "06:23",
    sunset: "18:45",
    uvIndex: Math.round(Math.random() * 10),
    hourly,
    daily,
    aqi: Math.round(Math.random() * 200),
  };
}

function getWeatherIcon(condition: string, size = 24) {
  const props = { size, className: "text-white" };
  switch (condition) {
    case "Clear": return <Sun {...props} className="text-amber-400" />;
    case "Clouds": return <Cloud {...props} className="text-slate-300" />;
    case "Rain": return <CloudRain {...props} className="text-blue-400" />;
    case "Drizzle": return <CloudRain {...props} className="text-cyan-400" />;
    case "Thunderstorm": return <CloudLightning {...props} className="text-purple-400" />;
    case "Snow": return <Snowflake {...props} className="text-sky-200" />;
    case "Mist": case "Fog": return <CloudFog {...props} className="text-slate-400" />;
    default: return <Sun {...props} className="text-amber-400" />;
  }
}

function getAQIInfo(aqi: number) {
  if (aqi <= 50) return { label: "Good", color: "bg-emerald-500", text: "text-emerald-600" };
  if (aqi <= 100) return { label: "Moderate", color: "bg-yellow-500", text: "text-yellow-600" };
  if (aqi <= 150) return { label: "Unhealthy for Sensitive", color: "bg-orange-500", text: "text-orange-600" };
  if (aqi <= 200) return { label: "Unhealthy", color: "bg-red-500", text: "text-red-600" };
  return { label: "Very Unhealthy", color: "bg-purple-500", text: "text-purple-600" };
}

function getUVInfo(uv: number) {
  if (uv <= 2) return { label: "Low", color: "bg-emerald-500" };
  if (uv <= 5) return { label: "Moderate", color: "bg-yellow-500" };
  if (uv <= 7) return { label: "High", color: "bg-orange-500" };
  if (uv <= 10) return { label: "Very High", color: "bg-red-500" };
  return { label: "Extreme", color: "bg-purple-500" };
}

export default function WeatherDashboard() {
  const [city, setCity] = useState("London");
  const [searchQuery, setSearchQuery] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState<"C" | "F">("C");
  const [favorites, setFavorites] = useState<string[]>(["London", "New York"]);

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  const fetchWeather = (cityName: string) => {
    setLoading(true);
    setTimeout(() => {
      setWeather(generateMockWeather(cityName));
      setLoading(false);
    }, 800);
  };

  const filteredCities = useMemo(() => {
    if (!searchQuery) return [];
    return MOCK_CITIES.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  const convertTemp = (temp: number) => unit === "C" ? temp : Math.round(temp * 9 / 5 + 32);

  const toggleFavorite = (cityName: string) => {
    setFavorites((prev) => prev.includes(cityName) ? prev.filter((c) => c !== cityName) : [...prev, cityName]);
  };

  const aqiInfo = weather ? getAQIInfo(weather.aqi) : null;
  const uvInfo = weather ? getUVInfo(weather.uvIndex) : null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Head><title>Weather Dashboard Pro</title></Head>

      {/* Header */}
      <header className="bg-slate-900 text-white py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
              <Cloud size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Weather Pro</h1>
              <p className="text-slate-400 text-xs">Real-time Weather Analytics</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setUnit(unit === "C" ? "F" : "C")}
              className="px-3 py-1.5 bg-slate-800 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
            >
              °{unit}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              {filteredCities.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
                  {filteredCities.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => { setCity(c.name); setSearchQuery(""); }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                    >
                      <MapPin size={16} className="text-slate-400" />
                      <span className="font-medium">{c.name}</span>
                      <span className="text-slate-400 text-sm">{c.country}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => fetchWeather(city)}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
            >
              Search
            </button>
          </div>

          {/* Quick Cities */}
          <div className="flex flex-wrap gap-2 mt-3">
            {favorites.map((fav) => (
              <button
                key={fav}
                onClick={() => setCity(fav)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${city === fav ? "bg-blue-500 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
              >
                {fav}
              </button>
            ))}
            {MOCK_CITIES.filter((c) => !favorites.includes(c.name)).slice(0, 4).map((c) => (
              <button
                key={c.name}
                onClick={() => setCity(c.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${city === c.name ? "bg-blue-500 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}

        {weather && !loading && (
          <>
            {/* Main Weather Card */}
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl p-8 text-white mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin size={18} />
                      <h2 className="text-2xl font-bold">{weather.city}, {weather.country}</h2>
                    </div>
                    <p className="text-blue-100 capitalize">{weather.description}</p>
                  </div>
                  <button
                    onClick={() => toggleFavorite(weather.city)}
                    className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                  >
                    <Navigation size={18} className={favorites.includes(weather.city) ? "fill-white" : ""} />
                  </button>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-7xl font-bold">{convertTemp(weather.temp)}°</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-blue-100">
                      <Thermometer size={16} />
                      <span>Feels like {convertTemp(weather.feelsLike)}°</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-100">
                      <ArrowUp size={16} />
                      <span>H: {convertTemp(weather.daily[0].max)}°</span>
                      <ArrowDown size={16} />
                      <span>L: {convertTemp(weather.daily[0].min)}°</span>
                    </div>
                  </div>
                  <div className="ml-auto">
                    {getWeatherIcon(weather.condition, 80)}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <WeatherStat icon={Droplets} label="Humidity" value={`${weather.humidity}%`} color="text-blue-600" bg="bg-blue-50" />
              <WeatherStat icon={Wind} label="Wind" value={`${weather.windSpeed} km/h`} color="text-cyan-600" bg="bg-cyan-50" sub={`${weather.windDeg}°`} />
              <WeatherStat icon={Gauge} label="Pressure" value={`${weather.pressure} hPa`} color="text-purple-600" bg="bg-purple-50" />
              <WeatherStat icon={Eye} label="Visibility" value={`${weather.visibility} km`} color="text-amber-600" bg="bg-amber-50" />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Hourly Forecast */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <TrendingUp size={18} className="text-blue-500" /> 24-Hour Temperature
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={weather.hourly}>
                      <defs>
                        <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="time" tick={{ fontSize: 10 }} interval={3} />
                      <YAxis tick={{ fontSize: 10 }} domain={["dataMin - 5", "dataMax + 5"]} />
                      <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                      <Area type="monotone" dataKey="temp" stroke="#3b82f6" fill="url(#tempGradient)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* 7-Day Forecast */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Calendar size={18} className="text-blue-500" /> 7-Day Forecast
                  </h3>
                  <div className="space-y-3">
                    {weather.daily.map((day, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4 w-32">
                          <span className="font-semibold text-sm">{day.day}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getWeatherIcon(day.condition, 20)}
                        </div>
                        <div className="flex items-center gap-4 flex-1 justify-end">
                          <div className="flex items-center gap-1 text-slate-500 text-sm">
                            <Droplets size={14} />
                            {day.humidity}%
                          </div>
                          <div className="flex items-center gap-1 text-slate-500 text-sm">
                            <Wind size={14} />
                            {day.wind}km/h
                          </div>
                          <div className="flex items-center gap-3 w-24">
                            <span className="text-sm text-slate-400">{convertTemp(day.min)}°</span>
                            <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-400 to-amber-400 rounded-full"
                                style={{ width: `${((day.max - day.min) / 20) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold">{convertTemp(day.max)}°</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Panel */}
              <div className="space-y-6">
                {/* Sun Times */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h3 className="font-bold mb-4">Sun & Moon</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                          <Sunrise size={18} className="text-amber-500" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Sunrise</p>
                          <p className="font-semibold">{weather.sunrise}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                          <Sunset size={18} className="text-orange-500" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Sunset</p>
                          <p className="font-semibold">{weather.sunset}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* UV Index */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h3 className="font-bold mb-4">UV Index</h3>
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 ${uvInfo?.color} rounded-2xl flex items-center justify-center text-white text-2xl font-bold`}>
                      {weather.uvIndex}
                    </div>
                    <div>
                      <p className="font-semibold">{uvInfo?.label}</p>
                      <p className="text-sm text-slate-500">
                        {weather.uvIndex <= 2 ? "No protection needed" : weather.uvIndex <= 5 ? "Wear sunscreen" : "Avoid direct sun"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className={`h-full ${uvInfo?.color} rounded-full transition-all`} style={{ width: `${(weather.uvIndex / 11) * 100}%` }} />
                  </div>
                </div>

                {/* Air Quality */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h3 className="font-bold mb-4">Air Quality</h3>
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 ${aqiInfo?.color} rounded-2xl flex items-center justify-center text-white text-xl font-bold`}>
                      {weather.aqi}
                    </div>
                    <div>
                      <p className="font-semibold">{aqiInfo?.label}</p>
                      <p className="text-sm text-slate-500">AQI Index</p>
                    </div>
                  </div>
                  <div className="mt-4 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className={`h-full ${aqiInfo?.color} rounded-full transition-all`} style={{ width: `${Math.min((weather.aqi / 300) * 100, 100)}%` }} />
                  </div>
                </div>

                {/* Humidity Chart */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h3 className="font-bold mb-4">Humidity Trend</h3>
                  <ResponsiveContainer width="100%" height={150}>
                    <LineChart data={weather.hourly.slice(0, 12)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="time" tick={{ fontSize: 9 }} interval={2} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 9 }} />
                      <Tooltip contentStyle={{ borderRadius: "8px", border: "none" }} />
                      <Line type="monotone" dataKey="humidity" stroke="#06b6d4" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <footer className="py-6 text-center text-slate-400 text-sm border-t border-slate-200 mt-12">
        <p>Data provided by OpenWeatherMap API (Mock) | Built with Next.js & Recharts</p>
      </footer>
    </div>
  );
}

function WeatherStat({ icon: Icon, label, value, color, bg, sub }: { icon: any; label: string; value: string; color: string; bg: string; sub?: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center`}>
          <Icon size={20} className={color} />
        </div>
        <div>
          <p className="text-xs text-slate-500">{label}</p>
          <p className="text-lg font-bold text-slate-900">{value}</p>
          {sub && <p className="text-xs text-slate-400">{sub}</p>}
        </div>
      </div>
    </div>
  );
}
