import Link from "next/link";

export default function AdminHome() {
  return (
    <div>
      <h1 className="font-heading text-4xl font-bold">Admin</h1>
      <p className="mt-2 text-loop-muted">Manage what shows on the LooP site.</p>
      <Link
        href="/admin/events"
        className="mt-8 block max-w-sm rounded-2xl border border-white/10 bg-loop-card p-6 transition-colors hover:border-loop-accent"
      >
        <p className="font-heading text-xl font-bold">Events</p>
        <p className="mt-1 text-sm text-loop-muted">Add, edit, or delete events.</p>
      </Link>
    </div>
  );
}