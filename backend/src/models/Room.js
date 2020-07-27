const mongoose = require("mongoose");


const RoomSchema = new mongoose.Schema({
    className:{
        type:String,
        required:true
    },
    students:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    teacher:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        unique:false
    },
    date:{
        type:Date,
        default:Date.now
    } 
});

module.exports = mongoose.model("Room",RoomSchema);