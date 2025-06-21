import express from 'express';
import Milestone from '../models/Milestone.js';
import Tip from '../models/Tip.js';

const router = express.Router();

router.get('/popular-milestones', async (req, res) => {
  const results = await Milestone.aggregate([
    { $group: { _id: '$title', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);
  res.json(results);
});

router.get('/top-tips', async (req, res) => {
  const tips = await Tip.find().sort({ likes: -1 }).limit(5);
  res.json(tips);
});

export default router;