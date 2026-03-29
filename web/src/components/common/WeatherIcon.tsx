import { WEATHER_CODES } from "@weather-app/shared";
import { Icon } from "@/components/icons/Icon";

interface WeatherIconProps {
  code: number;
  isDay: boolean;
  size?: "sm" | "md" | "lg";
}

const SIZES = { sm: 28, md: 48, lg: 72 };

export function WeatherIcon({ code, isDay, size = "md" }: WeatherIconProps) {
  const weather = WEATHER_CODES[code];
  let iconName = weather?.icon ?? "clear";

  if (!isDay && (iconName === "clear" || iconName === "mostly-clear")) {
    iconName = "clear-night";
  }

  return (
    <Icon
      name={iconName}
      size={SIZES[size]}
      label={weather?.label ?? "Unknown weather"}
      className="text-white"
    />
  );
}
