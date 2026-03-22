import mongoose, { Document, Schema, Model, Types } from "mongoose";

// Interface for individual feedback
interface IFeedback extends Document {
  boarderId: Types.ObjectId; // Reference to Boarder model
  mealType: "morning" | "lunch" | "eveningSnack" | "dinner";
  day: string;
  feedback: "Like" | "Dislike"; // Enforcing valid values
  replacementSuggestion?: string; // Optional replacement suggestion
  createdAt?: Date;
  updatedAt?: Date;
}

// Mongoose Schema for Feedback
const FeedbackSchema = new Schema<IFeedback>(
  {
    boarderId: {
      type: Schema.Types.ObjectId,
      ref: "Boarder",
      required: true,
      index: true,
    },
    mealType: {
      type: String,
      enum: ["morning", "lunch", "eveningSnack", "dinner"],
      required: true,
    },
    day: {
      type: String,
      required: true,
    },
    feedback: {
      type: String,
      enum: ["Like", "Dislike"],
      required: true,
    },
    replacementSuggestion: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Interface for the MenuPoll document
interface IMenuPoll extends Document {
  _id: Types.ObjectId;
  menuId: Types.ObjectId; // Reference to MessMenu model
  feedbacks: IFeedback[]; // Array of feedbacks
  expiryDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Mongoose Schema for Menu Poll
const MenuPollSchema = new Schema<IMenuPoll>(
  {
    menuId: {
      type: Schema.Types.ObjectId,
      ref: "MessMenu",
      required: true,
      index: true,
    },
    feedbacks: [FeedbackSchema], // Embedded feedback array
    expiryDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Creating the Model
const MenuPoll: Model<IMenuPoll> =
  mongoose.models.MenuPoll ||
  mongoose.model<IMenuPoll>("MenuPoll", MenuPollSchema);

export default MenuPoll;
