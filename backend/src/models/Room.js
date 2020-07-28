const mongoose = require("mongoose");


const RoomSchema = new mongoose.Schema({
    className:{
        type:String,
        required:true
    },
    students:[{
       student: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
        }
    }],
    teacher:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",

    },
    date:{
        type:Date,
        default:Date.now
    },
    resources:{
        type:{
            teacher_id: mongoose.Schema.Types.ObjectId,
            resources: [String]
        }
    },
    submissions:{
        type:[
                {
                    student_id: mongoose.Schema.Types.ObjectId,
                    submissions: [String]
                }
            ]
      },    
});

module.exports = mongoose.model("Room",RoomSchema);