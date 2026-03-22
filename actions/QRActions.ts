"use server";
import Boarder from "@/models/Boarder";
import crypto from "crypto";

type UserType = {
  name: string;
  rollno: string;
  email: string;
  cardNo: string;
  phoneNo: string;
  session: string;
};

type UserNotAdded = {
  user: UserType;
  message: string;
};

export const addBoarders = async (users: UserType[]) => {
  const usersNotAdded: UserNotAdded[] = [];

  for (const user of users) {
    try {
      const existingUser = await Boarder.findOne({
        $or: [
          { rollno: user.rollno },
          { email: user.email },
          { cardNo: user.cardNo },
          { phoneNo: user.phoneNo },
        ],
      });

      if (existingUser) {
        usersNotAdded.push({ user, message: "User already exists" });
        continue;
      }

      const secret = crypto.randomBytes(16).toString("hex");

      await Boarder.create({ ...user, secret });
    } catch (err) {
      usersNotAdded.push({ user, message: "Error adding user" });
      console.error(`Error generating QR code for ${user.name}:`, err);
    }
  }

  return { success: true, usersNotAdded };
};

export const verifyQRCode = async (secret: string) => {
  try {
    const user = await Boarder.findOne({ secret });

    if (!user) {
      return { valid: false, message: "Invalid QR code" };
    }

    return {
      valid: true,
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        phoneNo: user.phoneNo,
        cardNo: user.cardNo,
        rollno: user.rollno,
        active: user.active,
      },
    };
  } catch (error) {
    console.error("Error verifying QR Code:", error);
    return { valid: false, message: "Error verifying QR code" };
  }
};
