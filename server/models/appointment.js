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
    enum: ['Online', 'Offline'],
    default: 'Online',
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
    level:{
      type:String,
    },
    
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
      },
      meetlink:{
        type: String,
      },
      paymentstatus:{
        type:String,
        default: 'Pending'
      },
      message:{
        type: String, 
      },
      
      paymentrecived:{
        type:Boolean,
default:false
      },
      extensionprice: {
        type: Number,
        default: 0
        
      },
      firstsession:{
        type:String,
        default: 'Pending' 
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      reminded: {
        type: Boolean,
        default: false,
      },

    });
    
  
    
    


exports.Appointment = mongoose.model('Appointment', appointmentSchema);
