import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js"
const router = express.Router();

/**
 * ✅ REGISTER
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, telephone, ville, age } = req.body;
    console.log("📥 Tentative register:", email);

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.warn("⚠️ Email déjà utilisé:", email);
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    // Hash du mot de passe
    const passwordHash = await bcrypt.hash(password, 10);
    console.log("🔑 Hash généré pour:", email);

    // Créer l’utilisateur
    const user = new User({
      name,
      email,
      passwordHash,
      role,
      telephone,
      ville,
      age,
    });

    await user.save();
    console.log("✅ Utilisateur enregistré:", user.email);

    // Générer token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        telephone: user.telephone,
        ville: user.ville,
        age: user.age,
      },
    });
  } catch (err) {
    console.error("❌ Erreur register:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

/**
 * ✅ LOGIN
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("📥 Tentative login:", email);

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      console.warn("❌ Utilisateur introuvable:", email);
      return res.status(400).json({ message: "Utilisateur non trouvé" });
    }

    // Vérifier mot de passe
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    console.log("🔑 Résultat bcrypt.compare:", isMatch);

    if (!isMatch) {
      console.warn("❌ Mot de passe invalide pour:", email);
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    // Générer token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("✅ Login réussi pour:", email);

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        telephone: user.telephone,
        ville: user.ville,
        age: user.age,
      },
    });
  } catch (err) {
    console.error("❌ Erreur login:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});
// Dashboad
router.get("/protected", authMiddleware, async (req, res) => {
  res.json({ message: "Accès autorisé ✅", user: req.user });
});
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json({ user });
  } catch (err) {
    console.error("❌ Erreur /me:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});


export default router;
