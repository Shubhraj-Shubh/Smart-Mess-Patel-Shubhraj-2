import { object, string, boolean } from "zod";

export const signInSchema = object({
  email: string({ required_error: "Email is required" })
    .email("Invalid email")
    .min(2, "Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters")
    .max(32, "Password must be at most 32 characters"),
});

export const signUpSchema = object({
  firstName: string()
    .min(1, { message: "First name is required" })
    .max(50, { message: "First name is too long" }),
  lastName: string()
    .min(1, { message: "Last name is required" })
    .max(50, { message: "Last name is too long" }),
  email: string().email({ message: "Invalid email address" }),
  companyName: string().max(100, { message: "Company name is too long" }),
  password: string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[a-z]/, { message: "Password must contain a lowercase letter" })
    .regex(/[A-Z]/, { message: "Password must contain an uppercase letter" })
    .regex(/[0-9]/, { message: "Password must contain a digit" })
    .regex(/[@$!%*?&#]/, {
      message: "Password must contain a special character",
    }),
  otp: string()
    .length(6, { message: "OTP must be 6 digits" })
    .regex(/^\d+$/, { message: "OTP must be numeric" }),
  agreeToTerms: boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});
