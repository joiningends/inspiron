const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
    hostId: {
         type: Number, 
         required: true,
         },
        
  assessment_name: {
    type: String,
    required: true,
  },
  summary: { 
    type: String,
     required: true,
    },
    slug: {
      type: String,
      required: false,
      
    },
  type: {
     type: Number,
      default: 0 
    },
  score: { 
    type: Number,
     default: 0
     },
  published: {
     type: Number, 
     required: true, 
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
     required: true,
    },
  endsAt: { 
    type: Object,
     
     required: true,
    },
  content: { 
    type: String, 
    required:true 
},
  questions: [
    {
      question: {
        type: String,
        required: true,
      },
      options: [
        {
          text: {
            type: String,
            required: true,
          },
          points: {
            type: Number,
            required: true,
          },
        },
      ],
    },
  ],



 
});


const Assessment = mongoose.model('Assessment', assessmentSchema);

module.exports = Assessment;
