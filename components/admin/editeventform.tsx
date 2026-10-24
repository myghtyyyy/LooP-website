"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toLocalInput } from "@/lib/events";

const input =
  "w-full rounded-xl border border-white/10 bg-loop-bg px-4 py-3 text-sm";

type EventRow = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  starts_at: string;
  ends_at: string | null;
  poster_url: string | null;
  published: boolean;
};

export default function EditEventForm({ event }: { event: EventRow }) {
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
      let posterUrl = event.poster_url;
      const file = f.get("poster") as File;
      if (file && file.size > 0) {
        const path = `events/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
        const { error: upErr } = await supabase.storage
          .from("posters")
          .upload(path, file);
        if (upErr) throw upErr;
        posterUrl = supabase.storage.from("posters").getPublicUrl(path).data.publicUrl;
      }

      const ends = String(f.get("ends_at"));
      // Slug is left unchanged so existing shared links keep working.
      const { error: updErr } = await supabase
        .from("events")
        .update({
          title: String(f.get("title")).trim(),
          description: String(f.get("description")),
          location: String(f.get("location")) || null,
          starts_at: new Date(String(f.get("starts_at"))).toISOString(),
          ends_at: ends ? new Date(ends).toISOString() : null,
          poster_url: posterUrl,
          published: f.get("published") === "on",
        })
        .eq("id", event.id);
      if (updErr) throw updErr;

      router.push("/admin/events");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-5">
      <Link
        href="/admin/events"
        className="font-mono text-sm text-loop-muted hover:text-loop-text"
      >
        ← back to events
      </Link>
      <h1 className="font-heading text-4xl font-bold">Edit event</h1>

      <input name="title" defaultValue={event.title} className={input} required />
      <textarea
        name="description"
        defaultValue={event.description ?? ""}
        rows={6}
        className={input}
      />
      <input
        name="location"
        defaultValue={event.location ?? ""}
        placeholder="Location (optional)"
        className={input}
      />

      <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
        <label className="space-y-1 font-mono text-xs text-loop-muted">
          Starts
          <input
            type="datetime-local"
            name="starts_at"
            defaultValue={toLocalInput(event.starts_at)}
            className={input}
            required
          />
        </label>
        <label className="space-y-1 font-mono text-xs text-loop-muted">
          Ends (optional)
          <input
            type="datetime-local"
            name="ends_at"
            defaultValue={toLocalInput(event.ends_at)}
            className={input}
          />
        </label>
      </div>

      <div className="space-y-2">
        <p className="font-mono text-xs text-loop-muted">Current poster</p>
        <div className="relative aspect-[3/4] w-40 overflow-hidden rounded-xl border border-white/10 bg-loop-card">
          {event.poster_url && (
            <Image
              src={event.poster_url}
              alt=""
              fill
              sizes="160px"
              className="object-cover"
            />
          )}
        </div>
        <label className="block space-y-1 font-mono text-xs text-loop-muted">
          Replace poster (leave empty to keep it)
          <input type="file" name="poster" accept="image/*" className={input} />
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="published" defaultChecked={event.published} />
        Show on the public site
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        disabled={busy}
        className="rounded-xl bg-loop-accent px-6 py-3 font-mono text-sm text-white disabled:opacity-50"
      >
        {busy ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}