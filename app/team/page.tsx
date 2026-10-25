import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Reveal from "@/components/ui/reveal";
import TeamBoard from "@/components/team/teamboard";
import type { Member } from "@/components/cards/teamcard";

export const metadata: Metadata = {
  title: "Team | LooP",
  description: "The people behind LooP.",
};

async function Team({ year }: { year?: string }) {
  const supabase = await createClient();

  // is the visitor an admin? (decides if edit controls exist at all)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let isAdmin = false;
  if (user) {
    const { data: me } = await supabase
      .from("profiles")
      .select("role, is_active")
      .eq("id", user.id)
      .single();
    isAdmin = me?.role === "admin" && !!me.is_active;
  }

  // admins load the full rows (role, email, active); everyone else gets the safe public view
  const res = isAdmin
    ? await supabase
        .from("profiles")
        .select("id, full_name, position, avatar_url, linkedin, display_order, term_year, role, is_active, email")
        .not("term_year", "is", null)
        .order("display_order")
    : await supabase.from("team_members").select("*").order("display_order");

  const all = (res.data ?? []) as unknown as Member[];
  const years = [...new Set(all.map((m) => m.term_year))].sort((a, b) => b - a);
  const current = Number(year) || years[0];
  const list = all.filter((m) => m.term_year === current);

  return (
    <>
      {years.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="mr-2 font-mono text-xs uppercase tracking-widest text-loop-muted">
            term
          </span>
          {years.map((y) => (
            <Link
              key={y}
              href={`/team?year=${y}`}
              scroll={false}
              className={`rounded-full border px-5 py-2 font-mono text-xs transition-all duration-300 ${
                y === current
                  ? "border-[#00D9F5] bg-[#00D9F5]/10 text-[#00D9F5] shadow-[0_0_20px_rgba(0,217,245,0.25)]"
                  : "border-white/10 text-loop-muted hover:border-white/30 hover:text-white"
              }`}
            >
              {y}
            </Link>
          ))}
        </div>
      )}

      <TeamBoard key={current} members={list} isAdmin={isAdmin} />

      {list.length > 0 && (
        <Reveal className="mt-24 pb-16 text-center">
          <p className="font-mono text-sm text-loop-muted">
            // {list.length} people, one loop. want to be part of it?{" "}
            <Link href="/contact" className="text-[#00D9F5] hover:underline">
              say hi
            </Link>
          </p>
        </Reveal>
      )}
    </>
  );
}

async function TeamLoader({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }>;
}) {
  const { year } = await searchParams;
  return <Team year={year} />;
}

export default function TeamPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }>;
}) {
  return (
    <main className="mx-auto max-w-[1280px] px-20 pb-24 pt-36 max-lg:px-10 max-md:px-5 max-md:pt-32">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#00D9F5]">
          ./team
        </p>
        <h1 className="mt-3 max-w-3xl font-heading text-6xl font-bold leading-[1.05] tracking-tight max-md:text-4xl">
          The people behind{" "}
          <span className="bg-gradient-to-r from-[#268BFF] to-[#00D9F5] bg-clip-text text-transparent">
            the loop.
          </span>
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-loop-muted max-md:text-base">
          Students who organise the events, run the workshops, and keep this
          place going, guided by our faculty coordinator. Click a card to meet
          them.
        </p>
      </Reveal>

      <Suspense fallback={<p className="mt-12 text-loop-muted">Loading…</p>}>
        <TeamLoader searchParams={searchParams} />
      </Suspense>
    </main>
  );
}