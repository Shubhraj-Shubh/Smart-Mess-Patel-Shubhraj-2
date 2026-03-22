import mongoose, { Schema, Document, Model } from "mongoose";

interface Signature extends Document {
  _id: mongoose.Types.ObjectId;
  type: "gsec" | "hallpresident";
  signatureUrl: string;
  uploadDate: Date;
  active: boolean;
}

const signatureSchema = new Schema<Signature>({
  type: {
    type: String,
    enum: ["gsec", "hallpresident"],
    required: true,
  },
  signatureUrl: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  active: { type: Boolean, default: false },
});

const Signature: Model<Signature> =
  mongoose.models.Signature ||
  mongoose.model<Signature>("Signature", signatureSchema);

export default Signature;
