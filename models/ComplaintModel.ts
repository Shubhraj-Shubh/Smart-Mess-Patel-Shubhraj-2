import mongoose, { Schema, Document, Model } from "mongoose";

interface IComplaint extends Document {
  _id: mongoose.Types.ObjectId;
  userId: string;
  userName: string;
  rollno: string;
  description: string;
  status: "Pending" | "Resolved";
  adminMessage: string;
  createdAt: Date;
  updatedAt: Date;
}

const complaintSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    rollno: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Resolved"],
      default: "Pending",
    },
    adminMessage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Complaint: Model<IComplaint> =
  mongoose.models.Complaint ||
  mongoose.model<IComplaint>("Complaint", complaintSchema);

export default Complaint;
