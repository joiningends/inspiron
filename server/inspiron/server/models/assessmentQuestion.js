const mongoose = require('mongoose');

const assessmentQuestionSchema = new mongoose.Schema({
    assessmentid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assessment',
        required: true,
    },
   
    
  type: {
     type: String,
      required: true,
     },
  active: {
    type: Number,
    required: true, 
    },
  level: {
     type: Number, 
     default: 0 
    },
  score: { 
    type: Number, 
    default: 0
 },
  createdAt: { 
    type: Date, 
    default: Date.now,
},
  updatedAt: { 
    type: Date, 
    default: Date.now,
 },
  content: { 
    type: String,
    required: true,
}
});

const AssessmentQuestion = mongoose.model('AssessmentQuestion', assessmentQuestionSchema);


