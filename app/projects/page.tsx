import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Reveal from "@/components/ui/reveal";
import ProjectsBoard from "@/components/projects/projectboard";
import type { ProjectRow } from "@/components/admin/projectform";

export const metadata: Metadata = {
  title: "Projects | LooP",
  description: "Things LooP members have built.",
};

async function Projects() {
  await connection();
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });
  const list = (data ?? []) as ProjectRow[];

  return (
    <>
      <p className="mt-6 font-mono text-sm text-[#00D9F5]">
        $ ls ./projects <span className="text-loop-muted">// {list.length} built so far</span>
      </p>
      <ProjectsBoard projects={list} />
    </>
  );
}

export default function ProjectsPage() {
  return (
    <main className="mx-auto max-w-[1280px] px-20 pb-24 pt-36 max-lg:px-10 max-md:px-5 max-md:pt-32">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#00D9F5]">./projects</p>
        <h1 className="mt-3 max-w-3xl font-heading text-6xl font-bold leading-[1.05] tracking-tight max-md:text-4xl">
          Things we{" "}
          <span className="bg-gradient-to-r from-[#268BFF] to-[#00D9F5] bg-clip-text text-transparent">
            actually built.
          </span>
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-loop-muted max-md:text-base">
          Every project here was made by a LooP member, from late-night hackathon
          ideas to things that are still running. Click one to see who built it
          and grab the code.
        </p>
      </Reveal>
      <Suspense fallback={<p className="mt-12 text-loop-muted">Loading…</p>}>
        <Projects />
      </Suspense>
    </main>
  );
}