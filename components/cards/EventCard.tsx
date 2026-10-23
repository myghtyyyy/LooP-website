import Image from "next/image";
import Link from "next/link";
import { getStatus, statusLabel } from "@/lib/events";

type Props = {
  slug: string;
  title: string;
  posterUrl: string | null;
  startsAt: string;
  endsAt: string | null;
};

const dot = {
  upcoming: "bg-yellow-400",
  ongoing: "bg-green-400 animate-pulse",
  completed: "bg-loop-muted",
};

export default function EventCard({ slug, title, posterUrl, startsAt, endsAt }: Props) {
  const status = getStatus(startsAt, endsAt);
  return (
    <Link
      href={`/events/${slug}`}
      className="group block overflow-hidden rounded-2xl border border-white/10 bg-loop-card transition-transform hover:-translate-y-1"
    >
      <div className="relative aspect-[3/4] bg-loop-bg">
        {posterUrl && (
          <Image src={posterUrl} alt={title} fill sizes="25vw" className="object-cover" />
        )}
      </div>
      <div className="p-4">
        <span className="flex items-center gap-2 font-mono text-xs uppercase text-loop-muted">
          <span className={`h-2 w-2 rounded-full ${dot[status]}`} />
          {statusLabel[status]}
        </span>
        <h3 className="mt-2 font-heading text-xl font-bold">{title}</h3>
      </div>
    </Link>
  );
}