export function ClearDay() {
  return (
    <>
      <circle cx="32" cy="32" r="10" fill="#FBBF24" />
      <g stroke="#FBBF24" strokeWidth="3" strokeLinecap="round">
        <line x1="32" y1="12" x2="32" y2="17">
          <animate attributeName="opacity" dur="3s" repeatCount="indefinite" values="0.5;1;0.5" />
        </line>
        <line x1="32" y1="47" x2="32" y2="52">
          <animate attributeName="opacity" dur="3s" repeatCount="indefinite" values="0.5;1;0.5" begin="0.4s" />
        </line>
        <line x1="12" y1="32" x2="17" y2="32">
          <animate attributeName="opacity" dur="3s" repeatCount="indefinite" values="0.5;1;0.5" begin="0.8s" />
        </line>
        <line x1="47" y1="32" x2="52" y2="32">
          <animate attributeName="opacity" dur="3s" repeatCount="indefinite" values="0.5;1;0.5" begin="1.2s" />
        </line>
        <line x1="17.86" y1="17.86" x2="21.4" y2="21.4">
          <animate attributeName="opacity" dur="3s" repeatCount="indefinite" values="0.5;1;0.5" begin="0.2s" />
        </line>
        <line x1="42.6" y1="42.6" x2="46.14" y2="46.14">
          <animate attributeName="opacity" dur="3s" repeatCount="indefinite" values="0.5;1;0.5" begin="0.6s" />
        </line>
        <line x1="17.86" y1="46.14" x2="21.4" y2="42.6">
          <animate attributeName="opacity" dur="3s" repeatCount="indefinite" values="0.5;1;0.5" begin="1s" />
        </line>
        <line x1="42.6" y1="21.4" x2="46.14" y2="17.86">
          <animate attributeName="opacity" dur="3s" repeatCount="indefinite" values="0.5;1;0.5" begin="1.4s" />
        </line>
      </g>
    </>
  );
}
