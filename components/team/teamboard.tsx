"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Pencil, Plus, X } from "lucide-react";
import { FaLinkedinIn } from "react-icons/fa";
import Reveal from "@/components/ui/reveal";
import TeamCard, { type Member } from "@/components/cards/teamcard";
import MemberEditor from "@/components/admin/membereditor";
import { TIERS, tierOf } from "@/lib/team";

function Connector({ reduce }: { reduce: boolean }) {
  return (
    <div
      aria-hidden
      className="relative mx-auto my-12 h-20 w-px bg-gradient-to-b from-[#268BFF]/60 to-[#00D9F5]/10 max-md:my-8 max-md:h-12"
    >
      <motion.span
        className="absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[#00D9F5] shadow-[0_0_12px_3px_rgba(0,217,245,0.7)]"
        style={{ top: "0%" }}
        animate={reduce ? undefined : { top: ["0%", "100%"], opacity: [0, 1, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export default function TeamBoard({
  members,
  isAdmin,
}: {
  members: Member[];
  isAdmin: boolean;
}) {
  const reduce = useReducedMotion() ?? false;
  const [edit, setEdit] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const rows = useMemo(
    () => TIERS.map((_, t) => members.filter((m) => tierOf(m.position) === t)),
    [members]
  );
  const flat = useMemo(() => rows.flat(), [rows]);
  const idx = flat.findIndex((m) => m.id === openId);
  const open = idx >= 0 ? flat[idx] : null;

  const step = (d: number) =>
    setOpenId(flat[(idx + d + flat.length) % flat.length].id);

  // keyboard: Esc closes, arrows move between people
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const visible = rows
    .map((r, i) => ({ r, i }))
    .filter((x) => x.r.length > 0);

  return (
    <>
      {edit && (
        <p className="mt-10 rounded-xl border border-dashed border-[#00D9F5]/40 bg-[#00D9F5]/5 px-4 py-3 text-center font-mono text-xs text-[#00D9F5]">
          edit mode · click any card to change name, position, role, photo or order
        </p>
      )}

      <div className="mt-16 max-md:mt-12">
        {visible.map(({ r, i }, k) => (
          <Fragment key={i}>
            {k > 0 && <Connector reduce={reduce} />}
            <section>
              <Reveal className="mb-8 flex items-center gap-4">
                <span className="font-mono text-xs text-[#00D9F5]">0{i + 1}</span>
                <h2 className="font-heading text-2xl font-bold max-md:text-xl">
                  {TIERS[i].label}
                </h2>
                <span className="hidden font-mono text-xs text-loop-muted md:inline">
                  {TIERS[i].sub}
                </span>
                <span className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
              </Reveal>
              <div className="flex flex-wrap justify-center gap-6 max-md:gap-4">
                {r.map((m, n) => (
                  <Reveal key={m.id} delay={Math.min(n * 0.08, 0.4)}>
                    <TeamCard
                      m={m}
                      size={TIERS[i].size}
                      editMode={edit}
                      onSelect={() => (edit ? setEditing(m) : setOpenId(m.id))}
                    />
                  </Reveal>
                ))}
              </div>
            </section>
          </Fragment>
        ))}
      </div>

      {members.length === 0 && (
        <p className="mt-16 font-mono text-sm text-loop-muted">
          // the team is getting set up. check back soon.
        </p>
      )}

      {/* admin controls (only rendered for admins) */}
      {isAdmin && (
        <div className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/10 bg-[#0D0D14]/90 p-1.5 shadow-[0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setEdit((v) => !v)}
            className={`flex items-center gap-2 rounded-full px-5 py-3 font-mono text-xs transition-all ${
              edit
                ? "bg-[#00D9F5] text-[#06060C] shadow-[0_0_24px_rgba(0,217,245,0.5)]"
                : "text-white hover:bg-white/10"
            }`}
          >
            <Pencil size={14} />
            {edit ? "Done editing" : "Edit team"}
          </button>
          <Link
            href="/admin/team"
            className="flex items-center gap-2 rounded-full px-5 py-3 font-mono text-xs text-loop-muted transition-colors hover:bg-white/10 hover:text-white"
          >
            <Plus size={14} /> Add member
          </Link>
        </div>
      )}

      {/* profile spotlight */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="spotlight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenId(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-[#06060C]/80 p-5 backdrop-blur-md"
          >
            <motion.div
              key={open.id}
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="relative grid max-h-[90vh] w-full max-w-3xl grid-cols-2 overflow-hidden rounded-3xl border border-white/10 bg-[#0D0D14] shadow-[0_0_80px_rgba(38,139,255,0.25)] max-md:grid-cols-1"
            >
              <div className="relative aspect-[4/5] bg-loop-card max-md:aspect-[4/3]">
                {open.avatar_url ? (
                  <Image
                    src={open.avatar_url}
                    alt={open.full_name ?? ""}
                    fill
                    sizes="400px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#268BFF]/30 via-[#0D0D14] to-[#00D9F5]/20">
                    <span className="font-heading text-9xl font-bold text-white/70">
                      {open.full_name?.[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-center p-8 max-md:p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#00D9F5]">
                  {TIERS[tierOf(open.position)].label} · {open.term_year}
                </p>
                {open.position && (
                  <p className="mt-4 inline-block self-start rounded-full border border-[#00D9F5]/30 bg-[#00D9F5]/10 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-[#00D9F5]">
                    {open.position}
                  </p>
                )}
                <h3 className="mt-3 font-heading text-4xl font-bold leading-tight max-md:text-3xl">
                  {open.full_name}
                </h3>
                {open.linkedin && (
                  <a
                    href={open.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 self-start rounded-xl border border-white/15 px-5 py-3 font-mono text-sm text-white transition-colors hover:border-[#00D9F5] hover:text-[#00D9F5]"
                  >
                    <FaLinkedinIn size={14} /> LinkedIn
                  </a>
                )}

                <div className="mt-8 flex items-center gap-3 font-mono text-xs text-loop-muted">
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Previous person"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 hover:border-[#00D9F5] hover:text-[#00D9F5]"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Next person"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 hover:border-[#00D9F5] hover:text-[#00D9F5]"
                  >
                    <ArrowRight size={16} />
                  </button>
                  <span>
                    {idx + 1} / {flat.length}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpenId(null)}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#06060C]/70 text-white backdrop-blur-md hover:border-[#00D9F5]"
              >
                <X size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* admin edit panel */}
      <AnimatePresence>
        {editing && (
          <MemberEditor
            key={editing.id}
            member={editing}
            onClose={() => setEditing(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}