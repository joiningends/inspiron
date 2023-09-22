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
router.get('/therapists/:therapistId/name', appointmentController.getUniqueUserNamesForTherapist);
router.get('/users/:userId/upcoming-appointments', appointmentController.getUpcomingAppointmentsByTherapistForUser);
router.put('/:id/update-session-notes', appointmentController.updateUserSessionNotesemail);
router.get('/users/:userId/payment',  appointmentController.payment);
router.get('/users/:userId/paymentpending',  appointmentController.paymentpending);
router.get('/:id/payment', appointmentController.getAppointmentByIdoffline);
router.put('/:appointmentId/paymentrecived', appointmentController.updatePaymentStatus);
router.get('/:id/sucess', appointmentController.setPaymentStatusToSuccess);
router.get('/:appointmentId/updatepaymentstatus', appointmentController.updatePaymentStatusextend);

module.exports = router;
