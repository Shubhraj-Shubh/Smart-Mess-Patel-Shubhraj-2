import mongoose, { Schema, Document, Model } from "mongoose";

interface IFine extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  adminId: mongoose.Types.ObjectId;
  adminName: string;
  reason: string;
  session: number;
  season: string;
  fineAmount: number;
  paid: boolean;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const FineSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boarder",
      required: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    adminName: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    session: { type: Number, required: true },
    season: { type: String, required: true },
    fineAmount: { type: Number, required: true },
    paid: { type: Boolean, default: false },
    category: { type: String, default: "FINE" },
  },
  {
    timestamps: true,
  }
);

const Fine: Model<IFine> =
  mongoose.models.Fine || mongoose.model<IFine>("Fine", FineSchema);

export default Fine;
