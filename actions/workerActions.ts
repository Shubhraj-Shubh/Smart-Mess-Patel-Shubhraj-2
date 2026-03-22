"use server";
import Boarder from "@/models/Boarder";
import CostModel from "@/models/CostModel";
import WorkerModel from "@/models/WorkerModel";
import { revalidatePath } from "next/cache";

type CostType = {
  userId: string;
  workerId: string;
  workerName: string;
  amount: string;
  category?: string;
};

export const addCost = async (costData: CostType) => {
  try {
    const boarder = await Boarder.findById(costData.userId);

    if (!boarder) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const worker = await WorkerModel.findById(costData.workerId);

    if (!worker || worker.disabled) {
      return {
        success: false,
        message: "Invalid Staff",
      };
    }

    const date = new Date();
    const month = date.getMonth();
    let session = date.getFullYear();
    if (month < 6) session = session - 1;
    const season = month < 6 ? "SPRING" : "AUTUMN";

    const cost = new CostModel({ ...costData, session, season });
    await cost.save();

    if (typeof boarder.amount !== "number") {
      boarder.amount = 0;
    }

    boarder.amount += Number(costData.amount);
    await boarder.save();

    return {
      success: true,
      message: "Cost added successfully",
    };
  } catch (error) {
    console.error("Error adding cost:", error);
    return {
      success: false,
      message: "Internal server error",
    };
  }
};

export const getWorker = async (email: string) => {
  try {
    const worker = await WorkerModel.findOne({ email });

    if (!worker) {
      return null;
    }

    return worker;
  } catch (error) {
    console.error("Error getting worker:", error);
    return null;
  }
};

export const createWorker = async ({
  name,
  email,
  phoneNo,
  deleteAt,
}: {
  name: string;
  email: string;
  phoneNo: string;
  deleteAt?: Date;
}) => {
  try {
    if (!deleteAt) {
      deleteAt = new Date();
      deleteAt.setFullYear(deleteAt.getFullYear() + 1);
    }

    const existingWorker = await WorkerModel.findOne({ email });

    if (existingWorker) {
      return {
        status: 400,
        message: "Worker already exists",
      };
    }

    const worker = new WorkerModel({ name, email, phoneNo, deleteAt });

    await worker.save();

    revalidatePath('/worker');
    return {
      status: 200,
      message: "Worker created successfully",
    };
  } catch (error) {
    console.error("Error creating worker:", error);
    return {
      status: 500,
      message: "Internal server error",
    };
  }
};
