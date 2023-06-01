const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
    hostId: {
         type: Number, 
         required: true,
         },

  title: {
     type: String, 
     required: true, 
    },

  metaTitle: { 
    type: String, 
    required: true,
 },
  slug: { 
    type: String,
     required: true,
     },
  summary: { 
    type: String,
     required: true,
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
}
});

exports.Assessment = mongoose.model('Assessment', assessmentSchema);
