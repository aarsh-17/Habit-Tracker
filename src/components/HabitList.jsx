import { useEffect, useState } from "react";
import { useHabit } from "../context/HabitContext";
import {
  format,
  addDays,
  startOfWeek,
  subWeeks,
  addWeeks,
  isSameDay,
  setDate
} from "date-fns";

const HabitList = () => {
  const { habits, date ,data,setData,tailwindColors} = useHabit();

  const today = format(date, "yyyy-MM-dd"); // Format for matching
  const day = format(date, "EEE");

  

  const handleComplete = (habitName) => {
  const entry = { habitName, date: today, completed: true };

  // Prevent duplicates
  const alreadyExists = data.completed.some(
    (e) => e.habitName === habitName && e.date === today
  );

  if (alreadyExists) return;

  setData((prevData) => ({
    ...prevData,
    completed: [...prevData.completed, entry]
  }));
};


  const handleUndo = (habitName, date) => {
    setData((prevData) => ({
  ...prevData,
  completed: prevData.completed.filter(
    (entry) => !(entry.date === date && entry.habitName === habitName)
  ),
}));

    
  }

  return (
    <div className="flex flex-col gap-4 overflow-hidden pr-2">
      {habits.map((habit, index) => {
        const colorClass = tailwindColors[index % tailwindColors.length];
        const [textColor, bgColor] = colorClass.split(" ");

       
        if (!habit.selectedDays.includes(day)) return null;

        
        const isDone = data.completed.some(
          (entry) => entry.habitName === habit.habitName && entry.date === today
        );

        return (
          <div
            key={index}
            className={`flex flex-row items-center h-[100px] gap-6 rounded-xl px-4 transition ${
              isDone ? bgColor : "bg-white"
            }`}
          >
            {/* Colored side bar */}
            <div className={`w-2 h-full ${bgColor}`} />

            <div className="flex flex-col justify-between items-start w-full">
              <p
                className={`text-xl font-bold ${
                  isDone ? "text-white" : textColor
                }`}
              >
                {habit.habitName}
              </p>

              {isDone ? (
                <div className="text-white flex flex-row items-center gap-1 text-sm font-medium   w-full justify-between">
                  <div><span className="text-lg">✅</span> Completed</div>
                  <button className="rounded  px-4 text-sm border border-white" onClick={()=>handleUndo(habit.habitName,today)}>Undo</button>
                </div>
              ) : (
                <button
                  onClick={() => handleComplete(habit.habitName)}
                  className={`border border-slate-300 rounded px-3 py-1 w-full text-sm opacity-70 hover:opacity-100 transition`}
                >
                  Mark as Complete
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};


export default HabitList;
