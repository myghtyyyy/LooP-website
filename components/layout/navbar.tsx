"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "~/home" },
  { href: "/events", label: "./events" },
  { href: "/team", label: "./team" },
  { href: "/projects", label: "./projects" },
];

const pill =
  "rounded-full border border-white/10 bg-loop-card/70 backdrop-blur-md";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  // hide on scroll down, show on scroll up
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (y > prev && y > 120 && !open) setHidden(true);
    else setHidden(false);
  });

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const contactActive = pathname.startsWith("/contact");

  return (
    <motion.header
      animate={{ y: hidden ? -120 : 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed inset-x-0 top-4 z-50"
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-20 max-lg:px-10 max-md:px-5">
        {/* Logo pill */}
        {/* Logo pill */}
<Link
  href="/"
  onClick={() => setOpen(false)}
  aria-label="LooP home"
  className={`${pill} flex h-12 w-12 items-center justify-center overflow-hidden`}
>
  <Image
    src="/logo/logo.png"
    alt="LooP"
    width={100}
    height={28}
    priority
    className="h-full w-full object contain p-1.5"
  />
</Link>


        {/* Links pill (desktop) */}
        <ul
          className={`${pill} flex items-center gap-1 p-1.5 max-md:hidden`}
          onMouseLeave={() => setHovered(null)}
        >
          {links.map((link) => {
            const active = isActive(link.href);
            return (
              <li key={link.href} className="relative">
                <Link
                  href={link.href}
                  onMouseEnter={() => setHovered(link.href)}
                  className={`relative block rounded-full px-5 py-2.5 font-mono text-sm transition-colors ${
                    active ? "text-white" : "text-loop-muted hover:text-loop-text"
                  }`}
                >
                  {/* hover highlight follows the mouse */}
                  {hovered === link.href && !active && (
                    <motion.span
                      layoutId="nav-hover"
                      className="absolute inset-0 rounded-full bg-white/10"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  {/* active highlight slides between pages */}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-loop-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Contact pill (desktop) */}
        <Link
          href="/contact"
          className={`${pill} flex h-12 items-center gap-2 px-6 font-mono text-sm transition-colors max-md:hidden ${
            contactActive
              ? "border-loop-accent text-loop-text"
              : "text-loop-accent hover:border-loop-accent"
          }`}
        >
          ./contact <ArrowRight size={16} />
        </Link>

        {/* Menu button (phones) */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className={`${pill} hidden h-12 w-12 items-center justify-center max-md:flex`}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="mx-5 mt-3 hidden max-md:block"
          >
            <ul className="rounded-3xl border border-white/10 bg-loop-card/90 p-2 backdrop-blur-md">
              {[...links, { href: "/contact", label: "./contact" }].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-2xl px-5 py-3.5 font-mono text-base ${
                      isActive(link.href)
                        ? "bg-loop-accent text-white"
                        : "text-loop-muted"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}