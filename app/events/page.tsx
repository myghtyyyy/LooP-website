import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import EventCard from "@/components/cards/EventCard";

async function EventGrid() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select("slug, title, poster_url, starts_at, ends_at")
    .eq("published", true)
    .order("starts_at", { ascending: false });

  if (!events?.length)
    return <p className="text-loop-muted">No events yet. Check back soon.</p>;

  return (
    <div className="grid grid-cols-4 gap-6 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
      {events.map((e) => (
        <EventCard
          key={e.slug}
          slug={e.slug}
          title={e.title}
          posterUrl={e.poster_url}
          startsAt={e.starts_at}
          endsAt={e.ends_at}
        />
      ))}
    </div>
  );
}

export default function EventsPage() {
  return (
    <main className="mx-auto max-w-[1280px] px-20 pb-24 pt-32 max-lg:px-10 max-md:px-5">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-loop-muted">./events</p>
      <h1 className="mb-10 mt-2 font-heading text-5xl font-bold max-md:text-4xl">Our events</h1>
      <Suspense fallback={<p className="text-loop-muted">Loading…</p>}>
        <EventGrid />
      </Suspense>
    </main>
  );
}