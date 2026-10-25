export const TIERS = [
  { label: "Faculty", sub: "guiding the club", size: "xl" as const },
  { label: "Leadership", sub: "president · vice president · secretary", size: "lg" as const },
  { label: "Core team", sub: "treasurer · head executive", size: "md" as const },
  { label: "Executives", sub: "the ones making it happen", size: "sm" as const },
];

// the tier is decided by the position text
export function tierOf(position: string | null) {
  const x = (position ?? "").toLowerCase();
  if (/(teacher|faculty|professor|advisor|mentor)/.test(x)) return 0;
  if (/(president|\bvp\b|secretary)/.test(x)) return 1;
  if (/(treasurer|head)/.test(x)) return 2;
  return 3;
}