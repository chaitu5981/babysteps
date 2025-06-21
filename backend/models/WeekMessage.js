import mongoose from 'mongoose';
const weekMessageSchema = new mongoose.Schema({
  week: { type: Number, required: true, unique: true },
  message: { type: String, required: true }
});
export default mongoose.model('WeekMessage', weekMessageSchema);