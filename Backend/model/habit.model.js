// models/Habit.js
import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    habitId: { type: Number, unique: true }, // 👈 new field
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    habitName: { type: String, required: true },
    selectedDays: [{ type: String, enum: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] }],
    perDay: { type: Number, required: true },
  },
  { timestamps: true }
);

const Habit = mongoose.model("Habit", habitSchema);
export default Habit;
