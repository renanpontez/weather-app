import { WEATHER_CODES } from "@weather-app/shared";

function generateParticles(count: number) {
  return Array.from({ length: count }, () => ({
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random(),
    opacity: Math.random(),
    size: Math.random(),
    top: Math.random() * 60,
  }));
}

interface WeatherBackgroundProps {
  weatherCode: number;
  isDay: boolean;
}

type WeatherEffect = "rain" | "snow" | "storm" | "fog" | "stars" | null;

const EFFECT_MAP: Record<string, WeatherEffect> = {
  rain: "rain",
  "heavy-rain": "rain",
  "rain-showers": "rain",
  drizzle: "rain",
  "freezing-drizzle": "rain",
  "freezing-rain": "rain",
  snow: "snow",
  "heavy-snow": "snow",
  thunderstorm: "storm",
  fog: "fog",
};

function getEffect(icon: string, isDay: boolean): WeatherEffect {
  if (EFFECT_MAP[icon]) return EFFECT_MAP[icon];
  if (!isDay && (icon === "clear" || icon === "mostly-clear")) return "stars";
  return null;
}

const GRADIENT_NIGHT = "from-sky-night-from via-sky-night-via to-sky-night-to";
const GRADIENT_DEFAULT = "from-sky-default-from via-sky-default-via to-sky-default-to";

const GRADIENT_MAP: Record<string, string> = {
  clear: "from-sky-clear-from via-sky-clear-via to-sky-clear-to",
  "mostly-clear": "from-sky-clear-from via-sky-clear-via to-sky-clear-to",
  "partly-cloudy": "from-sky-cloudy-from via-sky-cloudy-via to-sky-cloudy-to",
  overcast: "from-sky-overcast-from via-sky-overcast-via to-sky-overcast-to",
  fog: "from-sky-fog-from via-sky-fog-via to-sky-fog-to",
  drizzle: "from-sky-rain-from via-sky-rain-via to-sky-rain-to",
  rain: "from-sky-rain-from via-sky-rain-via to-sky-rain-to",
  "heavy-rain": "from-sky-rain-from via-sky-rain-via to-sky-rain-to",
  "freezing-drizzle": "from-sky-rain-from via-sky-rain-via to-sky-rain-to",
  "freezing-rain": "from-sky-rain-from via-sky-rain-via to-sky-rain-to",
  "rain-showers": "from-sky-rain-from via-sky-rain-via to-sky-rain-to",
  snow: "from-sky-snow-from via-sky-snow-via to-sky-snow-to",
  "heavy-snow": "from-sky-snow-from via-sky-snow-via to-sky-snow-to",
  thunderstorm: "from-sky-storm-from via-sky-storm-via to-sky-storm-to",
};

function getGradient(icon: string, isDay: boolean): string {
  if (!isDay) return GRADIENT_NIGHT;
  return GRADIENT_MAP[icon] ?? GRADIENT_DEFAULT;
}

const rainParticles = generateParticles(40);
const snowParticles = generateParticles(30);
const starParticles = generateParticles(20);

function RainEffect() {
  return (
    <div className="weather-particles" aria-hidden="true">
      {rainParticles.map((p, i) => (
        <div
          key={i}
          className="weather-drop"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay * 0.4}s`,
            animationDuration: `${1.5 + p.duration}s`,
            opacity: 0.2 + p.opacity * 0.2,
          }}
        />
      ))}
    </div>
  );
}

function SnowEffect() {
  return (
    <div className="weather-particles" aria-hidden="true">
      {snowParticles.map((p, i) => (
        <div
          key={i}
          className="weather-flake"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay * 0.8}s`,
            animationDuration: `${3 + p.duration * 3}s`,
            opacity: 0.2 + p.opacity * 0.2,
            width: `${2 + p.size * 3}px`,
            height: `${2 + p.size * 3}px`,
          }}
        />
      ))}
    </div>
  );
}

function StormEffect() {
  return (
    <>
      <RainEffect />
      <div className="weather-lightning" aria-hidden="true" />
    </>
  );
}

function FogEffect() {
  return (
    <div className="weather-particles" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="weather-fog-layer"
          style={{
            animationDelay: `${i * 3}s`,
            top: `${20 + i * 25}%`,
            opacity: 0.08 + i * 0.06,
          }}
        />
      ))}
    </div>
  );
}

function StarsEffect() {
  return (
    <div className="weather-particles" aria-hidden="true">
      {starParticles.map((p, i) => (
        <div
          key={i}
          className="weather-star"
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${3 + p.duration * 4}s`,
            width: `${1 + p.size * 2}px`,
            height: `${1 + p.size * 2}px`,
          }}
        />
      ))}
    </div>
  );
}

export function WeatherBackground({ weatherCode, isDay }: WeatherBackgroundProps) {
  const weather = WEATHER_CODES[weatherCode];
  const icon = weather?.icon ?? "clear";
  const effect = getEffect(icon, isDay);
  const gradient = getGradient(icon, isDay);

  return (
    <div className={`fixed inset-0 -z-10 bg-linear-to-b ${gradient} transition-colors duration-1000`}>
      {effect === "stars" && <StarsEffect />}
      {effect === "rain" && <RainEffect />}
      {effect === "snow" && <SnowEffect />}
      {effect === "storm" && <StormEffect />}
      {effect === "fog" && <FogEffect />}
    </div>
  );
}
