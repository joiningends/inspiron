const Category = require('../models/category');

const createCategory = async (req, res) => {
  try {
    const { centerName, centerAddress, contactNo, sessionDuration, timeBetweenSessions } = req.body;
    const category = new Category({
      centerName,
      centerAddress,
      contactNo,
      sessionDuration,
      timeBetweenSessions
    });
    const newCategory = await category.save();
    res.status(201).json({ success: true, category: newCategory });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({ error: 'An error occurred while getting the categories' });
  }
};

// Get a specific category by ID
const getCategoryById = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    console.error('Error getting category:', error);

// Create a new category
    res.status(500).json({ error: 'An error occurred while getting the category' });
  }
};

// Update a category
const updateCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { $set: req.body },
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'An error occurred while updating the category' });
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    if (!deletedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'An error occurred while deleting the category' });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};
