import EventScan from "./EventScan";

export default async function ScanEventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const eventId = (await params).eventId;

  return (
    <div className="">
      <EventScan eventId={eventId} />
    </div>
  );
}
