import express from "express";
import {
  createContact,
  getAllContacts,
  deleteContact,
} from "../controllers/contact.controller.js";
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create a new contact submission
router.post("/create", requireSignIn, createContact);

// Get all contact submissions (admin functionality)
router.get("/getAllContacts", requireSignIn, isAdmin, getAllContacts);

// Delete a specific contact submission (admin functionality)
router.delete("/delete/:id", requireSignIn, isAdmin, deleteContact);

export default router;
