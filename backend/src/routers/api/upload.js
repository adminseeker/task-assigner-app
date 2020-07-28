const express = require("express");
const multer = require("multer");
const AWS = require("aws-sdk");

const auth = require("../../middleware/auth");

const User = require("../../models/User");
const Room = require("../../models/Room");

const upload = multer({storage:multer.memoryStorage(),limits:{fileSize:1000000}});

const router = express.Router();

router.post("/:id",[auth,upload.single("file")],async(req,res)=>{
    try {
        const file = req.file;
        const s3Bucket = new AWS.S3({
            accessKeyId:process.env.AWS_ID,
            secretAccessKey:process.env.AWS_SECRET,
            region:process.env.AWS_REGION
        });
    
        const params = {
            Bucket: process.env.AWS_BUCKET,
            Key: req.user.id+"_"+file.originalname,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: "public-read"
        }

        s3Bucket.upload(params,async (error,data)=>{
            if (error) {
                res.status(500).json({ "msg":"error uploading files!" });
            } else {
                if(req.user.isTeacher){
                    const room = await Room.findOneAndUpdate({_id:req.params.id,teacher:req.user.id},{$push:{resources:{resource:data.Location}}},{new:true});
                    if(!room){
                        return res.status(404).json({"msg":"No room found!"});
                    }
                }else{
                    const room = await Room.findOneAndUpdate({_id:req.params.id,"students._id":req.user.id},{$addToSet:{submissions:{student_id:req.user.id,submission:data.Location}}},{new:true});
                    if(!room){
                        return res.status(404).json({"msg":"No room found!"});
                    }   
                }
                res.json({location:data.Location});
            }
        })
    } catch (error) {
        res.status(500).send("Server Error!");
        console.log(error);
    }
});

router.delete("/:id/resources/:id")

module.exports = router;