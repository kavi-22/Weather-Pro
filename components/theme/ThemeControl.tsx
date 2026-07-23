"use client";

import React from "react";
import { Palette, Sparkles } from "lucide-react";
import { ThemeMode } from "@/types/theme";
import { WEATHER_THEMES } from "@/utils/themeHelpers";

interface ThemeControlProps {
  themeMode: ThemeMode;
  onThemeModeChange: (mode: ThemeMode) => void;
  activeCondition?: string;
}

export function ThemeControl({
  themeMode,
  onThemeModeChange,
  activeCondition = "Clear",
}: ThemeControlProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative inline-block text-left">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 backdrop-blur-md rounded-lg border border-slate-700 text-xs text-slate-200">
          <Palette size={14} className="text-blue-400" />
          <span className="font-medium hidden sm:inline">Theme:</span>
          <select
            value={themeMode}
            onChange={(e) => onThemeModeChange(e.target.value as ThemeMode)}
            className="bg-transparent text-white focus:outline-none cursor-pointer font-semibold py-0.5"
          >
            <option value="auto" className="bg-slate-900 text-white">
              ⚡ Auto ({activeCondition})
            </option>
            {Object.keys(WEATHER_THEMES).map((key) => (
              <option key={key} value={key} className="bg-slate-900 text-white">
                {WEATHER_THEMES[key].name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
