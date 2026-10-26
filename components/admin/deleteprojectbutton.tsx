"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DeleteProjectButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        if (!confirm(`Delete "${title}"? This can't be undone.`)) return;
        const { error } = await createClient().from("projects").delete().eq("id", id);
        if (error) return alert(error.message);
        router.refresh();
      }}
      className="font-mono text-xs text-red-400 hover:underline"
    >
      delete
    </button>
  );
}