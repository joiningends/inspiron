const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    fileName: String,
    filePath: String,
    fileType: String,
  });
  
  const File = mongoose.model('File', fileSchema);
  