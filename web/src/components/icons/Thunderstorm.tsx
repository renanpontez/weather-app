export function Thunderstorm() {
  return (
    <>
      <path
        d="M53 36h-38a7 7 0 0 1 1.4-13.86 7.21 7.21 0 0 1-.1-1.14 7 7 0 0 1 10.57-6 10.49 10.49 0 0 1 19.11 8h.32a7 7 0 0 1 0 14z"
        fill="#F1F6FE"
        stroke="#D2DCEB"
        strokeWidth="0.5"
      />
      <polygon
        points="34 36 28 46 32 46 28 56 38 43 33.5 43 36 36"
        fill="#FBBF24"
      >
        <animate attributeName="opacity" dur="2s" repeatCount="indefinite" values="1;1;0.3;1;1;0.2;1" />
      </polygon>
      <g>
        <line x1="20" y1="42" x2="18" y2="52" stroke="#5C81BC" strokeOpacity="0.5" strokeWidth="2.5" strokeLinecap="round" />
        <animateTransform attributeName="transform" type="translate" dur="0.8s" repeatCount="indefinite" values="1 -4; -1 8" />
        <animate attributeName="opacity" dur="0.8s" repeatCount="indefinite" values="0;0.5;0.5;0" />
      </g>
      <g>
        <line x1="43" y1="42" x2="41" y2="52" stroke="#5C81BC" strokeOpacity="0.5" strokeWidth="2.5" strokeLinecap="round" />
        <animateTransform attributeName="transform" type="translate" dur="0.8s" repeatCount="indefinite" values="1 -4; -1 8" begin="-0.4s" />
        <animate attributeName="opacity" dur="0.8s" repeatCount="indefinite" values="0;0.5;0.5;0" begin="-0.4s" />
      </g>
    </>
  );
}
