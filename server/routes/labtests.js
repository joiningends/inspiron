const express = require('express');
const router = express.Router();
const multer = require('multer');
const labTestController = require('../controller/labtestController');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads'); // Specify the destination folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  },
});

const upload = multer({ storage: storage });

// Define a POST route for uploading Excel files and creating Lab Tests
router.post('/', upload.single('file'), labTestController.createlabtest);
router.get('/', labTestController.getAllLabTests);
router.get('/:id', labTestController.getLabTestById);
router.put('/:id', labTestController.updateLabTestById);
router.delete('/:id', labTestController.deleteLabTestById);

module.exports = router;