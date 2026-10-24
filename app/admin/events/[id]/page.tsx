import { Suspense } from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EditEventForm from "@/components/admin/editeventform";

async function Loader({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: event } = await supabase
    .from("events")
    .select("id, title, description, location, starts_at, ends_at, poster_url, published")
    .eq("id", id)
    .single();
  if (!event) notFound();
  return <EditEventForm event={event} />;
}

export default function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<p className="text-loop-muted">Loading…</p>}>
      <Loader params={params} />
    </Suspense>
  );
}