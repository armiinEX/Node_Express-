const categoryModel = require("./../../models/category");
const mongoose = require("mongoose");




exports.create = async (req, res) => {
    const { title, href } = req.body;
    const category = await categoryModel.create({ title, href });

    return res.status(201).json({ category });
};

exports.getAll = async (req, res) => {
    const categories = await categoryModel.find({}).lean();

    return res.status(200).json({ categories });
};

exports.remove = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid category ID!" });
        }

        const deletedCategory = await categoryModel.findByIdAndDelete(id);
        
        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found!" });
        }

        return res.status(200).json({ message: "Category deleted successfully!" });

    } catch (error) {
        console.error("Error deleting category:", error);
        return res.status(500).json({ message: "Server error!", error: error.message });
    }
};


exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, href } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid category ID!" });
        }

        if (!title || !href) {
            return res.status(400).json({ message: "Title and href are required!" });
        }

        const updatedCategory = await categoryModel.findByIdAndUpdate(
            id,
            { title, href },
            { new: true, runValidators: true } 
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: "Category not found!" });
        }

        return res.status(200).json({
            message: "Category updated successfully!",
            updatedCategory
        });

    } catch (error) {
        console.error("Error updating category:", error);
        return res.status(500).json({ message: "Server error!", error: error.message });
    }
};

exports.TESTupdate = async (req, res) => {
    try {
        const { title, href } = req.body;

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid category ID!" });
        }

        if (!title || !href) {
            return res.status(400).json({ message: "Title and href are required!" });
        }

        const updatedCategory = await categoryModel.findByIdAndUpdate(
            req.params.id,
            { title, href },
            { new: true, runValidators: true } 
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: "Category not found!" });
        }

        return res.status(200).json({
            message: "Category updated successfully!",
            updatedCategory
        });

    } catch (error) {
        console.error("Error updating category:", error);
        return res.status(500).json({ message: "Server error!", error: error.message });
    }
};