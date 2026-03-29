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

function getEffect(icon: string, isDay: boolean) {
  if (icon.includes("rain") || icon === "drizzle" || icon === "freezing-drizzle" || icon === "freezing-rain") return "rain";
  if (icon.includes("snow")) return "snow";
  if (icon === "thunderstorm") return "storm";
  if (icon === "fog") return "fog";
  if (!isDay && (icon === "clear" || icon === "mostly-clear")) return "stars";
  return null;
}

function getGradient(icon: string, isDay: boolean): string {
  if (!isDay) return "from-[#0a0c14] via-[#0f1424] to-[#0a0c14]";

  switch (icon) {
    case "clear":
    case "mostly-clear":
      return "from-[#1a2a4a] via-[#1e3a5f] to-[#0f1d33]";
    case "partly-cloudy":
      return "from-[#141e30] via-[#1a2840] to-[#0f1620]";
    case "overcast":
      return "from-[#1a1e28] via-[#202530] to-[#12151c]";
    case "fog":
      return "from-[#1c2028] via-[#22262f] to-[#14171e]";
    case "drizzle":
    case "rain":
    case "heavy-rain":
    case "freezing-drizzle":
    case "freezing-rain":
    case "rain-showers":
      return "from-[#101520] via-[#151c2a] to-[#0c1018]";
    case "snow":
    case "heavy-snow":
      return "from-[#161a22] via-[#1c2230] to-[#10141c]";
    case "thunderstorm":
      return "from-[#0c0e16] via-[#12151f] to-[#08090f]";
    default:
      return "from-[#0f1219] via-[#0c0e13] to-[#0a0c10]";
  }
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
    <div className={`fixed inset-0 -z-10 bg-gradient-to-b ${gradient} transition-colors duration-1000`}>
      {effect === "stars" && <StarsEffect />}
      {effect === "rain" && <RainEffect />}
      {effect === "snow" && <SnowEffect />}
      {effect === "storm" && <StormEffect />}
      {effect === "fog" && <FogEffect />}
    </div>
  );
}
