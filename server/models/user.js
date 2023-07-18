const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    
    age:{
type:Number,
required:true,
    },
    mobile: {
        type: Number,
        required: true,

    },
    gender: {
        type: String,
        required: false,
      },
    email: {
        type: String,
        required: true,
        unique: true
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
    },
    assessmentScore: {
    
        type: Number,
        required: true,
     
    },
    coins: {
        type: Number,
        default: 0,
        required:false,
      }

});



exports.User = mongoose.model('User', userSchema);
