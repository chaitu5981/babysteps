import mongoose from "mongoose";
const tipSchema = new mongoose.Schema({
  milestoneId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Milestone",
    required: true,
  },
  content: String,
  author: String,
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  likedBy: [String],
});
export default mongoose.model("Tip", tipSchema);
