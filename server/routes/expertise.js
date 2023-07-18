// expertiseRoutes.js

const express = require('express');
const router = express.Router();
const expertiseController = require('../controller/expertiseController');

// Create a new expertise
router.post('/', expertiseController.createExpertise);

// Get all expertise
router.get('/', expertiseController.getAllExpertise);

// Get expertise by ID
router.get('/:id', expertiseController.getExpertiseById);

// Update expertise by ID
router.put('/:id', expertiseController.updateExpertiseById);

// Delete expertise by ID
router.delete('/:id', expertiseController.deleteExpertiseById);

module.exports = router;
