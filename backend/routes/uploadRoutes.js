// routes/uploadRoutes.js
import express from "express";
import { uploadInlineImage } from "../middlewares/upload.js";
import { handleInlineImageUpload } from "../controllers/uploadController.js";
import { verifyAdmin, verifyToken } from "../middlewares/auth.js";

const router = express.Router();

// Auth optional here depending on your needs
router.post("/upload-inline-image", verifyToken, verifyAdmin, uploadInlineImage, handleInlineImageUpload);

export default router;
