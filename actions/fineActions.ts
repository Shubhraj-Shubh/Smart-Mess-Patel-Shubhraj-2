"use server";
import FineModel from "@/models/FineModel";
import Boarder from "@/models/Boarder";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";
import { GetAdmin } from "./adminActions";
import { revalidatePath } from "next/cache";

export const getFines = async (userId: string, limit = 10, includePaid = false) => {
  try {
    const query: { userId: string; paid?: boolean } = { userId };

    if (!includePaid) {
      query.paid = false;
    }

    const fines = await FineModel.find(query)
      .sort({ createdAt: "desc" })
      .limit(limit)
      .lean();

    const filteredFines = fines.map((fine) => ({
      _id: fine._id.toString(),
      userId: fine.userId.toString(),
      adminId: fine.adminId.toString(),
      adminName: fine.adminName,
      reason: fine.reason,
      session: fine.session,
      season: fine.season,
      fineAmount: fine.fineAmount,
      paid: fine.paid,
      category: fine.category,
      createdAt: fine.createdAt,
      updatedAt: fine.updatedAt,
    }));

    return filteredFines;
  } catch (error) {
    console.log("Failed to fetch fines:", error);
    return [];
  }
};

export async function getMoreFines(
  boarderId: string,
  cursor: string,
  limit = 10,
  includePaid = false
) {
  const query: {
    userId: ObjectId;
    _id: { $lt: ObjectId };
    paid?: boolean;
  } = {
    userId: new ObjectId(boarderId),
    _id: { $lt: new ObjectId(cursor) },
  };

  if (!includePaid) {
    query.paid = false;
  }

  const fines = await FineModel.find(query)
    .sort({ _id: -1 })
    .limit(limit)
    .lean();

  return fines.map((fine) => ({
    _id: fine._id.toString(),
    userId: fine.userId.toString(),
    adminId: fine.adminId.toString(),
    adminName: fine.adminName,
    reason: fine.reason,
    session: fine.session,
    season: fine.season,
    fineAmount: fine.fineAmount,
    paid: fine.paid,
    category: fine.category,
    createdAt: fine.createdAt,
    updatedAt: fine.updatedAt,
  }));
}

type FineType = {
  userId: string;
  reason: string;
  fineAmount: number;
  season: string;
};

export async function addFine(fine: FineType) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, message: "Unauthorized" };

    const admin = await GetAdmin(session.user.email as string);
    if (!admin || admin.role !== "admin")
      return { success: false, message: "Only admin can add fines" };

    const newFine = new FineModel({
      userId: new ObjectId(fine.userId),
      adminId: admin._id,
      adminName: admin.name,
      reason: fine.reason,
      fineAmount: fine.fineAmount,
      season: fine.season,
      session: new Date().getFullYear(),
      category: "FINE",
      paid: false,
    });

    await newFine.save();

    // Update boarder's fineAmount
    await Boarder.updateOne(
      { _id: new ObjectId(fine.userId) },
      { $inc: { fineAmount: fine.fineAmount } }
    );

    revalidatePath(`/boarder/${fine.userId}`);
    return { success: true, message: "Fine added successfully" };
  } catch (error) {
    console.error("Error adding fine:", error);
    return { success: false, message: "Failed to add fine" };
  }
}

export async function updateFine(
  fineId: string,
  data: { reason: string; fineAmount: number }
) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false };

    const admin = await GetAdmin(session.user.email as string);
    if (!admin || admin.role !== "admin") return { success: false };

    const fine = await FineModel.findById(fineId);
    if (!fine || fine.paid) return { success: false };

    const oldAmount = fine.fineAmount;
    const newAmount = data.fineAmount;
    const diff = newAmount - oldAmount;

    // Update boarder's fineAmount
    if (diff !== 0) {
      await Boarder.updateOne(
        { _id: new ObjectId(fine.userId) },
        { $inc: { fineAmount: diff } }
      );
    }

    await FineModel.findByIdAndUpdate(
      fineId,
      { reason: data.reason, fineAmount: newAmount },
      { new: true }
    );

    revalidatePath(`/boarder/${fine.userId}`);
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}

export async function deleteFine(fineId: string) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false };

    const admin = await GetAdmin(session.user.email as string);
    if (!admin || admin.role !== "admin") return { success: false };

    const fine = await FineModel.findById(fineId);
    if (!fine) return { success: false };

    const boarderId = fine.userId.toString();

    // Update boarder's fineAmount
    await Boarder.updateOne(
      { _id: new ObjectId(boarderId) },
      { $inc: { fineAmount: -fine.fineAmount } }
    );

    await FineModel.findByIdAndDelete(fineId);

    revalidatePath(`/boarder/${boarderId}`);
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}

export async function clearSingleFine(fineId: string) {
  try {
    const session = await auth();
    if (!session?.user) return "failed";

    const admin = await GetAdmin(session.user.email as string);
    if (!admin || admin.role !== "admin") return "failed";

    const fine = await FineModel.findById(fineId);
    if (!fine || fine.paid) return "failed";

    await Boarder.updateOne(
      { _id: new ObjectId(fine.userId) },
      { $inc: { fineAmount: -fine.fineAmount } }
    );

    await FineModel.updateOne({ _id: fine._id }, { $set: { paid: true } });

    revalidatePath(`/boarder/${fine.userId}`);
    return "success";
  } catch (error) {
    console.log(error);
    return "failed";
  }
}

export async function clearAllFinesForBoarder(boarderId: string) {
  try {
    const session = await auth();
    if (!session?.user) return "failed";

    const admin = await GetAdmin(session.user.email as string);
    if (!admin || admin.role !== "admin") return "failed";

    // Mark all unpaid fines as paid
    await FineModel.updateMany(
      { userId: new ObjectId(boarderId), paid: false },
      { $set: { paid: true } }
    );

    // Reset boarder's fineAmount
    await Boarder.updateOne(
      { _id: new ObjectId(boarderId) },
      { $set: { fineAmount: 0 } }
    );

    revalidatePath(`/boarder/${boarderId}`);
    return "success";
  } catch (error) {
    console.log(error);
    return "failed";
  }
}

export async function clearAllFinesSystem() {
  try {
    const session = await auth();
    if (!session?.user) return "failed";

    const admin = await GetAdmin(session.user.email as string);
    if (!admin || admin.role !== "admin") return "failed";

    // Mark all unpaid fines as paid
    await FineModel.updateMany({ paid: false }, { $set: { paid: true } });

    // Reset all boarders' fineAmount
    await Boarder.updateMany({}, { $set: { fineAmount: 0 } });

    return "success";
  } catch (error) {
    console.log(error);
    return "failed";
  }
}
