export const TIERS = [
  { label: "Faculty", sub: "guiding the club", size: "xl" as const },
  { label: "Leadership", sub: "president · vice president · secretary", size: "lg" as const },
  { label: "Core team", sub: "treasurer · head executive", size: "md" as const },
  { label: "Executives", sub: "the ones making it happen", size: "sm" as const },
];

export function tierOf(position: string | null) {
  const x = (position ?? "").toLowerCase();
  if (/(teacher|faculty|professor|advisor|mentor)/.test(x)) return 0;
  if (/head/.test(x)) return 3; // checked early so "head executive" stays in its own row
  if (/(president|\bvp\b)/.test(x)) return 1; // also matches "vice president"
  if (/(treasurer|secretary)/.test(x)) return 2;
  return 4;
}