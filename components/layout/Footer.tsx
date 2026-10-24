"use client";

import { useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { ArrowUp, ArrowUpRight, Check, Copy, Mail } from "lucide-react";
import { FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { SiSubstack } from "react-icons/si";
import { links } from "@/data/links";

const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/team", label: "Team" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

const socials = [
  { href: links.instagram, label: "Instagram", icon: FaInstagram },
  { href: links.linkedin, label: "LinkedIn", icon: FaLinkedinIn },
  { href: links.substack, label: "Substack", icon: SiSubstack },
  {
    href: `https://mail.google.com/mail/?view=cm&to=${links.email}`,
    label: "Email",
    icon: Mail,
  },
];

const ticker = ["BUILD", "SHARE", "REPEAT"];

function Ticker({ reduce }: { reduce: boolean }) {
  const row = Array.from({ length: 8 }, () => ticker).flat();
  return (
    <div className="overflow-hidden border-y border-white/10 py-4 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
      <motion.div
        className="flex w-max gap-8 whitespace-nowrap font-mono text-sm uppercase tracking-[0.4em] text-loop-muted"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        {[...row, ...row].map((w, i) => (
          <span key={i} className="flex items-center gap-8">
            {w}
            <span className="h-1.5 w-1.5 rounded-full bg-[#00D9F5] shadow-[0_0_10px_2px_rgba(0,217,245,0.6)]" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function Wordmark({ reduce }: { reduce: boolean }) {
  // spotlight follows the cursor and reveals a gradient fill inside the letters
  const mx = useSpring(useMotionValue(-400), { stiffness: 120, damping: 20 });
  const my = useSpring(useMotionValue(-400), { stiffness: 120, damping: 20 });
  const mask = useMotionTemplate`radial-gradient(260px circle at ${mx}px ${my}px, black 0%, transparent 70%)`;

  const text =
    "select-none text-center font-heading text-[26vw] font-bold leading-[0.8] tracking-tighter max-md:text-[30vw]";

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
      onMouseLeave={() => {
        mx.set(-400);
        my.set(-400);
      }}
      className="relative mt-6 overflow-hidden pb-2"
    >
      {/* outlined letters */}
      <p
        aria-hidden
        className={`${text} text-transparent`}
        style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.14)" }}
      >
        LOOP
      </p>
      {/* gradient letters, only visible under the cursor */}
      <motion.p
        aria-hidden
        className={`${text} absolute inset-0 bg-gradient-to-r from-[#268BFF] via-[#00D9F5] to-[#268BFF] bg-clip-text text-transparent`}
        style={{ maskImage: mask, WebkitMaskImage: mask }}
      >
        LOOP
      </motion.p>
      {/* fade into the page at the bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#06060C] to-transparent" />
    </motion.div>
  );
}

export default function Footer() {
  const reduce = useReducedMotion() ?? false;
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(links.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  }

  const col = "font-mono text-xs uppercase tracking-[0.25em] text-loop-muted";

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-white/10 bg-[#06060C]/80 backdrop-blur-sm">
      {/* glow on the top edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#268BFF] to-transparent shadow-[0_0_24px_4px_rgba(38,139,255,0.5)]"
      />

      <div className="mx-auto max-w-[1280px] px-20 max-lg:px-10 max-md:px-5">
        {/* call to action */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex items-end justify-between gap-8 py-20 max-md:flex-col max-md:items-start max-md:py-14"
        >
          <h2 className="max-w-2xl font-heading text-6xl font-bold leading-[1.02] tracking-tight max-md:text-4xl">
            Keep the{" "}
            <span className="bg-gradient-to-r from-[#268BFF] to-[#00D9F5] bg-clip-text text-transparent">
              loop
            </span>{" "}
            going.
          </h2>
          <Link
            href="/contact"
            className="group relative flex shrink-0 items-center gap-3 rounded-full bg-gradient-to-r from-[#268BFF] to-[#00BFEA] px-8 py-4 font-mono text-sm text-white shadow-[0_0_40px_rgba(38,139,255,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_60px_rgba(0,217,245,0.5)]"
          >
            Say hello
            <ArrowUpRight
              size={18}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </motion.div>
      </div>

      <Ticker reduce={reduce} />

      <div className="mx-auto max-w-[1280px] px-20 max-lg:px-10 max-md:px-5">
        {/* columns */}
        <div className="grid grid-cols-12 gap-10 py-16 max-lg:grid-cols-2 max-md:grid-cols-1 max-md:py-12">
          {/* brand */}
          <div className="col-span-5 max-lg:col-span-2 max-md:col-span-1">
            <p className="font-heading text-3xl font-bold">
              Loo<span className="text-[#00D9F5]">P</span>
            </p>
            <p className="mt-3 max-w-xs leading-relaxed text-loop-muted">
              A student-run tech community where builders connect, learn, and ship.
            </p>
            <ul className="mt-7 flex gap-3">
              {socials.map(({ href, label, icon: Icon }) => (
                <li key={label}>
                  <motion.a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    whileHover={reduce ? undefined : { y: -4, scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-[#0D0D14]/80 text-loop-muted transition-colors duration-300 hover:border-[#00D9F5]/60 hover:text-[#00D9F5] hover:shadow-[0_0_24px_rgba(0,217,245,0.3)]"
                  >
                    <Icon size={18} />
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* explore */}
          <div className="col-span-3 max-lg:col-span-1">
            <p className={col}>Explore</p>
            <ul className="mt-5 space-y-3">
              {nav.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group inline-flex items-center gap-2 text-loop-text/80 transition-colors hover:text-white"
                  >
                    <span className="h-px w-0 bg-[#00D9F5] transition-all duration-300 group-hover:w-4" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* contact */}
          <div className="col-span-4 max-lg:col-span-1">
            <p className={col}>Say hi</p>
            <p className="mt-5 break-all font-heading text-xl font-bold">
              {links.email}
            </p>
            <button
              type="button"
              onClick={copyEmail}
              className="mt-4 flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 font-mono text-xs text-white transition-colors hover:border-[#268BFF]/60"
            >
              {copied ? (
                <Check size={14} className="text-green-400" />
              ) : (
                <Copy size={14} />
              )}
              {copied ? "Copied" : "Copy email"}
            </button>
          </div>
        </div>

        {/* bottom bar */}
        <div className="flex items-center justify-between gap-4 border-t border-white/10 py-6 font-mono text-xs text-loop-muted max-md:flex-col max-md:items-start">
          <p>© 2026 LooP. Built by the team, for the team.</p>
          <div className="flex items-center gap-6">
            <Link href="/login" className="transition-colors hover:text-white">
              Team login
            </Link>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Back to top"
              className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-[#00D9F5]/60"
            >
              <motion.span
                aria-hidden
                className="absolute -inset-1 rounded-full border border-dashed border-[#00D9F5]/40"
                animate={reduce ? undefined : { rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              />
              <ArrowUp
                size={16}
                className="transition-transform duration-300 group-hover:-translate-y-0.5"
              />
            </button>
          </div>
        </div>
      </div>

      <Wordmark reduce={reduce} />
    </footer>
  );
}