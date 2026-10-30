import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import DeleteProjectButton from "@/components/admin/deleteprojectbutton";

async function List() {
  await connection();
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("id, title, featured, published, builders")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-4xl font-bold">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="rounded-xl bg-loop-accent px-5 py-3 font-mono text-sm text-white"
        >
          + New project
        </Link>
      </div>
      <ul className="mt-8 divide-y divide-white/10 rounded-2xl border border-white/10 bg-loop-card">
        {projects?.length === 0 && (
          <li className="p-6 text-loop-muted">No projects yet. Add the first one.</li>
        )}
        {projects?.map((p) => (
          <li key={p.id} className="flex items-center justify-between gap-4 p-5">
            <div>
              <p className="font-heading text-lg font-bold">
                {p.title} {p.featured && <span className="text-[#00D9F5]">★</span>}
              </p>
              <p className="font-mono text-xs text-loop-muted">
                {p.builders.join(", ") || "no builders listed"}
                {!p.published && " · hidden"}
              </p>
            </div>
            <div className="flex gap-5">
              <Link
                href={`/admin/projects/${p.id}/edit`}
                className="font-mono text-xs text-[#00D9F5] hover:underline"
              >
                edit
              </Link>
              <DeleteProjectButton id={p.id} title={p.title} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AdminProjects() {
  return (
    <Suspense fallback={<p className="text-loop-muted">Loading…</p>}>
      <List />
    </Suspense>
  );
}