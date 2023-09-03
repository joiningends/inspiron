const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
 
    name: {
        type: String,
        
    },
    
    age:{
type:Number,

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
        unique: true
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
    profile :{
        type: String,
        
    },
    assessmentScore: {
    
        type: Number,

     
    },
    therapist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Therapist'
        
      },
      socioeconomic:{
        type: mongoose.Schema.Types.Mixed
    },
    chief: [
      {
        type: mongoose.Schema.Types.Mixed
      }
    ],
      
      illness: [
        {
          type: mongoose.Schema.Types.Mixed
        }
      ],
      casesummery:{
        type:String
      },
      
      Sessionnumber:{
        type: Number, 
      },
      
        date: {
          type: Date,
          default: Date.now,
        },
        time: {
          type: String,
         
          default: () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
       
        
    
     credits: {
        type: Number,
        default: 0
     },

      groupid: {
        type:String,
        
      },
      empid:{
        type:String,
        
      },
      types:{
        type:String
      },
      resetPasswordToken :{
        type:String
      },
      resetPasswordExpires:{
        type: Date,
      },
      firstsession:{
        type:String
      }
      
});




exports.User = mongoose.model('User', userSchema);
