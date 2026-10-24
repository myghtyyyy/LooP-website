"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import CopyEmail from "@/components/ui/copyemail";

// edit these to match what people actually write to you about
const reasons = [
  {
    label: "Join the club",
    subject: "I want to join LooP",
    body: "Hey LooP team,\n\nI'm [your name] from [your branch/year]. I'd love to be part of the club. I'm interested in [what you like building or learning].\n\nThanks!",
  },
  {
    label: "Collaborate",
    subject: "Let's collaborate with LooP",
    body: "Hey LooP team,\n\nI'm [your name] from [your club/org]. We'd love to do something together. Here's the idea:\n\n[your idea]\n\nCheers!",
  },
  {
    label: "Speak at an event",
    subject: "I'd like to give a talk at LooP",
    body: "Hey LooP team,\n\nI'm [your name], and I'd love to speak about [topic]. A bit about me: [one line].\n\nLooking forward to hearing from you!",
  },
  {
    label: "Just saying hi",
    subject: "Hi from a LooP fan",
    body: "Hey LooP team,\n\n",
  },
];

export default function ContactComposer({ email }: { email: string }) {
  const [i, setI] = useState(0);
  const r = reasons[i];

  const gmail = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(
    email
  )}&su=${encodeURIComponent(r.subject)}&body=${encodeURIComponent(r.body)}`;

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0D0D14]/80 shadow-[0_0_60px_rgba(38,139,255,0.10)] backdrop-blur-md">
      {/* window bar */}
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
        <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
        <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
        <span className="h-3 w-3 rounded-full bg-[#28C840]" />
        <span className="ml-3 font-mono text-xs text-loop-muted">new message</span>
      </div>

      <div className="p-6 max-md:p-5">
        <p className="font-mono text-xs uppercase tracking-widest text-loop-muted">
          what brings you here?
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {reasons.map((x, idx) => (
            <button
              key={x.label}
              type="button"
              onClick={() => setI(idx)}
              className={`rounded-full border px-4 py-2 font-mono text-xs transition-all ${
                idx === i
                  ? "border-[#00D9F5] bg-[#00D9F5]/10 text-[#00D9F5]"
                  : "border-white/15 text-loop-muted hover:border-white/40 hover:text-white"
              }`}
            >
              {x.label}
            </button>
          ))}
        </div>

        {/* the "email" */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-5 font-mono text-sm">
          <p className="break-all text-loop-muted">
            to: <span className="text-white">{email}</span>
          </p>
          <p className="mt-1 text-loop-muted">
            subject:{" "}
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={r.subject}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="inline-block text-white"
              >
                {r.subject}
              </motion.span>
            </AnimatePresence>
          </p>
          <div className="my-4 h-px bg-white/10" />
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={r.body}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="whitespace-pre-line leading-relaxed text-loop-text/80"
            >
              {r.body}
              <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-[#00D9F5]" />
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={gmail}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#268BFF] to-[#00BFEA] px-6 py-3.5 font-mono text-sm text-white transition-transform hover:-translate-y-0.5"
          >
            Open in Gmail
            <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <CopyEmail email={email} />
          <span className="font-mono text-xs text-loop-muted">
            not on Gmail? copy the address and use any app.
          </span>
        </div>
      </div>
    </div>
  );
}