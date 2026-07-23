"use client";

import React, { useState, useEffect } from "react";
import { Droplets, Wind, Gauge, Eye } from "lucide-react";

import { WeatherData, TempUnit, City } from "@/types/weather";
import { ThemeMode } from "@/types/theme";
import { fetchLiveWeather } from "@/services/weatherApi";
import { getEffectiveTheme } from "@/utils/themeHelpers";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SearchBar } from "@/components/search/SearchBar";

import { CurrentWeatherCard } from "@/components/weather/CurrentWeatherCard";
import { WeatherStat } from "@/components/weather/WeatherStat";
import { HourlyForecastChart } from "@/components/weather/HourlyForecastChart";
import { DailyForecastCard } from "@/components/weather/DailyForecastCard";
import { SunMoonCard } from "@/components/weather/SunMoonCard";
import { UvIndexCard } from "@/components/weather/UvIndexCard";
import { AirQualityCard } from "@/components/weather/AirQualityCard";
import { HumidityTrendChart } from "@/components/weather/HumidityTrendChart";

export default function WeatherDashboard() {
  const [city, setCity] = useState("London");
  const [searchQuery, setSearchQuery] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState<TempUnit>("C");
  const [themeMode, setThemeMode] = useState<ThemeMode>("auto");
  const [favorites, setFavorites] = useState<string[]>(["London", "New York"]);

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const fetchWeather = async (cityName: string, lat?: number, lon?: number, cityObj?: City) => {
    setLoading(true);
    const data = await fetchLiveWeather(cityName, lat, lon, cityObj);
    setWeather(data);
    setCity(data.city);
    setLoading(false);
  };

  const handleSelectCity = (cityName: string, lat?: number, lon?: number, cityObj?: City) => {
    fetchWeather(cityName, lat, lon, cityObj);
    setSearchQuery("");
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      fetchWeather(searchQuery.trim());
      setSearchQuery("");
    } else {
      fetchWeather(city);
    }
  };

  const toggleFavorite = (cityName: string) => {
    setFavorites((prev) =>
      prev.includes(cityName) ? prev.filter((c) => c !== cityName) : [...prev, cityName]
    );
  };

  const toggleUnit = () => {
    setUnit((prev) => (prev === "C" ? "F" : "C"));
  };

  const effectiveTheme = getEffectiveTheme(themeMode, weather?.condition);

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed transition-all duration-1000"
      style={{ backgroundImage: `url(${effectiveTheme.bgImage})` }}
    >
      {/* Dark Atmospheric Gradient Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${effectiveTheme.gradientOverlay} transition-all duration-1000 pointer-events-none z-0`}
      />

      <div className="relative z-10 flex flex-col min-h-screen justify-between">
        <Header
          unit={unit}
          onToggleUnit={toggleUnit}
          themeMode={themeMode}
          onThemeModeChange={setThemeMode}
          activeCondition={weather?.condition}
        />

        <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full">
          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              onSelectCity={handleSelectCity}
              onSearchSubmit={handleSearchSubmit}
            />
          </div>

          {/* Loading Spinner */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <div className="w-14 h-14 border-4 border-blue-400/20 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-slate-300 text-sm font-medium animate-pulse">
                Fetching live satellite & location telemetry...
              </p>
            </div>
          )}

          {/* Weather Dashboard View */}
          {weather && !loading && (
            <>
              {/* Dynamic Theme Weather Hero Card */}
              <CurrentWeatherCard
                weather={weather}
                unit={unit}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                theme={effectiveTheme}
              />

              {/* Quick Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <WeatherStat
                  icon={Droplets}
                  label="Humidity"
                  value={`${weather.humidity}%`}
                  color="text-blue-400"
                  bg="bg-blue-500/10 border border-blue-500/20"
                />
                <WeatherStat
                  icon={Wind}
                  label="Wind"
                  value={`${weather.windSpeed} km/h`}
                  color="text-cyan-400"
                  bg="bg-cyan-500/10 border border-cyan-500/20"
                  sub={`${weather.windDeg}°`}
                />
                <WeatherStat
                  icon={Gauge}
                  label="Pressure"
                  value={`${weather.pressure} hPa`}
                  color="text-purple-400"
                  bg="bg-purple-500/10 border border-purple-500/20"
                />
                <WeatherStat
                  icon={Eye}
                  label="Visibility"
                  value={`${weather.visibility} km`}
                  color="text-amber-400"
                  bg="bg-amber-500/10 border border-amber-500/20"
                />
              </div>

              {/* Detailed Analytics Grid */}
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column - Charts & Daily Forecast */}
                <div className="lg:col-span-2 space-y-6">
                  <HourlyForecastChart hourly={weather.hourly} />
                  <DailyForecastCard daily={weather.daily} unit={unit} />
                </div>

                {/* Right Column - Secondary Widgets */}
                <div className="space-y-6">
                  <SunMoonCard sunrise={weather.sunrise} sunset={weather.sunset} />
                  <UvIndexCard uvIndex={weather.uvIndex} />
                  <AirQualityCard aqi={weather.aqi} />
                  <HumidityTrendChart hourly={weather.hourly} />
                </div>
              </div>
            </>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}
