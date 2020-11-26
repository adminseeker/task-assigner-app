const express = require("express");
const bcrypt = require("bcryptjs");

const auth = require("../../middleware/auth");
const generateAuthToken = require("../../token/generateAuthToken");

const User = require("../../models/User");
const ForgotPassword = require("../../models/ForgotPassword");

const mailer = require("../../mailer/mailer");

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

/* 
    route : "/api/rooms/room_id/students/invite",
    desc : "Teacher Invites Students",
    auth : "Teacher",
    method: "POST"
*/

router.post("/sendotp",async (req,res)=>{
    try{
        const email = req.body.email;
        const user = await User.findOne({email})
        if(!user){
            return res.json({"msg":"No user exists with that email!"});
        }
        let emailHTML = "<h2>You have requested for changing the password. Here is your OTP. Don't share with anyone.</h2>\n <p>Your OTP is:</p> ";
        let subject = "OTP for changing Tasker Password";
        let otp = Math.floor(100000 + Math.random() * 900000);
        const forgotPasswordrequest = new ForgotPassword({email,otp});
        await forgotPasswordrequest.save();
        await mailer(email,text="",html=emailHTML+"<h1>"+otp+"</h1>",subject);
        res.json({"msg":"OTP sent to "+email});
    } catch (error) {
        res.status(500).send("Server Error!");
        console.log(error);
    }
});

router.post("/newpassword",async (req,res)=>{
    try{
        const email = req.body.email;
        const otp = req.body.otp;
        let newPassword = req.body.newPassword;
        const forgotPasswordrequest = await ForgotPassword.findOne({email})
        if(!forgotPasswordrequest){
            return res.json({"msg":"invalid otp!"});
        }
        if(otp==forgotPasswordrequest.otp){
           const salt = await bcrypt.genSalt(10);
           newPassword = await bcrypt.hash(newPassword,salt);
           const user = await User.findOneAndUpdate({email},{password:newPassword},{new:true});
           await ForgotPassword.deleteMany({email});
           return res.json({"msg":"Password Reset Completed Successfully!"}) 
        }else{
            return res.json({"msg":"invalid otp!"});
        }
        
    } catch (error) {
        res.status(500).send("Server Error!");
        console.log(error);
    }
});


module.exports = router;