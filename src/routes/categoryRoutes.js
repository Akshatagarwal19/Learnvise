import express from "express";
import auth from "../middleware/auth.js";
import categoryController from "../controllers/categorycontroller.js";

const router = express.Router();

// Create a category
router.post("/", auth.authenticate, auth.authorize(["Manager", "Owner"]), categoryController.createCategory);

// Get all categories
router.get("/", auth.authenticate, categoryController.getAllCategories);

// Get a single category
router.get("/:id", auth.authenticate, categoryController.getCategoryById);

// Update a category
router.put("/:id", auth.authenticate, auth.authorize(["Manager", "Owner"]), categoryController.updateCategory);

// Delete a category
router.delete("/:id", auth.authenticate, auth.authorize(["Owner"]), categoryController.deleteCategory);

export default router;
