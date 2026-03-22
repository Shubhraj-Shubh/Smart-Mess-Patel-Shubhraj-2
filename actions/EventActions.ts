"use server";
import Boarder from "@/models/Boarder";
import Event from "@/models/EventModel";

type EventDataType = {
  eventName: string;
  description?: string;
  emails: string[];
  date: Date;
};

export const createEvent = async (eventData: EventDataType) => {
  try {
    const event = new Event(eventData);

    await event.save();

    return {
      success: true,
      message: "Event created",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Internal server error",
    };
  }
};

export const getAllEvents = async (limit?: string) => {
  try {
    const events = await Event.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit || "50"));

    if (!events) {
      return {
        success: false,
        message: "No events found",
      };
    }

    return {
      success: true,
      events,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Internal server error",
    };
  }
};

export const verifyEventUserById = async (eventId: string, email: string) => {
  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return {
        success: false,
        message: "Event not found",
      };
    }

    if (!event.emails.includes(email)) {
      return {
        success: false,
        message: "You are not authorized to view this event",
      };
    }

    return {
      success: true,
      event,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Internal server error",
    };
  }
};

export const getEventById = async (id: string) => {
  try {
    const event = await Event.findById(id);
    if (!event) {
      return {
        success: false,
        message: "Event not found",
      };
    }

    const boarders = await Boarder.find({ _id: { $in: event.boarders } });

    return {
      success: true,
      event,
      boarders,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Internal server error",
    };
  }
};

export const updateEvent = async (id: string, eventData: EventDataType) => {
  try {
    await Event.findByIdAndUpdate(id, eventData);

    return {
      success: true,
      message: "Event Updated",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Internal server error",
    };
  }
};

export const addAttendee = async (eventId: string, secret: string) => {
  try {
    const user = await Boarder.findOne({ secret });

    if (!user) {
      return {
        success: false,
        message: "Invalid User",
      };
    }

    if (user.active === false) {
      return {
        success: false,
        message: "Card Inactive",
      };
    }

    const id = user._id;

    const event = await Event.findById(eventId);

    if (!event) {
      return {
        success: false,
        message: "Event not found",
      };
    }

    if (event.boarders.includes(id)) {
      return {
        success: false,
        message: "User is already added to the event",
      };
    }

    await Event.findByIdAndUpdate(
      eventId,
      { $addToSet: { boarders: id } },
      { new: true }
    );

    return {
      success: true,
      message: "User added to event",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Internal server error",
    };
  }
};

export const removeAttendee = async (eventId: string, userId: string) => {
  try {
    const event = await Event.findByIdAndUpdate(
      eventId,
      { $pull: { attendees: userId } },
      { new: true }
    );
    return {
      success: true,
      event,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Internal server error",
    };
  }
};

export const deleteEvent = async (eventId: string) => {
  try {
    const event = await Event.findByIdAndDelete(eventId);

    if (!event) {
      return {
        success: false,
        message: "Event not found",
      };
    }

    return {
      success: true,
      message: "Event deleted successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to delete event",
    };
  }
};
