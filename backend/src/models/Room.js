const mongoose = require("mongoose");


const RoomSchema = new mongoose.Schema({
    students:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Student"
    }],
    teacher:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Teacher"
    },
    date:{
        type:Date,
        default:Date.now
    } 
});

module.exports = mongoose.model("Room",RoomSchema);