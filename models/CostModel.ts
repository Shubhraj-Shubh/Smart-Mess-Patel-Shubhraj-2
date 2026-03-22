import mongoose, { Schema, Document, Model } from "mongoose";

interface ICost extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  workerId: mongoose.Types.ObjectId;
  workerName: string;
  session: number;
  season: string;
  category: string;
  amount: number;
  paid: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CostSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boarder",
      required: true,
    },
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
      required: true,
    },
    workerName: {
      type: String,
      required: true,
    },
    session: { type: Number, required: true },
    season: { type: String, required: true },
    category: { type: String, default: "ADDONS" },
    amount: { type: Number, required: true },
    paid: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Cost: Model<ICost> =
  mongoose.models.Cost || mongoose.model<ICost>("Cost", CostSchema);

export default Cost;
