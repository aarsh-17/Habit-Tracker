import { useHabit } from "../context/HabitContext"
const Streak = () => {
  const {data,habits}=useHabit();
  
  
    return (
      <div className=" h-[150px] overflow-y-auto custom-scrollbar">
       {habits.map((habit) => {
  const highestStreak = (() => {
    const dates = data.completed
      .filter((entry) => entry.habitName === habit.habitName)
      .map((entry) => new Date(entry.date))
      .sort((a, b) => a - b); // sort ascending

    if (dates.length === 0) return 0;

    let maxStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < dates.length; i++) {
      const diff =
        (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24); // difference in days

      if (diff === 1) {
        currentStreak += 1;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else if (diff > 1) {
        currentStreak = 1; // reset
      }
    }

    return maxStreak;
  })();

  return (
    <div
      key={habit.habitName}
      className="p-2 w-full h-[50px] flex flex-row items-center justify-between"
    >
      <p className="text-xl">{habit.habitName}</p>
      <p className="text-xl text-purple-600">{highestStreak} 🔥</p>
    </div>
  );
})}

      </div>
    )
}

export default Streak