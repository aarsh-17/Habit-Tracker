import { useState } from "react";
import { useHabit } from "../context/HabitContext";

const Add = () => {
  const [habitName, setHabitName] = useState("");
  
  const [perDay, setPerDay] = useState("");
  const [error, setError] = useState("");
  const { habits, setHabits } = useHabit();
  const [selectedDays, setSelectedDays] = useState([]);


  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

   const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!habitName  || !perDay || selectedDays.length === 0) {
      setError("Please fill in all fields.");
      return;
    }
    
    
    const newHabit = { habitName, perDay,selectedDays };
    const existingHabit = habits.find((h) => h.habitName === habitName);
    const res=await fetch("http://localhost:5000/habit",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      credentials:"include",
      body:JSON.stringify(newHabit)
    })

    if (existingHabit) {
     setError("Habit already exists.");
      return; 
    }
    setHabits([...habits, newHabit]);
    setHabitName("");
    setSelectedDays([]);
    setPerDay("");
    setError("");
  };

  return (
    <div className="bg-white  w-full h-full p-6 space-y-4  font-poppins">
    <h2 className="text-xl font-semibold text-gray-700">Add New Habit</h2>
    {error && <p className="text-red-500">{error}</p>}
      <form
      onSubmit={handleSubmit}
       className="flex flex-col justify-start h-full gap-9"
    >
      
      <div>
        <label className="block text-sm text-gray-600 mb-1">Habit Name</label>
        <input
          type="text"
          value={habitName}
          onChange={(e) => setHabitName(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
          placeholder="e.g., Read, Workout"
        />
      </div>

      

      <div>
        <label className="block text-sm text-gray-600 mb-1">Frequency per Day</label>
        <input
          type="number"
          value={perDay}
          onChange={(e) => setPerDay(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
          placeholder="e.g., 2"
          min="0"
        />

        <div>
        <p className="mt-5">Select Days</p>
        <div className="grid grid-cols-7 gap-2 m">
          
          {days.map((day) => (
            <button
              type="button"
              key={day}
              onClick={() => toggleDay(day)}
              className={`px-2 py-1 rounded-full border transition ${
                selectedDays.includes(day)
                  ? "bg-blue-500 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition mt-[50px]"
      >
        Add Habit
      </button>
    </form>
    </div>
    
  );
};

export default Add;
