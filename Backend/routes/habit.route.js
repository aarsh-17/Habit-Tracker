import express from "express";
import { addHabit, deleteHabit, getHabits } from "../controllers/habit.controller.js";
import { protectedRoute } from "../middleware/protectedRoutes.js";

const router=express.Router();

router.get("/",protectedRoute,getHabits)
router.post("/",protectedRoute,addHabit)

router.delete("/:name",protectedRoute,deleteHabit)

export default router