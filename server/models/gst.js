const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gstSchema = new Schema({
    rate: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }
});

const GST = mongoose.model('GST', gstSchema);

module.exports = GST;
