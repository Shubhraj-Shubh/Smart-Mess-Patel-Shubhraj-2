"use server";
import AdminModel from "@/models/AdminModel";
import Boarder from "@/models/Boarder";
import Worker from "@/models/WorkerModel";
import Representative from "@/models/RepresentativeModel";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

export async function GetAllWorkers() {
  try {
    const workers = await Worker.find();

    const filteredWorkers = workers.map((worker) => ({
      _id: worker._id.toString(),
      name: worker.name,
      email: worker.email,
      phoneNo: worker.phoneNo,
    }));

    return filteredWorkers || [];
  } catch (error) {
    console.error("Failed to fetch workers:", error);
    return [];
  }
}

export async function disableWorker(id: string) {
  try {
    const worker = await Worker.findByIdAndUpdate(id, { disabled: true });

    if (!worker) {
      return {
        success: false,
        message: "Worker not found",
      };
    }

    return {
      success: true,
      message: "Worker disabled",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Internal server error",
    };
  }
}

export async function RemoveWorker(id: string) {
  try {
    await Worker.findByIdAndDelete(id);

    revalidatePath('/worker');
    return {
      success: true,
      message: "Removed form Workers",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Internal server error",
    };
  }
}

export async function UpdateWorker(WorkerData: {
  _id: string;
  name: string;
  email: string;
  phoneNo: string;
}) {
  try {
    if (!WorkerData || !WorkerData._id) {
      return {
        success: false,
        message: "Invalid Worker data",
      };
    }

    const { _id, ...rest } = WorkerData;

    const updatedWorker = await Worker.findByIdAndUpdate(_id, rest, {
      new: true,
      runValidators: true,
    });

    if (!updatedWorker) {
      return {
        success: false,
        message: "Worker not found",
      };
    }

    return {
      success: true,
      message: "Worker updated",
    };
  } catch (error) {
    console.error("Error updating Worker:", error);
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
}

export async function GetAdmin(email: string) {
  try {
    const admin = await AdminModel.findOne({ email });

    if (!admin) return null;

    return admin;
  } catch (error) {
    console.error(error);
    return null;
  }
}

type AdminType = {
  name: string;
  email: string;
  rollno: string;
};

export async function AddAdmin(admin: AdminType, adminId: string, role: "admin" | "coadmin" | "manager" ) {
  try {
    // Only admin role can add new admins
    const user = await AdminModel.findById(adminId);
    
    if (!user || user.role !== "admin") {
      return { success: false, message: "Only admin can add new admins" };
    }
    
    // Create admin with specified role
    const newAdmin = new AdminModel({ ...admin, role });
    await newAdmin.save();

    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error("Error adding admin:", error);
    return { success: false, message: error instanceof Error ? error.message : "Failed to add admin" };
  }
}

export async function changeAdminRole(
  _id: string,
  adminId: string,
  role: "admin" | "coadmin" | "manager"
) {
  try {
    const user = await AdminModel.findById(adminId);

    if (!user || user.role !== "admin") {
      return {
        success: false,
        message: "Only admin can change roles",
      };
    }

    const admin = await AdminModel.findById(_id);

    if (!admin) {
      return {
        success: false,
        message: "Admin not found",
      };
    }

    await AdminModel.findByIdAndUpdate(_id, { $set: { role } });

    revalidatePath('/admin');
    return {
      success: true,
      message: "Updated role of Admin",
    };
  } catch (error) {
    console.error("Error promoting admin:", error);

    return {
      success: false,
      message: "Internal Server Error",
    };
  }
}

export async function RemoveAdmin(id: string, adminId: string) {
  try {
    const user = await AdminModel.findById(adminId);

    if (!user || user.role !== "admin") {
      return {
        success: false,
        message: "Only admin can remove admins",
      };
    }

    const admins = await AdminModel.find();

    let flag = true;

    for (let i = 0; i < admins.length; i++) {
      if (admins[i].role === "admin") {
        flag = false;
        break;
      }
    }

    if (flag) {
      return {
        success: false,
        message:
          "Cannot remove the last admin. Add another admin before removing this one.",
      };
    }

    await AdminModel.findByIdAndDelete(id);

    revalidatePath('/admin');
    return {
      success: true,
      message: "Removed from Admin",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Internal server error",
    };
  }
}

export async function GetAllAdmins() {
  try {
    const admins = await AdminModel.find();

    const filteredAdmins = admins.map((admin) => ({
      _id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
      rollno: admin.rollno,
      role: admin.role,
    }));

    return filteredAdmins;
  } catch (error) {
    console.error(error);
    return [];
  }
}

type AdminData = {
  _id: string;
  name: string;
  email: string;
  rollno: string;
};

export async function UpdateAdmin(admin: AdminData, adminId: string) {
  try {
    if (!admin || !admin._id) {
      return {
        success: false,
        message: "Invalid admin data",
      };
    }

    const user = await AdminModel.findById(adminId);

    if (!user || user.role !== "admin") {
      return {
        success: false,
        message: "Only admin can update admin data",
      };
    }

    const { _id, ...rest } = admin;

    const updatedAdmin = await AdminModel.findByIdAndUpdate(_id, rest, {
      new: true,
      runValidators: true, // Ensure validations are run
    });

    if (!updatedAdmin) {
      return {
        success: false,
        message: "Admin not found",
      };
    }

    return {
      success: true,
      data: updatedAdmin,
    };
  } catch (error) {
    console.error("Error updating admin:", error);
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
}

export async function GetAllBoarders() {
  try {
    const boarders = await Boarder.find({ active: true }).sort({
      cardNo: 1,
    });

    const filteredBoarders = boarders.map((boarder) => ({
      _id: boarder._id.toString(),
      name: boarder.name,
      email: boarder.email,
      rollno: boarder.rollno,
      phoneNo: boarder.phoneNo,
      session: boarder.session,
      cardNo: boarder.cardNo,
      secret: boarder.secret,
      amount: boarder.amount,
      fineAmount: boarder.fineAmount ,
    }));

    return filteredBoarders;
  } catch (error) {
    console.error(error);
    return [];
  }
}

type BoarderType = {
  name: string;
  email: string;
  rollno: string;
  phoneNo: string;
  session: string;
  cardNo: string;
};

export async function EditBoarder(_id: string, boarder: BoarderType) {
  try {
    const updatedBoarder = await Boarder.findByIdAndUpdate(
      _id,
      { $set: boarder },
      { new: true }
    );

    if (!updatedBoarder) {
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating boarder:", error);
    return { success: false };
  }
}

export async function GenerateNewBoarderQRSecret(_id: string) {
  try {
    const secret = crypto.randomBytes(16).toString("hex");

    const updatedBoarder = await Boarder.findByIdAndUpdate(
      _id,
      { $set: { secret } },
      { new: true }
    );

    if (!updatedBoarder) {
      return {
        success: false,
        message: "Boarder not found",
      };
    }

    return {
      success: true,
      secret,
      message: "New QR secret generated successfully",
    };
  } catch (error) {
    console.error("Error generating new boarder QR secret:", error);
    return {
      success: false,
      message: "Failed to generate new QR",
    };
  }
}

export async function DeactivateBoardersByRollNos(rollNos: string[]) {
  try {
    const normalizedRollNos = Array.from(
      new Set(
        rollNos
          .map((rollNo) => rollNo.trim())
          .filter((rollNo) => rollNo.length > 0)
      )
    );

    if (normalizedRollNos.length === 0) {
      return {
        success: false,
        message: "No valid roll numbers provided",
      };
    }

    const matchingBoarders = await Boarder.find(
      { rollno: { $in: normalizedRollNos } },
      { rollno: 1, active: 1 }
    ).lean();

    const foundRollNos = new Set(matchingBoarders.map((b) => b.rollno));
    const notFoundRollNos = normalizedRollNos.filter(
      (rollNo) => !foundRollNos.has(rollNo)
    );

    const activeRollNos = matchingBoarders
      .filter((boarder) => boarder.active)
      .map((boarder) => boarder.rollno);

    const alreadyInactiveCount = matchingBoarders.length - activeRollNos.length;

    let updatedCount = 0;
    if (activeRollNos.length > 0) {
      const updateResult = await Boarder.updateMany(
        { rollno: { $in: activeRollNos } },
        { $set: { active: false } }
      );
      updatedCount = updateResult.modifiedCount || 0;
    }

    revalidatePath('/boarder');
    revalidatePath('/see-boarders');

    return {
      success: true,
      updatedCount,
      alreadyInactiveCount,
      notFoundRollNos,
      totalProcessed: normalizedRollNos.length,
      message: "Boarder status updated successfully",
    };
  } catch (error) {
    console.error("Error deactivating boarders by roll numbers:", error);
    return {
      success: false,
      message: "Failed to deactivate boarders",
    };
  }
}

// Representative Actions
type RepresentativeType = {
  name: string;
  rollno: string;
  role: string;
  department?: string;
  phoneNo?: string;
  session: string; // input as string from form
  photoUrl?: string;
  isArchived?: boolean;
};

function parseSessionToYear(sessionInput: string): number {
  const trimmed = sessionInput.trim();
  // Extract first 4-digit year from input (handles "2024" or "2024-2025")
  const match = trimmed.match(/\d{4}/);
  return match ? Number(match[0]) : 0;
}

export async function GetAllRepresentatives() {
  try {
    const representatives = await Representative.find({ isArchived: false }).sort({
      session: -1, // sort by numeric year descending (latest first)
    });

    const filteredRepresentatives = representatives.map((rep) => ({
      _id: rep._id.toString(),
      name: rep.name,
      rollno: rep.rollno,
      role: rep.role,
      department: rep.department,
      phoneNo: rep.phoneNo,
      session: rep.session, // numeric year like 2024
      photoUrl: rep.photoUrl,
      isArchived: rep.isArchived,
    }));

    return filteredRepresentatives;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function GetArchivedRepresentatives() {
  try {
    const representatives = await Representative.find({ isArchived: true }).sort({
      session: -1, // Sort by session year descending (2027 → 2024)
      createdAt: -1, // Secondary sort by creation date
    });

    const filteredRepresentatives = representatives.map((rep) => ({
      _id: rep._id.toString(),
      name: rep.name,
      rollno: rep.rollno,
      role: rep.role,
      department: rep.department,
      phoneNo: rep.phoneNo,
      session: rep.session, // This should be a NUMBER like 2024, not string
      photoUrl: rep.photoUrl,
      isArchived: rep.isArchived,
    }));

    return filteredRepresentatives;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function AddRepresentative(representative: RepresentativeType) {
  try {
    const sessionYear = parseSessionToYear(representative.session);

    if (!sessionYear) {
      return {
        success: false,
        message: "Invalid session format. Please enter a year like 2024 or 2024-2025.",
      };
    }

    await Representative.create({
      ...representative,
      session: sessionYear,
    });

    revalidatePath('/representatives');
    revalidatePath('/representatives/archived');
    revalidatePath('/team');

    return {
      success: true,
      message: "Representative added successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to add representative",
    };
  }
}

export async function UpdateRepresentative(
  _id: string,
  representative: RepresentativeType
) {
  try {
    const sessionYear = parseSessionToYear(representative.session);

    if (!sessionYear) {
      return {
        success: false,
        message: "Invalid session format. Please enter a year like 2024 or 2024-2025.",
      };
    }

    const updatedRep = await Representative.findByIdAndUpdate(
      _id,
      { $set: { ...representative, session: sessionYear } },
      { new: true, runValidators: true }
    );

    if (!updatedRep) {
      return {
        success: false,
        message: "Representative not found",
      };
    }

    revalidatePath('/representatives');
    revalidatePath('/representatives/archived');
    revalidatePath('/team');

    return {
      success: true,
      message: "Representative updated successfully",
    };
  } catch (error) {
    console.error("Error updating representative:", error);
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
}

export async function DeleteRepresentative(id: string) {
  try {
    await Representative.findByIdAndDelete(id);

    revalidatePath('/representatives');
    revalidatePath('/representatives/archived');
    revalidatePath('/team');

    return {
      success: true,
      message: "Representative deleted successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Internal server error",
    };
  }
}

export async function ArchiveRepresentative(id: string) {
  try {
    await Representative.findByIdAndUpdate(id, { isArchived: true });

    revalidatePath('/representatives');
    revalidatePath('/representatives/archived');
    revalidatePath('/team');

    return {
      success: true,
      message: "Representative archived successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Internal server error",
    };
  }
}

export async function UnarchiveRepresentative(id: string) {
  try {
    await Representative.findByIdAndUpdate(id, { isArchived: false });

    revalidatePath('/representatives');
    revalidatePath('/representatives/archived');
    revalidatePath('/team');

    return {
      success: true,
      message: "Representative unarchived successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Internal server error",
    };
  }
}
