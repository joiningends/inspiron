const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
    hostId: {
         type: Number, 
         required: false,
         },
        
  assessment_name: {
    type: String,
    required: false,
  },
  summary: { 
    type: String,
     required: false,
    },
    slug: {
      type: String,
      required: false,
      
    },
  type: {
     type: Number,
      default: 0 
    },
    image: {
      type: String,
    },
  
 
    assessmentScore: { 
    type: Number,
     default: 0
     },
  
  published: {
     type: Number, 
     required: false, 
    },
  createdAt: { 
    type: Date,
    default: Date.now,
    },
  updatedAt: {
     type: Date, 
     default: Date.now, 
    },
  publishedAt: {
     type: Date,
     default: Date.now,
    },
  startsAt: {
     type: Object, 
     required: false,
    },
  endsAt: { 
    type: Object,
     
     required: false,
    },
  content: { 
    type: String, 
    required:false
},
  questions: [
    {
      question: {
        type: String,
        required: false,
      },
      options: [
        {
          text: {
            type: String,
            required: false,
          },
          points: {
            type: Number,
            required: false,
          },
        },
      ],
    },
  ],
  low: {
    type: {
      min: Number,
      max: Number,
      expertise:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expertise',
      }],
      serverityname: [String],
      result:String,
      description:String
    },
    required: false,
  },
  medium: {
    type: {
      min: Number,
      max: Number,
      expertise:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expertise',
      }],
      serverityname: [String],
      result:String,
      description:String
    },
    required: false,
  },
  high: {
    type: {
      min: Number,
      max: Number,
      expertise:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expertise',
      }],
      serverityname: [String],
      result:String,
      description:String
    },
    required: false,
  },
});
const Assessment = mongoose.model('Assessment', assessmentSchema);

module.exports = Assessment;