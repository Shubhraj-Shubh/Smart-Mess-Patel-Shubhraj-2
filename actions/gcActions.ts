"use server";

import connectDB from "@/lib/db";
import { GCEvent, GCItem, GCRefreshmentEntry } from "@/models/gcModel";
import AdminModel from "@/models/AdminModel";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";

// Add these type definitions at the top of the file after imports
type PopulatedEntry = {
  _id: mongoose.Types.ObjectId;
  event: { name: string } | null;
  item: { name: string } | null;
  quantity: number;
  addedBy: {
    name: string;
    email: string;
    rollno: string;
  } | null;
  isVerified: boolean;
  date: Date;
  time: string;
  createdAt: Date;
};

export async function GetAllGCEvents() {
  try {
    await connectDB();
    const events = await GCEvent.find().sort({ isCustom: 1, name: 1 });

    const filteredEvents = events.map((event) => ({
      _id: event._id.toString(),
      name: event.name,
      isCustom: event.isCustom,
    }));

    return filteredEvents;
  } catch (error) {
    console.error("Error fetching GC events:", error);
    return [];
  }
}

export async function GetAllGCItems() {
  try {
    await connectDB();
    const items = await GCItem.find().sort({ isCustom: 1, name: 1 });

    const filteredItems = items.map((item) => ({
      _id: item._id.toString(),
      name: item.name,
      isCustom: item.isCustom,
    }));

    return filteredItems;
  } catch (error) {
    console.error("Error fetching GC items:", error);
    return [];
  }
}

export async function CreateGCEvent(name: string) {
  try {
    await connectDB();

    // Check if event already exists (case-insensitive)
    const existingEvent = await GCEvent.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
    });

    if (existingEvent) {
      return {
        success: true,
        event: {
          _id: existingEvent._id.toString(),
          name: existingEvent.name,
          isCustom: existingEvent.isCustom,
        },
      };
    }

    // Create new event
    const event = await GCEvent.create({
      name: name.trim(),
      isCustom: true,
    });

    revalidatePath("/gc-refreshments/add");

    return {
      success: true,
      event: {
        _id: event._id.toString(),
        name: event.name,
        isCustom: event.isCustom,
      },
    };
  } catch (error) {
    console.error("Error creating GC event:", error);
    return {
      success: false,
      error: "Failed to create event",
    };
  }
}

export async function CreateGCItem(name: string) {
  try {
    await connectDB();

    // Check if item already exists (case-insensitive)
    const existingItem = await GCItem.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
    });

    if (existingItem) {
      return {
        success: true,
        item: {
          _id: existingItem._id.toString(),
          name: existingItem.name,
          isCustom: existingItem.isCustom,
        },
      };
    }

    // Create new item
    const item = await GCItem.create({
      name: name.trim(),
      isCustom: true,
    });

    revalidatePath("/gc-refreshments/add");

    return {
      success: true,
      item: {
        _id: item._id.toString(),
        name: item.name,
        isCustom: item.isCustom,
      },
    };
  } catch (error) {
    console.error("Error creating GC item:", error);
    return {
      success: false,
      error: "Failed to create item",
    };
  }
}

type RefreshmentEntryData = {
  eventId: string;
  itemId: string;
  quantity: number;
};

export async function AddRefreshmentEntry(data: RefreshmentEntryData) {
  try {
    await connectDB();

    const session = await auth();
    if (!session?.user?.email) {
      return {
        success: false,
        error: "Unauthorized - Please login again",
      };
    }

    // Check time limit (4:00 PM to 8:00 PM)
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinutes;
    const startTime = 16 * 60; // 4:00 PM
    const endTime = 20 * 60; // 8:00 PM

    if (currentTime < startTime || currentTime >= endTime) {
      return {
        success: false,
        error: "Refreshments can only be added between 4:00 PM and 8:00 PM",
      };
    }

    // Get admin from database
    const admin = await AdminModel.findOne({ email: session.user.email });
    if (!admin) {
      return {
        success: false,
        error: "Admin not found",
      };
    }

    // Verify event exists
    const eventExists = await GCEvent.findById(data.eventId);
    if (!eventExists) {
      return {
        success: false,
        error: "Event not found",
      };
    }

    // Verify item exists
    const itemExists = await GCItem.findById(data.itemId);
    if (!itemExists) {
      return {
        success: false,
        error: "Item not found",
      };
    }

    // Create entry
    await GCRefreshmentEntry.create({
      event: data.eventId,
      item: data.itemId,
      quantity: data.quantity,
      addedBy: admin._id,
      date: now,
      time: now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      isVerified: false,
    });

    revalidatePath("/gc-refreshments/add");
    revalidatePath("/gc-refreshments/confirm");

    return {
      success: true,
      message: "Refreshment entry added successfully",
    };
  } catch (error) {
    console.error("Error adding refreshment entry:", error);
    return {
      success: false,
      error: "Failed to add entry. Please try again.",
    };
  }
}

export async function GetPendingRefreshments() {
  try {
    await connectDB();

    const entries = await GCRefreshmentEntry.find({ isVerified: false })
      .populate({
        path: "event",
        select: "name",
      })
      .populate({
        path: "item",
        select: "name",
      })
      .populate({
        path: "addedBy",
        select: "name email rollno",
        model: "Admin",
      })
      .sort({ createdAt: -1 })
      .lean<PopulatedEntry[]>();

    const filteredEntries = entries.map((entry) => ({
      _id: entry._id.toString(),
      event: entry.event ? { name: entry.event.name } : null,
      item: entry.item ? { name: entry.item.name } : null,
      quantity: entry.quantity,
      addedBy: entry.addedBy
        ? {
            name: entry.addedBy.name || "Unknown Admin",
            email: entry.addedBy.email || "",
            rollno: entry.addedBy.rollno || "",
          }
        : { name: "Unknown Admin", email: "", rollno: "" },
      isVerified: entry.isVerified,
      date: entry.date.toISOString(),
      time: entry.time,
      createdAt: entry.createdAt.toISOString(),
    }));

    return filteredEntries;
  } catch (error) {
    console.error("Error fetching pending refreshments:", error);
    return [];
  }
}

export async function GetRefreshmentHistory() {
  try {
    await connectDB();

    const entries = await GCRefreshmentEntry.find()
      .populate({
        path: "event",
        select: "name",
      })
      .populate({
        path: "item",
        select: "name",
      })
      .populate({
        path: "addedBy",
        select: "name email rollno",
        model: "Admin",
      })
      .sort({ createdAt: -1 })
      .lean<PopulatedEntry[]>();

    const filteredEntries = entries.map((entry) => ({
      _id: entry._id.toString(),
      event: entry.event ? { name: entry.event.name } : null,
      item: entry.item ? { name: entry.item.name } : null,
      quantity: entry.quantity,
      addedBy: entry.addedBy
        ? {
            name: entry.addedBy.name || "Unknown Admin",
            email: entry.addedBy.email || "",
            rollno: entry.addedBy.rollno || "",
          }
        : { name: "Unknown Admin", email: "", rollno: "" },
      isVerified: entry.isVerified,
      date: entry.date.toISOString(),
      time: entry.time,
      createdAt: entry.createdAt.toISOString(),
    }));

    return filteredEntries;
  } catch (error) {
    console.error("Error fetching refreshment history:", error);
    return [];
  }
}

export async function VerifyRefreshmentEntry(entryId: string) {
  try {
    await connectDB();

    const session = await auth();
    if (!session?.user?.email) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const admin = await AdminModel.findOne({ email: session.user.email });
    if (!admin || admin.role !== "admin") {
      return {
        success: false,
        error: "Only admins can verify entries",
      };
    }

    const entry = await GCRefreshmentEntry.findByIdAndUpdate(
      entryId,
      { isVerified: true },
      { new: true }
    );

    if (!entry) {
      return {
        success: false,
        error: "Entry not found",
      };
    }

    revalidatePath("/gc-refreshments/confirm");
    revalidatePath("/gc-refreshments/add");

    return {
      success: true,
      message: "Entry verified successfully",
    };
  } catch (error) {
    console.error("Error verifying refreshment entry:", error);
    return {
      success: false,
      error: "Failed to verify entry",
    };
  }
}

export async function VerifyMultipleRefreshmentEntries(entryIds: string[]) {
  try {
    await connectDB();

    const session = await auth();
    if (!session?.user?.email) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const admin = await AdminModel.findOne({ email: session.user.email });
    if (!admin || admin.role !== "admin") {
      return {
        success: false,
        error: "Only admins can verify entries",
      };
    }

    await GCRefreshmentEntry.updateMany(
      { _id: { $in: entryIds } },
      { isVerified: true }
    );

    revalidatePath("/gc-refreshments/confirm");
    revalidatePath("/gc-refreshments/add");

    return {
      success: true,
      message: `${entryIds.length} ${entryIds.length === 1 ? 'entry' : 'entries'} verified successfully`,
    };
  } catch (error) {
    console.error("Error verifying multiple refreshment entries:", error);
    return {
      success: false,
      error: "Failed to verify entries",
    };
  }
}

export async function DeleteRefreshmentEntry(entryId: string) {
  try {
    await connectDB();

    const session = await auth();
    if (!session?.user?.email) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const admin = await AdminModel.findOne({ email: session.user.email });
    if (!admin) {
      return {
        success: false,
        error: "Admin not found",
      };
    }

    await GCRefreshmentEntry.findByIdAndDelete(entryId);

    revalidatePath("/gc-refreshments/confirm");
    revalidatePath("/gc-refreshments/add");

    return {
      success: true,
      message: "Entry deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting refreshment entry:", error);
    return {
      success: false,
      error: "Failed to delete entry",
    };
  }
}

export async function DeleteMultipleRefreshmentEntries(entryIds: string[]) {
  try {
    await connectDB();

    const session = await auth();
    if (!session?.user?.email) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const admin = await AdminModel.findOne({ email: session.user.email });
    if (!admin) {
      return {
        success: false,
        error: "Admin not found",
      };
    }

    await GCRefreshmentEntry.deleteMany({ _id: { $in: entryIds } });

    revalidatePath("/gc-refreshments/confirm");
    revalidatePath("/gc-refreshments/add");

    return {
      success: true,
      message: `${entryIds.length} ${entryIds.length === 1 ? 'entry' : 'entries'} deleted successfully`,
    };
  } catch (error) {
    console.error("Error deleting multiple refreshment entries:", error);
    return {
      success: false,
      error: "Failed to delete entries",
    };
  }
}

export async function SeedGCEvents() {
  try {
    await connectDB();

    const events = [
      "Bridge",
      "Volleyball",
      "Badminton",
      "Hockey",
      "Cricket",
      "Table Tennis",
      "Squash",
      "Football",
      "Chess",
      "Athletics",
      "Aquatics",
      "Weightlifting",
      "Tennis",
    ];

    for (const eventName of events) {
      const exists = await GCEvent.findOne({ name: eventName });
      if (!exists) {
        await GCEvent.create({ name: eventName, isCustom: false });
      }
    }

    return {
      success: true,
      message: "Events seeded successfully",
    };
  } catch (error) {
    console.error("Error seeding events:", error);
    return {
      success: false,
      error: "Failed to seed events",
    };
  }
}

export async function SeedGCItems() {
  try {
    await connectDB();

    const items = [
      "Tea",
      "Coffee",
      "Biscuits",
      "Samosa",
      "Pakora",
      "Bread",
      "Butter",
      "Jam",
      "Cold Drink",
      "Water Bottles",
      "Chips",
      "Namkeen",
    ];

    for (const itemName of items) {
      const exists = await GCItem.findOne({ name: itemName });
      if (!exists) {
        await GCItem.create({ name: itemName, isCustom: false });
      }
    }

    return {
      success: true,
      message: "Items seeded successfully",
    };
  } catch (error) {
    console.error("Error seeding items:", error);
    return {
      success: false,
      error: "Failed to seed items",
    };
  }
}
