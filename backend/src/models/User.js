const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
    phone:{
        type:Number,
        require:true
    },
    isTeacher:{
        type:Boolean,
        required:true
    },
    teacher:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Teacher"
    },
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Student"
    },
    tokens:[{
        token:{
            type:String,
            required:true
        },
        _id:false
    }],
    date:{
        type:Date,
        default:Date.now
    }  
});

// UserSchema.pre("save",async function(next){
//     const user = this;
//     if(user.isModified("password")){
//         const salt = await bcrypt.genSalt(10);
//         user.password = await bcrypt.hash(user.password,salt);
//     }
//     next();
// });


module.exports = mongoose.model("User",UserSchema);