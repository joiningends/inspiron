const mongoose = require('mongoose');

const takeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
	assessmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assessment',
        required: true,
    },
	
	status: {
       type:Number,
       required:true
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
     type: Date, 
     default: Date.now,
    },
  finishedAt: { 
    type: Date,
     default: Date.now,
    },
  content: { 
    type: Date, 
    
     default: Date.now, 
}
});

exports.Take = mongoose.model('Take', takeSchema);
