const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  details:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  registerNumber:{
      type:String
  },
  submissions:{
    type:[String]
  }  
});

module.exports = mongoose.model("Student",StudentSchema);