import { getEventById } from "@/actions/EventActions";
import EventComponent from "./EventComponent";

export default async function AboutEventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  const event = await getEventById(eventId);

  return (
    <div>
      <EventComponent eventData={event} />
    </div>
  );
}
