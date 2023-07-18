const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  therapist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Therapist',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  dateTime: {
    type: Date,
    required: false,
  },
  sessionMode: {
    type: String,
    enum: ['Online', 'Offline', 'Both'],
    default: 'Online',
  },
  
  
 
});

exports.Appointment = mongoose.model('Appointment', appointmentSchema);
