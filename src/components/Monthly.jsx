import {
  startOfMonth,
  endOfMonth,
  getDay,
  addMonths,
  subMonths,
  format,
  eachDayOfInterval,
} from "date-fns";
import { useState, useMemo } from "react";
import { useHabit } from "../context/HabitContext";
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from "lucide-react";

const CalendarGrid = () => {
  const { data, habits } = useHabit();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  console.log(data);
  

  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  const allDays = eachDayOfInterval({ start, end });
  const startWeekday = getDay(start); // Sunday = 0

  // ✅ Memoized monthly completion data
  const { totalScheduled, totalCompleted, dailyPercentages } = useMemo(() => {
    let totalScheduled = 0;
    let totalCompleted = 0;
    let dailyPercentages = {};

    allDays.forEach((date) => {
      const dateStr = format(date, "yyyy-MM-dd");
      const weekday = format(date, "EEE");

      const scheduledHabits = habits.filter((h) =>
        h.selectedDays.includes(weekday)
      );

      const completedHabits = data.completed.filter(
        (entry) => entry.date === dateStr
      );

      const completedCount = scheduledHabits.filter((habit) =>
        completedHabits.some((c) => c.habitName === habit.habitName)
      ).length;

      totalScheduled += scheduledHabits.length;
      totalCompleted += completedCount;

      dailyPercentages[dateStr] =
        scheduledHabits.length > 0
          ? Math.round((completedCount / scheduledHabits.length) * 100)
          : 0;
    });

    return { totalScheduled, totalCompleted, dailyPercentages };
  }, [currentMonth, data.completed, habits]);

  const monthProgress =
    totalScheduled > 0
      ? Math.round((totalCompleted / totalScheduled) * 100)
      : 0;

  return (
    <div className="w-full p-4 overflow-y-auto h-full">
      {/* Header with Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth((prev) => subMonths(prev, 1))}
          className="px-3 py-1 rounded hover:bg-gray-300"
        >
          <ArrowLeftCircleIcon />
        </button>
        <h2 className="text-xl font-bold">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <button
          onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
          className="px-3 py-1 rounded hover:bg-gray-300"
        >
          <ArrowRightCircleIcon />
        </button>
      </div>

      {/* Monthly Progress */}
      <div className="w-full mb-6">
        <p className="mb-1 text-sm font-medium">
          Monthly Progress: {monthProgress}%
        </p>
        <div className="w-full bg-gray-200 h-3 rounded-full">
          <div
            className="h-3 bg-blue-500 rounded-full transition-all"
            style={{ width: `${monthProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-2 text-sm font-semibold text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 mt-2">
        {/* Empty boxes before the 1st day */}
        {Array.from({ length: startWeekday }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {allDays.map((date, index) => {
          const dateStr = format(date, "yyyy-MM-dd");
          const percent = dailyPercentages[dateStr] || 0;
          const day = format(date, "d");

          const circleColor =
            percent === 100
              ? "bg-green-500"
              : percent >= 50
              ? "bg-yellow-400"
              : percent > 0
              ? "bg-orange-400"
              : "bg-gray-300";

          return (
            <div
              key={dateStr}
              className="h-20 w-full border rounded-md flex flex-col items-center justify-center"
            >
              <p className="text-xs font-bold">{day}</p>
              <div
                className={`w-10 h-10 mt-2 rounded-full flex items-center justify-center text-white text-xs font-bold ${circleColor}`}
              >
                {percent}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
