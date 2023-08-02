const express = require('express');
const router = express.Router();
const illnessController = require('../controller/illnessesController');

// Create a new illness
router.post('/', illnessController.createIllness);

// Get all illnesses
router.get('/', illnessController.getAllIllnesses);

// Get a specific illness by ID
router.get('/:id', illnessController.getIllnessById);

// Update a specific illness by ID
router.put('/:id', illnessController.updateIllnessById);

// Delete a specific illness by ID
router.delete('/:id', illnessController.deleteIllnessById);


module.exports = router;
