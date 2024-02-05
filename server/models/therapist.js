const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const therapistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  therapisttype:{
    type:String,
  },
  image: {
    type: String,
  },
  sign:{
    type: String,
  },
  dob: {
    type: Date,
    require: false,
  },
  age: {
    type: Number,
  },
  expriencelevel:
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Price",
      },
    
  level:{
type:String
  },
  sessionPrice:{
    type:Number
  },
  discountPrice:{
    type:Number
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

  passwordHash : {
    type: String,
  },

  mobile: {
    type: String,
    required: true,
    unique: true,
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
  userReviews: 
    {
     type: Number,
    },
 
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
    type: mongoose.Schema.Types.Mixed
  },
  group: [
    {
      
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client' // Reference to the "Client" model
      },
      
   
      
  ],
  groupDetails: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client'
      },
      groupid: String, // Store the name of the group
    }
  ],
  status:{
    type:String,
    default: 'Pending'
  },
  ratings: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the "User" model
        
      },
      rating: {
        type: Number,
        
      },
    },
  ],
  resetPasswordToken :{
    type:String
  },
  resetPasswordExpires:{
    type: Date,
  },
});

therapistSchema.pre("save", async function (next) {
  const therapist = this;

  // Check if the email is already used by a user
  const userWithSameEmail = await mongoose.models.User.findOne({
    email: therapist.email,
  });

  if (userWithSameEmail) {
    const error = new Error("Email must be unique across therapists and users");
    return next(error);
  }

  // Continue with the save operation
  next();
});

exports.Therapist = mongoose.model("Therapist", therapistSchema);


