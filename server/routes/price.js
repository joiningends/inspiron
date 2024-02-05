const express = require('express');
const router = express.Router();
const priceController = require('../controller/priceController'); // Adjust the path to your controller

// Create a new price entry
router.post('/', priceController.createPrice);

// Get all price entries
router.get('/', priceController.getAllPrices);

// Get price information by experience level
router.get('/:experienceLevelId', priceController.getPriceByExperienceLevel);
router.put('/:priceId', priceController.updatePrice);

// Delete a price entry
router.delete('/:priceId', priceController.deletePrice);
module.exports = router;
