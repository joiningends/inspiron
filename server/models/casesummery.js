const mongoose = require('mongoose');

const caseSummarySchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('CaseSummary', caseSummarySchema);
