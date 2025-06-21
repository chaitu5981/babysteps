import express from "express";
import Milestone from "../models/Milestone.js";
import Tip from "../models/Tip.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const routerFactory = (io) => {
  const router = express.Router();
  router.use(verifyToken);

  router.post("/", async (req, res) => {
    const milestone = await Milestone.create({
      ...req.body,
      userId: req.userId,
    });
    res.status(201).json(milestone);
  });

  router.get("/", async (req, res) => {
    const milestones = await Milestone.find().sort({ date: -1 });
    res.json(milestones);
  });

  router.get("/:id/tips", async (req, res) => {
    const tips = await Tip.find({ milestoneId: req.params.id }).sort({
      createdAt: 1,
    });
    res.json(tips);
  });

  router.post("/:id/tips", async (req, res) => {
    const tip = await Tip.create({ ...req.body, milestoneId: req.params.id });
    io.emit(`new-tip-${req.params.id}`, tip);
    res.status(201).json(tip);
  });

  router.put("/:id", async (req, res) => {
    const milestone = await Milestone.findById(req.params.id);
    if (!milestone)
      return res.status(404).json({ message: "Milestone not found" });

    if (milestone.userId.toString() !== req.userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this milestone" });
    }

    milestone.title = req.body.title;
    milestone.date = req.body.date;
    milestone.notes = req.body.notes;
    await milestone.save();

    res.json(milestone);
  });

  router.delete("/:id", async (req, res) => {
    const milestone = await Milestone.findById(req.params.id);
    if (!milestone)
      return res.status(404).json({ message: "Milestone not found" });

    if (milestone.userId.toString() !== req.userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this milestone" });
    }

    await Tip.deleteMany({ milestoneId: req.params.id });
    await milestone.deleteOne();

    res.json({ message: "Milestone deleted" });
  });

  return router;
};

export default routerFactory;
