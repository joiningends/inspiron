const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    middlename: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    mobile: {
        type: Number,
        required: true,

    },
    email: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    
    host: {
        type: Number,
        required: true,
      },
    
    registeredAt: {
        type: Date,
        default: Date.now,
    },
    lastlogin: {
        type: Date,
        default: Date.now,
    },
    intro: {
        type: String,
        require: true
    },
    profile :{
        type: String,
        required: true,
    }
    

});



exports.User = mongoose.model('User', userSchema);
