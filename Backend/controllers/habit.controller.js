import Habit from "../model/habit.model.js";
import Counter from "../model/Counter.js";
export const getHabits = async (req, res) => {
  try {


    const habits = await Habit.find({ userId: req.user._id });
    res.json(habits);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const addHabit = async (req, res) => {
  try {
    // Get the current counter or initialize it
    let counter = await Counter.findOne({ name: "habitId" });

    if (!counter) {
      counter = await Counter.create({ name: "habitId", value: 1 });
    } else {
      counter.value += 1;
      await counter.save();
    }

    const newHabit = new Habit({
      habitId: counter.value, // 👈 assign the incremented habitId
      userId: req.user._id, // assuming you're using a protected route
      habitName: req.body.habitName,
      selectedDays: req.body.selectedDays,
      perDay: req.body.perDay,
    });

    await newHabit.save();
    res.status(201).json({ message: "Habit created", habit: newHabit });
  } catch (error) {
    console.error("Error adding habit:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteHabit = async (req, res) => {
  try {
    const { name } = req.params;

    await Habit.findOneAndDelete({ habitName: name });
    res.json({ message: "Habit deleted successfully" });
  } catch (error) {
    console.error("Error deleting habit:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};