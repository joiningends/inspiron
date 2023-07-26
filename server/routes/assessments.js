const express = require('express');
const router = express.Router();
const multer = require('multer');
const assessmentController = require('../controller/assessmentController');

  

router.get('/', assessmentController.getAllAssessments);

// GET a single assessment by ID
router.get('/:id', assessmentController.getAssessmentById);
// POST create a new assessment
router.post('/',  assessmentController.createAssessment);
router.put('/:id',  assessmentController.updateAssessment);

// DELETE delete an assessment
router.delete('/:id', assessmentController.deleteAssessment);

module.exports = router;
