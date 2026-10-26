import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import Reveal from "@/components/ui/reveal";
import SectionHead from "@/components/home/sectionhead";

export default async function HomeProjects() {
  await connection();
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("id, slug, title, tagline, cover_url, tags, builders, featured, community")
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(6);

  if (!data?.length) return null;

  return (
    <section>
      <SectionHead
        tag="./projects"
        title="Built with"
        accent="LooP."
        href="/projects"
        cta="All projects"
      />
      <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-md:grid-cols-1">
        {data.map((p, i) => (
          <Reveal key={p.id} delay={(i % 3) * 0.08}>
            <Link
              href="/projects"
              className="group block h-full overflow-hidden rounded-2xl border border-white/10 bg-[#0D0D14]/80 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-[#268BFF]/60 hover:shadow-[0_0_40px_rgba(38,139,255,0.2)]"
            >
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                {p.community && (
                  <span className="ml-auto rounded-full border border-white/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-loop-muted">
                    community
                  </span>
                )}
                {p.featured && (
                  <span
                    className={`${
                      p.community ? "ml-2" : "ml-auto"
                    } flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-[#00D9F5]`}
                  >
                    <Star size={11} fill="currentColor" /> featured
                  </span>
                )}
              </div>
              <div className="relative aspect-[16/10] overflow-hidden bg-loop-card">
                {p.cover_url ? (
                  <Image
                    src={p.cover_url}
                    alt=""
                    fill
                    sizes="400px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#268BFF]/30 via-[#0D0D14] to-[#00D9F5]/20">
                    <span className="font-mono text-5xl text-white/30">{"</>"}</span>
                  </div>
                )}
              </div>
              <div className="space-y-3 p-5">
                <h3 className="font-heading text-2xl font-bold leading-tight">{p.title}</h3>
                {p.tagline && <p className="line-clamp-2 text-loop-muted">{p.tagline}</p>}
                <div className="flex flex-wrap gap-1.5">
                  {p.tags.slice(0, 3).map((t: string) => (
                    <span
                      key={t}
                      className="rounded-full border border-[#00D9F5]/30 bg-[#00D9F5]/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[#00D9F5]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                {p.builders.length > 0 && (
                  <p className="truncate font-mono text-xs text-loop-muted">
                    by {p.builders.join(", ")}
                  </p>
                )}
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}