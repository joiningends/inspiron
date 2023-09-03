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
  startTime:{
    type: String,

  },
  endTime:{
    type: String,
  },
  
  
  sessionMode: {
    type: String,
    enum: ['Online', 'Offline', 'Both'],
    default: 'Online',
  },
  paymentMethod:{
    type: String,
  },
  price:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Price",
    },
    session:{
      type: Number,
      
    },
    sessionPrice: {
      type: Number,
      
    },
    discountPrice: {
      type: Number,
    },
    
    priceHistory: [
      
    ],
    status:{
      type:String,
      default: 'pending'},


      sessionnotes:{
        Summary :{
          type: String,
        },
        Growthcurvepoints:{
          type: String,
        },
TherapeuticTechniquesused:{
type: String,
},
Homeworkgiven:{
type: String,
},
Nextsessionplan:{
type: String,
},
sharedWithPatient:{
type:Boolean,
default:false
},
sharedWithPsychiatrist:{
type:Boolean,
default:false
},
generateReport:{
type:Boolean,
default:false
},
      },
      sessionstatus:{
        type:String,
        default: 'Pending'
      }

    });
    
  
 


exports.Appointment = mongoose.model('Appointment', appointmentSchema);
