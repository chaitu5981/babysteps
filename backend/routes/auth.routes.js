import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token, pregnancyStartDate: user.pregnancyStartDate });
});

router.post("/register", async (req, res) => {
  const { email, password, pregnancyStartDate } = req.body;
  const hashed = bcrypt.hashSync(password, 10);
  try {
    const newUser = await User.create({
      email,
      password: hashed,
      pregnancyStartDate,
    });
    res.status(201).json(newUser);
  } catch {
    res.status(400).json({ message: "User already exists" });
  }
});

export default router;
