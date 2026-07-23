import { TempUnit, AQIInfo, UVInfo } from "@/types/weather";

export function convertTemp(temp: number, unit: TempUnit): number {
  if (unit === "F") {
    return Math.round((temp * 9) / 5 + 32);
  }
  return Math.round(temp);
}

export function getAQIInfo(aqi: number): AQIInfo {
  if (aqi <= 50) return { label: "Good", color: "bg-emerald-500", text: "text-emerald-600" };
  if (aqi <= 100) return { label: "Moderate", color: "bg-yellow-500", text: "text-yellow-600" };
  if (aqi <= 150) return { label: "Unhealthy for Sensitive", color: "bg-orange-500", text: "text-orange-600" };
  if (aqi <= 200) return { label: "Unhealthy", color: "bg-red-500", text: "text-red-600" };
  return { label: "Very Unhealthy", color: "bg-purple-500", text: "text-purple-600" };
}

export function getUVInfo(uv: number): UVInfo {
  if (uv <= 2) return { label: "Low", color: "bg-emerald-500" };
  if (uv <= 5) return { label: "Moderate", color: "bg-yellow-500" };
  if (uv <= 7) return { label: "High", color: "bg-orange-500" };
  if (uv <= 10) return { label: "Very High", color: "bg-red-500" };
  return { label: "Extreme", color: "bg-purple-500" };
}
