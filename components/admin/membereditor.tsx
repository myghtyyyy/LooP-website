"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Member } from "@/components/cards/teamcard";
import { compressImage } from "@/lib/image";

const input =
  "w-full rounded-xl border border-white/10 bg-loop-bg px-4 py-3 text-sm";
const label = "block space-y-1 font-mono text-xs text-loop-muted";

const POSITIONS = [
  "Teacher Coordinator",
  "President",
  "Vice President",
  "Secretary",
  "Treasurer",
  "Head Executive",
  "Executive",
];

function messageOf(err: unknown) {
  if (typeof err === "object" && err && "message" in err)
    return String((err as { message: unknown }).message);
  return "Something went wrong";
}

export default function MemberEditor({
  member,
  onClose,
}: {
  member: Member;
  onClose: () => void;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const f = new FormData(e.currentTarget);
    const supabase = createClient();

    try {
      let avatar = member.avatar_url;
      const file = f.get("avatar") as File;
      if (file && file.size > 0) {
         const small = await compressImage(file);
        const path = `team/${member.id}-${Date.now()}.jpg`;
        const { error: upErr } = await supabase.storage
          .from("posters")
          .upload(path, small, { contentType: "image/jpeg" });
        if (upErr) throw upErr;
        avatar = supabase.storage.from("posters").getPublicUrl(path).data.publicUrl;
      }

      const year = String(f.get("term_year") ?? "").trim();
      const order = String(f.get("display_order") ?? "").trim();

      // the database only allows this for admins
      const { data, error: updErr } = await supabase
        .from("profiles")
        .update({
          full_name: String(f.get("full_name")).trim() || null,
          position: String(f.get("position")).trim() || null,
          linkedin: String(f.get("linkedin")).trim() || null,
          avatar_url: avatar,
          role: String(f.get("role")),
          term_year: year ? parseInt(year, 10) : null,
          display_order: order ? parseInt(order, 10) : 100,
          is_active: f.get("is_active") === "on",
        })
        .eq("id", member.id)
        .select("id");
      if (updErr) throw updErr;
      if (!data?.length) throw new Error("Not allowed. Only admins can edit the team.");

      router.refresh();
      onClose();
    } catch (err) {
      setError(messageOf(err));
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[70]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#06060C]/70 backdrop-blur-sm"
      />
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto border-l border-white/10 bg-[#0B0B12] p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#00D9F5]">
              edit member
            </p>
            <h2 className="font-heading text-2xl font-bold">
              {member.full_name ?? "Unnamed"}
            </h2>
            {member.email && (
              <p className="font-mono text-xs text-loop-muted">{member.email}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-loop-muted hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-loop-card">
              {member.avatar_url && (
                <Image src={member.avatar_url} alt="" fill sizes="80px" className="object-cover" />
              )}
            </div>
            <label className={label}>
              Replace photo (square works best)
              <input type="file" name="avatar" accept="image/*" className={input} />
            </label>
          </div>

          <label className={label}>
            Full name
            <input name="full_name" defaultValue={member.full_name ?? ""} className={input} required />
          </label>

          <label className={label}>
            Position (decides which row they appear in)
            <input
              name="position"
              list="positions"
              defaultValue={member.position ?? ""}
              className={input}
            />
            <datalist id="positions">
              {POSITIONS.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>
          </label>

          <label className={label}>
            LinkedIn URL
            <input name="linkedin" defaultValue={member.linkedin ?? ""} className={input} />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className={label}>
              Order (1 = first)
              <input name="display_order" type="number" defaultValue={member.display_order} className={input} />
            </label>
            <label className={label}>
              Term year
              <input name="term_year" type="number" defaultValue={member.term_year ?? ""} className={input} />
            </label>
          </div>
          <p className="-mt-2 font-mono text-[11px] text-loop-muted">
            Clear the term year to hide this person from the Team page.
          </p>

          <label className={label}>
            Website access
            <select name="role" defaultValue={member.role ?? "pending"} className={input}>
              <option value="pending">pending (no login access, e.g. teacher)</option>
              <option value="member">member (can edit events)</option>
              <option value="admin">admin (full control)</option>
            </select>
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="is_active" defaultChecked={member.is_active ?? true} />
            Active (untick when they leave: access ends, name stays in that year)
          </label>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              disabled={busy}
              className="flex-1 rounded-xl bg-gradient-to-r from-[#268BFF] to-[#00BFEA] py-3 font-mono text-sm text-white disabled:opacity-50"
            >
              {busy ? "Saving…" : "Save changes"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/15 px-5 py-3 font-mono text-sm text-loop-muted hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.aside>
    </div>
  );
}