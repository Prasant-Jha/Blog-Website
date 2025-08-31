import express from "express";
import { getTotalUsers, getTotalBlogs, getTotalViews } from "../controllers/statsController.js";
import { verifyAdmin } from "../middlewares/auth.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

// Routes with admin check
router.get("/total-users", verifyToken, verifyAdmin, getTotalUsers);
router.get("/total-blogs", verifyToken, verifyAdmin, getTotalBlogs);
router.get("/total-views", verifyToken, verifyAdmin, getTotalViews);

export default router;
