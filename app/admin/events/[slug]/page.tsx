import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getStatus, statusLabel } from "@/lib/events";

async function Detail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: e } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();
  if (!e) notFound();

  const when = new Date(e.starts_at).toLocaleString("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });

  return (
    <div className="grid grid-cols-[360px_1fr] gap-12 max-md:grid-cols-1">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-loop-card">
        {e.poster_url && (
          <Image src={e.poster_url} alt={e.title} fill sizes="360px" className="object-cover" />
        )}
      </div>
      <div>
        <p className="font-mono text-xs uppercase text-loop-accent">
          {statusLabel[getStatus(e.starts_at, e.ends_at)]}
        </p>
        <h1 className="mt-2 font-heading text-5xl font-bold max-md:text-4xl">{e.title}</h1>
        <p className="mt-4 font-mono text-sm text-loop-muted">
          {when}
          {e.location && ` · ${e.location}`}
        </p>
        <p className="mt-8 whitespace-pre-line leading-relaxed text-loop-text/90">
          {e.description}
        </p>
      </div>
    </div>
  );
}

export default function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <main className="mx-auto max-w-[1280px] px-20 pb-24 pt-32 max-lg:px-10 max-md:px-5">
      <Link href="/events" className="mb-8 inline-block font-mono text-sm text-loop-muted hover:text-loop-text">
        ← all events
      </Link>
      <Suspense fallback={<p className="text-loop-muted">Loading…</p>}>
        <Detail params={params} />
      </Suspense>
    </main>
  );
}