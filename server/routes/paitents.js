const express = require('express');
const router = express.Router();

const patientController = require('../controller/patientController');


// Patient routes
router.post('/therapists/:id/paitents', patientController.createPatient);
//router.put('/therapists/:therapistId/paitents/:patientId/headings',patientController.updatePatient);

module.exports = router;
