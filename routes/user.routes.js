import { Router } from "express";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import User from "../models/user.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { userName, email, password } = req.body || {};
    if (!userName || !email || !password) {
      return res.status(400).json({ message: "userName, email, password are required" });
    }

    const existed = await User.findOne({ email: email.toLowerCase().trim() });
    if (existed) return res.status(409).json({ message: "Email already exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      userName,
      email: email.toLowerCase().trim(),
      password: hash
    });

    res.status(201).json({
      message: "Registered successfully",
      user: { id: user._id, userName: user.userName, email: user.email }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ message: "email, password are required" });

    const user = await User.findOne({ email: (email || "").toLowerCase().trim() });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid email or password" });

    const random = uuidv4();
    user.apiKeyToken = random;
    await user.save();

    const apiKey = `mern-$${user._id}$-$${user.email}$-${random}`;
    res.json({
      message: "Login successful",
      apiKey,
      user: { id: user._id, userName: user.userName, email: user.email }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
