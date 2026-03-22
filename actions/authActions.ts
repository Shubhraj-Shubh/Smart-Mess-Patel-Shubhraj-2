"use server";
import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";
import sendEmail from "@/lib/nodemailer";
import OTPModel from "@/models/OTPModel";
import User from "@/models/UserModel";

export async function handleCredentialsSignIn({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    await signIn("credentials", {
      email: email,
      password: password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      console.error("AuthError", error);
      switch (error.type) {
        case "CredentialsSignin":
          return {
            message: "Invalid credentials",
          };
        default:
          return {
            message: "An error occurred",
          };
      }
    }
    throw error;
  }
}

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  otp: string;
};

export async function sendOTP(email: string) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const emailContent = `
      <h2>MyLamp AI - OTP Verification</h2>
      <p>Dear User,</p>
      <p>Your One-Time Password (OTP) for completing your signup/verification is:</p>
      <h1 style="color: #4CAF50;">${otp}</h1>
      <p>This OTP is valid for the next 10 minutes. Please do not share it with anyone.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <br />
      <p>Regards,<br>MyLamp AI Team</p>
    `;
  try {
    const otpDoc = new OTPModel({
      email: email,
      otp: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });
    
    await otpDoc.save();
    
    const res = await sendEmail(email, "MyLamp AI - Your OTP Code", emailContent);
    
    if (res === "success") {
      return "success"
    }
    else return "failed";
  } catch (err) {
    console.log(err);
  }
  return "failed";
}

export async function handleCredentialSignUp(formData: FormData) {
  try {
    
    const {otp, ...restformData} = formData;
    
    const otpEntry = await OTPModel.findOne({ email: formData.email, otp: otp });
    
    if (!otpEntry) {
      return "Invalid OTP";
    } else if (otpEntry.expiresAt < new Date()) {
      await otpEntry.deleteOne(); 
      return "OTP Expired";
    }
    
    const existingUser = await User.findOne({ email: formData.email });
    
    if (existingUser) {
      return "User already exists. Please Log In";
    }
    
    const user = new User({
      ...restformData,
      name: `${formData.firstName} ${formData.lastName}`,
    });
    await user.save();
    
    await otpEntry.deleteOne();
    
    return "success";
  } catch (err) {
    console.log(err);
  }
  return "failed";
}

export async function handleGoogleSignIn() {
  await signIn("google", { callbackUrl: "/" });
}

export async function handleSignOut() {
  await signOut();
}
