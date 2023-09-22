const mongoose = require('mongoose');


const ePrescriptionSchema = new mongoose.Schema({
    therapistname:{
        type: String,

    },
    username:{
        type: String,
    },
    age:{
        type: Number, 
    },
    gender:{
        type: String,
    },
    mobile:{
        type: Number,
    },
  diagnosis: {
    type: String,
  },
  description: {
    type: String,
  },
  medicene:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medicene',
    
  }],
  dose: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dose',
   
  },
  frequency:{
type:String
  },
  instruction:{
    type:String
  },
  drugAllergies: [
    {
      name: {
        type: String,
      },
      // Add any other properties related to drug allergies here
    },
  ],
  labTests: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LabTest',
       
      // Add any other properties related to lab tests here
    },
  ],
 
});

// Create models for E-Prescription and Medication
exports.EPrescription = mongoose.model('EPrescription', ePrescriptionSchema);
