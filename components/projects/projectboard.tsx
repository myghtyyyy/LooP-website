"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Copy, Star, X } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import type { ProjectRow } from "@/components/admin/projectform";

const initials = (n: string) =>
  n.split(" ").map((x) => x[0]).slice(0, 2).join("").toUpperCase();

const cloneCmd = (url: string) =>
  `git clone ${url.replace(/\/$/, "").replace(/\.git$/, "")}.git`;

const safe = (u: string | null) => (u && /^https?:\/\//.test(u) ? u : null);

function Cover({ p, sizes }: { p: ProjectRow; sizes: string }) {
  return p.cover_url ? (
    <Image src={p.cover_url} alt="" fill sizes={sizes} className="object-cover transition-transform duration-500 group-hover:scale-105" />
  ) : (
    <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#268BFF]/30 via-[#0D0D14] to-[#00D9F5]/20">
      <span className="font-mono text-5xl text-white/30">{"</>"}</span>
    </div>
  );
}

function Builders({ names }: { names: string[] }) {
  if (!names.length) return null;
  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2">
        {names.slice(0, 4).map((n) => (
          <span key={n} title={n} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0D0D14] bg-gradient-to-br from-[#268BFF] to-[#00D9F5] font-mono text-[10px] font-bold text-[#06060C]">
            {initials(n)}
          </span>
        ))}
      </div>
      <p className="truncate font-mono text-xs text-loop-muted">{names.join(", ")}</p>
    </div>
  );
}

function Card({ p, onOpen, big }: { p: ProjectRow; onOpen: () => void; big?: boolean }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35 }}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen()}
      className={`group cursor-pointer overflow-hidden rounded-2xl border bg-[#0D0D14]/80 outline-none backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-[#268BFF]/60 hover:shadow-[0_0_40px_rgba(38,139,255,0.2)] focus-visible:ring-2 focus-visible:ring-[#00D9F5] ${
        big ? "col-span-full border-[#00D9F5]/40 shadow-[0_0_60px_rgba(0,217,245,0.12)]" : "border-white/10"
      }`}
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        <span className="ml-2 truncate font-mono text-[11px] text-loop-muted">~/projects/{p.slug.replace(/-[a-z0-9]{4}$/, "")}</span>
        {p.featured && (
          <span className="ml-auto flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-[#00D9F5]">
            <Star size={11} fill="currentColor" /> featured
          </span>
        )}
      </div>
      <div className={big ? "grid grid-cols-2 max-md:grid-cols-1" : ""}>
        <div className={`relative overflow-hidden ${big ? "min-h-64" : "aspect-[16/10]"}`}>
          <Cover p={p} sizes={big ? "600px" : "400px"} />
        </div>
        <div className={`space-y-4 p-5 ${big ? "flex flex-col justify-center p-8" : ""}`}>
          <div>
            <h3 className={`font-heading font-bold leading-tight ${big ? "text-4xl max-md:text-3xl" : "text-2xl"}`}>{p.title}</h3>
            {p.tagline && <p className="mt-1.5 text-loop-muted">{p.tagline}</p>}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {p.tags.map((t) => (
              <span key={t} className="rounded-full border border-[#00D9F5]/30 bg-[#00D9F5]/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[#00D9F5]">{t}</span>
            ))}
          </div>
          <Builders names={p.builders} />
          <p className="flex items-center gap-1 font-mono text-xs text-[#268BFF] opacity-0 transition-opacity group-hover:opacity-100">
            open project <ArrowUpRight size={13} />
          </p>
        </div>
      </div>
    </motion.article>
  );
}

function Detail({ p, onClose }: { p: ProjectRow; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const repo = safe(p.repo_url);
  const demo = safe(p.demo_url);

  async function copy() {
    if (!repo) return;
    try {
      await navigator.clipboard.writeText(cloneCmd(repo));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#06060C]/80 p-4 backdrop-blur-md"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0D0D14] shadow-[0_0_80px_rgba(38,139,255,0.25)]"
      >
        <div className="relative aspect-[16/8] overflow-hidden bg-loop-card">
          <Cover p={p} sizes="700px" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0D0D14] to-transparent" />
          <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#06060C]/70 backdrop-blur-md hover:border-[#00D9F5]">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-6 p-7 max-md:p-5">
          <div>
            <h2 className="font-heading text-4xl font-bold leading-tight max-md:text-3xl">{p.title}</h2>
            {p.tagline && <p className="mt-2 text-lg text-loop-muted">{p.tagline}</p>}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {p.tags.map((t) => (
              <span key={t} className="rounded-full border border-[#00D9F5]/30 bg-[#00D9F5]/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[#00D9F5]">{t}</span>
            ))}
          </div>
          {p.description && <p className="whitespace-pre-line leading-relaxed text-loop-text/85">{p.description}</p>}

          {p.builders.length > 0 && (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-loop-muted">built by</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.builders.map((n) => (
                  <span key={n} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-1 pr-4 text-sm">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#268BFF] to-[#00D9F5] font-mono text-[10px] font-bold text-[#06060C]">{initials(n)}</span>
                    {n}
                  </span>
                ))}
              </div>
            </div>
          )}

          {repo && (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/40 p-3 font-mono text-xs">
              <code className="truncate text-[#00D9F5]">$ {cloneCmd(repo)}</code>
              <button onClick={copy} className="flex shrink-0 items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 hover:bg-white/20">
                {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {repo && (
              <a href={repo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#268BFF] to-[#00BFEA] px-6 py-3 font-mono text-sm text-white transition-transform hover:-translate-y-0.5">
                <FaGithub size={16} /> View on GitHub
              </a>
            )}
            {demo && (
              <a href={demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3 font-mono text-sm hover:border-[#268BFF]/60">
                Live demo <ArrowUpRight size={15} />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ProjectsBoard({ projects }: { projects: ProjectRow[] }) {
  const [tag, setTag] = useState("All");
  const [openId, setOpenId] = useState<string | null>(null);
  const open = projects.find((p) => p.id === openId) ?? null;

  const tags = useMemo(
    () => ["All", ...new Set(projects.flatMap((p) => p.tags))],
    [projects]
  );
  const shown = projects.filter((p) => tag === "All" || p.tags.includes(tag));
  const hero = tag === "All" ? shown.find((p) => p.featured) : undefined;
  const rest = shown.filter((p) => p.id !== hero?.id);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenId(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!projects.length)
    return <p className="mt-16 font-mono text-sm text-loop-muted">// no projects yet. the first one is being built right now.</p>;

  return (
    <>
      <div className="mt-10 flex flex-wrap gap-2">
        {tags.map((t) => (
          <button
            key={t}
            onClick={() => setTag(t)}
            className={`rounded-full border px-5 py-2 font-mono text-xs transition-all duration-300 ${
              t === tag
                ? "border-[#00D9F5] bg-[#00D9F5]/10 text-[#00D9F5] shadow-[0_0_20px_rgba(0,217,245,0.25)]"
                : "border-white/10 text-loop-muted hover:border-white/30 hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <motion.div layout className="mt-10 grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-md:grid-cols-1">
        <AnimatePresence mode="popLayout">
          {hero && <Card key={hero.id} p={hero} big onOpen={() => setOpenId(hero.id)} />}
          {rest.map((p) => (
            <Card key={p.id} p={p} onOpen={() => setOpenId(p.id)} />
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {open && <Detail key={open.id} p={open} onClose={() => setOpenId(null)} />}
      </AnimatePresence>
    </>
  );
}