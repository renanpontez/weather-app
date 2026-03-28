export function Drizzle() {
  return (
    <>
      <path
        d="M53 38h-38a7 7 0 0 1 1.4-13.86 7.21 7.21 0 0 1-.1-1.14 7 7 0 0 1 10.57-6 10.49 10.49 0 0 1 19.11 8h.32a7 7 0 0 1 0 14z"
        fill="#F1F6FE"
        stroke="#D2DCEB"
        strokeWidth="0.5"
      />
      <g>
        <line x1="26" y1="42" x2="24" y2="50" stroke="#5C81BC" strokeWidth="3" strokeLinecap="round" />
        <animateTransform attributeName="transform" type="translate" dur="1s" repeatCount="indefinite" values="0 -3; -1 6" />
        <animate attributeName="opacity" dur="1s" repeatCount="indefinite" values="0;1;1;0" />
      </g>
      <g>
        <line x1="37" y1="42" x2="35" y2="50" stroke="#5C81BC" strokeOpacity="0.6" strokeWidth="3" strokeLinecap="round" />
        <animateTransform attributeName="transform" type="translate" dur="1s" repeatCount="indefinite" values="0 -3; -1 6" begin="-0.5s" />
        <animate attributeName="opacity" dur="1s" repeatCount="indefinite" values="0;1;1;0" begin="-0.5s" />
      </g>
    </>
  );
}
