const express = require("express");
const bcrypt = require("bcryptjs");

const auth = require("../../middleware/auth");
const generateAuthToken = require("../../token/generateAuthToken");

const User = require("../../models/User");
const Teacher = require("../../models/Teacher");
const Student = require("../../models/Student");

const router = express.Router();

/* 
    route : "/api/users",
    desc : "Register as Teacher or Student",
    auth : "PUBLIC",
    method: "POST"
*/

router.post("/",async (req,res)=>{
    try {
        const user = new User(req.body);
        generateAuthToken(user.id,(token)=>{
            user.tokens =user.tokens.concat({token})
        });
        if(user.isTeacher){
            const teacher = new Teacher({});
            user.teacher = teacher.id;
            await teacher.save();
        }else{
            const student = new Student({});
            user.student = student.id;
            await student.save();
        }
        await user.save();
        res.json(user.tokens[user.tokens.length-1]);        
    } catch (error) {
        res.status(400).send(error);   
    }
});

/* 
    route : "/api/users/me",
    desc : "Get User profile",
    auth : ["Teacher","Student"],
    method: "GET"
*/

router.get("/me",auth,async (req,res)=>{
    try {
        const user = req.user
        if(!user){
            return res.status(404).json({msg:"User Not Found"});
        }
        if(user.isTeacher){
            await user.populate("teacher").execPopulate();
        }else{
            await user.populate("student").execPopulate();  
        }
        res.json(user);
    } catch (error) {
        res.status(500).send("Server Error!");
        console.log(error);
    }
});


module.exports = router;

