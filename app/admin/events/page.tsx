import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getStatus, statusLabel } from "@/lib/events";
import DeleteEventButton from "@/components/admin/DeleteEventButton";

export default async function AdminEvents() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select("id, slug, title, starts_at, ends_at, published")
    .order("starts_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-4xl font-bold">Events</h1>
        <Link
          href="/admin/events/new"
          className="rounded-xl bg-loop-accent px-5 py-3 font-mono text-sm text-white"
        >
          + New event
        </Link>
      </div>

      <ul className="mt-8 divide-y divide-white/10 rounded-2xl border border-white/10 bg-loop-card">
        {events?.length === 0 && (
          <li className="p-6 text-loop-muted">No events yet. Add your first one.</li>
        )}
        {events?.map((e) => (
          <li key={e.id} className="flex items-center justify-between gap-4 p-5">
            <div>
              <p className="font-heading text-lg font-bold">{e.title}</p>
              <p className="font-mono text-xs text-loop-muted">
                {statusLabel[getStatus(e.starts_at, e.ends_at)]}
                {!e.published && " · hidden"}
              </p>
            </div>
            <div className="flex gap-5">
              <Link href={`/events/${e.slug}`} className="font-mono text-xs text-loop-muted hover:text-loop-text">
                view
              </Link>
              <DeleteEventButton id={e.id} title={e.title} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}