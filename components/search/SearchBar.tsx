"use client";

import React, { useState, useEffect } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { City } from "@/types/weather";
import { searchLiveCities } from "@/services/weatherApi";

interface SearchBarProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSelectCity: (cityName: string, lat?: number, lon?: number, cityObj?: City) => void;
  onSearchSubmit: () => void;
}

export function SearchBar({
  searchQuery,
  onSearchQueryChange,
  onSelectCity,
  onSearchSubmit,
}: SearchBarProps) {
  const [liveCities, setLiveCities] = useState<City[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setLiveCities([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchLiveCities(searchQuery);
      setLiveCities(results);
      setIsSearching(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="relative flex-1">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setLiveCities([]);
                onSearchSubmit();
              }
            }}
            placeholder="Search city, state, or country (e.g. London, California, Tokyo)..."
            className="w-full pl-12 pr-10 py-3 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all shadow-inner"
          />
          {isSearching && (
            <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 animate-spin" />
          )}
          {liveCities.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden">
              {liveCities.map((c, i) => (
                <button
                  key={`${c.name}-${c.lat}-${i}`}
                  onClick={() => {
                    setLiveCities([]);
                    onSelectCity(c.name, c.lat, c.lon, c);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800/80 transition-colors text-left text-slate-200 border-b border-slate-800/40 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-blue-400 shrink-0" />
                    <div>
                      <span className="font-semibold text-white">{c.name}</span>
                      {c.state && (
                        <span className="text-slate-300 text-xs ml-1.5 font-medium">
                          ({c.state})
                        </span>
                      )}
                      <p className="text-xs text-slate-400">{c.fullLocation}</p>
                    </div>
                  </div>
                  {c.countryCode && (
                    <span className="text-slate-400 text-xs px-2 py-0.5 bg-slate-800 rounded-md font-mono shrink-0">
                      {c.countryCode}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={() => {
            setLiveCities([]);
            onSearchSubmit();
          }}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/25"
        >
          Search
        </button>
      </div>
    </div>
  );
}
