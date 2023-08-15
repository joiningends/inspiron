const express = require('express');
const router = express.Router();
const multer = require('multer');

// Import the controller functions
const  clientController  = require('../controller/clientController');

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
    router.get('/', clientController.getAllClients);

    router.get('/:id', clientController.getClientById);

router.post('/', upload.single('image'), clientController.generateURL);
router.put('/:id', upload.single('image'), clientController.updateClient);
router.delete('/:id', clientController.deleteClientById);

// Export the router
module.exports = router;