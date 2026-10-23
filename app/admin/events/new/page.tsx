"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const input =
  "w-full rounded-xl border border-white/10 bg-loop-bg px-4 py-3 text-sm";

export default function NewEvent() {
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
      const title = String(f.get("title")).trim();
      const slug =
        title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") +
        "-" + Math.random().toString(36).slice(2, 6);

      // upload poster (optional)
      let posterUrl: string | null = null;
      const file = f.get("poster") as File;
      if (file && file.size > 0) {
        const path = `events/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
        const { error: upErr } = await supabase.storage.from("posters").upload(path, file);
        if (upErr) throw upErr;
        posterUrl = supabase.storage.from("posters").getPublicUrl(path).data.publicUrl;
      }

      const { data: { user } } = await supabase.auth.getUser();
      const ends = String(f.get("ends_at"));

      const { error: insErr } = await supabase.from("events").insert({
        slug,
        title,
        description: String(f.get("description")),
        location: String(f.get("location")) || null,
        starts_at: new Date(String(f.get("starts_at"))).toISOString(),
        ends_at: ends ? new Date(ends).toISOString() : null,
        poster_url: posterUrl,
        published: f.get("published") === "on",
        created_by: user?.id,
      });
      if (insErr) throw insErr;

      router.push("/admin/events");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-5">
      <h1 className="font-heading text-4xl font-bold">New event</h1>
      <input name="title" placeholder="Event title" className={input} required />
      <textarea name="description" placeholder="What is this event about? (shown when someone opens the card)" rows={6} className={input} />
      <input name="location" placeholder="Location (optional)" className={input} />
      <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
        <label className="space-y-1 font-mono text-xs text-loop-muted">
          Starts
          <input type="datetime-local" name="starts_at" className={input} required />
        </label>
        <label className="space-y-1 font-mono text-xs text-loop-muted">
          Ends (optional)
          <input type="datetime-local" name="ends_at" className={input} />
        </label>
      </div>
      <label className="block space-y-1 font-mono text-xs text-loop-muted">
        Poster image
        <input type="file" name="poster" accept="image/*" className={input} />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="published" defaultChecked /> Show on the public site
      </label>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        disabled={busy}
        className="rounded-xl bg-loop-accent px-6 py-3 font-mono text-sm text-white disabled:opacity-50"
      >
        {busy ? "Saving…" : "Create event"}
      </button>
    </form>
  );
}