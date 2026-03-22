import mongoose, { Schema, Document, Model } from "mongoose";

interface DriveMenu extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  driveLink: string;
  uploadDate: Date;
  active: boolean;
}

const driveMenuSchema = new Schema<DriveMenu>({
  title: { type: String, required: true },
  driveLink: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  active: { type: Boolean, default: false },
});

const DriveMenu: Model<DriveMenu> =
  mongoose.models.DriveMenu || mongoose.model<DriveMenu>("DriveMenu", driveMenuSchema);

export default DriveMenu;
