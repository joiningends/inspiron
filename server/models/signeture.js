const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const signatureSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String, // Assuming you'll store the image as a URL or file path
        required: true
    }
});

const Signature = mongoose.model('Signature', signatureSchema);

module.exports = Signature;
