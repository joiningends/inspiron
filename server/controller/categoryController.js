const Category = require('../models/category');
const { Therapist } = require('../models/therapist');


const createCategory = async (req, res) => {
  try {
    const { centerName, centerAddress, contactNo, city, pin } = req.body;

    const category = new Category({
      centerName,
      centerAddress,
      contactNo,
      city,
      pin
      // Don't include extendsession field in the category object
    });

    const newCategory = await category.save();

    // Exclude the extendsession field from the response
    const { extendsession, ...categoryWithoutExtendsession } = newCategory.toObject();

    res.status(201).json({ success: true, category: categoryWithoutExtendsession });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



const createsession= async (req, res) => {
  try {
    const { sessionDuration, timeBetweenSessions, extendsession} = req.body;

    const category = new Category({
      
      
      sessionDuration,
      timeBetweenSessions,
      extendsession,
      
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

const getCategoriesWithCenterName = async (req, res) => {
  
    try {
      const categoriesWithCenterInfo = await Category.find({
        centerName: { $exists: true, $ne: '' },
        centerAddress: { $exists: true, $ne: '' },
        contactNo: { $exists: true, $ne: '' }
      });
  
      if (categoriesWithCenterInfo.length > 0) {
        return res.json({ categories: categoriesWithCenterInfo });
      } else {
        return res.json({ message: 'No categories with center information found' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to retrieve categories with center information' });
    }
  };
  
  
const getCategoriesWithSessionDuration = async (req, res) => {
  try {
    const categoriesWithSessionDuration = await Category.find({ sessionDuration: { $exists: true } });

    if (categoriesWithSessionDuration.length > 0) {
      return res.json({ categories: categoriesWithSessionDuration });
    } else {
      return res.json({ message: 'No categories with sessionDuration field found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to retrieve categories' });
  }
};


// Controller function to update session fields
const updateSessionFields = async (req, res) => {
  const { categoryId } = req.params; // Get the categoryId from the URL params
  const { sessionDuration, timeBetweenSessions} = req.body; // Get the updated session fields from the request body

  try {
    // Find the Category document by its ID
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).send('Category not found');
    }

    // Update the session fields if new values are provided
    if (sessionDuration !== undefined) {
      category.sessionDuration = sessionDuration;
    }
    if (timeBetweenSessions !== undefined) {
      category.timeBetweenSessions = timeBetweenSessions;
    }
   

    // Save the updated document
    await category.save();

    res.status(200).send('Category updated successfully');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal server error.');
  }
};




module.exports = {
  createCategory,
  createsession,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoriesWithCenterName,
  getCategoriesWithSessionDuration,
  updateSessionFields
  
};
