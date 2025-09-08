import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";
import authMiddleware from "./middleware/auth.js";
dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Vite dev (frontend)
      "http://127.0.0.1:5173",
      "https://health-now-frontend.netlify.app", // netlify site
    ],
    credentials: true,
  })
);
app.use("/api/chat", chatRoutes);

// Routes
app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: "Accès autorisé ✅", user: req.user });
});
// Mongo + start
const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0"; // 🔑 essentiel pour Docker

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(5000, () => console.log("🚀 Backend démarré sur port 5000"));
  })
  .catch(err => console.error("❌ Erreur MongoDB:", err));
