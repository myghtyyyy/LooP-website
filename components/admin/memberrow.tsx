"use client";

import { useState } from "react";
import { updateMember, resetPassword } from "@/app/admin/team/action";
const input =
  "w-full rounded-lg border border-white/10 bg-loop-bg px-3 py-2 text-sm";

export type Member = {
  id: string;
  email: string | null;
  full_name: string | null;
  position: string | null;
  role: "pending" | "member" | "admin";
  term_year: number | null;
  display_order: number;
  is_active: boolean;
};

export default function MemberRow({ m }: { m: Member }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const res = await updateMember(new FormData(e.currentTarget));
    setMsg({ ok: res.ok, text: res.message });
    setBusy(false);
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`space-y-3 rounded-2xl border border-white/10 bg-loop-card p-5 ${
        m.is_active ? "" : "opacity-60"
      }`}
    >
      <input type="hidden" name="id" value={m.id} />
      <div className="flex items-center justify-between gap-3">
        <p className="truncate font-mono text-sm text-loop-muted">{m.email}</p>
        <label className="flex items-center gap-2 font-mono text-xs">
          <input type="checkbox" name="is_active" defaultChecked={m.is_active} /> active
        </label>
      </div>
      <div className="grid grid-cols-5 gap-3 max-xl:grid-cols-2 max-md:grid-cols-1">
        <input name="full_name" defaultValue={m.full_name ?? ""} placeholder="Full name" className={input} />
        <input name="position" defaultValue={m.position ?? ""} placeholder="Position" className={input} />
        <select name="role" defaultValue={m.role} className={input}>
          <option value="pending">pending</option>
          <option value="member">member</option>
          <option value="admin">admin</option>
        </select>
        <input name="term_year" type="number" defaultValue={m.term_year ?? ""} placeholder="Year" className={input} />
        <input name="display_order" type="number" defaultValue={m.display_order} className={input} />
      </div>
      <div className="flex items-center gap-4">
        <button
          disabled={busy}
          className="rounded-lg bg-loop-accent px-4 py-2 font-mono text-xs text-white disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save"}
        </button>
        <button
  type="button"
  onClick={async () => {
    if (!confirm(`Reset password for ${m.email}?`)) return;
    const fd = new FormData();
    fd.set("id", m.id);
    const res = await resetPassword(fd);
    setMsg({ ok: res.ok, text: res.message });
  }}
  className="rounded-lg border border-white/15 px-4 py-2 font-mono text-xs text-loop-muted hover:text-loop-text"
>
  Reset password
</button>
        {msg && (
          <span className={`text-xs ${msg.ok ? "text-green-400" : "text-red-400"}`}>{msg.text}</span>
        )}
      </div>
    </form>
  );
}