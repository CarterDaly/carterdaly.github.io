import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export function HeroGraphic() {
  const reduceMotion = useReducedMotion();

  const fadeIn = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 6 },
          animate: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.25, 0.9, 0.3, 1] } },
        };

  return (
    <motion.svg
      viewBox="0 0 1800 1200"
      role="presentation"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid slice"
      style={{ width: "100%", height: "100%" }}
      initial={reduceMotion ? undefined : "hidden"}
      animate={reduceMotion ? undefined : "show"}
    >
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
      <rect width="1800" height="1200" fill="#d8cfc4" opacity="0.96" />
      <rect width="1800" height="1200" filter="url(#paper-grain)" />

      <g transform="translate(160 0)">
        {/* Large structural frame (anchored to hero grid, no edge contact) */}
        <motion.rect x={140} y={170} width={1520} height={860} fill="none" stroke="#2a2a28" strokeWidth="0.95" opacity="0.28" {...fadeIn(0.05)} />
        <motion.rect x={260} y={250} width={1280} height={700} fill="none" stroke="#2a2a28" strokeWidth="0.75" opacity="0.24" {...fadeIn(0.1)} />

        {/* Primary frames */}
        <motion.rect x={420} y={330} width={1000} height={540} fill="none" stroke="#0e3b2e" strokeWidth="0.72" opacity="0.6" {...fadeIn(0.15)} />
        <motion.rect x={760} y={420} width={600} height={420} fill="none" stroke="#2a2a28" strokeWidth="0.68" opacity="0.38" {...fadeIn(0.2)} />
        <motion.rect x={910} y={500} width={260} height={200} fill="none" stroke="#0e3b2e" strokeWidth="0.68" opacity="0.48" {...fadeIn(0.24)} />
        <motion.rect x={1080} y={520} width={320} height={260} fill="none" stroke="#8a101e" strokeWidth="0.68" opacity="0.46" {...fadeIn(0.28)} />

        {/* Alignment bars and ticks */}
        <motion.rect x={260} y={720} width={1280} height={1} fill="#2a2a28" opacity="0.18" {...fadeIn(0.18)} />
        <motion.rect x={420} y={890} width={880} height={1} fill="#2a2a28" opacity="0.16" {...fadeIn(0.2)} />
        <motion.rect x={620} y={210} width={1} height={760} fill="#2a2a28" opacity="0.16" {...fadeIn(0.22)} />
        <motion.rect x={1180} y={250} width={1} height={700} fill="#2a2a28" opacity="0.16" {...fadeIn(0.24)} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.rect key={`tick-top-${i}`} x={340 + i * 240} y={190} width={14} height={1} fill="#2a2a28" opacity="0.2" {...fadeIn(0.26 + i * 0.02)} />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.rect key={`tick-right-${i}`} x={1520} y={360 + i * 140} width={1} height={14} fill="#2a2a28" opacity="0.16" {...fadeIn(0.34 + i * 0.02)} />
        ))}

        {/* Labels */}
        <motion.text
          x={480}
          y={736}
          fill="#0e3b2e"
          fontFamily="Neue Haas Grotesk Display Pro, 'Helvetica Neue', Arial, sans-serif"
          fontSize="14"
          letterSpacing="4"
          opacity="0.9"
          {...fadeIn(0.5)}
        >
          FORECASTING
        </motion.text>
        <motion.text
          x={626}
          y={716}
          fill="#8a101e"
          fontFamily="Neue Haas Grotesk Display Pro, 'Helvetica Neue', Arial, sans-serif"
          fontSize="14"
          letterSpacing="4"
          opacity="0.85"
          {...fadeIn(0.5)}
        >
          FUSION
        </motion.text>

        {/* Accent points / data nodes */}
        <motion.rect x={1060} y={460} width={12} height={12} fill="#0e3b2e" opacity="0.82" {...fadeIn(0.54)} />
        <motion.rect x={840} y={820} width={10} height={10} fill="#8a101e" opacity="0.76" {...fadeIn(0.56)} />
        <motion.rect x={1240} y={640} width={14} height={14} fill="none" stroke="#8a101e" strokeWidth="0.72" opacity="0.62" {...fadeIn(0.58)} />
        <motion.rect x={940} y={660} width={10} height={10} fill="#2a2a28" opacity="0.72" {...fadeIn(0.6)} />
      </g>
    </motion.svg>
  );
}
