const mongoose = require('mongoose');

const assessmentAnswerSchema = new mongoose.Schema({
    assessmentid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assessment',
        required: true,
    },
   assessmentQuestionid:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AssessmentQuestion',
    required: true,
   },
    
 
  active: {
    type: Number,
    required: true, 
    },
  
  correct: { 
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

const AssessmentAnswer = mongoose.model('AssessmentAnswer', assessmentAnswerSchema);

