import { City, WeatherData } from "@/types/weather";

const GEOCODING_API_URL =
  process.env.NEXT_PUBLIC_GEOCODING_API_URL || "https://geocoding-api.open-meteo.com/v1";
const WEATHER_API_URL =
  process.env.NEXT_PUBLIC_WEATHER_API_URL || "https://api.open-meteo.com/v1";
const AIR_QUALITY_API_URL =
  process.env.NEXT_PUBLIC_AIR_QUALITY_API_URL || "https://air-quality-api.open-meteo.com/v1";

export function mapWMOCodeToCondition(code: number): { condition: string; description: string } {
  switch (code) {
    case 0:
      return { condition: "Clear", description: "clear sky" };
    case 1:
      return { condition: "Clear", description: "mainly clear" };
    case 2:
      return { condition: "Clouds", description: "partly cloudy" };
    case 3:
      return { condition: "Clouds", description: "overcast" };
    case 45:
    case 48:
      return { condition: "Fog", description: "foggy" };
    case 51:
    case 53:
    case 55:
      return { condition: "Drizzle", description: "drizzle" };
    case 56:
    case 57:
      return { condition: "Drizzle", description: "freezing drizzle" };
    case 61:
      return { condition: "Rain", description: "light rain" };
    case 63:
      return { condition: "Rain", description: "moderate rain" };
    case 65:
      return { condition: "Rain", description: "heavy rain" };
    case 66:
    case 67:
      return { condition: "Rain", description: "freezing rain" };
    case 71:
    case 73:
    case 75:
    case 77:
      return { condition: "Snow", description: "snowfall" };
    case 80:
    case 81:
    case 82:
      return { condition: "Rain", description: "rain showers" };
    case 85:
    case 86:
      return { condition: "Snow", description: "snow showers" };
    case 95:
      return { condition: "Thunderstorm", description: "thunderstorm" };
    case 96:
    case 99:
      return { condition: "Thunderstorm", description: "thunderstorm with hail" };
    default:
      return { condition: "Clear", description: "clear sky" };
  }
}

export async function searchLiveCities(query: string): Promise<City[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    const res = await fetch(
      `${GEOCODING_API_URL}/search?name=${encodeURIComponent(
        query.trim()
      )}&count=8&language=en&format=json`
    );
    if (!res.ok) return [];
    const data = await res.json();

    if (!data.results) return [];

    return data.results.map((item: any) => {
      const name = item.name;
      const state = item.admin1 || item.admin2 || "";
      const country = item.country || "";
      const countryCode = item.country_code ? item.country_code.toUpperCase() : "";

      const locationParts = [name, state, country].filter(Boolean);
      const fullLocation = locationParts.join(", ");

      return {
        name,
        state,
        country,
        countryCode,
        lat: item.latitude,
        lon: item.longitude,
        fullLocation,
      };
    });
  } catch (error) {
    console.error("Geocoding search error:", error);
    return [];
  }
}

export async function fetchLiveWeather(
  cityName: string,
  targetLat?: number,
  targetLon?: number,
  selectedCity?: City
): Promise<WeatherData> {
  let lat = targetLat;
  let lon = targetLon;
  let name = cityName;
  let state = selectedCity?.state || "";
  let country = selectedCity?.country || "";
  let countryCode = selectedCity?.countryCode || "";
  let fullLocation = selectedCity?.fullLocation || "";

  if (lat === undefined || lon === undefined || !fullLocation) {
    const cities = await searchLiveCities(cityName);
    if (cities.length > 0) {
      const matched = cities[0];
      lat = matched.lat;
      lon = matched.lon;
      name = matched.name;
      state = matched.state || "";
      country = matched.country;
      countryCode = matched.countryCode || "";
      fullLocation = matched.fullLocation;
    } else {
      // Default fallback coordinates (London)
      lat = 51.5074;
      lon = -0.1278;
      name = "London";
      state = "England";
      country = "United Kingdom";
      countryCode = "GB";
      fullLocation = "London, England, United Kingdom";
    }
  }

  const forecastUrl = `${WEATHER_API_URL}/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,weather_code,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;
  const aqiUrl = `${AIR_QUALITY_API_URL}/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi`;

  const [forecastRes, aqiRes] = await Promise.all([
    fetch(forecastUrl),
    fetch(aqiUrl).catch(() => null),
  ]);

  if (!forecastRes.ok) {
    throw new Error(`Weather API HTTP error: ${forecastRes.status}`);
  }

  const data = await forecastRes.json();
  let usAqi = 42;
  if (aqiRes && aqiRes.ok) {
    const aqiData = await aqiRes.json();
    if (aqiData.current && typeof aqiData.current.us_aqi === "number") {
      usAqi = Math.round(aqiData.current.us_aqi);
    }
  }

  const current = data.current || {};
  const { condition, description } = mapWMOCodeToCondition(current.weather_code ?? 0);

  // Format 24-hour forecast
  const hourlyTimes: string[] = data.hourly?.time || [];
  const hourlyTemps: number[] = data.hourly?.temperature_2m || [];
  const hourlyHumidities: number[] = data.hourly?.relative_humidity_2m || [];

  const hourly = hourlyTimes.slice(0, 24).map((timeStr, i) => {
    const date = new Date(timeStr);
    const hours = date.getHours();
    return {
      time: `${hours}:00`,
      temp: Math.round(hourlyTemps[i] ?? current.temperature_2m ?? 20),
      humidity: Math.round(hourlyHumidities[i] ?? 50),
    };
  });

  // Format 7-day forecast
  const dailyTimes: string[] = data.daily?.time || [];
  const dailyMins: number[] = data.daily?.temperature_2m_min || [];
  const dailyMaxs: number[] = data.daily?.temperature_2m_max || [];
  const dailyCodes: number[] = data.daily?.weather_code || [];
  const dailyWinds: number[] = data.daily?.wind_speed_10m_max || [];

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const daily = dailyTimes.slice(0, 7).map((dateStr, i) => {
    const date = new Date(dateStr);
    const dayName = i === 0 ? "Today" : days[date.getDay()];
    const dayCondition = mapWMOCodeToCondition(dailyCodes[i] ?? 0).condition;

    return {
      day: dayName,
      min: Math.round(dailyMins[i] ?? current.temperature_2m - 5),
      max: Math.round(dailyMaxs[i] ?? current.temperature_2m + 5),
      condition: dayCondition,
      humidity: Math.round(hourlyHumidities[i * 24] ?? 60),
      wind: Math.round(dailyWinds[i] ?? current.wind_speed_10m ?? 10),
    };
  });

  // Sunrise & Sunset formatting
  const rawSunrise = data.daily?.sunrise?.[0];
  const rawSunset = data.daily?.sunset?.[0];

  const formatTime = (isoString?: string) => {
    if (!isoString) return "06:00";
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  };

  const uvIndexMax = data.daily?.uv_index_max?.[0] ?? 4;

  return {
    city: name,
    state,
    country,
    countryCode,
    fullLocation: fullLocation || [name, state, country].filter(Boolean).join(", "),
    temp: Math.round(current.temperature_2m ?? 20),
    feelsLike: Math.round(current.apparent_temperature ?? current.temperature_2m ?? 20),
    humidity: Math.round(current.relative_humidity_2m ?? 50),
    windSpeed: Math.round(current.wind_speed_10m ?? 12),
    windDeg: Math.round(current.wind_direction_10m ?? 180),
    pressure: Math.round(current.surface_pressure ?? 1013),
    visibility: 10,
    description,
    condition,
    sunrise: formatTime(rawSunrise),
    sunset: formatTime(rawSunset),
    uvIndex: Math.round(uvIndexMax),
    hourly,
    daily,
    aqi: usAqi,
  };
}
