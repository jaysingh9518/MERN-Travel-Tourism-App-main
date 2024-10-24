import express from "express";
import {
  createBlogPost,
  getAllBlogs,
  getBlogById,
  updateBlogPost,
  deleteBlogPost,
  likeBlogPost,
  dislikeBlogPost,
  addComment,
  getFeaturedBlogs, // Import the new controller function
} from "../controllers/blog.controller.js";
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create a new blog post (Admin only)
router.post("/create", requireSignIn, isAdmin, createBlogPost);

// Get all blog posts
router.get("/", getAllBlogs);

// Get featured blog posts
router.get("/featured", getFeaturedBlogs); // New route for featured blogs

// Get a single blog post by ID (increments views)
router.get("/:id", getBlogById);

// Like a blog post
router.put("/like/:id", likeBlogPost);

// Dislike a blog post
router.put("/dislike/:id", dislikeBlogPost);

// Add a comment to a blog post
router.post("/comment/:id", requireSignIn, addComment);

// Update a blog post (Admin only)
router.put("/update/:id", requireSignIn, isAdmin, updateBlogPost);

// Delete a blog post (Admin only)
router.delete("/delete/:id", requireSignIn, isAdmin, deleteBlogPost);

export default router;
