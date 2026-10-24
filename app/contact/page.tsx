import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { SiSubstack } from "react-icons/si";
import { links } from "@/data/links";
import { createClient } from "@/lib/supabase/server";
import Reveal from "@/components/ui/reveal";
import ContactComposer from "@/components/ui/contactcomposer";

export const metadata: Metadata = {
  title: "Contact | LooP",
  description: "Say hi to the LooP team.",
};

const places = [
  {
    icon: FaInstagram,
    name: "Instagram",
    line: "where the posters and event photos live",
    href: links.instagram,
  },
  {
    icon: FaLinkedinIn,
    name: "LinkedIn",
    line: "for the grown-up stuff",
    href: links.linkedin,
  },
  {
    icon: SiSubstack,
    name: "Substack",
    line: "long reads and things we learned the hard way",
    href: links.substack,
  },
];

// real people, pulled from your Team page
async function Faces() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("team_members")
    .select("id, full_name, position, avatar_url")
    .order("term_year", { ascending: false })
    .order("display_order")
    .limit(3);

  if (!data?.length) return null;

  return (
    <Reveal delay={0.1} className="mt-10 flex items-center gap-5 max-md:flex-col max-md:items-start">
      <div className="flex -space-x-3">
        {data.map((m) => (
          <div
            key={m.id}
            className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-[#06060C] bg-loop-card"
          >
            {m.avatar_url ? (
              <Image src={m.avatar_url} alt={m.full_name ?? ""} fill sizes="56px" className="object-cover" />
            ) : (
              <span className="flex h-full items-center justify-center font-heading text-lg text-loop-muted">
                {m.full_name?.[0]}
              </span>
            )}
          </div>
        ))}
      </div>
      <p className="text-loop-muted">
        <span className="text-white">
          {data.map((m) => m.full_name?.split(" ")[0]).join(", ")}
        </span>{" "}
        and the rest of the team read these. Real people, not a no-reply inbox.
      </p>
    </Reveal>
  );
}

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-[1100px] px-20 pb-24 pt-36 max-lg:px-10 max-md:px-5 max-md:pt-32">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#00D9F5]">
          ./contact
        </p>
        <h1 className="mt-3 font-heading text-6xl font-bold leading-[1.05] tracking-tight max-md:text-4xl">
          Say hi.{" "}
          <span className="bg-gradient-to-r from-[#268BFF] to-[#00D9F5] bg-clip-text text-transparent">
            We actually reply.
          </span>
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-loop-muted max-md:text-base">
          Got a question, an idea, or just curious what we get up to? Tell us
          what it&apos;s about and we&apos;ll start the email for you.
        </p>
      </Reveal>

      <Suspense fallback={<div className="mt-10 h-14" />}>
        <Faces />
      </Suspense>

      <Reveal delay={0.15} className="mt-12">
        <ContactComposer email={links.email} />
      </Reveal>

      {/* other places */}
      <Reveal delay={0.1} className="mt-16">
        <h2 className="font-heading text-2xl font-bold">Or find us hanging out here</h2>
        <ul className="mt-5 divide-y divide-white/10 border-y border-white/10">
          {places.map(({ icon: Icon, name, line, href }) => (
            <li key={name}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-5 py-5 transition-all duration-300 hover:pl-3"
              >
                <Icon size={20} className="shrink-0 text-loop-muted transition-colors group-hover:text-[#00D9F5]" />
                <span className="font-heading text-xl font-bold">{name}</span>
                <span className="flex-1 text-loop-muted max-md:hidden">{line}</span>
                <ArrowUpRight
                  size={20}
                  className="ml-auto text-loop-muted transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#00D9F5]"
                />
              </a>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal className="mt-10">
        <p className="font-mono text-sm text-loop-muted">
          // we usually reply within a couple of days. exam weeks might take
          a little longer.
        </p>
      </Reveal>
    </main>
  );
}