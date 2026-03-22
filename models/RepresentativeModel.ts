import mongoose, { Document, Schema, Model } from "mongoose";

interface IRepresentative extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  rollno: string;
  role: string;
  department?: string;
  phoneNo?: string;
  session: number; // MUST be number, not string
  photoUrl?: string;
  isArchived: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const RepresentativeSchema: Schema<IRepresentative> = new Schema(
  {
    name: { type: String, required: true },
    rollno: { type: String, required: true },
    role: { type: String, required: true },
    department: { type: String },
    phoneNo: { type: String },
    session: { type: Number, required: true }, // Changed to Number
    photoUrl: { type: String },
    isArchived: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Representative: Model<IRepresentative> =
  mongoose.models.Representative ||
  mongoose.model<IRepresentative>("Representative", RepresentativeSchema);

export default Representative;
