const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
    name: String,
    street: String,
    city: String,
    state: String,
    
    telephone: String,
    email: String,
    website: String,
    GSTN: String,
    SAC: String
})
const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
