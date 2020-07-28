const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema({
    registerNumber:{
        type:String
    }
});

module.exports = mongoose.model("Teacher",TeacherSchema);