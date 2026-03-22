import { getAllEvents } from "@/actions/EventActions";
import EventDialogForm from "./EventForm";
import CopyButton from "./CopyButton";
import Link from "next/link";

export default async function EventsPage() {
  const limit = "50";

  const result = await getAllEvents(limit);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <EventDialogForm />

        <h2 className="text-2xl font-semibold mb-4"> Upcoming Events</h2>

        {result.success === false ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Failed to load events</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {result.events?.map((event) => (
              <Link
                href={`/event/${event._id.toString()}`}
                key={event._id.toString()}
                className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <CopyButton eventId={event._id.toString()} />

                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {event.eventName}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>

                  {event.description && (
                    <p className="text-gray-600 mb-4">{event.description}</p>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700 mr-2">
                        Workers:
                      </span>
                      <span className="text-sm text-gray-600">
                        {event.emails.length}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700 mr-2">
                        Boarders:
                      </span>
                      <span className="text-sm text-gray-600">
                        {event.boarders.length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 text-sm text-gray-500">
                  Created: {new Date(event.createdAt).toLocaleDateString()}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
