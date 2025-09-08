// backend/src/routes/chat.js
import express from "express";
import Tip from "../models/Tip.js";

const router = express.Router();

// ➡️ Endpoint pour poser une question
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message requis" });
    }

    // Recherche simple (mot-clé dans la question)
    const tip = await Tip.findOne({
      question: { $regex: message, $options: "i" },
    });

    if (tip) {
      return res.json({ reply: tip.answer });
    } else {
      return res.json({
        reply: "❌ Désolé, je n’ai pas encore d’astuce pour ça.",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ➡️ Endpoint pour ajouter de nouvelles astuces
router.post("/add", async (req, res) => {
  try {
    const { question, answer, category } = req.body;

    const tip = new Tip({ question, answer, category });
    await tip.save();

    res.json({ message: "✅ Astuce ajoutée", tip });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Impossible d’ajouter l’astuce" });
  }
});

// ➡️ Endpoint pour voir toutes les astuces (debug/admin)
router.get("/all", async (req, res) => {
  const tips = await Tip.find();
  res.json(tips);
});

export default router;
