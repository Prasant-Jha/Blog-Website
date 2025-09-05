import express from "express";
import { register, login, getProfile, updateProfile, changePassword, forgotPassword, resetPassword, deleteUser, getAllUsers, updateUserRole } from "../controllers/authController.js";
import { verifyAdmin, verifyToken } from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, upload.single("avatar"), updateProfile);
router.put("/change-password", verifyToken, changePassword);

router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

router.get("/users", verifyToken, verifyAdmin, getAllUsers);
router.delete("/users/:id", verifyToken, verifyAdmin, deleteUser);
router.put("/users/:id/role", verifyToken, verifyAdmin, updateUserRole);

export default router;
