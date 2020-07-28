const express = require("express");
const bcrypt = require("bcryptjs");

const auth = require("../../middleware/auth");
const generateAuthToken = require("../../token/generateAuthToken");

const User = require("../../models/User");

const router = express.Router();

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