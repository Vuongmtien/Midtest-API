import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    apiKeyToken: { type: String, default: null }
  },
  { timestamps: true }
);
userSchema.index({ email: 1 }, { unique: true });

export default mongoose.model("User", userSchema);
