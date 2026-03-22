
import mongoose, { Schema, Document, Model } from "mongoose";

type MealType = {
  veg: string[];
  nonVeg: string[];
}

type Meal = {
  morning: MealType;
  lunch: MealType;
  eveningSnack: MealType;
  dinner: MealType;
}

type Day = {
  day:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  meals: Meal;
}

interface Season extends Document {
  _id: mongoose.Types.ObjectId;
  season: "Summer" | "Winter" | "Autumn" | "Spring";
  startDate: Date;
  endDate: Date;
  menu: Day[];
  active: boolean;
}

const daySchema = new Schema<Day>({
  day: {
    type: String,
    required: true,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  },
  meals: {
    morning: {
      veg: { type: [String], required: true },
      nonVeg: { type: [String], required: true },
    },
    lunch: {
      veg: { type: [String], required: true },
      nonVeg: { type: [String], required: true },
    },
    eveningSnack: {
      veg: { type: [String], required: true },
      nonVeg: { type: [String], required: true },
    },
    dinner: {
      veg: { type: [String], required: true },
      nonVeg: { type: [String], required: true },
    },
  },
});

const seasonSchema = new Schema<Season>({
  season: {
    type: String,
    required: true,
    enum: ["Winter", "Summer", "Spring", "Autumn"],
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  active: { type: Boolean, default: false },
  menu: { type: [daySchema], required: true },
});

const MessMenu: Model<Season> =
  mongoose.models.MessMenu || mongoose.model<Season>("MessMenu", seasonSchema);

export default MessMenu;