const mongoose = require('mongoose');

const coinSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    expriencelevel:[
        {
          type:String
        },
      ], 
      
  coinBalance: {
    type: Number,
    default: 0,
  },
  groupid: {
    type: String,
  },
 avarage:{
    type: Number,
 },
 

});

module.exports = mongoose.model('Coin', coinSchema);
