const express = require("express");
const mongoose = require("mongoose");
const moment = require("moment");
const multer = require("multer");
const AWS = require("aws-sdk");
const { v1: uuidv1 } = require('uuid');

const auth = require("../../middleware/auth");

const User = require("../../models/User");
const Room = require("../../models/Room");

const mailer = require("../../mailer/mailer");

const upload = multer({storage:multer.memoryStorage(),limits:{fileSize:1000000000}});

const router = express.Router();

const s3Bucket = new AWS.S3({
    accessKeyId:process.env.AWS_ID,
    secretAccessKey:process.env.AWS_SECRET,
    region:process.env.AWS_REGION
});

/* 
    route : "/api/upload/room_id",                          
    desc : "Upload Resources and Submissions",
    auth : ["Teacher","Student"],
    method: "POST"
*/

router.post("/:id",[auth,upload.single("file")],async(req,res)=>{
    try {
        const file = req.file;
        const resource_id = req.header("resource_id");
        const description = req.header("description");
        const params = {
            Bucket: process.env.AWS_BUCKET,
            Key: uuidv1().slice(-24).replace(/-/g,Math.floor(Math.random()*10))+"_"+file.originalname,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: "public-read"
        }
        if(req.user.isTeacher){
            const room = await Room.findOne({_id:req.params.id,teacher:req.user.id});
            if(!room){
                return res.status(404).json({"msg":"No room found!"});
            }
            let result = room.resources.filter((resource)=>(resource.resource.split("/").pop()==params.Key));
            if(result.length!==0){
                return res.json({"code":"0","msg":"File already exists with that name!"});
            }
        }else{
            const room = await Room.findOne({_id:req.params.id,"students._id":req.user.id});
            if(!room){
                return res.status(404).json({"msg":"No room found!"});
            }   
            let result = room.submissions.filter((submission)=>(submission.submission.split("/").pop()==params.Key));
            if(result.length!==0){
                return res.json({"code":"0","msg":"File already exists with that name!"});
            }
        }

        s3Bucket.upload(params,async (error,data)=>{
            if (error) {
                res.status(500).json({ "msg":"error uploading file!" });
            } else {
                if(req.user.isTeacher){
                    const room = await Room.findOneAndUpdate({_id:req.params.id,teacher:req.user.id},{$addToSet:{resources:{resource:data.Location,description:description}}},{new:true});
                    if(!room){
                        return res.status(404).json({"msg":"No room found!"});
                    }
                }else{
                    const room = await Room.findOneAndUpdate({_id:req.params.id,"students._id":req.user.id},{$addToSet:{submissions:{student_id:req.user.id,resource_id,submission:data.Location,description:description}}},{new:true});
                    if(!room){
                        return res.status(404).json({"msg":"No room found!"});
                    }   
                }
                res.json({"code":"1","msg":"File uploaded Successfully!",location:data.Location});
            }
        })
    } catch (error) {
        if(error instanceof mongoose.CastError){
            return res.status(404).json({"msg":"No room found!"});
        }
        res.status(500).send("Server Error!");
        console.log(error);
    }
});

/* 
    route : "/api/upload/room_id/resource_id/deadline",
    desc : "Add/update deadline",
    auth : ["Teacher"],
    method: "POST"
*/

router.post("/:id1/:id2/deadline",auth,async (req,res)=>{
    try {
        user=req.user;
        if(!req.user.isTeacher){
            return res.status(401).json({"msg":"Authorization denied!"});
        }
        const deadline = req.body.deadline;
        const room = await Room.findOneAndUpdate({_id:req.params.id1,teacher:req.user.id,"resources._id":req.params.id2},{"resources.$.deadline":deadline},{new:true});
        if(!room){
            return res.json({"msg":"No room found"});
        }
        const resource = room.resources.find((resource)=>(resource._id==req.params.id2))
        let ids = room.students.map((student)=>(student._id));
        ids.push(req.user._id);
        let Emails = await User.find({_id:{$in:ids}}).select("email -_id");
        Emails = Emails.map(({email})=>(email));
        let HTMLText = "<h2>classroom "+room.className+"</h2>"+"\n<h3>Deadline for "+resource.description+" set to "+moment(deadline).format('MMMM Do YYYY, h:mm:ss a')+"</h3>";
        let subject = "Tasker Deadline details from Instructor "+user.name;
        await mailer(Emails,"",HTMLText,subject);
        return res.json({"code":"1","msg":"deadline updated"});
    } catch (error) {
        res.status(500).send("Server Error!");
        console.log(error);
    }

})

/* 
    route : "/api/upload/room_id/materials",
    desc : "Upload materials",
    auth : ["Teacher"],
    method: "POST"
*/

router.post("/:id/materials",[auth,upload.single("file")],async(req,res)=>{
    try {
        const file = req.file;
        const description = req.header("description");
        const params = {
            Bucket: process.env.AWS_BUCKET,
            Key: uuidv1().slice(-24).replace(/-/g,Math.floor(Math.random()*10))+"_m_"+file.originalname,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: "public-read"
        }

        if(req.user.isTeacher){
            const room = await Room.findOne({_id:req.params.id,teacher:req.user.id});
            if(!room){
                return res.status(404).json({"msg":"No room found!"});
            }
            let result = room.materials.filter((material)=>(material.material.split("/").pop()==params.Key));
            if(result.length!==0){
                return res.json({"code":"0","msg":"File already exists with that name!"});
            }
            s3Bucket.upload(params,async (error,data)=>{
                if (error) {
                    res.status(500).json({"code":"0", "msg":"error uploading file!" });
                } else {
                    
                        const room = await Room.findOneAndUpdate({_id:req.params.id,teacher:req.user.id},{$addToSet:{materials:{material:data.Location,description:description}}},{new:true});
                        if(!room){
                            return res.status(404).json({"msg":"No room found!"});
                        }
                    
                    res.json({"code":"1","msg":"File uploaded Successfully!",location:data.Location});
                }
            })
        }else{
            return res.status(401).json({"msg":"Authorizaion error!"})
        }
    } catch (error) {
        if(error instanceof mongoose.CastError){
            return res.status(404).json({"msg":"No room found!"});
        }
        res.status(500).send("Server Error!");
        console.log(error);
    }
});

/* 
    route : "/api/upload/room_id/resources/resource_id",
    desc : "Delete Resources",
    auth : ["Teacher"],
    method: "DELETE"
*/

router.delete("/:id1/resources/:id2",auth,async (req,res)=>{
    try {
        if(!req.user.isTeacher){
            return res.status(401).json({"msg":"Authorization denied!"});
        }
        const room = await Room.findOneAndUpdate({_id:req.params.id1,teacher:req.user.id},{$pull:{resources:{_id:req.params.id2},submissions:{resource_id:req.params.id2}}});
        if(!room){
            return res.status(500).json({ "msg":"error deleting file!" });
        }

        let objects=[];
        let resources = room.resources.filter((resource)=>resource._id==req.params.id2);
        resources = resources.map((resource)=>{
            return {Key:resource.resource.toString().split("/").pop()};
        });
        objects= objects.concat(resources)
        let submissions = room.submissions.filter((submission)=>submission.resource_id==req.params.id2);
        if(submissions!==0){
            submissions = submissions.map((submission)=>{
                return {Key:submission.submission.toString().split("/").pop()};
            });
    
            objects = objects.concat(submissions);
        }
        const params = {
            Bucket: "aravind-web-apps",
            Delete: {
                Objects: objects
              }
        }
        objects.forEach((object)=>{object.Key="tasker/"+object.Key});
        s3Bucket.deleteObjects(params,async(error,data)=>{
            if(error){
            console.log("from S3")
            console.log(error)
            throw new Error;
            }
            
        })
        res.json({"msg":"Assignment Successfully Deleted!"});
    } catch (error) {
        res.status(500).send("Server Error!");
        console.log(error);   
    }
});

/* 
    route : "/api/upload/room_id/materials/material_id",
    desc : "Delete Materials by id",
    auth : ["Teacher"],
    method: "DELETE"
*/

router.delete("/:id/materials/:id2",auth,async (req,res)=>{
    try {
        if(!req.user.isTeacher){
            return res.status(401).json({"msg":"Authorization denied!"});
        }
        const room = await Room.findOneAndUpdate({_id:req.params.id,teacher:req.user.id},{$pull:{materials:{_id:req.params.id2}}});
        if(!room){
            return res.status(500).json({ "msg":"error deleting file!" });
        }
        const fileName = room.materials.map((material)=>{
            if(material._id == req.params.id2){
                return material.material;
            }
        }).toString().split("/").pop();
        const params = {
            Bucket: process.env.AWS_BUCKET,
            Key: fileName
        }

        s3Bucket.deleteObject(params,async(error,data)=>{
            if(error){
                return res.status(500).json({ "msg":"error deleting file!" });
            }
            res.json({"msg":"File Successfully Deleted!"});
        })

    } catch (error) {
        res.status(500).send("Server Error!");
        console.log(error);   
    }
});


/* 
    route : "/api/upload/room_id/submissions/submission_id",
    desc : "Teacher Can Delete Student Submissions By His submission ID,Student Can Delete His Own Submissions",
    auth : ["Teacher","Student"],
    method: "DELETE"
*/

router.delete("/:id/submissions/:id2",auth,async (req,res)=>{
    try {
        let room
        if(req.user.isTeacher){
            room = await Room.findOneAndUpdate({_id:req.params.id,teacher:req.user.id},{$pull:{submissions:{_id:req.params.id2}}});
        }else{
            room = await Room.findOneAndUpdate({_id:req.params.id,"students._id":req.user.id},{$pull:{submissions:{_id:req.params.id2}}});
        }
        if(!room){
            return res.status(500).json({ "msg":"error deleting file!" });
        }
        const fileName = room.submissions.map((submission)=>{
            if(submission._id == req.params.id2){
                return submission.submission;
            }
        }).toString().split("/").pop();
        const params = {
            Bucket: process.env.AWS_BUCKET,
            Key: fileName
        }

        s3Bucket.deleteObject(params,async(error,data)=>{
            if(error){
                return res.status(500).json({ "msg":"error deleting file!" });
            }
            res.json({"msg":"File Successfully Deleted!"});
        })

    } catch (error) {
        res.status(500).send("Server Error!");
        console.log(error);   
    }
});

module.exports = router;