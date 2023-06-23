const express = require('express');
const router = express.Router();
const Assessment = require('../models/assessmentf');
const assessmentController = require('../controller/assessmentController');

// GET all assessments
router.get('/', assessmentController.getAllAssessments);

// GET a specific assessment by ID
router.get('/:id', assessmentController.getAssessmentById);

// CREATE a new assessment
router.post('/', assessmentController.createAssessment);

// UPDATE an existing assessment
router.put('/:id', assessmentController.updateAssessment);

// DELETE an assessment
router.delete('/:id', assessmentController.deleteAssessment);

// POST /generate-report
router.post('/generate-report', assessmentController.generateReport);

// GET /assessment-report
router.get('/assessment-report', assessmentController.getAssessmentReport);

module.exports = router;
