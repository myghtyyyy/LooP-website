import Image from "next/image";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { tierOf } from "@/lib/team";
import Reveal from "@/components/ui/reveal";
import SectionHead from "@/components/home/sectionhead";

export default async function HomeTeam() {
  await connection();
  const supabase = await createClient();
  const { data } = await supabase
    .from("team_members")
    .select("id, full_name, position, avatar_url, display_order, term_year")
    .order("display_order");

  if (!data?.length) return null;

  const year = Math.max(...data.map((m) => m.term_year));
  const faces = data
    .filter((m) => m.term_year === year && tierOf(m.position) <= 1)
    .sort((a, b) => tierOf(a.position) - tierOf(b.position) || a.display_order - b.display_order)
    .slice(0, 4);

  if (!faces.length) return null;

  return (
    <section>
      <SectionHead
        tag="./team"
        title="The people behind"
        accent="the loop."
        href="/team"
        cta="Meet the team"
      />
      <div className="grid grid-cols-4 gap-6 max-lg:grid-cols-2">
        {faces.map((m, i) => (
          <Reveal key={m.id} delay={i * 0.08}>
            <div className="group text-center">
              <div className="relative mx-auto aspect-square w-full max-w-[240px] overflow-hidden rounded-full border border-white/10 bg-loop-card transition-all duration-300 group-hover:border-[#00D9F5]/60 group-hover:shadow-[0_0_40px_rgba(0,217,245,0.25)]">
                {m.avatar_url ? (
                  <Image
                    src={m.avatar_url}
                    alt={m.full_name ?? ""}
                    fill
                    sizes="240px"
                    className="object-cover saturate-[0.6] transition-all duration-500 group-hover:scale-105 group-hover:saturate-100"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#268BFF]/30 via-[#0D0D14] to-[#00D9F5]/20">
                    <span className="font-heading text-6xl font-bold text-white/70">
                      {m.full_name?.[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <h3 className="mt-5 font-heading text-xl font-bold">{m.full_name}</h3>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-[#00D9F5]">
                {m.position}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}