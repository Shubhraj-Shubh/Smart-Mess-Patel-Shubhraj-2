import mongoose, { Schema, Model, Document } from "mongoose";

interface IBoarder extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  rollno: string;
  email: string;
  cardNo: string;
  phoneNo: string;
  secret: string;
  session: number;
  amount: number;
  fineAmount: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BoarderSchema: Schema = new Schema({
  name: { type: String, required: true },
  rollno: { type: String, required: true },
  email: { type: String, required: true },
  cardNo: { type: String, required: true },
  phoneNo: { type: String, required: true },
  secret: { type: String, required: true },
  session: { type: Number, default: 2024 },
  amount: {
    type: Number,
    default: 0,
  },
  fineAmount: {
    type: Number,
    default: 0,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

const Boarder: Model<IBoarder> =
  mongoose.models.Boarder || mongoose.model<IBoarder>("Boarder", BoarderSchema);

export default Boarder;
