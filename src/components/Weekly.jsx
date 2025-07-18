import { useHabit } from "../context/HabitContext";
import { format ,addDays,parseISO} from "date-fns";
import { useState,useEffect } from "react";
const Weekly = () => {
  
  const {data,date,habits,tailwindColors,setData,setDate}=useHabit();
 
 const days=[];
 for(let i=6;i>=0;i--){
  days.push(addDays(date,-i));
 }


 

  const isDone=(habitName,date)=>{
   
    
    const entry=data.completed.find((entry)=>entry.date===date && entry.habitName===habitName);
    
    
    return entry?true:false;
  }

  const handleClick = (day, name) => {
  const formattedDate = format(day, "yyyy-MM-dd");
  setDate(parseISO(formattedDate))
  const newEntry = {
    habitName: name,
    date: formattedDate,
    completed: true,
  };

  // Check if already completed
  const alreadyExists = data.completed.some(
    (entry) =>
      entry.habitName.trim().toLowerCase() === name.trim().toLowerCase() &&
      entry.date === formattedDate
  );

  if (alreadyExists) return; // Do nothing

  // Add new entry
  setData((prevData) => ({
    ...prevData,
    completed: [...prevData.completed, newEntry],
  }));
};

  
  

  return (
    <div className="w-full h-full flex flex-col ">
      <div>

      </div>
      <div className="w-full h-full flex flex-row gap-1">
      <div className="w-1/6  flex flex-col justify-between">
        <div className="w-full h-10 flex flex-row items-center justify-center bg-blackx`"></div>
        {habits.map((habit,index)=>{
          const textColour=tailwindColors[index].split(" ")[0];
          const bgColour=tailwindColors[index].split(" ")[1];
          return(
            <div key={index} className={`w-full h-10 flex flex-row items-center justify-center `}>
              <p className={`text-xl font-bold ${textColour} ${bgColour} rounded-full w-3 h-3 flex items-center justify-center`}></p><p className={`text-xl font-bold ${textColour} ml-1`}>{habit.habitName}</p>
            </div>
          )
        })}
      </div>

        {days.map((day,index)=>{
          
          return(
            <div key={index} className="w-full h-full flex flex-col items-center justify-between  gap-1">
              <p className="text-l font-bold opacity-55 mb-3">{format(day,"EEE")}</p>
              {habits.map((habit,index)=>{
                const name=habit.habitName;
                const textColour=tailwindColors[index].split(" ")[0];
          const bgColour=tailwindColors[index].split(" ")[1];
                return(
                  habit.selectedDays.includes(format(day,"EEE"))?
                  <div
                    key={index}
                    className={`w-7 h-7 flex flex-col items-center justify-center ${
                      isDone(habit.habitName,format(day,"yyyy-MM-dd")) ? ` ${bgColour} ` : 'bg-slate-200'
                    } transition-all duration-300 ease-in-out rounded-md` }
                  >

                    
                    
                    <button className="w-full h-full" onClick={()=>{handleClick(day,name);
                    }}></button>
                    </div>:
                    <div key={index} className="w-7 h-7 flex flex-col items-center justify-center bg-white" />
                    )
              })}
            </div>)
        })}
      

      <div>
        
      </div>
    </div>
    </div>
    
  )
}

export default Weekly