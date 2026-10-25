"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { randomBytes } from "crypto";
export type Result = { ok: boolean; message: string; password?: string };

const ROLES = ["pending", "member", "admin"];

function fields(f: FormData) {
  const year = String(f.get("term_year") ?? "").trim();
  const order = String(f.get("display_order") ?? "").trim();
  return {
    full_name: String(f.get("full_name") ?? "").trim() || null,
    position: String(f.get("position") ?? "").trim() || null,
    role: String(f.get("role")),
    term_year: year ? parseInt(year, 10) : null,
    display_order: order ? parseInt(order, 10) : 100,
  };
}

function tempPassword() {
  return randomBytes(9).toString("base64url"); // 12 random characters
}

export async function createMember(formData: FormData): Promise<Result> {
  await requireStaff(true);

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const data = fields(formData);
  if (!email || !ROLES.includes(data.role))
    return { ok: false, message: "Check the email and role." };

  const password = tempPassword();
  const admin = createAdminClient();
  const { data: res, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // no confirmation email needed
  });
  if (error || !res.user)
    return { ok: false, message: error?.message ?? "Could not create user." };

  const { error: pErr } = await admin
    .from("profiles")
    .update(data)
    .eq("id", res.user.id);
  if (pErr) return { ok: false, message: pErr.message };

  revalidatePath("/admin/team");
  return {
  ok: true,
  message: `Created ${email}. Send this password to them. It is shown only once.`,
  password,
};
}

export async function resetPassword(formData: FormData): Promise<Result> {
  await requireStaff(true);

  const id = String(formData.get("id"));
  const password = tempPassword();
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.updateUserById(id, { password });
  if (error) return { ok: false, message: error.message };

  return { ok: true, message: `New temporary password (shown once): ${password}` };
}


export async function updateMember(formData: FormData): Promise<Result> {
  await requireStaff(true);

  const id = String(formData.get("id"));
  const data = fields(formData);
  if (!ROLES.includes(data.role)) return { ok: false, message: "Bad role." };

  // normal client: database rules and the last-admin trigger still apply
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ ...data, is_active: formData.get("is_active") === "on" })
    .eq("id", id);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/team");
  return { ok: true, message: "Saved" };
}