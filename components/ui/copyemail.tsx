"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyEmail({ email }: { email: string }) {
  const [done, setDone] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setDone(true);
      setTimeout(() => setDone(false), 1800);
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 font-mono text-sm text-white transition-colors hover:border-[#268BFF]/50"
    >
      {done ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
      {done ? "Copied" : "Copy"}
    </button>
  );
}