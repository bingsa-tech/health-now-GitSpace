// seedTips.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Tip from "./src/models/Tip.js";

dotenv.config();

const tips = [
  {
    question: "mal de tête",
    answer: "Buvez de l’eau, reposez-vous et évitez les écrans.",
    category: "santé générale",
  },
  {
    question: "rhume",
    answer:
      "Hydratez-vous bien, prenez du repos et faites des inhalations de vapeur.",
    category: "respiratoire",
  },
  {
    question: "fatigue",
    answer:
      "Essayez de dormir suffisamment, mangez équilibré et évitez la caféine tard le soir.",
    category: "énergie",
  },
  {
    question: "stress",
    answer:
      "Pratiquez la respiration profonde, la méditation ou allez marcher 10 minutes.",
    category: "bien-être",
  },
  {
    question: "maux de ventre",
    answer:
      "Une infusion de camomille ou de menthe peut aider. Évitez les repas trop lourds.",
    category: "digestion",
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connecté à MongoDB Atlas");

    // Nettoyer la collection avant d’insérer
    await Tip.deleteMany({});
    console.log("🗑️ Anciennes astuces supprimées");

    // Insérer les nouvelles
    await Tip.insertMany(tips);
    console.log("🌱 Astuces insérées avec succès !");

    process.exit();
  } catch (err) {
    console.error("❌ Erreur lors du seed :", err);
    process.exit(1);
  }
}

seed();
