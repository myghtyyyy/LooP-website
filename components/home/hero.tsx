"use client";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
  useReducedMotion,
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
        animate={
          reduceMotion
            ? undefined
            : { y: [0, -10, 0] }
        }
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
      className="relative isolate flex min-h-[760px] min-h-screen items-center justify-center overflow-hidden bg-[#08080B] px-5 pb-20 pt-28"
      style={{
        backgroundImage: `
          radial-gradient(
            ellipse at 50% 42%,
            rgba(38, 139, 255, 0.10) 0%,
            transparent 55%
          ),
          radial-gradient(
            rgba(255,255,255,0.055) 1px,
            transparent 1px
          )
        `,
        backgroundSize: "100% 100%, 28px 28px",
      }}
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

      {/* Dark overlay for text readability */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,8,11,0.94)_0%,rgba(8,8,11,0.68)_32%,transparent_68%)]" />

      {/* Main hero content */}
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        {/* Logo */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative mb-7 flex h-36 w-36 items-center justify-center sm:mb-8 sm:h-40 sm:w-40"
        >

          <motion.span
            className="absolute inset-0 rounded-full border border-[#268BFF]/35"
            animate={reduceMotion ? undefined : { rotate: 360 }}
            transition={{
              duration: 24,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ borderTopColor: "transparent" }}
          />

          <motion.span
            className="absolute -inset-4 rounded-full border border-white/[0.10]"
            animate={reduceMotion ? undefined : { rotate: -360 }}
            transition={{
              duration: 32,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ borderBottomColor: "transparent" }}
          />

          <Image
            src="/logo/logotsp.png"
            alt="LooP logo"
            width={112}
            height={112}
            priority
            className="h-24 w-24 object-contain sm:h-28 sm:w-28"
          />
        </motion.div>

        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-3 font-mono text-xs uppercase tracking-[0.35em] text-loop-muted max-md:tracking-[0.2em]"
        >
          Build — Share — Repeat
        </motion.p>

        <motion.h1
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.15, ease: "easeOut" }}
          className="font-heading text-7xl font-bold tracking-tight sm:text-8xl lg:text-9xl"
        >
          <span className="bg-gradient-to-r from-[#268BFF] to-[#00D9F5] bg-clip-text text-transparent">
            &lt;
          </span>
          LOOP
          <span className="bg-gradient-to-r from-[#00D9F5] to-[#268BFF] bg-clip-text text-transparent">
            &gt;
          </span>
        </motion.h1>

        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-5 max-w-xl font-mono text-sm leading-7 text-loop-muted sm:text-base"
        >
          Where builders{" "}
          <span className="text-[#00D9F5]">connect</span>, <span className="text-[#00D9F5]">learn</span>, and{" "}
          <span className="text-[#00D9F5]">build</span> the future
          together.
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
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>

          <Link
            href="/team"
            className="group flex min-h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-[#268BFF] to-[#00BFEA] px-7 py-3.5 font-mono text-sm text-white shadow-lg shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-blue-500/25"
          >
            Our Team
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </div>

      {/* Explore button */}
      <motion.button
        type="button"
        onClick={() =>
          window.scrollTo({
            top: window.innerHeight,
            behavior: "smooth",
          })
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