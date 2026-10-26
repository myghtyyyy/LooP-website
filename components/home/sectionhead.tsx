import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/reveal";

export default function SectionHead({
  tag,
  title,
  accent,
  href,
  cta,
}: {
  tag: string;
  title: string;
  accent: string;
  href: string;
  cta: string;
}) {
  return (
    <Reveal className="mb-10 flex items-end justify-between gap-6 max-md:flex-col max-md:items-start">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#00D9F5]">{tag}</p>
        <h2 className="mt-3 font-heading text-5xl font-bold leading-[1.05] tracking-tight max-md:text-3xl">
          {title}{" "}
          <span className="bg-gradient-to-r from-[#268BFF] to-[#00D9F5] bg-clip-text text-transparent">
            {accent}
          </span>
        </h2>
      </div>
      <Link
        href={href}
        className="group flex shrink-0 items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-mono text-xs text-white transition-colors hover:border-[#00D9F5]/60 hover:text-[#00D9F5]"
      >
        {cta}
        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
      </Link>
    </Reveal>
  );
}