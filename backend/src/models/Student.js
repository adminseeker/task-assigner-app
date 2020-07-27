const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  registerNumber:{
      type:String
  },
  submissions:{
    type:[String]
  },
  rooms:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Room"
}    
});

module.exports = mongoose.model("Student",StudentSchema);