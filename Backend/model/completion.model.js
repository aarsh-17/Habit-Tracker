import mongoose from "mongoose";

const completionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    habitName: { type: String, required: true },
    date: { type: String, required: true }, // Format: "YYYY-MM-DD"
    completed: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Prevent same user marking same habit twice on same day


const Completion = mongoose.model("Completion", completionSchema);
export default Completion;
