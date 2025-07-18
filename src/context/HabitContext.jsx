// src/context/ExpenseContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { Plus, TrendingDown, TrendingUp, Calendar, DollarSign, ShoppingBag, Coffee, Car, Home, Gamepad2, Heart, MoreHorizontal, Trash2, Edit3, PieChart, BarChart3, Filter } from 'lucide-react';

const HabitContext = createContext();

export const useHabit = () => useContext(HabitContext);

export const ContextProvider = ({ children }) => {
  const [username, setUsername] = useState(()=>{
      return localStorage.getItem("username")
  }
    
  );
  const [data, setData] = useState(() => {
  
  const storedCompleted = localStorage.getItem("Data");
 
  return {
    completed: storedCompleted ? JSON.parse(storedCompleted) : [],
  };
});

  const [unsyncedChanges, setUnsyncedChanges] = useState([]);

    
  const [habits,setHabits]= useState(() => {
    const stored = localStorage.getItem("habits");
    return stored ? JSON.parse(stored) : [];
    });

   useEffect(() => {
  const fetchHabits = async () => {
    try {
      const res = await fetch("http://localhost:5000/habit", {
        method: "GET",
        credentials: "include", // ✅ ensures cookies are sent
      });

     

      if (!res.ok) {
        const error = await res.json();
        console.error("Failed to fetch habits:", error);
        return;
      }

     

      const result = await res.json();
     
      setHabits(result);
    } catch (error) {
      console.error("Network error:", error.message);
    }
  };

  const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/data", {
          method: "GET",
          credentials: "include"
        });

        if (!res.ok) {
          const error = await res.json();
          console.error("Failed to fetch data:", error);
          return;
        }

        const result = await res.json();
        const simplifiedData = result.map(({ habitName, date, completed }) => ({
          habitName,
          date,
          completed
        }));

        setData({ completed: simplifiedData });
        localStorage.setItem("Data", JSON.stringify(simplifiedData));
      } catch (error) {
        console.error("Data fetch error:", error.message);
      }
    };

  if (!location.pathname.includes("login")) {
    fetchHabits();
    fetchData();
  }
}, []);

  const [date,setDate]=useState(new Date())
  const [completed, setCompleted] = useState([])
 const tailwindColors = [
    "text-red-500 bg-red-500",
    "text-orange-500 bg-orange-500",
    "text-yellow-500 bg-yellow-500",
    "text-green-500 bg-green-500",
    "text-blue-500 bg-blue-500",
    "text-indigo-500 bg-indigo-500",
    "text-purple-500 bg-purple-500",
    "text-pink-500 bg-pink-500",
    "text-teal-500 bg-teal-500",
    "text-amber-500 bg-amber-500",
    "text-cyan-500 bg-cyan-500",
    "text-lime-500 bg-lime-500",
  ];
  return (
    <HabitContext.Provider
      value={{
        username,
        setUsername,
        date,
        setDate,
        habits,
        setHabits,
        completed,
        setCompleted,
        data,
        setData,
        tailwindColors,
        unsyncedChanges,
        setUnsyncedChanges
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};
