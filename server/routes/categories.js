const express = require('express');
const router = express.Router();
const categoryController = require('../controller/categoryController');

// Create a new category
router.post('/', categoryController.createCategory);
router.post('/session', categoryController.createsession);
// Get all categories
router.get('/', categoryController.getAllCategories);

// Get a single category by ID
router.get('/:id', categoryController.getCategoryById);

// Update a category by ID
router.put('/:id', categoryController.updateCategory);

// Delete a category by ID
router.delete('/:id', categoryController.deleteCategory);
router.get('/center/info', categoryController.getCategoriesWithCenterName);
router.get('/session/info', categoryController.getCategoriesWithSessionDuration);


module.exports = router;
