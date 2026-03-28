export function Snow() {
  return (
    <>
      <path
        d="M53 38h-38a7 7 0 0 1 1.4-13.86 7.21 7.21 0 0 1-.1-1.14 7 7 0 0 1 10.57-6 10.49 10.49 0 0 1 19.11 8h.32a7 7 0 0 1 0 14z"
        fill="#F1F6FE"
        stroke="#D2DCEB"
        strokeWidth="0.5"
      />
      <g>
        <circle cx="24" cy="46" r="2.5" fill="#82B1FF" />
        <animateTransform attributeName="transform" type="translate" dur="1.5s" repeatCount="indefinite" values="0 -3; -1 8" />
        <animate attributeName="opacity" dur="1.5s" repeatCount="indefinite" values="0;1;1;0" />
      </g>
      <g>
        <circle cx="33" cy="44" r="2.5" fill="#82B1FF" opacity="0.7" />
        <animateTransform attributeName="transform" type="translate" dur="1.5s" repeatCount="indefinite" values="0 -3; -1 8" begin="-0.5s" />
        <animate attributeName="opacity" dur="1.5s" repeatCount="indefinite" values="0;0.7;0.7;0" begin="-0.5s" />
      </g>
      <g>
        <circle cx="42" cy="47" r="2.5" fill="#82B1FF" opacity="0.4" />
        <animateTransform attributeName="transform" type="translate" dur="1.5s" repeatCount="indefinite" values="0 -3; -1 8" begin="-1s" />
        <animate attributeName="opacity" dur="1.5s" repeatCount="indefinite" values="0;0.4;0.4;0" begin="-1s" />
      </g>
    </>
  );
}
