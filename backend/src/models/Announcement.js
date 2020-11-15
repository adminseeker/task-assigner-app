const mongoose = require("mongoose");

const AnnouncementSchema = new mongoose.Schema({
    teacher_id:{
        type:mongoose.Schema.Types.ObjectId,
        require:true
    },
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }  
});

module.exports = mongoose.model("Announcement",AnnouncementSchema);