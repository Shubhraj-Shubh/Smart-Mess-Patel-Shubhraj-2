"use server";
import connectDB from "@/lib/db";
import MessMenuUpload from "@/models/MessMenuModel";
import Signature from "@/models/SignatureModel";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ============================================
// MESS MENU ACTIONS
// ============================================

// Upload mess menu to Cloudinary
export async function UploadMessMenu(title: string, imageBase64: string) {
  try {
    await connectDB();

    // Upload menu image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(imageBase64, {
      folder: "mess-menus",
      resource_type: "image",
    });

    // Make all existing menus inactive
    await MessMenuUpload.updateMany({}, { active: false });

    // Create new active menu
    const messMenu = new MessMenuUpload({
      title,
      menuImageUrl: uploadResult.secure_url,
      active: true,
    });
    await messMenu.save();

    return {
      status: 200,
      message: "Mess menu uploaded successfully",
      data: {
        _id: messMenu._id.toString(),
        menuImageUrl: messMenu.menuImageUrl,
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

// Get active mess menu
export async function GetActiveMessMenu() {
  try {
    await connectDB();
    const messMenu = await MessMenuUpload.findOne({ active: true });

    if (!messMenu) {
      return {
        status: 404,
        message: "No active menu found",
      };
    }

    return {
      status: 200,
      message: "Menu fetched successfully",
      data: {
        _id: messMenu._id.toString(),
        title: messMenu.title,
        menuImageUrl: messMenu.menuImageUrl,
        uploadDate: messMenu.uploadDate,
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

// Get all mess menus
export async function GetAllMessMenus() {
  try {
    await connectDB();
    const menus = await MessMenuUpload.find().sort({ uploadDate: -1 });

    return {
      status: 200,
      message: "Menus fetched successfully",
      data: menus.map((menu) => ({
        _id: menu._id.toString(),
        title: menu.title,
        menuImageUrl: menu.menuImageUrl,
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

// Delete mess menu
export async function DeleteMessMenu(id: string) {
  try {
    await connectDB();
    const menu = await MessMenuUpload.findById(id);

    if (!menu) {
      return {
        status: 404,
        message: "Menu not found",
      };
    }

    // Extract public ID from Cloudinary URL and delete image
    try {
      const publicId = menu.menuImageUrl
        .split("/")
        .slice(-2)
        .join("/")
        .split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    } catch (cloudinaryError) {
      console.log("Error deleting from Cloudinary:", cloudinaryError);
    }

    await MessMenuUpload.findByIdAndDelete(id);

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

// Set mess menu as active
export async function SetActiveMessMenu(id: string) {
  try {
    await connectDB();

    // Make all menus inactive
    await MessMenuUpload.updateMany({}, { active: false });

    // Set the selected menu as active
    const menu = await MessMenuUpload.findByIdAndUpdate(
      id,
      { active: true },
      { new: true }
    );

    if (!menu) {
      return {
        status: 404,
        message: "Menu not found",
      };
    }

    return {
      status: 200,
      message: "Menu set as active",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
}

// ============================================
// SIGNATURE ACTIONS
// ============================================

// Upload G.Sec signature
export async function UploadGsecSignature(signatureBase64: string) {
  try {
    await connectDB();

    // Upload signature to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(signatureBase64, {
      folder: "mess-signatures/gsec",
      resource_type: "image",
    });

    // Make all existing G.Sec signatures inactive
    await Signature.updateMany({ type: "gsec" }, { active: false });

    // Create new active signature
    const signature = new Signature({
      type: "gsec",
      signatureUrl: uploadResult.secure_url,
      active: true,
    });
    await signature.save();

    return {
      status: 200,
      message: "G.Sec signature uploaded successfully",
      data: {
        _id: signature._id.toString(),
        signatureUrl: signature.signatureUrl,
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

// Upload Hall President signature
export async function UploadHallPresidentSignature(signatureBase64: string) {
  try {
    await connectDB();

    // Upload signature to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(signatureBase64, {
      folder: "mess-signatures/hall-president",
      resource_type: "image",
    });

    // Make all existing Hall President signatures inactive
    await Signature.updateMany({ type: "hallpresident" }, { active: false });

    // Create new active signature
    const signature = new Signature({
      type: "hallpresident",
      signatureUrl: uploadResult.secure_url,
      active: true,
    });
    await signature.save();

    return {
      status: 200,
      message: "Hall President signature uploaded successfully",
      data: {
        _id: signature._id.toString(),
        signatureUrl: signature.signatureUrl,
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

// Get active G.Sec signature
export async function GetActiveGsecSignature() {
  try {
    await connectDB();
    const signature = await Signature.findOne({ type: "gsec", active: true });

    if (!signature) {
      return {
        status: 404,
        message: "No active G.Sec signature found",
      };
    }

    return {
      status: 200,
      message: "Signature fetched successfully",
      data: {
        _id: signature._id.toString(),
        signatureUrl: signature.signatureUrl,
        uploadDate: signature.uploadDate,
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

// Get active Hall President signature
export async function GetActiveHallPresidentSignature() {
  try {
    await connectDB();
    const signature = await Signature.findOne({
      type: "hallpresident",
      active: true,
    });

    if (!signature) {
      return {
        status: 404,
        message: "No active Hall President signature found",
      };
    }

    return {
      status: 200,
      message: "Signature fetched successfully",
      data: {
        _id: signature._id.toString(),
        signatureUrl: signature.signatureUrl,
        uploadDate: signature.uploadDate,
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

// Get all signatures
export async function GetAllSignatures() {
  try {
    await connectDB();
    const signatures = await Signature.find().sort({ uploadDate: -1 });

    return {
      status: 200,
      message: "Signatures fetched successfully",
      data: signatures.map((sig) => ({
        _id: sig._id.toString(),
        type: sig.type,
        signatureUrl: sig.signatureUrl,
        uploadDate: sig.uploadDate,
        active: sig.active,
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

// Delete signature
export async function DeleteSignature(id: string) {
  try {
    await connectDB();
    const signature = await Signature.findById(id);

    if (!signature) {
      return {
        status: 404,
        message: "Signature not found",
      };
    }

    // Extract public ID from Cloudinary URL and delete image
    try {
      const publicId = signature.signatureUrl
        .split("/")
        .slice(-2)
        .join("/")
        .split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    } catch (cloudinaryError) {
      console.log("Error deleting from Cloudinary:", cloudinaryError);
    }

    await Signature.findByIdAndDelete(id);

    return {
      status: 200,
      message: "Signature deleted successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
}

// Set signature as active
export async function SetActiveSignature(id: string) {
  try {
    await connectDB();

    const signature = await Signature.findById(id);
    if (!signature) {
      return {
        status: 404,
        message: "Signature not found",
      };
    }

    // Make all signatures of the same type inactive
    await Signature.updateMany({ type: signature.type }, { active: false });

    // Set the selected signature as active
    signature.active = true;
    await signature.save();

    return {
      status: 200,
      message: "Signature set as active",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
}
