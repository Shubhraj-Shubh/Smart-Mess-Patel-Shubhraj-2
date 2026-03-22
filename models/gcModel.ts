import mongoose, { Schema, Document } from "mongoose";

export interface IGCEvent extends Document {
  name: string;
  isCustom: boolean;
  createdAt: Date;
}

export interface IGCItem extends Document {
  name: string;
  isCustom: boolean;
  createdAt: Date;
}

export interface IGCRefreshmentEntry extends Document {
  event: mongoose.Types.ObjectId;
  item: mongoose.Types.ObjectId;
  quantity: number;
  addedBy: mongoose.Types.ObjectId;
  isVerified: boolean;
  date: Date;
  time: string;
  createdAt: Date;
}

const GCEventSchema = new Schema<IGCEvent>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    isCustom: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const GCItemSchema = new Schema<IGCItem>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    isCustom: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const GCRefreshmentEntrySchema = new Schema<IGCRefreshmentEntry>(
  {
    event: { type: Schema.Types.ObjectId, ref: "GCEvent", required: true },
    item: { type: Schema.Types.ObjectId, ref: "GCItem", required: true },
    quantity: { type: Number, required: true, min: 1 },
    addedBy: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
    isVerified: { type: Boolean, default: false },
    date: { type: Date, required: true, default: Date.now },
    time: { type: String, required: true },
  },
  { timestamps: true }
);

const GCEvent = mongoose.models.GCEvent || mongoose.model<IGCEvent>("GCEvent", GCEventSchema);
const GCItem = mongoose.models.GCItem || mongoose.model<IGCItem>("GCItem", GCItemSchema);
const GCRefreshmentEntry = mongoose.models.GCRefreshmentEntry || mongoose.model<IGCRefreshmentEntry>("GCRefreshmentEntry", GCRefreshmentEntrySchema);

export { GCEvent, GCItem, GCRefreshmentEntry };
