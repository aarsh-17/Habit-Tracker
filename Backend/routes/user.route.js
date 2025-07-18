import express from "express";
import User from "../model/User.js";

const router = express.Router();

router.get("/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ fullname: user.fullname });
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
