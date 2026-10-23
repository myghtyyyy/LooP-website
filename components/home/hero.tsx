"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Compass, X } from "lucide-react";
import PhotoLoop from "./photoloop";

function LoopMark({ reduceMotion }: { reduceMotion: boolean }) {
  const ringMask =
    "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))";

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative mb-10 flex h-44 w-44 items-center justify-center sm:h-52 sm:w-52"
    >
      {/* pulsing glow behind everything */}
      <motion.div
        className="absolute -inset-12 rounded-full bg-[radial-gradient(circle,rgba(38,139,255,0.38)_0%,rgba(0,217,245,0.12)_40%,transparent_70%)] blur-xl"
        animate={
          reduceMotion
            ? undefined
            : { scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }
        }
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* outer dashed ring (slow, reverse) */}
      <motion.div
        className="absolute -inset-7 rounded-full border border-dashed border-white/20"
        animate={reduceMotion ? undefined : { rotate: -360 }}
        transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
      />

      {/* orbiting dot on the outer ring */}
      <motion.div
        className="absolute -inset-7"
        animate={reduceMotion ? undefined : { rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_12px_3px_rgba(255,255,255,0.6)]" />
      </motion.div>

      {/* faint static ring */}
      <div className="absolute inset-0 rounded-full border border-[#268BFF]/25" />

      {/* spinning light sweep */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, transparent 90deg, #268BFF 230deg, #00D9F5 335deg, transparent 360deg)",
          WebkitMask: ringMask,
          mask: ringMask,
        }}
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
      />

      {/* glowing dot riding the sweep */}
      <motion.div
        className="absolute inset-0"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
      >
        <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00D9F5] shadow-[0_0_16px_5px_rgba(0,217,245,0.75)]" />
      </motion.div>

      {/* inner ring (reverse) */}
      <motion.div
        className="absolute inset-6 rounded-full border border-[#00D9F5]/30"
        style={{ borderTopColor: "transparent", borderBottomColor: "transparent" }}
        animate={reduceMotion ? undefined : { rotate: -360 }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      />

      {/* logo, gently floating */}
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/logo/logotsp.png"
          alt="LooP logo"
          width={128}
          height={128}
          priority
          className="h-24 w-24 object-contain drop-shadow-[0_0_18px_rgba(0,217,245,0.45)] sm:h-28 sm:w-28"
        />
      </motion.div>
    </motion.div>
  );
}

function LoopTitle({ reduceMotion }: { reduceMotion: boolean }) {
  const letters = ["L", "O", "O", "P"];

  const shine =
    "linear-gradient(100deg, #ffffff 0%, #ffffff 38%, #7fd8ff 50%, #ffffff 62%, #ffffff 100%)";

  return (
    <div className="relative">
      {/* glow behind the text */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 scale-110 bg-[radial-gradient(ellipse_at_center,rgba(38,139,255,0.32)_0%,transparent_65%)] blur-2xl"
      />

      <h1
        aria-label="LOOP"
        className="flex items-center justify-center font-heading text-7xl font-bold leading-none tracking-tight sm:text-8xl lg:text-[9.5rem]"
      >
        {/* left bracket */}
        <motion.span
          aria-hidden
          initial={reduceMotion ? false : { opacity: 0, x: 40 }}
          animate={
            reduceMotion
              ? { opacity: 1 }
              : { opacity: 1, x: [0, -8, 0] }
          }
          transition={{
            opacity: { duration: 0.6, delay: 0.1 },
            x: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
          }}
          className="mr-2 bg-gradient-to-br from-[#268BFF] to-[#00D9F5] bg-clip-text text-transparent [filter:drop-shadow(0_0_22px_rgba(38,139,255,0.7))]"
        >
          &lt;
        </motion.span>

        {/* letters */}
        {letters.map((ch, i) => (
          <motion.span
            key={i}
            aria-hidden
            initial={
              reduceMotion
                ? false
                : { opacity: 0, y: 60, filter: "blur(14px)" }
            }
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 14,
              delay: 0.15 + i * 0.09,
            }}
            className="inline-block"
          >
            <motion.span
              className="inline-block bg-clip-text text-transparent [filter:drop-shadow(0_4px_28px_rgba(120,190,255,0.35))]"
              style={{
                backgroundImage: shine,
                backgroundSize: "300% 100%",
                backgroundPosition: "130% 0",
              }}
              animate={
                reduceMotion
                  ? undefined
                  : { backgroundPosition: ["130% 0", "-30% 0"] }
              }
              transition={{
                duration: 1.6,
                delay: 1.2 + i * 0.12,
                repeat: Infinity,
                repeatDelay: 4,
                ease: "easeInOut",
              }}
            >
              {ch}
            </motion.span>
          </motion.span>
        ))}

        {/* right bracket */}
        <motion.span
          aria-hidden
          initial={reduceMotion ? false : { opacity: 0, x: -40 }}
          animate={
            reduceMotion
              ? { opacity: 1 }
              : { opacity: 1, x: [0, 8, 0] }
          }
          transition={{
            opacity: { duration: 0.6, delay: 0.1 },
            x: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
          }}
          className="ml-2 bg-gradient-to-bl from-[#00D9F5] to-[#268BFF] bg-clip-text text-transparent [filter:drop-shadow(0_0_22px_rgba(0,217,245,0.7))]"
        >
          &gt;
        </motion.span>
      </h1>

      {/* glowing underline that draws in */}
      <motion.div
        initial={reduceMotion ? false : { scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
        className="mx-auto mt-4 h-px w-3/4 bg-gradient-to-r from-transparent via-[#268BFF] to-transparent shadow-[0_0_14px_2px_rgba(38,139,255,0.6)]"
      />
    </div>
  );
}

export default function Hero() {
  const reduceMotion = useReducedMotion() ?? false;
  const [exploring, setExploring] = useState(false);

  // lock page scroll while exploring
  useEffect(() => {
    if (!exploring) return;
    window.scrollTo({ top: 0 });
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [exploring]);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Infinite photo wall */}
      <PhotoLoop
        reduceMotion={reduceMotion}
        exploring={exploring}
        onExit={() => setExploring(false)}
      />

      {/* Soft overlay for text readability (fades out in explore mode) */}
      <motion.div
        animate={{ opacity: exploring ? 0 : 1 }}
        transition={{ duration: 0.6 }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,6,12,0.5)_0%,rgba(6,6,12,0.2)_35%,transparent_65%)]"
      />

      {/* Main hero content (blurs away in explore mode) */}
      <motion.div
        animate={
          exploring
            ? { opacity: 0, scale: 0.94, filter: "blur(12px)" }
            : { opacity: 1, scale: 1, filter: "blur(0px)" }
        }
        transition={{ duration: 0.6, ease: "easeInOut" }}
        inert={exploring}
        style={{ pointerEvents: exploring ? "none" : "auto" }}
        className="relative z-10 flex flex-col items-center px-5 text-center"
      >
        <LoopMark reduceMotion={reduceMotion} />

        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-3 font-mono text-xs uppercase tracking-[0.35em] text-loop-muted max-md:tracking-[0.2em]"
        >
          Build — Share — Repeat
        </motion.p>

        <LoopTitle reduceMotion={reduceMotion} />

        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-5 max-w-xl font-mono text-sm leading-7 text-loop-muted sm:text-base"
        >
          Where builders <span className="text-[#00D9F5]">connect</span>,{" "}
          <span className="text-[#00D9F5]">learn</span>, and{" "}
          <span className="text-[#00D9F5]">build</span> the future together.
        </motion.p>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:mt-9"
        >
          <Link
            href="/events"
            className="group flex min-h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-[#268BFF] to-[#00BFEA] px-7 py-3.5 font-mono text-sm text-white shadow-lg shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-blue-500/25"
          >
            Events
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <Link
            href="/team"
            className="group flex min-h-12 items-center gap-2 rounded-xl border border-white/15 bg-[#0D0D14]/70 px-7 py-3.5 font-mono text-sm text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#268BFF]/50"
          >
            Our Team
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Explore / Back button */}
      <motion.button
        type="button"
        onClick={() => setExploring((v) => !v)}
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className={`absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border px-6 py-3 font-mono text-xs uppercase tracking-widest backdrop-blur-xl transition-colors sm:bottom-8 ${
          exploring
            ? "border-[#00D9F5]/60 bg-[#0D0D14]/80 text-[#00D9F5] shadow-[0_0_24px_rgba(0,217,245,0.25)]"
            : "border-white/10 bg-[#13131B]/80 text-loop-text hover:border-[#268BFF]/50 hover:text-[#00D9F5]"
        }`}
      >
        {exploring ? <X size={14} /> : <Compass size={14} />}
        {exploring ? "Back" : "Explore"}
      </motion.button>
    </section>
  );
}