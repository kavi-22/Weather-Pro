export type TempUnit = "C" | "F";

export interface City {
  name: string;
  state?: string;
  country: string;
  countryCode?: string;
  lat: number;
  lon: number;
  fullLocation: string;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  humidity: number;
}

export interface DailyForecast {
  day: string;
  min: number;
  max: number;
  condition: string;
  humidity: number;
  wind: number;
}

export interface WeatherData {
  city: string;
  state?: string;
  country: string;
  countryCode?: string;
  fullLocation: string;
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
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  aqi: number;
}

export interface AQIInfo {
  label: string;
  color: string;
  text: string;
}

export interface UVInfo {
  label: string;
  color: string;
}
