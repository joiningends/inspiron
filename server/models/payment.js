const mongoose = require('mongoose');

// Define the Payment schema
const paymentSchema = new mongoose.Schema({
  
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Appointment', // Reference to the Appointment model
  },
  paymentStatus: {
    type: String,
    required: true,
  },
  razorpayOrderId: {
    type: String,
    required: true,
  },
  razorpayPaymentId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    
  },
  currency: {
    type: String,
    
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


// Create a Mongoose model for Payment
const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
