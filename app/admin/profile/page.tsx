import { Suspense } from "react";
import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import ProfileForm from "@/components/admin/profileform";

async function Profile() {
  await requireStaff();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data } = await supabase
    .from("profiles")
    .select("full_name, linkedin, avatar_url, position")
    .eq("id", user!.id)
    .single();
  return <ProfileForm profile={data!} />;
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<p className="text-loop-muted">Loading…</p>}>
      <Profile />
    </Suspense>
  );
}