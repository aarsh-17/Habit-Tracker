import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "lucide-react";
import Login from "./components/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardLayout from "./components/DashboardLayout.jsx"
import './index.css'
import { ContextProvider } from "./context/HabitContext.jsx";
import Add from "./components/Add.jsx";
import Weekly from "./components/Weekly.jsx";
import CalendarGrid from "./components/Monthly.jsx";
const router = createBrowserRouter([
  
    {
    path: "/",
    element: <Home />,
  },

  
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: (
     
      < ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
        
      
    ),
    children: [
    //   {
    //     path: "",
    //     element: <Recents />
    //   },
      {
        path: "add",
        element: <Add />,
      },
      {
        path: "weekly",
        element: <Weekly/>,
      },
       {
        path: "monthly",
        element: <CalendarGrid/>,
      },
    //   {
    //     path: "charts",
    //     element: <Charts />,
    //   },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ContextProvider>
       <RouterProvider router={router} />
    </ContextProvider>
     
    
    
  </React.StrictMode>
);