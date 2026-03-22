import mongoose, { Schema, Document } from "mongoose";

interface OtpDocument extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  otp: string;
  expiresAt: Date;
}

const otpSchema = new Schema<OtpDocument>({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.OTP ||
  mongoose.model<OtpDocument>("OTP", otpSchema);
