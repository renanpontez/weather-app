export function ClearNight() {
  return (
    <path
      d="M30 14a18 18 0 1 0 20 20A14 14 0 0 1 30 14z"
      fill="#CBD5E1"
      stroke="#94A3B8"
      strokeWidth="0.5"
    >
      <animate attributeName="opacity" dur="4s" repeatCount="indefinite" values="0.7;1;0.7" />
    </path>
  );
}
