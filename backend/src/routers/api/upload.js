const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const AWS = require("aws-sdk");

const auth = require("../../middleware/auth");

const User = require("../../models/User");
const Room = require("../../models/Room");

const upload = multer({storage:multer.memoryStorage(),limits:{fileSize:100000000}});

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
        const description = req.header("description");
        const params = {
            Bucket: process.env.AWS_BUCKET,
            Key: req.user.id+"_"+file.originalname,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: "public-read"
        }

        if(req.user.isTeacher){
            const room = await Room.findOne({_id:req.params.id,teacher:req.user.id});
            if(!room){
                return res.status(404).json({"msg":"No room found!"});
            }
        }else{
            const room = await Room.findOne({_id:req.params.id,"students._id":req.user.id});
            if(!room){
                return res.status(404).json({"msg":"No room found!"});
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
                    const room = await Room.findOneAndUpdate({_id:req.params.id,"students._id":req.user.id},{$addToSet:{submissions:{student_id:req.user.id,submission:data.Location,description:description}}},{new:true});
                    if(!room){
                        return res.status(404).json({"msg":"No room found!"});
                    }   
                }
                res.json({location:data.Location});
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
    route : "/api/upload/room_id/resources",
    desc : "Delete Resources",
    auth : ["Teacher"],
    method: "DELETE"
*/

router.delete("/:id/resources/",auth,async (req,res)=>{
    try {
        if(!req.user.isTeacher){
            return res.status(401).json({"msg":"Authorization denied!"});
        }
        const room = await Room.findOneAndUpdate({_id:req.params.id,teacher:req.user.id},{$pull:{resources:{resource:req.body.location}}});
        if(!room){
            return res.status(500).json({ "msg":"error deleting file!" });
        }
        const fileName = room.resources.map((resource)=>{
            if(resource.resource == req.body.location){
                return resource.resource;
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
    route : "/api/upload/room_id/submissions",
    desc : "Student Can Delete His Own Submissions",
    auth : ["Student"],
    method: "DELETE"
*/

router.delete("/:id/submissions/",auth,async (req,res)=>{
    try {
        let room;
        if(req.user.isTeacher){
            room = await Room.findOneAndUpdate({_id:req.params.id,teacher:req.user.id,"submissions.student_id":req.body.student_id},{$pull:{submissions:{submission:req.body.location,student_id:req.body.student_id}}});

        }else{
             room = await Room.findOneAndUpdate({_id:req.params.id,"students._id":req.user.id,"submissions.student_id":req.user.id},{$pull:{submissions:{submission:req.body.location,student_id:req.user.id}}});
        }
        if(!room){
            return res.status(500).json({ "msg":"error deleting file!" });
        }
        const fileName = room.submissions.map((submission)=>{
            if(submission.submission == req.body.location){
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

/* 
    route : "/api/upload/room_id/submissions/student_id",
    desc : "Teacher Can Delete Student Submissions By His ID",
    auth : ["Teacher"],
    method: "DELETE"
*/

router.delete("/:id/submissions/:id2",auth,async (req,res)=>{
    try {
        if(!req.user.isTeacher){
            return res.status(401).json({"msg":"Authorization denied!"});
        }
        const room = await Room.findOneAndUpdate({_id:req.params.id,teacher:req.user.id},{$pull:{submissions:{submission:req.body.location,student_id:req.params.id2}}});
        if(!room){
            return res.status(500).json({ "msg":"error deleting file!" });
        }
        const fileName = room.submissions.map((submission)=>{
            if(submission.submission == req.body.location){
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