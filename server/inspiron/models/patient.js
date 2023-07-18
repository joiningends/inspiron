const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  sex: {
    type: String,
    enum: ['Male', 'Female', 'Transgender', 'Prefer not to say'],
    required: true
  },
  pronouns: {
    type: String,
    enum: ['He/Him', 'She/Her', 'They/Them', 'No pronouns'],
    required: true
  },
  height: {
    type: Number
  },
  weight: {
    type: Number
  },
  fullAddress: {
    type: String
  },
  contactDetails: {
    type: String
  },
  emergencyContactName: {
    type: String
  },
  emergencyContactNumber: {
    type: String
  },
  education: {
    comments: {
      type: String
    },
    tenth: {
      type: String
    },
    twelfth: {
      type: String
    },
    graduation: {
      type: String
    },
    postGraduation: {
      type: String
    }
  },
  occupation: {
    type: String
  },
  socioeconomicStatus: {
    type: String,
    enum: ['Lower', 'Middle', 'Upper']
  },
  informant: {
    name: {
      type: String
    },
    relationshipWithPatient: {
      type: String,
      enum: ['First circle - Parents, relative, cousin', 'Second circle - Friends, colleague']
    },
    durationOfStayWithPatient: {
      type: String
    }
  },
  information: {
    type: String,
    enum: ['Reliable', 'Adequate', 'Questionable']
  },
  religionEthnicity: {
    type: String
  },
  dateOfBirth: {
    type: Date
  },
  languagesKnown: {
    type: [String],
    enum: ['English', 'Hindi', 'Telugu', 'Marathi', 'Kannada', 'Tamil'],
    default: []
  },
  otherLanguage: {
    type: String
  },
  foreignLanguage: {
    type: String
  },
  maritalStatus: {
    type: String,
    enum: ['Married', 'Unmarried', 'Single', 'In a relationship']
  },
  courtshipDuration: {
    type: Number
  },
  reference: {
    type: String,
    enum: ['Doctor', 'Family & friend']
  },
  cognitiveFunctions:{
    type: mongoose.Schema.Types.ObjectId,
  ref: 'Heading',
  required: true,
  },
  description: {
    type:String,
    required:true,
  }
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
