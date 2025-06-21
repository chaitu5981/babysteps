import express from "express";
import Tip from "../models/Tip.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();
router.use(verifyToken);

router.put("/:id/like", async (req, res) => {
  const tip = await Tip.findById(req.params.id);
  if (!tip) return res.status(404).json({ message: "Tip not found" });

  // Prevent duplicate likes from same user
  if (tip.likedBy?.includes(req.userId.toString())) {
    return res.status(400).json({ message: "You already liked this tip" });
  }

  tip.likes = (tip.likes || 0) + 1;
  tip.likedBy = [...(tip.likedBy || []), req.userId.toString()];
  await tip.save();
  res.json(tip);
});

export default router;
