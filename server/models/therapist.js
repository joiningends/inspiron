const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const therapistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  dob: {
    type: Date,
    require: false,
  },
  age: {
    type: Number,
    require: false,
  },
  expriencelevel: {
    type: Number,
  },

  gender: {
    type: String,
    require: false,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  
  password: {
    type: String,
    
},

  mobile: {
    type: String,
    required: true,
  },
  emergencymobile: {
    type: String,
    required: false,
  },
  currentaddress: {
    type: String,
    required: false,
  },
  permanentaddress: {
    type: String,
    required: false,
  },

  designation: {
    type: String,
    required: false,
  },
  expertise: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expertise",
    },
  ],
  modeOfSession: {
    type: [String],
    required: false,
  },

  languages: {
    type: [String],
    required: false,
  },
  sessionPrice: {
    type: Number,
    required: false,
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
    required: false,
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
  availability: [
    {
      location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
      day: {
        type: [String],
        required: false,
      },
    },
  ],
  education: [
    {
      collegeName: String,
      educationLevel: String,
      field: String,
      duration: Number,
    },
  ],
  password: {
    type: String,
  },
  meetLink: {
    type: String,
  },
  sessions: {
    date: { type: Date },
    timeSlots: [
      {
        startTime: { type: String },
        endTime: { type: String },
        sessionType: {
          type: String,
        },
        location: { type: String },
      },
    ],
    
  },
});


exports.Therapist = mongoose.model("Therapist", therapistSchema);