"use client";

import React from "react";
import { TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { HourlyForecast } from "@/types/weather";

interface HourlyForecastChartProps {
  hourly: HourlyForecast[];
}

export function HourlyForecastChart({ hourly }: HourlyForecastChartProps) {
  return (
    <div className="bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-6 shadow-lg">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-white">
        <TrendingUp size={18} className="text-blue-400" /> 24-Hour Temperature
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={hourly}>
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#94a3b8" }} interval={3} />
          <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} domain={["dataMin - 5", "dataMax + 5"]} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              borderRadius: "12px",
              border: "1px solid #334155",
              color: "#ffffff",
              boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
            }}
          />
          <Area
            type="monotone"
            dataKey="temp"
            stroke="#60a5fa"
            fill="url(#tempGradient)"
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
