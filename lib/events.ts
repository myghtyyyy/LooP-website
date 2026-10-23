export type EventStatus = "upcoming" | "ongoing" | "completed";

export function getStatus(startsAt: string, endsAt?: string | null): EventStatus {
  const now = Date.now();
  const start = new Date(startsAt).getTime();
  const end = endsAt ? new Date(endsAt).getTime() : start + 24 * 60 * 60 * 1000;
  if (now < start) return "upcoming";
  if (now <= end) return "ongoing";
  return "completed";
}

export const statusLabel: Record<EventStatus, string> = {
  upcoming: "About to happen",
  ongoing: "Ongoing",
  completed: "Completed",
};