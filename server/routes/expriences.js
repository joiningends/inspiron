// routes/experienceLevelRoutes.js
const express = require('express');
const router = express.Router();
const experienceLevelController = require('../controller/exprienceController');

// Create a new ExperienceLevel
router.post('/', experienceLevelController.createExperienceLevel);

// Get all ExperienceLevels
router.get('/', experienceLevelController.getExperienceLevels);

// Get a specific ExperienceLevel by ID
router.get('/:id', experienceLevelController.getExperienceLevelById);

// Update an existing ExperienceLevel
router.put('/:id', experienceLevelController.updateExperienceLevel);

// Delete an ExperienceLevel
router.delete('/:id', experienceLevelController.deleteExperienceLevel);

module.exports = router;
