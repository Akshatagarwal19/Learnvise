import Category from "../models/Category.js";

const categoryController = {
    // Create a new category
    createCategory: async (req, res) => {
        const { name, description } = req.body;

        try {
            // Check if the category already exists
            const existingCategory = await Category.findOne({ name });
            if (existingCategory) {
                return res.status(400).json({ message: "Category already exists" });
            }

            const category = await Category.create({
                name,
                description,
            });

            res.status(201).json({ message: "Category created successfully", category });
        } catch (error) {
            console.error("Error creating category:", error.message);
            res.status(500).json({ message: "Failed to create category", error: error.message });
        }
    },

    // Get all categories
    getAllCategories: async (req, res) => {
        try {
            const categories = await Category.find().sort({ createdAt: -1 }); // Sort by newest first
            res.status(200).json(categories);
        } catch (error) {
            console.error("Error fetching categories:", error.message);
            res.status(500).json({ message: "Failed to fetch categories", error: error.message });
        }
    },

    // Get a single category by ID
    getCategoryById: async (req, res) => {
        const { id } = req.params;

        try {
            const category = await Category.findById(id);
            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }

            res.status(200).json(category);
        } catch (error) {
            console.error(`Error fetching category with ID ${id}:`, error.message);
            res.status(500).json({ message: "Failed to fetch category", error: error.message });
        }
    },

    // Update a category
    updateCategory: async (req, res) => {
        const { id } = req.params;
        const { name, description } = req.body;

        try {
            const category = await Category.findById(id);
            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }

            // Update category fields
            if (name) category.name = name;
            if (description) category.description = description;

            await category.save();

            res.status(200).json({ message: "Category updated successfully", category });
        } catch (error) {
            console.error(`Error updating category with ID ${id}:`, error.message);
            res.status(500).json({ message: "Failed to update category", error: error.message });
        }
    },

    // Delete a category
    deleteCategory: async (req, res) => {
        const { id } = req.params;

        try {
            const category = await Category.findById(id);
            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }

            await category.deleteOne();

            res.status(200).json({ message: "Category deleted successfully" });
        } catch (error) {
            console.error(`Error deleting category with ID ${id}:`, error.message);
            res.status(500).json({ message: "Failed to delete category", error: error.message });
        }
    },
};

export default categoryController;
