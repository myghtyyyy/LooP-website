"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function InfinityAnimation() {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <svg
        viewBox="0 0 200 100"
        className="absolute h-20 w-40 overflow-visible sm:h-24 sm:w-48"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="infinityGradient">
            <stop offset="0%" stopColor="#268BFF" />
            <stop offset="50%" stopColor="#00D9F5" />
            <stop offset="100%" stopColor="#268BFF" />
          </linearGradient>

          <filter id="infinityGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          id="infinityPath"
          d="M 100 50
             C 75 10, 30 10, 15 35
             C -5 70, 40 95, 70 65
             L 130 35
             C 160 5, 205 30, 185 65
             C 170 90, 125 90, 100 50"
          stroke="url(#infinityGradient)"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.35"
        />

        {!reduceMotion && (
          <>
            <circle r="3" fill="#00D9F5" filter="url(#infinityGlow)">
              <animateMotion
                dur="4s"
                repeatCount="indefinite"
                rotate="auto"
              >
                <mpath href="#infinityPath" />
              </animateMotion>
            </circle>

            <circle r="1.5" fill="#FFFFFF">
              <animateMotion
                dur="4s"
                begin="-2s"
                repeatCount="indefinite"
                rotate="auto"
              >
                <mpath href="#infinityPath" />
              </animateMotion>
            </circle>
          </>
        )}
      </svg>
    </div>
  );
}