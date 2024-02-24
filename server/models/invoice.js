const mongoose = require('mongoose');

// Define Invoice Schema
const invoiceSchema = new mongoose.Schema({
    invoiceCount: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
       
    }
});

// Create Invoice Model
const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
