"use server";
import ComplaintModel from "@/models/ComplaintModel";

type ComplaintType = {
  userId: string;
  description: string;
};

export const createComplaint = async (complaint: ComplaintType) => {
  try {
    await ComplaintModel.create(complaint);

    return {
      success: true,
      message: "Complaint created successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
};

export const getUserComplaints = async (
  userId: string
): Promise<Complaint[]> => {
  try {
    const complaints = await ComplaintModel.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .exec();

    const filteredComplaints = complaints.map((complaint) => ({
      ...complaint,
      _id: complaint._id.toString(),
    }));

    return filteredComplaints;
  } catch (error) {
    console.error("Failed to fetch complaints:", error);
    return [];
  }
};

interface Complaint {
  _id: string;
  userId: string;
  userName: string;
  rollno: string;
  description: string;
  status: "Pending" | "Resolved";
  adminMessage: string;
  createdAt: Date;
  updatedAt: Date;
}

interface PaginatedResult<T> {
  success: boolean;
  data: T[];
  total?: number;
  page?: number;
  limit?: number;
  message?: string;
}

export const getComplaints = async (
  page: number,
  limit: number
): Promise<PaginatedResult<Complaint>> => {
  if (page < 1 || limit < 1) {
    throw new Error("Page and limit must be positive integers.");
  }

  try {
    const skip = (page - 1) * limit;

    const [complaints, total] = await Promise.all([
      ComplaintModel.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      ComplaintModel.countDocuments().exec(),
    ]);

    const filteredComplaints = complaints.map((complaint) => ({
      _id: complaint._id.toString(),
      userId: complaint.userId,
      userName: complaint.userName,
      rollno: complaint.rollno,
      description: complaint.description,
      status: complaint.status,
      adminMessage: complaint.adminMessage,
      createdAt: complaint.createdAt,
      updatedAt: complaint.updatedAt,
    }));

    return {
      success: true,
      data: filteredComplaints,
      total,
      page,
      limit,
    };
  } catch (error) {
    console.error("Failed to fetch complaints:", error);
    return {
      success: false,
      data: [],
      message: "Internal Server Error",
    };
  }
};

export const updateComplaint = async ({
  _id,
  status,
  adminMessage,
}: {
  _id: string;
  status: string;
  adminMessage: string;
}) => {
  try {
    await ComplaintModel.findByIdAndUpdate(_id, { status, adminMessage });

    return {
      success: true,
      message: "Complaint updated successfully",
    };
  } catch (error) {
    console.error("Failed to update complaint:", error);
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
};
