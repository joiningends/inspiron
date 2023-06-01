const mongoose = require('mongoose');

const assessmentmetaSchema = new mongoose.Schema({
    assessmentid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assessment',
        required: true,
    },
   key: {
    type: String, 
    required: true,
      
   },
  
  content: { 
    type: String, 
    required: true,
      
}
});

exports.Assessmentmeta = mongoose.model('Assessmentmeta', assessmentmetaSchema);
