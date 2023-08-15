const Category = require('../models/category');
const { Therapist } = require('../models/therapist');


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

// Get a single category by ID
const getCategoryById = async (req, res) => {
  
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Error getting category:', error);
    res.status(500).json({ error: 'An error occurred while getting the category' });
  }
};

// Update a category by ID
const updateCategory = async (req, res) => {
  
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
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

// Delete a category by ID
const deleteCategory = async (req, res) => {
  
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    
    if (!deletedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'An error occurred while deleting the category' });
  }
};

// Update extendsession of a category by ID
 const updateExtendsession = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const { extendsession } = req.body;

    // Find the existing category
    const existingCategory = await Category.findById(categoryId);

    if (!existingCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if extendsession is equal to timeBetweenSessions
    if (extendsession >= existingCategory.timeBetweenSessions) {
      return res.status(400).json({ message: 'sorry not extended' });
    }

    // Update the extendsession field
    existingCategory.extendsession = extendsession;

    // Save the updated category
    const updatedCategory = await existingCategory.save();

    
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  updateExtendsession
};
