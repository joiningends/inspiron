const express = require('express');
const router = express.Router();
const onsetController = require('../controller/onsetController');

// POST request to create a new onset
router.post('/', onsetController.createOnset);

// GET request to retrieve all onsets

// GET request to retrieve a specific onset by ID
router.get('/:id', onsetController.getOnsetById);
router.get('/', onsetController.getAllOnsets);

// PUT request to update an existing onset
router.put('/:id', onsetController.updateOnset);

// DELETE request to delete an onset
router.delete('/:id', onsetController.deleteOnset);

module.exports = router;
