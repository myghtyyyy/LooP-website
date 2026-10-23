import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Call at the top of any admin page. Redirects if the person isn't allowed in.
export async function requireStaff(adminOnly = false) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, full_name, role, position, is_active")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.is_active || profile.role === "pending") redirect("/");
  if (adminOnly && profile.role !== "admin") redirect("/admin");
  return profile;
}