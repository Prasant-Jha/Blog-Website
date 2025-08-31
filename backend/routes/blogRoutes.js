import express from "express";
import {
  createBlogPost,
  deleteBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  toggleLike,
  addComment,
  deleteComment,
  replyToComment
} from "../controllers/blogController.js";
import { verifyAdmin, verifyToken } from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

// Create blog (Admin only)
router.post("/create", verifyToken, verifyAdmin, upload.single("coverImage"), createBlogPost);

// Get all blogs
router.get("/", getAllBlogs);

// Get single blog
router.get("/:id", getSingleBlog);

// Like/unlike blog
router.put("/:id/like", verifyToken, toggleLike);

// Add comment
router.post("/:id/comment", verifyToken, addComment);

// Delete comment (Admin or same user who wrote it)
router.delete("/:blogId/comment/:commentId", verifyToken, deleteComment);

// Reply to a comment
router.post("/:blogId/comment/:commentId/reply", verifyToken, replyToComment);

// Update blog (Admin only)
router.put("/:id", verifyToken, verifyAdmin, upload.single("coverImage"), updateBlog);

// Delete blog (Admin only)
router.delete("/:id", verifyToken, verifyAdmin, deleteBlog);

export default router;
