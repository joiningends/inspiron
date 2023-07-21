const express = require('express');
const router = express.Router();
const multer = require('multer');
const therapistController = require('../controller/therapistController');
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

 router.get('/:id/details', therapistController.getTherapistDetails);


router.get('/all', therapistController.getAllTherapists);
router.get('/score', therapistController.getTherapists);
router.get('/:id', therapistController.getTherapistById);

router.post('/', therapistController.createTherapist);
router.post('/full', therapistController.createTherapistfull);

// Define the route for therapist password creation
//router.post('/password', therapistController.createTherapistPassword);
//router.get('/password/:token',therapistController.handlePasswordReset);
router.get('/:id/meetlink', therapistController.getTherapistmeetlink);

router.put('/:id', therapistController.updateTherapist);
router.put('/:id/approve', therapistController.updateTherapists);
router.put('/:id/primaryDetails', therapistController.updatePrimaryDetails);
router.put('/:id/ContactDetails', therapistController.updateContactDetails);
router.put('/:id/address', therapistController. updateAddresses);
router.put('/:id/education/:educationId',therapistController.updateEducation);
router.put('/:id/image', upload.single('image'), therapistController.updateTherapistImage );
router.put('/:id/Availability', therapistController.updateAvailability);
router.delete('/:id', therapistController.deleteTherapist);
//router.put('/:id/locations', therapistController.updateTherapistLocation);
//router.post('/:id/paitents', therapistController.createPatient);
module.exports = router;