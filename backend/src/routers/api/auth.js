const express = require("express");
const bcrypt = require("bcryptjs");

const auth = require("../../middleware/auth");
const generateAuthToken = require("../../token/generateAuthToken");

const User = require("../../models/User");

const router = express.Router();

/* 
    route : "/api/auth/",
    desc : "Get User profile",
    auth : ["Teacher","Student"],
    method: "GET"
*/

router.get("/",auth,async (req,res)=>{
    try {
        const user = await User.findById(req.user.id).select("-password -tokens")
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

/* 
    route : "/api/auth/login",
    desc : "Login user",
    auth : "Public",
    method: "POST"
*/

router.post("/login",async (req,res)=>{
    try {
        const user = await User.findOne({email:req.body.email});
        if(!user){
            return res.status(400).json({errors:[{msg:"invalid credentials"}]});
        }
        const isMatch = await bcrypt.compare(req.body.password,user.password);
        if(!isMatch){
            return res.status(400).json({errors:[{msg:"invalid credentials"}]});
        }
        generateAuthToken(user.id,(token)=>{
            user.tokens =user.tokens.concat({token})
        });
        await user.save();
        res.json(user.tokens[user.tokens.length-1]);
    } catch (error) {
        res.status(500).send("Server Error!");
        console.log(error);
    }
});

/* 
    route : "/api/auth/logout",
    desc : "Logout user",
    auth : ["Teacher","Student"],
    method: "POST"
*/

router.post("/logout",auth,async (req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token;
        });
        const user = req.user; 
        user.tokens=req.user.tokens;
        await user.save();
        res.json({"msg":"Logged out!"});
    }catch(error){
        res.status(500).send();
        console.log(error)
    }
});

/* 
    route : "/api/auth/logoutAll",
    desc : "Logout user from all devices",
    auth : ["Teacher","Student"],
    method: "POST"
*/

router.post("/logoutAll",auth,async (req,res)=>{
    try{
        req.user.tokens = []
        const user = req.user; 
        user.tokens=req.user.tokens;
        await user.save();
        res.json({"msg":"Logged out from all devices!"});
    }catch(error){
        res.status(500).send();
        console.log(error)
    }
});

module.exports = router;