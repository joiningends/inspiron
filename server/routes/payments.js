const express = require('express');
const router = express.Router();
const PaymentController = require('../controller/paymentController');


router.post('/orders', PaymentController.createOrder);
router.post('/verify/:appointmentId', PaymentController.verifyPayment);
router.post('/verify', PaymentController.verifyPaymentoverall);

module.exports = router;
