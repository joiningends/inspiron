const express = require('express');
const router = express.Router();
const multer = require('multer');
const assessmentController = require('../controller/assessmentController');

const storage = multer.memoryStorage();
const upload = multer({ storage });


router.get('/', assessmentController.getAllAssessments);

// GET a single assessment by ID
router.get('/:id', assessmentController.getAssessmentById);
// POST create a new assessment
router.post('/', upload.single('image'), assessmentController.createAssessment);

router.put('/:id',  upload.single('image'),  assessmentController.updateAssessment);

// DELETE delete an assessment
router.delete('/:id', assessmentController.deleteAssessment);

module.exports = router;
