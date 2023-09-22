const express = require('express');
const router = express.Router();
const doseController = require('../controller/dosesController');

// Create a new dose
router.post('/', doseController.createDose);

// Get all doses
router.get('/', doseController.getAllDoses);

// Get a specific dose by ID
router.get('/:id', doseController.getDoseById);

// Update a specific dose by ID
router.put('/:id', doseController.updateDose);

// Delete a specific dose by ID
router.delete('/:id', doseController.deleteDose);

module.exports = router;
