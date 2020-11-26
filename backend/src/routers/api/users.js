const express = require("express");
const bcrypt = require("bcryptjs");
const AWS = require("aws-sdk");

const auth = require("../../middleware/auth");
const generateAuthToken = require("../../token/generateAuthToken");

const User = require("../../models/User");
const Teacher = require("../../models/Teacher");
const Student = require("../../models/Student");
const Room = require("../../models/Room");
const Invite = require("../../models/Invite");
const Announcement = require("../../models/Announcement");

const router = express.Router();

const s3Bucket = new AWS.S3({
    accessKeyId:process.env.AWS_ID,
    secretAccessKey:process.env.AWS_SECRET,
    region:process.env.AWS_REGION
});

/* 
    route : "/api/users",
    desc : "Register as Teacher or Student",
    auth : "PUBLIC",
    method: "POST"
*/

router.post("/",async (req,res)=>{
    try {
        
        const check = await User.find({email:req.body.email});
        if(check.length!==0){
            return res.json({"msg":"Email already registered!"})
        }

        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password,salt)
        
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
    route : "/api/users",
    desc : "Update profile",
    auth : "Student,Teacher",
    method: "PATCH"
*/

router.patch("/",auth,async (req,res)=>{
    try {
        const user = req.user;
        if(!user){
            return res.json({"msg":"User Not Found!"})
        }
    const updates = req.body;
    delete updates.token;
    delete updates._id;
    delete updates.id;
    if(updates.email || updates.isTeacher){
        return res.json({"msg":"This field cannot be Updated!"})
    }
    if(updates.password){
        const salt = await bcrypt.genSalt(10);
        updates.password = await bcrypt.hash(updates.password,salt)
    }
    const editUser = await User.findOneAndUpdate({_id:user.id},updates,{new:true}).select("-password")    
    res.json(editUser);
    } catch (error) {
        console.log(error);
        return res.status(500).send();
    }
});

/* 
    route : "/api/users",
    desc : "Update password",
    auth : "Student,Teacher",
    method: "PATCH"
*/

router.patch("/password",auth,async (req,res)=>{
    try {
    let newPassword = req.body.newPassword;
    const password = req.body.password;
    if(newPassword && password){
        const user = await User.findOne({_id:req.user.id});
        if(!user){
            return res.status(400).json({errors:[{msg:"invalid user!"}]});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.json({code:"0",msg:"incorrect current password!"});
        }
        const salt = await bcrypt.genSalt(10);
        newPassword = await bcrypt.hash(newPassword,salt);
        user.password = newPassword;
        await user.save();
        return res.json({code:"1","msg":"Password Changed Successfully!"});
    }
        return res.json({code:"2","msg":"Error in changing password!"});

    } catch (error) {
        console.log(error);
        return res.status(500).send();
    }
});

/* 
    route : "/api/users",
    desc : "Delete User Account",
    auth : "Student,Teacher",
    method: "DELETE"
*/

router.delete("/",auth,async(req,res)=>{
    try {
        const user = req.user;
        if(!user){
           return res.json({"msg":"User Not Found!"})
        }
        if(user.isTeacher){
            let resources;
            let materials;
            let submissions;
            let objects=[];
            const rooms = await Room.find({teacher:req.user.id});
            const teacher = await Teacher.findOne({_id:user.teacher});
            await teacher.remove();
            if(rooms.length!==0){
                rooms.forEach(async (room)=>{
                    resources = room.resources.map((resource)=>{
                        return {Key:resource.resource.toString().split("/").pop()};
                });
                submissions = room.submissions.map((submission)=>{
                    return {Key:submission.submission.toString().split("/").pop()};
                });
                materials = room.materials.map((material)=>{
                    return {Key:material.material.toString().split("/").pop()};
                
                 });
                 if(resources.length!==0){
                    objects = objects.concat(resources);
                }
                if(submissions.length!==0){
                    objects = objects.concat(submissions);
                }
                if(materials.length!==0){
                    objects = objects.concat(materials);
                }
                
                if(room.announcements.length!==0){
                    await Announcement.deleteMany({_id:{$in:room.announcements}})                
                }
                
                await room.remove();
                
                })
                
                objects.forEach((object)=>{object.Key="tasker/"+object.Key});
                
                const params = {
                    Bucket: "aravind-web-apps",
                    Delete: {
                        Objects: objects
                      }
                }
                if(objects.length!==0){
                    s3Bucket.deleteObjects(params,(error,data)=>{
                        if(error){
                            console.log("From S3");
                            console.log(error);
                        }
                         
                    });
                    
                }
            }
            await user.remove();
            return res.json({"msg":"User removed Successfully!"});
        }else{
            let submissions;
            let objects=[];
            const rooms = await Room.find({"students._id":req.user.id});
            if(rooms.length!==0){
                rooms.forEach(async (room)=>{
                    submissions = room.submissions.reduce((result,submission)=>{
                        if(submission.student_id==req.user.id){
                            result.push({Key:submission.submission.toString().split("/").pop()});
                        }
                        return result;
                    },[]);
                    if(submissions.length!==0){
                        objects = objects.concat(submissions);
                    }
                    
                const deletedRoom = await Room.findOneAndUpdate({_id:room._id},{$pull:{students:{_id:req.user.id},submissions:{student_id:req.user.id}}});
                   
                })
                objects.forEach((object)=>{object.Key="tasker/"+object.Key});
                const params = {
                    Bucket: "aravind-web-apps",
                    Delete: {
                        Objects: objects
                      }
                }
                if(objects.length!==0){
                    s3Bucket.deleteObjects(params,(error,data)=>{
                        if(error){
                            console.log("From S3");
                            console.log(error);
                        }
                    });
                }
            }
            
            await user.remove();
            return res.json({"msg":"User removed Successfully!"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});




module.exports = router;

