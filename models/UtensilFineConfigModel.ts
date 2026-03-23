import mongoose, { Document, Model, Schema } from "mongoose";

interface IUtensilFineConfig extends Document {
  _id: mongoose.Types.ObjectId;
  key: string;
  amount: number;
  updatedByAdminId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const UtensilFineConfigSchema: Schema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "GLOBAL",
    },
    amount: {
      type: Number,
      required: true,
      default: 20,
      min: 0,
    },
    updatedByAdminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const UtensilFineConfigModel: Model<IUtensilFineConfig> =
  mongoose.models.UtensilFineConfig ||
  mongoose.model<IUtensilFineConfig>("UtensilFineConfig", UtensilFineConfigSchema);

export default UtensilFineConfigModel;
