import { Suspense } from "react";
import Link from "next/link";
import { requireStaff } from "@/lib/auth";
import LogoutButton from "@/components/admin/LogoutButton";

async function Guard({ children }: { children: React.ReactNode }) {
  const profile = await requireStaff();
  return (
    <div className="mx-auto max-w-[1280px] px-20 pb-24 pt-32 max-lg:px-10 max-md:px-5">
      <div className="mb-10 flex items-center justify-between gap-4 border-b border-white/10 pb-4">
        <nav className="flex gap-6 font-mono text-sm">
          <Link href="/admin" className="text-loop-muted hover:text-loop-text">dashboard</Link>
          <Link href="/admin/events" className="text-loop-muted hover:text-loop-text">events</Link>
        </nav>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-loop-muted max-md:hidden">
            {profile.email} · {profile.role}
          </span>
          <LogoutButton />
        </div>
      </div>
      {children}
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<p className="pt-40 text-center font-mono text-loop-muted">Loading…</p>}>
      <Guard>{children}</Guard>
    </Suspense>
  );
}