import React from "react";
import { Sun, Cloud, CloudRain, CloudLightning, Snowflake, CloudFog } from "lucide-react";

interface WeatherIconProps {
  condition: string;
  size?: number;
  className?: string;
}

export function WeatherIcon({ condition, size = 24, className = "" }: WeatherIconProps) {
  const props = { size, className: `text-white ${className}` };
  switch (condition) {
    case "Clear":
      return <Sun {...props} className="text-amber-400" />;
    case "Clouds":
      return <Cloud {...props} className="text-slate-300" />;
    case "Rain":
      return <CloudRain {...props} className="text-blue-400" />;
    case "Drizzle":
      return <CloudRain {...props} className="text-cyan-400" />;
    case "Thunderstorm":
      return <CloudLightning {...props} className="text-purple-400" />;
    case "Snow":
      return <Snowflake {...props} className="text-sky-200" />;
    case "Mist":
    case "Fog":
      return <CloudFog {...props} className="text-slate-400" />;
    default:
      return <Sun {...props} className="text-amber-400" />;
  }
}
