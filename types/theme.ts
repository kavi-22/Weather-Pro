export type ThemeMode = "auto" | "Clear" | "Clouds" | "Rain" | "Thunderstorm" | "Snow" | "Mist";

export interface WeatherTheme {
  id: string;
  name: string;
  bgImage: string;
  gradientOverlay: string;
  heroGradient: string;
  panelBg: string;
  accentText: string;
}
