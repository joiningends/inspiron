const express = require('express');
const router = express.Router();
const multer = require('multer');
const assessmentController = require('../controller/assessmentController');

const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};
const storage = multer.diskStorage({
    destination: function destination(req, file, cb) {
      const isValid = FILE_TYPE_MAP[file.mimetype];
      let uploadError = new Error('Invalid image type');
      if (isValid) {
        uploadError = null;
      }
      cb(uploadError, 'public/uploads');
    },
    filename: function (req, file, cb) {
      const fileName = file.originalname.split(' ').join('-');
      const extension = FILE_TYPE_MAP[file.mimetype];
      cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
  });
  const upload = multer({ storage });
// GET all assessments
router.get('/', assessmentController.getAllAssessments);

// GET a specific assessment by ID
router.get('/:id', assessmentController.getAssessmentById);

// CREATE a new assessment
router.post('/', upload.single('image'), assessmentController.createAssessment);

// UPDATE an existing assessment
router.put('/:id', upload.single('image'), assessmentController.updateAssessment);

// DELETE an assessment
router.delete('/:id', assessmentController.deleteAssessment);


// GET /assessment-report

module.exports = router;
