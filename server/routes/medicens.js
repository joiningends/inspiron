const express = require('express');
const router = express.Router();
const multer = require('multer');

const bodyParser = require("body-parser");
const mediceneController = require('../controller/mediceneController');


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
router.post('/', upload.single('file'), mediceneController.createMedicene);
router.get('/', mediceneController.getAllMedicenes);
router.get('/:id', mediceneController.getMediceneById);
router.put('/:id', mediceneController.updateMediceneById);
router.delete('/:id', mediceneController.deleteMediceneById);

module.exports = router;