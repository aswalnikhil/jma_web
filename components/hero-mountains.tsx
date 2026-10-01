"use client";

import { m, useReducedMotion, useTransform, type MotionValue } from "framer-motion";

/**
 * Layered Himalayan range behind the hero. Each layer drifts at its own speed
 * as the hero scrolls away (far = slowest), which creates the parallax depth.
 * Colours are hazy tints of the brand green so text on top keeps ≥4.5:1 contrast.
 */
export function HeroMountains({ progress }: { progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const sun = useTransform(progress, [0, 1], [0, reduce ? 0 : 160]);
  const far = useTransform(progress, [0, 1], [0, reduce ? 0 : 130]);
  const mid = useTransform(progress, [0, 1], [0, reduce ? 0 : 80]);
  const near = useTransform(progress, [0, 1], [0, reduce ? 0 : 35]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] md:h-[70%] lg:[mask-image:linear-gradient(90deg,rgb(0_0_0/0.35),#000_45%)]"
    >
      {/* Morning sun haze behind the peaks */}
      <m.div
        style={{ y: sun }}
        className="absolute top-[2%] right-[18%] h-56 w-56 rounded-full bg-[radial-gradient(closest-side,rgb(217_162_27/0.28),rgb(217_162_27/0.08)_60%,transparent)] md:h-80 md:w-80"
      />

      <Layer y={far} className="text-[#e6eadf]">
        {/* Far range: tall, jagged, snow-capped */}
        <path
          d="M0 400V250l90-60 60 25 110-95 60 40 70-65 80 75 70-30 100-80 80 70 70-25 90 65 80-80 80 60 80-70 80 75 90-35 80 55 70-25v250Z"
          fill="currentColor"
        />
        <g fill="#fbfaf4">
          <path d="m232 144 28-24 30 26-12-3-9 10-10-11-12 9Z" />
          <path d="m362 120 28-25 32 30-13-2-8 9-11-12-12 8Z" />
          <path d="m606 92 34-32 36 36-15-4-8 11-12-12-14 10Z" />
          <path d="m930 118 30-28 34 32-14-3-8 10-11-11-12 8Z" />
          <path d="m1090 108 30-28 34 33-14-3-9 10-10-12-13 9Z" />
          <path d="m1266 138 24-18 28 22-11-2-7 8-9-9-10 6Z" />
        </g>
      </Layer>

      <Layer y={mid} className="text-[#dde4d7]">
        {/* Mid ridge */}
        <path
          d="M0 400V290l120-50 90 30 120-65 100 50 90-25 90 45 110-60 110 50 100-30 100 45 120-55 110 40 90-25 90 20v140Z"
          fill="currentColor"
        />
      </Layer>

      <Layer y={near} className="text-[#d3ddcc]">
        {/* Near forested hills */}
        <path
          d="M0 400v-70c120-30 220-10 320-25 110-15 200 25 320 15s220-30 340-15 220-5 340 5c60 5 100-5 120-10v100Z"
          fill="currentColor"
        />
        <g fill="#c6d3be">
          {[70, 96, 250, 274, 560, 585, 900, 926, 1190, 1214, 1380].map((x, i) => (
            <path key={x} d={`M${x} ${i % 2 ? 330 : 322}l12-30 12 30Z`} />
          ))}
        </g>
      </Layer>
    </div>
  );
}

function Layer({
  y,
  className,
  children,
}: {
  y: MotionValue<number>;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <m.svg
      style={{ y }}
      viewBox="0 0 1440 400"
      preserveAspectRatio="xMidYMax slice"
      className={`absolute inset-0 h-full w-full will-change-transform ${className}`}
    >
      {children}
    </m.svg>
  );
}
