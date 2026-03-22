"use server";
import connectDB from "@/lib/db";
import DriveMenu from "@/models/DriveMenu";

export async function UploadDriveMenu(title: string, driveLink: string) {
  try {
    await connectDB();
    // Make all existing menus inactive
    await DriveMenu.updateMany({}, { active: false });
    
    // Create new active menu
    const menu = new DriveMenu({
      title,
      driveLink,
      active: true,
    });
    await menu.save();

    return {
      status: 200,
      message: "Drive menu uploaded successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
}

export async function GetActiveDriveMenu() {
  try {
    await connectDB();
    const menu = await DriveMenu.findOne({ active: true });

    if (!menu) {
      return {
        status: 404,
        message: "No active menu found",
      };
    }

    return {
      status: 200,
      message: "Menu fetched successfully",
      data: {
        _id: menu._id.toString(),
        title: menu.title,
        driveLink: menu.driveLink,
        uploadDate: menu.uploadDate,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
}

export async function GetAllDriveMenus() {
  try {
    await connectDB();
    const menus = await DriveMenu.find().sort({ uploadDate: -1 });

    return {
      status: 200,
      message: "Menus fetched successfully",
      data: menus.map((menu) => ({
        _id: menu._id.toString(),
        title: menu.title,
        driveLink: menu.driveLink,
        uploadDate: menu.uploadDate,
        active: menu.active,
      })),
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
}

export async function DeleteDriveMenu(id: string) {
  try {
    await connectDB();
    await DriveMenu.findByIdAndDelete(id);

    return {
      status: 200,
      message: "Menu deleted successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
}
