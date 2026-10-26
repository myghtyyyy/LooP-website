import { Suspense } from "react";
import { requireStaff } from "@/lib/auth";
import ProjectForm from "@/components/admin/projectform";
import { connection } from "next/server";
async function Loader() {
  const me = await requireStaff();
  return <ProjectForm isAdmin={me.role === "admin"} />;
}

export default function NewProject() {
  return (
    <Suspense fallback={<p className="text-loop-muted">Loading…</p>}>
      <Loader />
    </Suspense>
  );
}