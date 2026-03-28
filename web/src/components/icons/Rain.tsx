export function Rain() {
  return (
    <>
      <path
        d="M53 38h-38a7 7 0 0 1 1.4-13.86 7.21 7.21 0 0 1-.1-1.14 7 7 0 0 1 10.57-6 10.49 10.49 0 0 1 19.11 8h.32a7 7 0 0 1 0 14z"
        fill="#F1F6FE"
        stroke="#D2DCEB"
        strokeWidth="0.5"
      />
      <g>
        <line x1="22" y1="42" x2="19" y2="54" stroke="#5C81BC" strokeWidth="3" strokeLinecap="round" />
        <animateTransform attributeName="transform" type="translate" dur="0.8s" repeatCount="indefinite" values="1 -4; -1 8" />
        <animate attributeName="opacity" dur="0.8s" repeatCount="indefinite" values="0;1;1;0" />
      </g>
      <g>
        <line x1="33" y1="42" x2="30" y2="54" stroke="#5C81BC" strokeOpacity="0.73" strokeWidth="3" strokeLinecap="round" />
        <animateTransform attributeName="transform" type="translate" dur="0.8s" repeatCount="indefinite" values="1 -4; -1 8" begin="-0.4s" />
        <animate attributeName="opacity" dur="0.8s" repeatCount="indefinite" values="0;1;1;0" begin="-0.4s" />
      </g>
      <g>
        <line x1="44" y1="42" x2="41" y2="54" stroke="#5C81BC" strokeOpacity="0.33" strokeWidth="3" strokeLinecap="round" />
        <animateTransform attributeName="transform" type="translate" dur="0.8s" repeatCount="indefinite" values="1 -4; -1 8" begin="-0.2s" />
        <animate attributeName="opacity" dur="0.8s" repeatCount="indefinite" values="0;1;1;0" begin="-0.2s" />
      </g>
    </>
  );
}
