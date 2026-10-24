import type { Metadata } from "next";
import Link from "next/link";

import Reveal from "@/components/ui/reveal";
import { ArrowRight, Hammer, Mic, Repeat, Rocket, Share2, Trophy, Wrench } from "lucide-react";

export const metadata: Metadata = {
  title: "About | LooP",
  description: "Who we are and what LooP does.",
};
const activities = [
  {
    icon: Wrench,
    title: "Workshops",
    text: "Hands-on sessions where you learn a tool or skill by building with it, from beginner to advanced.",
    tag: "Learn",
  },
  {
    icon: Trophy,
    title: "Competitions",
    text: "Hackathons, coding contests, and challenges that push you to solve problems against the clock.",
    tag: "Compete",
  },
  {
    icon: Rocket,
    title: "Project Showcase",
    text: "A stage for member projects. The best ones get featured on this site for everyone to see.",
    tag: "Ship",
  },
  {
    icon: Mic,
    title: "Talks",
    text: "Sessions with seniors, alumni, and industry speakers sharing what they have learned the hard way.",
    tag: "Listen",
  },
];
const pillars = [
  {
    icon: Hammer,
    title: "Build",
    text: "We learn by making things. Workshops, hackathons, and projects where ideas become working software.",
  },
  {
    icon: Share2,
    title: "Share",
    text: "What one person figures out, everyone gains. Talks, blogs, and demos keep knowledge moving through the club.",
  },
  {
    icon: Repeat,
    title: "Repeat",
    text: "Every event feeds the next one. New members join, old ones mentor, and the loop keeps growing.",
  },
];

// replace with your real numbers
const stats = [
  { value: "10+", label: "Events hosted" },
  { value: "100+", label: "Members & attendees" },
  { value: "5+", label: "Projects built" },
  { value: "2026", label: "Current term" },
];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-[1280px] px-20 pb-24 pt-36 max-lg:px-10 max-md:px-5 max-md:pt-32">
      {/* intro */}
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#00D9F5]">
          ./about
        </p>
        <h1 className="mt-3 max-w-4xl font-heading text-6xl font-bold leading-[1.05] tracking-tight max-md:text-4xl">
          A community where builders{" "}
          <span className="bg-gradient-to-r from-[#268BFF] to-[#00D9F5] bg-clip-text text-transparent">
            connect, learn, and ship.
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-loop-muted max-md:text-base">
          LooP is a student-run tech club. Write a short story here: when and why
          it started, who it is for, and what makes it different from other
          clubs. Two or three sentences is enough.
        </p>
      </Reveal>
{/* what we do */}
<section className="mt-24 max-md:mt-16">
  <Reveal>
    <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#00D9F5]">
      ./activities
    </p>
    <h2 className="mt-2 font-heading text-4xl font-bold max-md:text-3xl">
      What we do
    </h2>
  </Reveal>

  <div className="mt-8 grid grid-cols-4 gap-6 max-xl:grid-cols-2 max-md:grid-cols-1">
    {activities.map(({ icon: Icon, title, text, tag }, i) => (
      <Reveal key={title} delay={i * 0.08}>
        <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-[#0D0D14]/70 p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-[#268BFF]/50 hover:shadow-[0_0_36px_rgba(38,139,255,0.18)]">
          {/* glow that appears on hover */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#268BFF]/0 blur-2xl transition-all duration-500 group-hover:bg-[#268BFF]/30"
          />
          <div className="relative flex items-center justify-between">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#268BFF]/25 to-[#00D9F5]/10 text-[#00D9F5] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <Icon size={22} />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-loop-muted">
              0{i + 1} / {tag}
            </span>
          </div>
          <h3 className="relative mt-6 font-heading text-2xl font-bold">{title}</h3>
          <p className="relative mt-2 leading-relaxed text-loop-muted">{text}</p>
        </div>
      </Reveal>
    ))}
  </div>
</section>
      {/* pillars */}
      <section className="mt-24 max-md:mt-16">
        <Reveal>
          <h2 className="mt-2 font-heading text-4xl font-bold max-md:text-3xl">
            How we work
          </h2>
        </Reveal>
        <div className="mt-8 grid grid-cols-3 gap-6 max-lg:grid-cols-1">
          {pillars.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.1}>
              <div className="group h-full rounded-2xl border border-white/10 bg-[#0D0D14]/70 p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#268BFF]/50 hover:shadow-[0_0_32px_rgba(38,139,255,0.15)]">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#268BFF]/25 to-[#00D9F5]/10 text-[#00D9F5]">
                  <Icon size={22} />
                </span>
                <h3 className="mt-5 font-heading text-2xl font-bold">{title}</h3>
                <p className="mt-2 leading-relaxed text-loop-muted">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* stats */}
      <section className="mt-24 max-md:mt-16">
        <div className="grid grid-cols-4 gap-6 rounded-3xl border border-white/10 bg-[#0D0D14]/70 p-8 backdrop-blur-md max-lg:grid-cols-2">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="text-center">
              <p className="bg-gradient-to-r from-[#268BFF] to-[#00D9F5] bg-clip-text font-heading text-5xl font-bold text-transparent max-md:text-4xl">
                {s.value}
              </p>
              <p className="mt-2 font-mono text-xs uppercase tracking-widest text-loop-muted">
                {s.label}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* mission */}
      <section className="mt-24 grid grid-cols-2 gap-12 max-md:mt-16 max-lg:grid-cols-1">
        <Reveal>
          <h2 className="font-heading text-3xl font-bold max-md:text-2xl">
            Our mission
          </h2>
          <p className="mt-4 leading-relaxed text-loop-muted">
            Write what the club stands for in a few lines. For example: make
            building software approachable for every student, whatever their
            starting point.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-heading text-3xl font-bold max-md:text-2xl">
            Who can join
          </h2>
          <p className="mt-4 leading-relaxed text-loop-muted">
            Explain how someone becomes a member: open to all branches,
            recruitment drives, or how to reach you. Point them to the contact
            page.
          </p>
        </Reveal>
      </section>

      {/* call to action */}
      <Reveal className="mt-24 max-md:mt-16">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0D0D14]/70 p-10 text-center backdrop-blur-md max-md:p-7">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(38,139,255,0.18),transparent_70%)]"
          />
          <h2 className="relative font-heading text-4xl font-bold max-md:text-3xl">
            Be part of the loop
          </h2>
          <p className="relative mx-auto mt-3 max-w-lg text-loop-muted">
            See what we have been up to, meet the team, or say hello.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/events"
              className="group flex min-h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-[#268BFF] to-[#00BFEA] px-7 py-3.5 font-mono text-sm text-white transition-all duration-300 hover:-translate-y-1"
            >
              See events
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="flex min-h-12 items-center gap-2 rounded-xl border border-white/15 px-7 py-3.5 font-mono text-sm text-white transition-all duration-300 hover:-translate-y-1 hover:border-[#268BFF]/50"
            >
              Contact us
            </Link>
          </div>
        </div>
      </Reveal>
    </main>
  );
}