const mongoose = require('mongoose');

// Define the Payment schema
const paymentSchema = new mongoose.Schema({
  
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    
    ref: 'Appointment', // Reference to the Appointment model
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
  },
  paymentStatus: {
    type: String,
    
  },
  razorpayOrderId: {
    type: String,
    
  },
  razorpayPaymentId: {
    type: String,
    
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
