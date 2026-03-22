import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollno: { type: String, required: true },
  email: { type: String, required: true },
  cardNo: { type: String, required: true },
  phoneNo: { type: String, required: true },
  secret: { type: String, required: true },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
