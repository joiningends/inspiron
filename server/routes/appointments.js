const express = require('express');
const router = express.Router();
const appointmentController = require('../controller/appointmentController');

// POST /appointments
router.post('/', appointmentController.createAppointment);
router.post('/therapist', appointmentController.createAppointmentbytherapist);
router.get('/:id', appointmentController.getAppointmentById);
router.get('/therapists/:therapistId', appointmentController.getAppointmentsByTherapist);
router.get('/therapists/:therapistId/upcoming', appointmentController.getUpcomingAppointmentsByTherapist);
router.get('/therapists/:therapistId/all', appointmentController.getAllAppointmentsByTherapist);
router.get('/therapists/:therapistId/today', appointmentController.getTodayAppointmentsByTherapist);

// PUT /appointments/:appointmentId
router.put('/:appointmentId', appointmentController.updateAppointment);

// DELETE /appointments/:appointmentId
router.delete('/:appointmentId', appointmentController.deleteAppointment);
router.get('/therapists/:therapistId/ended-meetcall', appointmentController.getAppointmentsByTherapistWithEndedMeetCall);

router.get('/', appointmentController.retrieveAppointments);
router.delete('/', appointmentController.deleteAllAppointments);
router.put('/:id/price', appointmentController.updateAppointmentPrice);
router.put('/:id/payment/:therapistId', appointmentController.updateAppointmentWithPayment);


router.get('/:id/extend-session', appointmentController.extendSession);
router.put('/:id/sessionotes', appointmentController.updateUserSessionNotes);

router.get('/users/:userId',  appointmentController.getAppointmentsByUser);
router.get('/users/:userId/therapists/:therapistId/latest-appointment',  appointmentController.getAllPreviousAppointmentsForUser);
module.exports = router;
