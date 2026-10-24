import { Suspense } from "react";
import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import InviteForm from "@/components/admin/inviteform";
import MemberRow, { type Member } from "@/components/admin/memberrow";

async function Team() {
  await requireStaff(true); // members who type this URL get sent back to /admin
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, email, full_name, position, role, term_year, display_order, is_active")
    .order("is_active", { ascending: false })
    .order("term_year", { ascending: false })
    .order("display_order");

  const members = (data ?? []) as Member[];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-heading text-4xl font-bold">Team</h1>
        <p className="mt-2 max-w-2xl text-sm text-loop-muted">
          <b>Role</b> is what someone can do. <b>Position</b> is the title shown on the public
          Team page. Untick <b>active</b> when someone leaves: they lose access but their
          events stay. Lower <b>order</b> numbers show first.
        </p>
      </div>
      <InviteForm />
      <div className="space-y-4">
        {members.map((m) => (
          <MemberRow key={m.id} m={m} />
        ))}
      </div>
    </div>
  );
}

export default function TeamAdminPage() {
  return (
    <Suspense fallback={<p className="text-loop-muted">Loading…</p>}>
      <Team />
    </Suspense>
  );
}