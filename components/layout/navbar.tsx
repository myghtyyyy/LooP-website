"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { ArrowRight, LayoutDashboard, Menu, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/team", label: "Team" },
  { href: "/projects", label: "Projects" },
];

const pill =
  "rounded-full border border-white/[0.10] bg-[#0D0D14]/90 shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-2xl";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [isStaff, setIsStaff] = useState(false);

  // show the admin pill only to logged-in team members
  useEffect(() => {
    const supabase = createClient();

    async function check() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return setIsStaff(false);

      const { data: profile } = await supabase
        .from("profiles")
        .select("role, is_active")
        .eq("id", user.id)
        .single();

      setIsStaff(
        !!profile &&
          profile.is_active &&
          ["member", "admin"].includes(profile.role)
      );
    }

    check();
    const { data: sub } = supabase.auth.onAuthStateChange(() => check());
    return () => sub.subscription.unsubscribe();
  }, []);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (y > prev && y > 120 && !open) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const contactActive = pathname.startsWith("/contact");

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{
        y: hidden ? -120 : 0,
        opacity: hidden ? 0 : 1,
      }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="fixed inset-x-0 top-6 z-50"
    >
      <div className="relative mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 sm:px-10 lg:px-16">
        {/* Logo */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          aria-label="LooP home"
          className={`${pill} group flex h-12 w-12 items-center justify-center overflow-hidden transition-all duration-300 hover:border-cyan-400/40 hover:shadow-[0_0_24px_rgba(0,217,245,0.12)]`}
        >
          <Image
            src="/logo/logotsp.png"
            alt="LooP"
            width={100}
            height={100}
            priority
            className="h-full w-full object-contain p-1.5 transition-transform duration-300 group-hover:scale-110"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Main navigation"
          className={`${pill} absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 p-1.5 md:flex`}
          onMouseLeave={() => setHovered(null)}
        >
          {links.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onMouseEnter={() => setHovered(link.href)}
                aria-current={active ? "page" : undefined}
                className={`relative block rounded-full px-5 py-2.5 font-mono text-sm transition-colors duration-200 ${
                  active ? "text-white" : "text-loop-muted hover:text-white"
                }`}
              >
                {hovered === link.href && !active && (
                  <motion.span
                    layoutId="nav-hover"
                    className="absolute inset-0 rounded-full bg-white/[0.06]"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}

                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#268BFF] to-[#00BFEA] shadow-[0_0_18px_rgba(38,139,255,0.20)]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}

                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right side (desktop): admin pill + contact */}
        <div className="hidden items-center gap-3 md:flex">
          {isStaff && (
            <Link
              href="/admin"
              className={`${pill} flex h-12 items-center gap-2 px-5 font-mono text-sm text-cyan-300 transition-colors hover:border-cyan-400/40`}
            >
              <LayoutDashboard size={16} /> Admin
            </Link>
          )}

          <Link
            href="/contact"
            className={`group flex h-12 items-center gap-2 rounded-full border px-6 font-mono text-sm transition-all duration-300 ${
              contactActive
                ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-300"
                : "border-white/[0.10] bg-[#0D0D14]/90 text-cyan-300 hover:border-cyan-400/40 hover:bg-cyan-400/[0.06]"
            }`}
          >
            Contact
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className={`${pill} flex h-12 w-12 items-center justify-center text-white transition-colors hover:border-cyan-400/30 md:hidden`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? "close" : "menu"}
              initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 45, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="flex"
            >
              {open ? <X size={21} /> : <Menu size={21} />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            aria-label="Mobile navigation"
            className="mx-5 mt-3 md:hidden"
          >
            <div className="rounded-3xl border border-white/[0.09] bg-[#0D0D14]/95 p-2 shadow-2xl backdrop-blur-2xl">
              {[
                ...links,
                { href: "/contact", label: "Contact" },
                ...(isStaff ? [{ href: "/admin", label: "Admin" }] : []),
              ].map((link) => {
                const active = isActive(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`mb-1 flex items-center justify-between rounded-2xl px-5 py-3.5 font-mono text-sm transition-colors last:mb-0 ${
                      active
                        ? "bg-gradient-to-r from-[#268BFF] to-[#00BFEA] text-white"
                        : "text-loop-muted hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    {link.label}
                    {active && <span className="text-xs">●</span>}
                  </Link>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}