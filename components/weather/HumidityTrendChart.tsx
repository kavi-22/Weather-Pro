"use client";

import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { HourlyForecast } from "@/types/weather";

interface HumidityTrendChartProps {
  hourly: HourlyForecast[];
}

export function HumidityTrendChart({ hourly }: HumidityTrendChartProps) {
  return (
    <div className="bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-6 shadow-lg">
      <h3 className="font-bold mb-4 text-white text-base">Humidity Trend</h3>
      <ResponsiveContainer width="100%" height={150}>
        <LineChart data={hourly.slice(0, 12)}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="time" tick={{ fontSize: 9, fill: "#94a3b8" }} interval={2} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: "#94a3b8" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              borderRadius: "8px",
              border: "1px solid #334155",
              color: "#ffffff",
            }}
          />
          <Line type="monotone" dataKey="humidity" stroke="#06b6d4" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
