"use client";

import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { Pencil } from "lucide-react";
import { FaLinkedinIn } from "react-icons/fa";

export type Member = {
  id: string;
  full_name: string | null;
  position: string | null;
  avatar_url: string | null;
  linkedin: string | null;
  display_order: number;
  term_year: number;
  // only loaded for admins
  role?: "pending" | "member" | "admin";
  is_active?: boolean;
  email?: string | null;
};

const sizes = {
  xl: { box: "w-96 max-md:w-full max-md:max-w-sm", name: "text-3xl", img: "384px" },
  lg: { box: "w-80 max-md:w-full max-md:max-w-sm", name: "text-2xl", img: "320px" },
  md: { box: "w-64 max-md:w-[calc(50%-0.5rem)]", name: "text-xl", img: "256px" },
  sm: { box: "w-52 max-md:w-[calc(50%-0.5rem)]", name: "text-lg", img: "208px" },
};
export type CardSize = keyof typeof sizes;

export default function TeamCard({
  m,
  size,
  editMode = false,
  onSelect,
}: {
  m: Member;
  size: CardSize;
  editMode?: boolean;
  onSelect: () => void;
}) {
  const reduce = useReducedMotion();
  const s = sizes[size];

  const nx = useMotionValue(0);
  const ny = useMotionValue(0);
  const gx = useMotionValue(-200);
  const gy = useMotionValue(-200);

  const rotateX = useSpring(useTransform(ny, [-0.5, 0.5], [7, -7]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(nx, [-0.5, 0.5], [-7, 7]), { stiffness: 200, damping: 20 });
  const glow = useMotionTemplate`radial-gradient(220px circle at ${gx}px ${gy}px, rgba(0,217,245,0.22), transparent 70%)`;

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    nx.set((e.clientX - r.left) / r.width - 0.5);
    ny.set((e.clientY - r.top) / r.height - 0.5);
    gx.set(e.clientX - r.left);
    gy.set(e.clientY - r.top);
  }
  function onLeave() {
    nx.set(0);
    ny.set(0);
    gx.set(-200);
    gy.set(-200);
  }

  const border = editMode
    ? "border-dashed border-[#00D9F5]/60"
    : "border-white/10 hover:border-[#268BFF]/50";

  return (
    <div className={s.box} style={{ perspective: 900 }}>
      <motion.div
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect();
          }
        }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`group relative cursor-pointer overflow-hidden rounded-3xl border bg-[#0D0D14]/80 backdrop-blur-md outline-none transition-[border-color,box-shadow] duration-300 hover:shadow-[0_0_40px_rgba(38,139,255,0.2)] focus-visible:ring-2 focus-visible:ring-[#00D9F5] ${border} ${
          size === "xl" ? "shadow-[0_0_60px_rgba(38,139,255,0.15)]" : ""
        } ${m.is_active === false ? "opacity-60" : ""}`}
      >
        {/* photo */}
        <div className="relative aspect-[4/5] overflow-hidden bg-loop-card">
          {m.avatar_url ? (
            <Image
              src={m.avatar_url}
              alt={m.full_name ?? "Team member"}
              fill
              sizes={s.img}
              className="object-cover saturate-[0.6] transition-all duration-500 group-hover:scale-105 group-hover:saturate-100"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#268BFF]/30 via-[#0D0D14] to-[#00D9F5]/20">
              <span className="font-heading text-7xl font-bold text-white/70">
                {m.full_name?.[0]?.toUpperCase() ?? "?"}
              </span>
            </div>
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0D0D14] to-transparent" />

          {/* linkedin (always visible on touch screens) */}
          {m.linkedin && !editMode && (
            <a
              href={m.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`${m.full_name ?? "Member"} on LinkedIn`}
              className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#06060C]/70 text-white backdrop-blur-md transition-all duration-300 hover:border-[#00D9F5] hover:text-[#00D9F5] md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
            >
              <FaLinkedinIn size={15} />
            </a>
          )}

          {/* admin edit badge */}
          {editMode && (
            <>
              <span className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#00D9F5] text-[#06060C] shadow-[0_0_20px_rgba(0,217,245,0.6)]">
                <Pencil size={16} />
              </span>
              <span className="absolute left-3 top-3 rounded-full bg-[#06060C]/80 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#00D9F5] backdrop-blur-md">
                {m.role}
                {m.is_active === false && " · inactive"}
              </span>
            </>
          )}
        </div>

        {/* info */}
        <div className="relative p-5">
          {m.position && (
            <p className="inline-block rounded-full border border-[#00D9F5]/30 bg-[#00D9F5]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#00D9F5]">
              {m.position}
            </p>
          )}
          <h3 className={`mt-3 font-heading font-bold leading-tight ${s.name}`}>
            {m.full_name}
          </h3>
        </div>

        {/* cursor spotlight */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: glow }}
        />
      </motion.div>
    </div>
  );
}