const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema({
    details:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    registerNumber:{
        type:String
    },
    resources:{
        type:[String]
    }  
});

module.exports = mongoose.model("Student",StudentSchema);