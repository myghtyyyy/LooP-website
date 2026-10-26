import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { ArrowUpRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getStatus, statusLabel } from "@/lib/events";
import Reveal from "@/components/ui/reveal";
import EventCard from "@/components/cards/EventCard";
import SectionHead from "@/components/home/sectionhead";

export default async function HomeEvents() {
  await connection(); // status depends on the current time
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("slug, title, description, poster_url, starts_at, ends_at, location")
    .eq("published", true)
    .order("starts_at", { ascending: false })
    .limit(8);

  if (!data?.length) return null;

  // featured = something live or coming up, else the latest event
  const live = data
    .filter((e) => getStatus(e.starts_at, e.ends_at) !== "completed")
    .sort((a, b) => +new Date(a.starts_at) - +new Date(b.starts_at));
  const hero = live[0] ?? data[0];
  const rest = data.filter((e) => e.slug !== hero.slug).slice(0, 3);
  const status = getStatus(hero.starts_at, hero.ends_at);

  const when = new Date(hero.starts_at).toLocaleDateString("en-IN", {
    dateStyle: "long",
    timeZone: "Asia/Kolkata",
  });

  return (
    <section>
      <SectionHead
        tag="./events"
        title="Happening at"
        accent="LooP."
        href="/events"
        cta="All events"
      />

      <Reveal>
        <Link
          href={`/events/${hero.slug}`}
          className="group grid grid-cols-[320px_1fr] overflow-hidden rounded-3xl border border-white/10 bg-[#0D0D14]/80 backdrop-blur-md transition-all duration-300 hover:border-[#268BFF]/60 hover:shadow-[0_0_50px_rgba(38,139,255,0.2)] max-md:grid-cols-1"
        >
          <div className="relative aspect-[3/4] overflow-hidden bg-loop-card max-md:aspect-[4/3]">
            {hero.poster_url && (
              <Image
                src={hero.poster_url}
                alt={hero.title}
                fill
                sizes="320px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}
          </div>
          <div className="flex flex-col justify-center gap-4 p-10 max-md:p-6">
            <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#00D9F5]">
              <span
                className={`h-2 w-2 rounded-full ${
                  status === "ongoing"
                    ? "animate-pulse bg-green-400"
                    : status === "upcoming"
                    ? "bg-yellow-400"
                    : "bg-loop-muted"
                }`}
              />
              {statusLabel[status]}
            </p>
            <h3 className="font-heading text-5xl font-bold leading-tight max-md:text-3xl">
              {hero.title}
            </h3>
            <p className="font-mono text-sm text-loop-muted">
              {when}
              {hero.location && ` · ${hero.location}`}
            </p>
            {hero.description && (
              <p className="line-clamp-3 max-w-xl leading-relaxed text-loop-text/80">
                {hero.description}
              </p>
            )}
            <span className="mt-2 flex items-center gap-2 font-mono text-sm text-[#268BFF]">
              See details
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </span>
          </div>
        </Link>
      </Reveal>

      {rest.length > 0 && (
        <div className="mt-6 grid grid-cols-3 gap-6 max-md:grid-cols-1">
          {rest.map((e, i) => (
            <Reveal key={e.slug} delay={i * 0.08}>
              <EventCard
                slug={e.slug}
                title={e.title}
                posterUrl={e.poster_url}
                startsAt={e.starts_at}
                endsAt={e.ends_at}
              />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}