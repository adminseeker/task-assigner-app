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
    resources: [{
        resource :{
            type: String
        },
        description:{
            type:String
        },
        createdAt:{
            type:Date,
            default:Date.now
        },
        _id:false
    }],
    submissions:[
                {
                    student_id: mongoose.Schema.Types.ObjectId,
                    submission:{
                        type:String
                    },
                    description:{
                        type:String
                    },
                    createdAt:{
                        type:Date,
                        default:Date.now
                    },
                    _id:false
                }
            ],
            
    materials: [{
        material :{
            type: String
        },
        description:{
            type:String
        },
        createdAt:{
            type:Date,
            default:Date.now
        },
        _id:false
    }]
});

module.exports = mongoose.model("Room",RoomSchema);