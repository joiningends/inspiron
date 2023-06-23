const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  therapist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Therapist',
    required: true,
  },
  user: {
    name: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      required: false,
    },
    age: {
      type: Number,
      required:false,
    },
  },
  dateTime: {
    type: Date,
    required: false,
  },
  session: {
    mode: {
      type: String,
      required: false,
    },
    duration: {
      type: Number,
      required: false,
    },
  },
});

exports.Appointment = mongoose.model('Appointment', appointmentSchema);
