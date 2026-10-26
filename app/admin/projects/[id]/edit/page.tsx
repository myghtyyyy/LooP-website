import { Suspense } from "react";
import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import ProjectForm, { type ProjectRow } from "@/components/admin/projectform";
import { connection } from "next/server";
async function Loader({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const me = await requireStaff();
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("*").eq("id", id).single();
  if (!data) notFound();
  return <ProjectForm project={data as ProjectRow} isAdmin={me.role === "admin"} />;
}

export default function EditProject({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p className="text-loop-muted">Loading…</p>}>
      <Loader params={params} />
    </Suspense>
  );
}