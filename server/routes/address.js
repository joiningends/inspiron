const express = require('express');
const router = express.Router();
const addressController = require('../controller/addressController');
const multer = require('multer');

const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
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

// POST /api/address - Create a new address
router.post('/create', addressController.createAddress);
router.post('/bank', addressController.createBankDetails);
router.post('/gst', addressController.createGST);

// POST /api/address/sign - Upload signature image
router.post('/sign', upload.single('image'), addressController.createSignature);

module.exports = router;
