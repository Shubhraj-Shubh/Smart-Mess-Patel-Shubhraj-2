import mongoose, { Schema, Document, Model } from "mongoose";

interface IWorker extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phoneNo: string;
  disabled: boolean;
  deleteAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const WorkerSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true },
    phoneNo: { type: String, required: true, unique: true },
    disabled: { type: Boolean, default: false },
    deleteAt: { type: Date, index: { expires: 0 } },
  },
  {
    timestamps: true,
  }
);

const Worker: Model<IWorker> =
  mongoose.models.Worker || mongoose.model<IWorker>("Worker", WorkerSchema);

export default Worker;
