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
      viewBox="0 0 1600 1200"
      role="presentation"
      className="w-full h-full"
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
      <rect width="1600" height="1200" fill="#d8cfc4" opacity="0.96" />
      <rect width="1600" height="1200" filter="url(#paper-grain)" />

      {/* Large structural frame (anchored to hero grid, no edge contact) */}
      <motion.rect x={140} y={80} width={1320} height={920} fill="none" stroke="#2a2a28" strokeWidth="1" opacity="0.45" {...fadeIn(0.05)} />
      <motion.rect x={200} y={140} width={1200} height={820} fill="none" stroke="#2a2a28" strokeWidth="0.6" opacity="0.38" {...fadeIn(0.1)} />

      {/* Medium frames */}
      <motion.rect x={380} y={260} width={720} height={520} fill="none" stroke="#0e3b2e" strokeWidth="0.9" opacity="0.78" {...fadeIn(0.15)} />
      <motion.rect x={640} y={360} width={480} height={380} fill="none" stroke="#2a2a28" strokeWidth="0.8" opacity="0.55" {...fadeIn(0.2)} />

      {/* Nested small frames */}
      <motion.rect x={900} y={500} width={300} height={230} fill="none" stroke="#0e3b2e" strokeWidth="0.75" opacity="0.62" {...fadeIn(0.25)} />
      <motion.rect x={1140} y={640} width={180} height={130} fill="none" stroke="#8a101e" strokeWidth="0.7" opacity="0.6" {...fadeIn(0.3)} />

      {/* Inset precision frames */}
      <motion.rect x={460} y={320} width={500} height={360} fill="none" stroke="#2a2a28" strokeWidth="0.6" opacity="0.32" {...fadeIn(0.32)} />
      <motion.rect x={780} y={460} width={320} height={220} fill="none" stroke="#0e3b2e" strokeWidth="0.65" opacity="0.42" {...fadeIn(0.36)} />
      <motion.rect x={600} y={560} width={240} height={170} fill="none" stroke="#2a2a28" strokeWidth="0.55" opacity="0.3" {...fadeIn(0.4)} />
      <motion.rect x={960} y={560} width={180} height={130} fill="none" stroke="#2a2a28" strokeWidth="0.55" opacity="0.28" {...fadeIn(0.44)} />

      {/* Alignment bars and ticks */}
      <motion.rect x={200} y={620} width={1200} height={1} fill="#2a2a28" opacity="0.2" {...fadeIn(0.18)} />
      <motion.rect x={320} y={820} width={960} height={1} fill="#2a2a28" opacity="0.18" {...fadeIn(0.2)} />
      <motion.rect x={800} y={200} width={1} height={720} fill="#2a2a28" opacity="0.18" {...fadeIn(0.22)} />
      <motion.rect x={1080} y={260} width={1} height={660} fill="#2a2a28" opacity="0.16" {...fadeIn(0.24)} />
      {/* ticks */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <motion.rect key={`tick-top-${i}`} x={340 + i * 120} y={220} width={10} height={1} fill="#2a2a28" opacity="0.28" {...fadeIn(0.26 + i * 0.015)} />
      ))}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <motion.rect key={`tick-right-${i}`} x={1380} y={360 + i * 100} width={1} height={10} fill="#2a2a28" opacity="0.26" {...fadeIn(0.36 + i * 0.015)} />
      ))}

      {/* Labels */}
      <motion.text
        x={240}
        y={640}
        fill="#0e3b2e"
        fontFamily="Neue Haas Grotesk Display Pro, 'Helvetica Neue', Arial, sans-serif"
        fontSize="14"
        letterSpacing="4"
        {...fadeIn(0.5)}
      >
        TIME-SERIES
      </motion.text>
      <motion.text
        x={1240}
        y={640}
        fill="#8a101e"
        fontFamily="Neue Haas Grotesk Display Pro, 'Helvetica Neue', Arial, sans-serif"
        fontSize="14"
        letterSpacing="4"
        {...fadeIn(0.5)}
      >
        FUSION
      </motion.text>

      {/* Accent points / data nodes */}
      <motion.rect x={980} y={400} width={12} height={12} fill="#0e3b2e" {...fadeIn(0.54)} />
      <motion.rect x={660} y={780} width={10} height={10} fill="#8a101e" {...fadeIn(0.56)} />
      <motion.rect x={1180} y={660} width={14} height={14} fill="none" stroke="#8a101e" strokeWidth="0.9" {...fadeIn(0.58)} />
      <motion.rect x={800} y={560} width={10} height={10} fill="#2a2a28" {...fadeIn(0.6)} />
    </motion.svg>
  );
}
