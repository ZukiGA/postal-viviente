import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

export default (() => {
  const WeatherMemory: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
    const weather = fileData.frontmatter?.weatherMemory as any
    if (!weather) return null

    return (
      <div class="weather-memory">
        <div class="weather-memory-inner">
          <span class="weather-condition">{weather.condition}</span>
          <span class="weather-temp">{weather.temp_max}° / {weather.temp_min}°C</span>
          {weather.wind_kmh > 0 && <span class="weather-wind">💨 {weather.wind_kmh} km/h</span>}
          {weather.rain_mm > 0 && <span class="weather-rain">🌧 {weather.rain_mm}mm</span>}
        </div>
      </div>
    )
  }

  WeatherMemory.displayName = "WeatherMemory"
  return WeatherMemory
}) satisfies QuartzComponentConstructor
