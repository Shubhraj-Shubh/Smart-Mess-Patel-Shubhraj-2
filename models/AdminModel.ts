import mongoose, { Document, Schema, Model } from "mongoose";

type RoleType = "admin" | "coadmin" | "manager";

interface IAdmin extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  rollno: string;
  email: string;
  role: RoleType;
  createdAt?: Date;
  updatedAt?: Date;
}

const AdminSchema: Schema<IAdmin> = new Schema(
  {
    name: { type: String, required: true },
    rollno: { type: String, required: true },
    email: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["admin", "coadmin", "manager"],
      default: "coadmin",
    },
  },
  {
    timestamps: true,
  }
);

const Admin: Model<IAdmin> =
  mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);

export default Admin;
