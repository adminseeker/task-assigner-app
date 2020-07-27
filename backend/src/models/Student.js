const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  registerNumber:{
      type:String
  },
  submissions:{
    type:[String]
  },    
});

module.exports = mongoose.model("Student",StudentSchema);