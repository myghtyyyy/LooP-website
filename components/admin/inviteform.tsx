"use client";

import { useState } from "react";
import { createMember } from "@/app/admin/team/action";
import PasswordBox from "@/components/admin/passwordbox";

const input =
  "w-full rounded-xl border border-white/10 bg-loop-bg px-4 py-3 text-sm";

export default function InviteForm() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{
    ok: boolean;
    text: string;
    password?: string;
  } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setBusy(true);
    setMsg(null);
    const res = await createMember(new FormData(form));
    setMsg({ ok: res.ok, text: res.message, password: res.password });
    if (res.ok) form.reset();
    setBusy(false);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-white/10 bg-loop-card p-6"
    >
      <h2 className="font-heading text-xl font-bold">Add a member</h2>
      <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
        <input type="email" name="email" placeholder="Email" className={input} required />
        <input name="full_name" placeholder="Full name" className={input} />
        <input name="position" placeholder="Position (e.g. Treasurer)" className={input} />
        <select name="role" defaultValue="member" className={input}>
          <option value="member">Member (edits events)</option>
          <option value="admin">Admin (full control)</option>
          <option value="pending">Pending (no access yet)</option>
        </select>
        <input name="term_year" type="number" defaultValue={2026} placeholder="Term year" className={input} />
        <input name="display_order" type="number" defaultValue={100} placeholder="Order (1 = first)" className={input} />
      </div>

      {msg && (
        <div className="space-y-3">
          <p className={`text-sm ${msg.ok ? "text-green-400" : "text-red-400"}`}>
            {msg.text}
          </p>
          {msg.password && <PasswordBox password={msg.password} />}
        </div>
      )}

      <button
        disabled={busy}
        className="rounded-xl bg-loop-accent px-6 py-3 font-mono text-sm text-white disabled:opacity-50"
      >
        {busy ? "Creating…" : "Create account"}
      </button>
    </form>
  );
}