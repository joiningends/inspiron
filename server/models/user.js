const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },

  age: {
    type: Number,
  },
  mobile: {
    type: Number,
  },
  gender: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },

  passwordHash: {
    type: String,
  },

  host: {
    type: Number,
  },

  registeredAt: {
    type: Date,
    default: Date.now,
  },
  lastlogin: {
    type: Date,
    default: Date.now,
  },
  intro: {
    type: String,
  },
  profile: {
    type: String,
  },
  assessmentScore: {
    type: Number,
  },
  therapist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Therapist",
  },
  socioeconomic: {
    type: mongoose.Schema.Types.Mixed,
  },
  chief: [
    {
      type: mongoose.Schema.Types.Mixed,
    },
  ],

  illness: [
    {
      type: mongoose.Schema.Types.Mixed,
    },
  ],
  casesummery: {
    type: String,
  },

  Sessionnumber: {
    type: Number,
  },

  date: {
    type: Date,
    default: Date.now,
  },
  time: {
    type: String,

    default: () =>
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  },

  credits: {
    type: Number,
    default: 0,
  },

  groupid: {
    type: String,
  },
  empid: {
    type: String,
  },
  types: {
    type: String,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  firstsession: {
    type: String,
    default: "pending",
  },
  desises: {
    type: String,
  },
  mediceneyoutake: {
    type: String,
  },
  priceHistory: [],
  isVerified: {
    type: Boolean,
  },
  verificationToken: {
    type: String,
  },
  israting: {
    type: Boolean,
    default: false,
  },
  lasttherapist: {
    type: mongoose.Schema.Types.ObjectId,
  },
  lasttherapistname: {
    type: String,
  },
});

userSchema.pre("save", async function (next) {
  const user = this;

  // Check if the email is already used by a therapist
  const therapistWithSameEmail = await mongoose.models.Therapist.findOne({
    email: user.email,
  });

  if (therapistWithSameEmail) {
    const error = new Error("Email must be unique across therapists and users");
    return next(error);
  }

  // Continue with the save operation
  next();
});

exports.User = mongoose.model("User", userSchema);
