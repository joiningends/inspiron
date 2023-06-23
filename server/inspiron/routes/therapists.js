const express = require('express');
const router = express.Router();
const therapistController = require('../controller/therapistController');

router.get('/all', therapistController.getAllTherapists);
router.get('/', therapistController.getTherapists);
router.get('/:id', therapistController.getTherapistById);

router.post('/', therapistController.createTherapist);
router.post('/full', therapistController.createTherapistfull);

// Define the route for therapist password creation
//router.post('/password', therapistController.createTherapistPassword);
//router.get('/password/:token',therapistController.handlePasswordReset);
router.get('/:id/meetlink', therapistController.getTherapistmeetlink);

router.put('/:id', therapistController.updateTherapist);
router.put('/:id/primaryDetails', therapistController.updatePrimaryDetails);
router.put('/:id/ContactDetails', therapistController.updateContactDetails);
router.put('/:id/address', therapistController. updateAddresses);
router.put('/:id/education/:educationId',therapistController.updateEducation);

router.put('/:id/Availability', therapistController.updateAvailability);
router.delete('/:id', therapistController.deleteTherapist);

module.exports = router;
