import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true }, // le hash sera stocké ici
    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },
    telephone: { type: String, required: true },
    ville: { type: String, required: true },
    age: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
