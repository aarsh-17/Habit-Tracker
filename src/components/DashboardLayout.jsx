import { useEffect } from "react";
import { useHabit } from "../context/HabitContext";
import { Link, Outlet, useLocation } from "react-router-dom";
import HabitList from "./HabitList";
import { ArrowLeftIcon ,ArrowRightIcon } from "lucide-react";
import { addDays ,format} from "date-fns";
import Streak from "./Streak";
const DashboardLayout =()=>{
  const {username,date,setDate,habits,data}=useHabit();
  useEffect(()=>{
  
    
  },[habits,data])
  
  useEffect(()=>{
    
    // localStorage.setItem("Data",JSON.stringify(data.completed))
    const postData=async()=>{
      try {
      const res=await fetch("http://localhost:5000/data",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        credentials:"include",
        body:JSON.stringify(data.completed)
      })
      const result=await res.json();
      console.log(result);
    } catch (error) {
      console.log(error.message);
    }
    }
    
    postData();
    // const timeInterval=setInterval(postData,5000);
    // return ()=>{
    //   clearInterval(timeInterval);
    // }
    
  },[data])
  

  

  
  const today=format(date,"EEE");
  const todayDate=format(date,"yyyy-MM-dd");
  
  const buttonstyle="w-[100px] h-[40px] bg-slate-100 rounded-3xl flex items-center justify-center cursor-pointer hover:bg-slate-300";
  const totalHabits = habits.reduce((count, habit) => {
  return habit.selectedDays.includes(today) ? count + 1 : count;
}, 0);


  const completedCount = data.completed.reduce((count, entry) => {
    return entry.date === todayDate ? count + 1 : count;
  },0);
  
  
  
  
  const progressPercent = totalHabits > 0 ? (completedCount / totalHabits) * 100 : 0;
  
  
  return(
    <div className="h-screen min-w-screen bg-slate-50 px-[100px] py-[50px]">
      <div className=" shadow-md rounded-3xl bg-white flex flex-col p-[50px] h-full font-poppins  text-slate-600">
        <div className="flex flex-row w-full items-center justify-between">
        <div >
          <p className="text-3xl font-bold">Hey {username}!!</p>
          <p>time till bedtime </p>
       </div>

       <div className=" flex flex-col w-[300px]">
        
        <div className="flex flex-row justify-between ">
           <p className="text-xl font-bold mb-3">{date.toLocaleDateString('en-US', { weekday: 'short' })}, {date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}</p>
           <div className="flex flex-row">
            <ArrowLeftIcon onClick={()=>{setDate(addDays(date, -1)); setCompleted([])}}/>
            <ArrowRightIcon onClick={()=>{setDate(addDays(date, 1)); setCompleted([])}}/>
           </div>
        </div>
        <div className="w-full mb-2">
          <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {Math.round(progressPercent)}% of daily goal achieved
          </p>
        </div>
       
       </div>
      </div>
       <div className="flex flex-row h-full w-full mt-5 gap-4">
        <div className="w-2/3  flex flex-col">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row bg-slate-100 items-center justify-center w-[500px] gap-4 rounded-3xl">
          <Link to="weekly"><button className={buttonstyle}>Weekly</button></Link>
          <Link to="monthly"><button className={buttonstyle}>Monthly</button></Link>
          <Link><button className={buttonstyle}>Yearly</button></Link>
          <Link><button className={buttonstyle}>All Time</button></Link>
        </div>
        <Link
        to={"add"}>
        <button className="w-[150px] h-[40px] flex justify-center items-center bg-white rounded-3xl text-blue-500 text-l">
          + Add Habit
          </button>
        </Link>
        </div>
        <Outlet />
        </div>
        <div className="w-1/3 flex flex-col">
        <div className="border-2 h-[500px] w-full p-4  overflow-y-scroll scroll-smooth hide-scrollbar ">
        <HabitList />
        </div>
        
          <Streak />
        
        
        
        </div>
      </div>
      </div>
      
    </div>  
  )
}

export default DashboardLayout;