import Link from "next/link";
import { Mail } from "lucide-react";
import { FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { SiSubstack } from "react-icons/si";
import { links } from "@/data/links";

const socials = [
  { href: `mailto:${links.email}`, label: "Email", icon: Mail },
  { href: links.instagram, label: "Instagram", icon: FaInstagram },
  { href: links.linkedin, label: "LinkedIn", icon: FaLinkedinIn },
  { href: links.substack, label: "Substack", icon: SiSubstack },
];

const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About us" },
  { href: "/events", label: "Events" },
  { href: "/team", label: "Team" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-loop-bg">
      <div className="mx-auto max-w-[1280px] px-20 py-14 max-lg:px-10 max-md:px-5">
        <div className="flex items-start justify-between gap-10 max-md:flex-col">
          <div>
            <p className="font-heading text-2xl font-bold">
              Loo<span className="text-loop-accent">P</span>
            </p>
            <p className="mt-2 font-mono text-sm text-loop-muted">
              Build. Share. Repeat.
            </p>
          </div>

          <ul className="flex flex-wrap gap-x-8 gap-y-3 font-mono text-sm text-loop-muted">
            {nav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-loop-text">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <ul className="flex gap-3">
            {socials.map(({ href, label, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-loop-card/70 text-loop-muted transition-colors hover:border-loop-accent hover:text-loop-text"
                >
                  <Icon size={18} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 flex items-center justify-between font-mono text-xs text-loop-muted">
  <p>© 2026 LooP. All rights reserved.</p>
  <Link href="/login" className="transition-colors hover:text-loop-text">
    Team login
  </Link>
</div>
      </div>
    </footer>
  );
}