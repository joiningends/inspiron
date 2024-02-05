const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: false
  },
  age: {
    type: Number,
    required: false
  },
  sex: {
    type: String,
    enum: ['Male', 'Female', 'Transgender', 'Prefer not to say'],
    required: false
  },
  pronouns: {
    type: String,
    enum: ['He/Him', 'She/Her', 'They/Them', 'No pronouns'],
    required: false
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
    
  },
  informant: {
    name: {
      type: String
    },
    relationshipWithPatient: {
      type: String,
      
    },
    durationOfStayWithPatient: {
      type: String
    }
  },
  information: {
    type: String,
    
  },
  religionEthnicity: {
    type: String
  },
  dateOfBirth: {
    type: Date
  },
  languagesKnown: {
    type: [String],
     
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
    
  },
  
  therapists: 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Therapist',
    },
  
  
  
  
onsets: {
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Onset',
  },
  heading:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Heading',
    },
     
},
  
});


const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;




