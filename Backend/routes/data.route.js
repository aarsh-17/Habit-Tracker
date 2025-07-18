import express from "express";
import { getData,postData } from "../controllers/data.controller.js";
import { protectedRoute } from "../middleware/protectedRoutes.js";
const router=express.Router();

router.get("/",protectedRoute,getData)
router.post("/",protectedRoute,postData);

export default router