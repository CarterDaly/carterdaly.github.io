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

      {/* Large structural frame (anchored to hero grid, no edge contact) */}
      <motion.rect x={50} y={220} width={1700} height={760} fill="none" stroke="#2a2a28" strokeWidth="1" opacity="0.42" {...fadeIn(0.05)} />
      <motion.rect x={116} y={264} width={1568} height={627.2} fill="none" stroke="#2a2a28" strokeWidth="0.6" opacity="0.36" {...fadeIn(0.1)} />

      {/* Medium frames */}
      <motion.rect x={228} y={331.2} width={1344} height={537.6} fill="none" stroke="#0e3b2e" strokeWidth="0.9" opacity="0.78" {...fadeIn(0.15)} />
      <motion.rect x={496.8} y={420.8} width={851.2} height={403.2} fill="none" stroke="#2a2a28" strokeWidth="0.8" opacity="0.55" {...fadeIn(0.2)} />

      {/* Nested small frames */}
      <motion.rect x={922.4} y={510.4} width={358.4} height={268.8} fill="none" stroke="#0e3b2e" strokeWidth="0.75" opacity="0.62" {...fadeIn(0.25)} />
      <motion.rect x={1280.8} y={644.8} width={201.6} height={145.6} fill="none" stroke="#8a101e" strokeWidth="0.7" opacity="0.6" {...fadeIn(0.3)} />

      {/* Inset precision frames */}
      <motion.rect x={384.8} y={353.6} width={851.2} height={448} fill="none" stroke="#2a2a28" strokeWidth="0.6" opacity="0.32" {...fadeIn(0.32)} />
      <motion.rect x={810.4} y={488} width={336} height={224} fill="none" stroke="#0e3b2e" strokeWidth="0.65" opacity="0.42" {...fadeIn(0.36)} />
      <motion.rect x={586.4} y={600} width={246.4} height={168} fill="none" stroke="#2a2a28" strokeWidth="0.55" opacity="0.3" {...fadeIn(0.4)} />
      <motion.rect x={989.6} y={600} width={212.8} height={134.4} fill="none" stroke="#2a2a28" strokeWidth="0.55" opacity="0.28" {...fadeIn(0.44)} />
      <motion.rect x={720.8} y={712} width={201.6} height={123.2} fill="none" stroke="#0e3b2e" strokeWidth="0.55" opacity="0.32" {...fadeIn(0.46)} />
      <motion.rect x={1135.2} y={712} width={145.6} height={100.8} fill="none" stroke="#8a101e" strokeWidth="0.5" opacity="0.3" {...fadeIn(0.48)} />

      {/* Alignment bars and ticks */}
      <motion.rect x={116} y={644.8} width={1344} height={1} fill="#2a2a28" opacity="0.2" {...fadeIn(0.18)} />
      <motion.rect x={255.2} y={846.4} width={1160} height={1} fill="#2a2a28" opacity="0.18" {...fadeIn(0.2)} />
      <motion.rect x={900} y={219.2} width={1} height={784} fill="#2a2a28" opacity="0.18" {...fadeIn(0.22)} />
      <motion.rect x={1280.8} y={286.4} width={1} height={694.4} fill="#2a2a28" opacity="0.16" {...fadeIn(0.24)} />
      {/* ticks */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <motion.rect key={`tick-top-${i}`} x={205.6 + i * 201.6} y={196.8} width={12} height={1} fill="#2a2a28" opacity="0.28" {...fadeIn(0.26 + i * 0.015)} />
      ))}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <motion.rect key={`tick-right-${i}`} x={1684} y={353.6 + i * 112} width={1} height={12} fill="#2a2a28" opacity="0.26" {...fadeIn(0.36 + i * 0.015)} />
      ))}

      {/* Labels */}
      <motion.text
        x={160.8}
        y={667.2}
        fill="#0e3b2e"
        fontFamily="Neue Haas Grotesk Display Pro, 'Helvetica Neue', Arial, sans-serif"
        fontSize="14"
        letterSpacing="4"
        {...fadeIn(0.5)}
      >
        TIME-SERIES
      </motion.text>
      <motion.text
        x={1370.4}
        y={667.2}
        fill="#8a101e"
        fontFamily="Neue Haas Grotesk Display Pro, 'Helvetica Neue', Arial, sans-serif"
        fontSize="14"
        letterSpacing="4"
        {...fadeIn(0.5)}
      >
        FUSION
      </motion.text>

      {/* Accent points / data nodes */}
      <motion.rect x={1056.8} y={398.4} width={13.4} height={13.4} fill="#0e3b2e" {...fadeIn(0.54)} />
      <motion.rect x={698.4} y={846.4} width={11.2} height={11.2} fill="#8a101e" {...fadeIn(0.56)} />
      <motion.rect x={1325.6} y={712} width={15.7} height={15.7} fill="none" stroke="#8a101e" strokeWidth="0.9" {...fadeIn(0.58)} />
      <motion.rect x={855.2} y={600} width={11.2} height={11.2} fill="#2a2a28" {...fadeIn(0.6)} />
    </motion.svg>
  );
}
