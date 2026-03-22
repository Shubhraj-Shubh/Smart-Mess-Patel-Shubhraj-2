import React from "react";
import { ObjectId } from "mongodb";
import EditEvent from "./EditEvent";
import CopyButton from "../CopyButton";

interface Boarder {
  _id: ObjectId;
  name: string;
  rollno: string;
  email: string;
  cardNo: string;
  phoneNo: string;
  secret: string;
  session: number;
  amount: number;
  __v: number;
}

interface Event {
  _id: ObjectId;
  eventName: string;
  description?: string;
  date: Date;
  emails: string[];
  boarders: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

interface EventPageProps {
  success: boolean;
  event?: Event;
  boarders?: Boarder[];
}

const EventComponent = ({ eventData }: { eventData: EventPageProps }) => {
  if (!eventData.success || !eventData.event) {
    return (
      <div className="p-4 text-destructive">Error loading event details</div>
    );
  }

  const { event, boarders } = eventData;

  // Convert event date to readable format
  const eventDate = new Date(event.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Get boarders associated with the event
  const eventBoarders = boarders?.filter((boarder) =>
    event.boarders.some((id) => id.toString() === boarder._id.toString())
  );

  return (
    <div className="container mx-auto p-4">
      {/* Event Header */}
      <div className="mb-8 relative">
        <CopyButton eventId={event._id.toString()} />
        <h1 className="text-3xl font-bold mb-2">{event.eventName}</h1>
        <p className="text-gray-600 mb-4">{event.description}</p>
        <div className="flex items-center text-sm text-gray-500">
          <span className="mr-4">📅 {eventDate}</span>
          <span>📧 {event.emails.join(", ")}</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg max-w-screen-xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">
          Associated Boarders ({eventBoarders?.length})
        </h2>
        <div className="space-y-4">
          {eventBoarders?.map((boarder) => (
            <div
              key={boarder._id.toString()}
              className="border-b pb-4 flex items-center justify-between"
            >
              <h3 className="font-medium">{boarder.name}</h3>
              <p className="text-sm text-gray-600">{boarder.rollno}</p>
              <p className="text-sm text-gray-600">Card: {boarder.cardNo}</p>
              <p className="text-sm text-gray-600">Phone: {boarder.phoneNo}</p>
            </div>
          ))}
        </div>
      </div>

      <EditEvent
        event={{
          _id: event._id.toString(),
          eventName: event.eventName,
          description: event.description,
          date: event.date,
          emails: event.emails,
        }}
      />
    </div>
  );
};

export default EventComponent;
