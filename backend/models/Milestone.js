import mongoose from 'mongoose';
const milestoneSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  date: Date,
  notes: String
});
export default mongoose.model('Milestone', milestoneSchema);