const mongoose = require('mongoose');


const ePrescriptionSchema = new mongoose.Schema({
    therapistname:{
        type: String,

    },
    therapisteducation:{
      type: String,

  },
  therapistsign:{
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
    diagnosis: String,
    description: String,
    medicineData: [
      {
        name: String,
        dosage: String,
        frequency: String,
        instructions: String
      }
    ],
    selectedLabTests: [String]
  });
  

// Create models for E-Prescription and Medication
exports.EPrescription = mongoose.model('EPrescription', ePrescriptionSchema);
