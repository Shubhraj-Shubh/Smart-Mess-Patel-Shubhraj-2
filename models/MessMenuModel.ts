import mongoose, { Schema, Document, Model } from "mongoose";

interface MessMenuUpload extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  menuImageUrl: string;
  uploadDate: Date;
  active: boolean;
}

const messMenuUploadSchema = new Schema<MessMenuUpload>({
  title: { type: String, required: true },
  menuImageUrl: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  active: { type: Boolean, default: false },
});

const MessMenuUpload: Model<MessMenuUpload> =
  mongoose.models.MessMenuUpload ||
  mongoose.model<MessMenuUpload>("MessMenuUpload", messMenuUploadSchema);

export default MessMenuUpload;
