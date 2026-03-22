import mongoose, { Schema, Document, Model } from "mongoose";

interface IEvent extends Document {
  _id: mongoose.Types.ObjectId;
  eventName: string;
  description?: string;
  date: Date;
  emails: string[];
  boarders: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema: Schema = new Schema(
  {
    eventName: { type: String, required: true },
    description: { type: String, default: "" },
    date: { type: Date, default: Date.now },
    emails: [{ type: String, required: true }],
    boarders: [{ type: Schema.Types.ObjectId, ref: "Boarder" }],
  },
  {
    timestamps: true,
  }
);

const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", eventSchema);

export default Event;
