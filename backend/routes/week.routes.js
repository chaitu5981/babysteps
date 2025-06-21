import express from 'express';
import WeekMessage from '../models/WeekMessage.js';

const router = express.Router();

// Get message for a particular week
router.get('/:week', async (req, res) => {
  const week = parseInt(req.params.week);
  const data = await WeekMessage.findOne({ week });
  if (data) return res.json(data);
  res.status(404).json({ message: 'No recommendation for this week.' });
});

export default router;
