const express = require('express');
const router = express.Router();
const appointmentController = require('../controller/appointmentController');

// POST /appointments
router.post('/', appointmentController.createAppointment);
router.get('/therapists/:therapistId', appointmentController.getAppointmentsByTherapist);
router.get('/therapists/:therapistId/upcoming', appointmentController.getUpcomingAppointmentsByTherapist);
router.get('/therapists/:therapistId/all', appointmentController.getAllAppointmentsByTherapist);
router.get('/therapists/:therapistId/today', appointmentController.getTodayAppointmentsByTherapist);

// PUT /appointments/:appointmentId
router.put('/:appointmentId', appointmentController.updateAppointment);

// DELETE /appointments/:appointmentId
router.delete('/:appointmentId', appointmentController.deleteAppointment);

module.exports = router;
