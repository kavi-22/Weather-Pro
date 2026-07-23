import React from "react";
import { Cloud } from "lucide-react";
import { TempUnit } from "@/types/weather";
import { ThemeMode } from "@/types/theme";
import { ThemeControl } from "@/components/theme/ThemeControl";

interface HeaderProps {
  unit: TempUnit;
  onToggleUnit: () => void;
  themeMode: ThemeMode;
  onThemeModeChange: (mode: ThemeMode) => void;
  activeCondition?: string;
}

export function Header({
  unit,
  onToggleUnit,
  themeMode,
  onThemeModeChange,
  activeCondition,
}: HeaderProps) {
  return (
    <header className="bg-slate-950/80 backdrop-blur-xl text-white py-4 shadow-lg border-b border-slate-800/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-cyan-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Cloud size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              Weather Pro
            </h1>
            <p className="text-slate-400 text-xs">Real-time Dynamic Weather Analytics</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ThemeControl
            themeMode={themeMode}
            onThemeModeChange={onThemeModeChange}
            activeCondition={activeCondition}
          />
          <button
            onClick={onToggleUnit}
            className="px-3.5 py-1.5 bg-slate-800/80 backdrop-blur-md hover:bg-slate-700 rounded-lg text-sm font-semibold transition-all border border-slate-700 shadow-sm"
            title="Toggle temperature unit"
          >
            °{unit}
          </button>
        </div>
      </div>
    </header>
  );
}
