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


    router.get('/total-therapists', therapistController.getTotalTherapists);


 router.get('/:id/details', therapistController.getTherapistDetails);


router.get('/all', therapistController.getAllTherapists);
router.get('/group/:groupid', therapistController.getAllTherapistscorporate);

router.get('/score/:assessmentId/:assessmentScore', therapistController.getTherapists);
router.get('/score/:assessmentId/:groupid/:assessmentScore', therapistController.getTherapistscorporate);
router.get('/:id', therapistController.getTherapistById);

router.post('/', therapistController.createTherapist);
router.post('/reset-password', therapistController.resetPassword);
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
router.put('/:id/about', therapistController.updateAbout);
router.put('/:id/education/:educationId',therapistController.updateEducation);
router.put('/:id/image', upload.single('image'), therapistController.updateTherapistImage );
router.put('/:id/sign', upload.single('image'), therapistController.updateTherapistsign );
router.put('/:id/Availability', therapistController.updateAvailability);
router.delete('/:id', therapistController.deleteTherapist);
router.delete('/', therapistController.deleteAllTherapists);

//router.put('/:id/locations', therapistController.updateTherapistLocation);
//router.post('/:id/paitents', therapistController.createPatient);
router.get('/:id/status', therapistController.approveTherapist);
router.put('/:therapistId/:userId/update-rating', therapistController.userRating);
router.put('/:id/adminrating', therapistController.userRatingadmin);
module.exports = router;  