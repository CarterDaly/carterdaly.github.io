import React from "react";

export function HeroGraphic() {
  return (
    <svg viewBox="0 0 1600 1200" role="presentation" className="w-full h-full">
      <defs>
        <filter id="paper-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" seed="7" result="noise" />
          <feColorMatrix in="noise" type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.06" />
          </feComponentTransfer>
        </filter>
      </defs>

      {/* Hero background tone (match hero), with subtle grain */}
      <rect width="1600" height="1200" fill="#d8cfc4" opacity="0.96" />
      <rect width="1600" height="1200" filter="url(#paper-grain)" />

      {/* Large structural frame (anchored to hero grid, no edge contact) */}
      <rect x={140} y={80} width={1320} height={920} fill="none" stroke="#2a2a28" strokeWidth="1" opacity="0.5" />
      <rect x={200} y={140} width={1200} height={820} fill="none" stroke="#2a2a28" strokeWidth="0.6" opacity="0.4" />

      {/* Medium frames */}
      <rect x={340} y={220} width={840} height={580} fill="none" stroke="#0e3b2e" strokeWidth="0.9" opacity="0.78" />
      <rect x={600} y={340} width={540} height={440} fill="none" stroke="#2a2a28" strokeWidth="0.8" opacity="0.58" />

      {/* Nested small frames */}
      <rect x={860} y={460} width={340} height={260} fill="none" stroke="#0e3b2e" strokeWidth="0.75" opacity="0.62" />
      <rect x={1120} y={600} width={210} height={150} fill="none" stroke="#8a101e" strokeWidth="0.7" opacity="0.6" />

      {/* Inset precision frames */}
      <rect x={420} y={300} width={540} height={380} fill="none" stroke="#2a2a28" strokeWidth="0.6" opacity="0.35" />
      <rect x={740} y={440} width={340} height={240} fill="none" stroke="#0e3b2e" strokeWidth="0.65" opacity="0.45" />
      <rect x={540} y={520} width={260} height={180} fill="none" stroke="#2a2a28" strokeWidth="0.55" opacity="0.32" />
      <rect x={900} y={520} width={200} height={140} fill="none" stroke="#2a2a28" strokeWidth="0.55" opacity="0.3" />

      {/* Alignment bars and ticks */}
      <rect x={200} y={620} width={1200} height={1} fill="#2a2a28" opacity="0.24" />
      <rect x={320} y={820} width={960} height={1} fill="#2a2a28" opacity="0.22" />
      <rect x={800} y={160} width={1} height={780} fill="#2a2a28" opacity="0.2" />
      <rect x={1080} y={240} width={1} height={720} fill="#2a2a28" opacity="0.18" />
      {/* ticks */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <rect key={`tick-top-${i}`} x={360 + i * 112} y={220} width={12} height={1} fill="#2a2a28" opacity="0.32" />
      ))}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={`tick-right-${i}`} x={1380} y={320 + i * 100} width={1} height={12} fill="#2a2a28" opacity="0.3" />
      ))}

      {/* Labels */}
      <text
        x={240}
        y={600}
        fill="#0e3b2e"
        fontFamily="Neue Haas Grotesk Display Pro, 'Helvetica Neue', Arial, sans-serif"
        fontSize="14"
        letterSpacing="4"
      >
        TIME-SERIES
      </text>
      <text
        x={1240}
        y={600}
        fill="#8a101e"
        fontFamily="Neue Haas Grotesk Display Pro, 'Helvetica Neue', Arial, sans-serif"
        fontSize="14"
        letterSpacing="4"
      >
        FUSION
      </text>

      {/* Accent points / data nodes */}
      <rect x={980} y={380} width={12} height={12} fill="#0e3b2e" />
      <rect x={660} y={760} width={10} height={10} fill="#8a101e" />
      <rect x={1180} y={640} width={14} height={14} fill="none" stroke="#8a101e" strokeWidth="0.9" />
      <rect x={800} y={540} width={10} height={10} fill="#2a2a28" />
    </svg>
  );
}
