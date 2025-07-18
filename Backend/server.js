import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { connectMongoDB } from './lib/db.js';
import authRoutes from "./routes/auth.route.js";
import habitRoutes from "./routes/habit.route.js";
import dataRoutes from "./routes/data.route.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.route.js";
import cors from "cors";


const app=express();
dotenv.config();
app.use(cookieParser())
app.use(cors({
  origin: "http://localhost:5173", // your frontend dev server
  credentials: true,
}));

app.use(express.json());

const PORT=process.env.PORT || 5000;

app.use("/auth",authRoutes); 
app.use("/habit",habitRoutes);
app.use("/data",dataRoutes);
app.use("/user",userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  connectMongoDB();
});