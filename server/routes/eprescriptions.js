// expertiseRoutes.js

const express = require('express');
const router = express.Router();
const eprescriptioncontroller = require('../controller/eprescriptionController');

// Create a new expertise
router.post('/:therapistId/:userId', eprescriptioncontroller.createEPrescription);
router.get('/', eprescriptioncontroller.getAllEPrescriptions);

// Get an ePrescription by ID with lab details, medicine details, and dose details
router.get('/:id', eprescriptioncontroller.getEPrescriptionById);

// Update an ePrescription by ID
router.put('/:id', eprescriptioncontroller.updateEPrescription);

// Delete an ePrescription by ID
router.delete('/:id', eprescriptioncontroller.deleteEPrescription);



module.exports = router;
