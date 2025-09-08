// backend/src/models/Tip.js
import mongoose from "mongoose";

const tipSchema = new mongoose.Schema(
  {
    question: { type: String, required: true }, // ex: "mal de tête"
    answer: { type: String, required: true }, // ex: "Buvez de l’eau, reposez-vous..."
    category: { type: String, default: "général" },
  },
  { timestamps: true }
);

export default mongoose.model("Tip", tipSchema);
