const express = require('express');
const router = express.Router();
const caseSummaryController = require('../controller/casesummeryController');

// Create a new case summary
router.post('/', caseSummaryController.createCaseSummary);

// Get all case summaries
router.get('/', caseSummaryController.getAllCaseSummaries);

// Get a specific case summary by ID
router.get('/:id', caseSummaryController.getCaseSummaryById);

// Update a specific case summary by ID
router.put('/:id', caseSummaryController.updateCaseSummaryById);

// Delete a specific case summary by ID
router.delete('/:id', caseSummaryController.deleteCaseSummaryById);

module.exports = router;
