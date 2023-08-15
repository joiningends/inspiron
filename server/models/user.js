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
    },
      chief: [
        {
          onset: String,
          SelectedOptions: [
            {
              QuestionName: String,
              option: String,
              comment: String
            }
          ]
        }
      ],
      illness: [
        {
          onset: String,
          SelectedOptions: [
            {
              QuestionName: String,
              option: String,
              comment: String
            }
          ]
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
             option:[{
                type:String
             }]
        },
        status:{

          type: String,
        
        },
       
    
      coins: {
        type: Number,
        default: 1,
        required:false,
      },
      groupid: {
        type:String,
        
      },
      empid:{
        type:String,
        
      },
      types:{
        type:String
      }


});




exports.User = mongoose.model('User', userSchema);
