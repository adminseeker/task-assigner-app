const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    isTeacher:{
        type:Boolean,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }  
});

module.exports = mongoose.model("User",UserSchema);