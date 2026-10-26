"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { compressImage } from "@/lib/image";

const input = "w-full rounded-xl border border-white/10 bg-loop-bg px-4 py-3 text-sm";
const label = "block space-y-1 font-mono text-xs text-loop-muted";

export type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  description: string | null;
  repo_url: string | null;
  demo_url: string | null;
  cover_url: string | null;
  tags: string[];
  builders: string[];
  featured: boolean;
  published: boolean;
};

const list = (s: FormDataEntryValue | null) =>
  String(s ?? "").split(",").map((x) => x.trim()).filter(Boolean);

function messageOf(err: unknown) {
  if (typeof err === "object" && err && "message" in err)
    return String((err as { message: unknown }).message);
  return "Something went wrong";
}

export default function ProjectForm({
  project,
  isAdmin,
}: {
  project?: ProjectRow;
  isAdmin: boolean;
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
      let cover = project?.cover_url ?? null;
      const file = f.get("cover") as File;
      if (file && file.size > 0) {
        const small = await compressImage(file, 1400);
        const path = `projects/${Date.now()}.jpg`;
        const { error: upErr } = await supabase.storage
          .from("posters")
          .upload(path, small, { contentType: "image/jpeg" });
        if (upErr) throw upErr;
        cover = supabase.storage.from("posters").getPublicUrl(path).data.publicUrl;
      }

      const title = String(f.get("title")).trim();
      const data = {
        title,
        tagline: String(f.get("tagline")).trim() || null,
        description: String(f.get("description")).trim() || null,
        repo_url: String(f.get("repo_url")).trim() || null,
        demo_url: String(f.get("demo_url")).trim() || null,
        cover_url: cover,
        tags: list(f.get("tags")),
        builders: list(f.get("builders")),
        published: f.get("published") === "on",
        ...(isAdmin ? { featured: f.get("featured") === "on" } : {}),
      };

      if (project) {
        const { error: err } = await supabase.from("projects").update(data).eq("id", project.id);
        if (err) throw err;
      } else {
        const slug =
          title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") +
          "-" + Math.random().toString(36).slice(2, 6);
        const { data: { user } } = await supabase.auth.getUser();
        const { error: err } = await supabase
          .from("projects")
          .insert({ ...data, slug, created_by: user?.id });
        if (err) throw err;
      }

      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      setError(messageOf(err));
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-5">
      <Link href="/admin/projects" className="font-mono text-sm text-loop-muted hover:text-loop-text">
        ← back to projects
      </Link>
      <h1 className="font-heading text-4xl font-bold">
        {project ? "Edit project" : "New project"}
      </h1>

      <input name="title" defaultValue={project?.title} placeholder="Project name" className={input} required />
      <input
        name="tagline"
        defaultValue={project?.tagline ?? ""}
        placeholder="One-line pitch, e.g. 'Find a study partner in 10 seconds'"
        maxLength={100}
        className={input}
      />
      <textarea
        name="description"
        defaultValue={project?.description ?? ""}
        placeholder="What does it do? What problem does it solve? What did you learn building it?"
        rows={6}
        className={input}
      />
      <label className={label}>
        Built by (names, separated by commas)
        <input name="builders" defaultValue={project?.builders.join(", ")} placeholder="Aarav Shah, Meera Iyer" className={input} />
      </label>
      <label className={label}>
        GitHub repo link
        <input name="repo_url" type="url" defaultValue={project?.repo_url ?? ""} placeholder="https://github.com/loop-club/project" className={input} />
      </label>
      <label className={label}>
        Live demo link (optional)
        <input name="demo_url" type="url" defaultValue={project?.demo_url ?? ""} placeholder="https://..." className={input} />
      </label>
      <label className={label}>
        Tags (separated by commas)
        <input name="tags" defaultValue={project?.tags.join(", ")} placeholder="Web, AI, Hardware" className={input} />
      </label>

      <div className="space-y-2">
        {project?.cover_url && (
          <div className="relative aspect-[16/10] w-56 overflow-hidden rounded-xl border border-white/10 bg-loop-card">
            <Image src={project.cover_url} alt="" fill sizes="224px" className="object-cover" />
          </div>
        )}
        <label className={label}>
          Cover image {project ? "(leave empty to keep the current one)" : "(a screenshot works great)"}
          <input type="file" name="cover" accept="image/*" className={input} />
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="published" defaultChecked={project?.published ?? true} />
        Show on the public site
      </label>
      {isAdmin && (
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="featured" defaultChecked={project?.featured ?? false} />
          Featured (big spotlight card, admins only)
        </label>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}
      <button disabled={busy} className="rounded-xl bg-loop-accent px-6 py-3 font-mono text-sm text-white disabled:opacity-50">
        {busy ? "Saving…" : project ? "Save changes" : "Add project"}
      </button>
    </form>
  );
}