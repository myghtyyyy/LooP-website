"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { ArrowRight, ChevronsDown } from "lucide-react";

type Photo = {
  src: string;
  left: number;
  top: number;
  w: number;
  depth: number;
  delay: number;
  hideOnMobile?: boolean;
};

const photos: Photo[] = [
  { src: "/events/hero/1.jpeg", left: 2, top: 18, w: 17, depth: 20, delay: 0 },
  { src: "/events/hero/2.jpeg", left: 20, top: 48, w: 13, depth: 28, delay: 0.6, hideOnMobile: true },
  { src: "/events/hero/3.jpeg", left: 5, top: 73, w: 14, depth: 24, delay: 1.2 },
  { src: "/events/hero/4.jpeg", left: 79, top: 16, w: 18, depth: 18, delay: 0.3 },
  { src: "/events/hero/5.jpeg", left: 73, top: 68, w: 16, depth: 25, delay: 0.9 },
  { src: "/events/hero/6.jpeg", left: 38, top: 83, w: 12, depth: 30, delay: 1.5, hideOnMobile: true },
  { src: "/events/hero/7.jpeg", left: 56, top: 85, w: 11, depth: 20, delay: 0.4, hideOnMobile: true },
  { src: "/events/hero/8.jpeg", left: 89, top: 47, w: 9, depth: 32, delay: 1.1, hideOnMobile: true },
];

function Tile({
  photo,
  mx,
  my,
  reduceMotion,
}: {
  photo: Photo;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const x = useTransform(mx, (v) => v * photo.depth);
  const y = useTransform(my, (v) => v * photo.depth);

  return (
    <motion.div
      style={{
        left: `${photo.left}%`,
        top: `${photo.top}%`,
        width: `min(${photo.w}vw, 300px)`,
        x: reduceMotion ? 0 : x,
        y: reduceMotion ? 0 : y,
      }}
      className={`absolute ${
        photo.hideOnMobile ? "max-md:hidden" : "max-md:opacity-35"
      }`}
    >
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: photo.delay,
        }}
        className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/40"
      >
        <Image
          src={photo.src}
          alt=""
          fill
          sizes="(max-width: 768px) 35vw, 20vw"
          className="object-cover"
        />
      </motion.div>
    </motion.div>
  );
}

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
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 50, damping: 20 });
  const my = useSpring(rawY, { stiffness: 50, damping: 20 });
  const reduceMotion = useReducedMotion() ?? false;

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduceMotion) return;
    rawX.set(e.clientX / window.innerWidth - 0.5);
    rawY.set(e.clientY / window.innerHeight - 0.5);
  };

  return (
    <section
      onMouseMove={onMove}
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* Floating photos */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {photos.map((photo) => (
          <Tile
            key={photo.src}
            photo={photo}
            mx={mx}
            my={my}
            reduceMotion={reduceMotion}
          />
        ))}
      </div>

      {/* Soft overlay for text readability (low strength so the background shows) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,6,12,0.5)_0%,rgba(6,6,12,0.2)_35%,transparent_65%)]" />

      {/* Main hero content */}
      <div className="relative z-10 flex flex-col items-center px-5 text-center">
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

        {/* CTA buttons */}
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
      </div>

      {/* Explore button */}
      <motion.button
        type="button"
        onClick={() =>
          window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
        }
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-[#13131B]/80 px-6 py-3 font-mono text-xs uppercase tracking-widest text-loop-text backdrop-blur-xl transition-colors hover:border-[#268BFF]/50 hover:text-[#00D9F5] sm:bottom-8"
      >
        <ChevronsDown size={14} />
        Explore
      </motion.button>
    </section>
  );
}