const mongoose = require('mongoose');

const takeSchema = new mongoose.Schema({
    takeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Take',
        required: true,
    },
	assessmentQuestionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AssessmentQuestionS',
        required: true,
    },
	assessmentAnswerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AssessmentAnswer',
        required: true,
    },
	status: {
       type:Number,
       required:true
    },
  active: { 
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
  content:{ 
    type: Date, 
    
     default: Date.now, 
  }

});

exports.Take = mongoose.model('Take', takeSchema);
