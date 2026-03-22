"use server";
import Boarder from "@/models/Boarder";
import { ObjectId } from "mongodb";
import CostModel from "@/models/CostModel";
import { auth } from "@/lib/auth";
import { GetAdmin } from "./adminActions";

export const getCosts = async (userId: string, limit = 10) => {
  try {
    const costs = await CostModel.find({ userId, paid: false })
      .sort({ createdAt: "desc" })
      .limit(limit)
      .lean();

    const filteredCosts = costs.map((cost) => ({
      _id: cost._id.toString(),
      userId: cost.userId.toString(),
      workerId: cost.workerId.toString(),
      workerName: cost.workerName,
      amount: cost.amount,
      paid: cost.paid,
      category: cost.category,
      createdAt: cost.createdAt,
    }));

    return filteredCosts;
  } catch (error) {
    console.log("Failed to fetch costs:", error);
    return [];
  }
};

export async function getMoreCosts(
  boarderId: string,
  cursor: string,
  limit = 10
) {
  const costs = await CostModel.find({
    userId: new ObjectId(boarderId),
    paid: false,
    _id: { $lt: new ObjectId(cursor) }, // use _id as cursor
  })
    .sort({ _id: -1 }) // newer first
    .limit(limit)
    .lean();

  return costs.map((cost) => ({
    _id: cost._id.toString(),
    userId: cost.userId.toString(),
    workerId: cost.workerId.toString(),
    workerName: cost.workerName,
    amount: cost.amount,
    paid: cost.paid,
    category: cost.category,
    createdAt: cost.createdAt,
  }));
}

export const getBoarderWithId = async (boarderId: string) => {
  try {
    const boarder = await Boarder.findById(boarderId);

    if (!boarder) return null;

    const updatedData = {
      ...boarder.toObject(),
      _id: boarder._id.toString(),
      fineAmount: boarder.fineAmount,
    };

    return updatedData;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getBoarder = async (email: string) => {
  try {
    const boarder = await Boarder.findOne({ email });

    if (!boarder) return null;

    const updatedData = {
      ...boarder.toObject(),
      _id: boarder._id.toString(),
      fineAmount: boarder.fineAmount,
    };

    return updatedData;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const clearCosts = async (boarderId: string) => {
  try {
    const session = await auth();

    if (!session?.user) {
      return "failed";
    }

    const admin = await GetAdmin(session.user.email as string);

    if (!admin || admin.role !== "admin") {
      return "failed";
    }

    await CostModel.updateMany(
      { userId: new ObjectId(boarderId), paid: false },
      { $set: { paid: true } }
    );

    await Boarder.updateOne(
      {
        _id: new ObjectId(boarderId),
      },
      {
        $set: {
          amount: 0,
        },
      }
    );

    return "success";
  } catch (error) {
    console.log(error);
    return "failed";
  }
};

export const clearSingleCost = async (costId: string) => {
  try {
    const session = await auth();
    if (!session?.user) return "failed";
    const admin = await GetAdmin(session.user.email as string);
    if (!admin || admin.role !== "admin") return "failed";

    const cost = await CostModel.findById(costId);
    if (!cost || cost.paid) return "failed";

    await Boarder.updateOne(
      { _id: new ObjectId(cost.userId) },
      { $inc: { amount: -cost.amount } }
    );

    await CostModel.updateOne({ _id: cost._id }, { $set: { paid: true } });
    return "success";
  } catch (error) {
    console.log(error);
    return "failed";
  }
};

export const updateCost = async (
  costId: string,
  data: { amount: number; category: string; workerName: string }
) => {
  try {
    const session = await auth();
    if (!session?.user) return { success: false };
    const admin = await GetAdmin(session.user.email as string);
    if (!admin || admin.role !== "admin") return { success: false };

    const cost = await CostModel.findById(costId);
    if (!cost) return { success: false };

    // adjust outstanding amount only if not paid
    if (!cost.paid && typeof data.amount === "number") {
      const diff = data.amount - cost.amount;
      await Boarder.updateOne(
        { _id: new ObjectId(cost.userId) },
        { $inc: { amount: diff } }
      );
    }

    cost.amount = data.amount;
    cost.category = data.category;
    cost.workerName = data.workerName;
    await cost.save();

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
};

export const clearAllBoardersCosts = async () => {
  try {
    const session = await auth();
    if (!session?.user) return "failed";
    const admin = await GetAdmin(session.user.email as string);
    if (!admin || admin.role !== "admin") return "failed";

    // Mark all unpaid costs as paid
    await CostModel.updateMany(
      { paid: false },
      { $set: { paid: true } }
    );

    // Reset all boarders' amounts to 0
    await Boarder.updateMany(
      {},
      { $set: { amount: 0 } }
    );

    return "success";
  } catch (error) {
    console.log(error);
    return "failed";
  }
};
