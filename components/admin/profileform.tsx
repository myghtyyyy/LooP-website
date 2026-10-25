"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { compressImage } from "@/lib/image";

const input =
  "w-full rounded-xl border border-white/10 bg-loop-bg px-4 py-3 text-sm";

export default function ProfileForm({
  profile,
}: {
  profile: {
    full_name: string | null;
    linkedin: string | null;
    avatar_url: string | null;
    position: string | null;
  };
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const f = new FormData(e.currentTarget);
    const supabase = createClient();
    try {
      let avatar: string | null = null;
      const file = f.get("avatar") as File;
      if (file && file.size > 0) {
        const small = await compressImage(file);
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const path = `team/${user!.id}-${Date.now()}.jpg`;
        const { error: upErr } = await supabase.storage
          .from("posters")
          .upload(path, small, { contentType: "image/jpeg" });
        if (upErr) throw upErr;
        avatar = supabase.storage.from("posters").getPublicUrl(path).data.publicUrl;
      }
      const { error } = await supabase.rpc("update_my_profile", {
        p_name: String(f.get("full_name")).trim(),
        p_linkedin: String(f.get("linkedin")).trim() || null,
        p_avatar: avatar,
      });
      if (error) throw error;
      setMsg({ ok: true, text: "Saved" });
      router.refresh();
    } catch (err) {
      setMsg({
        ok: false,
        text: err instanceof Error ? err.message : "Failed",
      });
    }
    setBusy(false);
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-5">
      <h1 className="font-heading text-4xl font-bold">My profile</h1>
      <p className="text-sm text-loop-muted">
        Your position ({profile.position ?? "not set"}) is set by an admin.
      </p>
      <div className="relative h-28 w-28 overflow-hidden rounded-2xl border border-white/10 bg-loop-card">
        {profile.avatar_url && (
          <Image src={profile.avatar_url} alt="" fill sizes="112px" className="object-cover" />
        )}
      </div>
      <label className="block space-y-1 font-mono text-xs text-loop-muted">
        Photo (portrait or square works best)
        <input type="file" name="avatar" accept="image/*" className={input} />
      </label>
      <input name="full_name" defaultValue={profile.full_name ?? ""} placeholder="Full name" className={input} required />
      <input name="linkedin" defaultValue={profile.linkedin ?? ""} placeholder="LinkedIn URL (optional)" className={input} />
      {msg && (
        <p className={`text-sm ${msg.ok ? "text-green-400" : "text-red-400"}`}>{msg.text}</p>
      )}
      <button disabled={busy} className="rounded-xl bg-loop-accent px-6 py-3 font-mono text-sm text-white disabled:opacity-50">
        {busy ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}