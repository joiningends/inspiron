const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const bankDetailsSchema = new Schema({
    accountname:{
        type: String,
        required: true
    },
    bankName: {
        type: String,
        required: true
    },
    accountNumber: {
        type: String,
        required: true
    },
    IFSC: {
        type: String,
        required: true
    },
    accounttype:{
        type: String,
        required: true
    }
});

const BankDetails = mongoose.model('BankDetails', bankDetailsSchema);

module.exports = BankDetails;
