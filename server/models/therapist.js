const mongoose = require('mongoose');

const therapistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  expertise: {
    type: [String],
    required: true,
  },
  modeOfSession: {
    type: [String],
    required: true,
  },
  languages: {
    type: [String],
    required: true,
  },
  sessionPrice: {
    type: Number,
    required: true,
  },
  nextAvailableDateTime: {
    type: Date,
    default: Date.now,
  },
  userRating: {
    type: Number,
    default: 0,
  },
  usersRecommended: {
    type: [String],
    required: true,
  },
  lastBooked: {
    type: Date,
    default: Date.now,
  },
  availableSessions: {
    type: Number,
    default: 0,
  },
  about: {
    type: String,
    required: true,
  },
  achievements: [
    {
      title: String,
      description: String,
    },
  ],
  userReviews: [
    {
      title: String,
      body: String,
    },
  ],
  availability: {
    type: Map,
    of: String,
    required: true,
  },
  education: [
    {
      collegeName: String,
      educationLevel: String,
    },
  ],
});

exports.Therapist = mongoose.model('Therapist', therapistSchema);
