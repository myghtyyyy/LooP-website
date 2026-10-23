"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await createClient().auth.signOut();
        router.push("/login");
        router.refresh();
      }}
      className="rounded-full border border-white/10 px-4 py-2 font-mono text-xs text-loop-muted hover:text-loop-text"
    >
      Log out
    </button>
  );
}