"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function PasswordBox({ password }: { password: string }) {
  const [done, setDone] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(password);
      setDone(true);
      setTimeout(() => setDone(false), 1800);
    } catch {}
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-[#00D9F5]/30 bg-black/30 p-3">
      <code className="select-all break-all font-mono text-base text-[#00D9F5]">
        {password}
      </code>
      <button
        type="button"
        onClick={copy}
        className="flex shrink-0 items-center gap-2 rounded-lg bg-[#00D9F5] px-4 py-2 font-mono text-xs text-[#06060C] transition-transform hover:-translate-y-0.5"
      >
        {done ? <Check size={14} /> : <Copy size={14} />}
        {done ? "Copied" : "Copy password"}
      </button>
    </div>
  );
}