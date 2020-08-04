const express = require("express");
const AWS = require("aws-sdk");

const auth = require("../../middleware/auth");

const User = require("../../models/User");
const Teacher = require("../../models/Teacher");
const Student = require("../../models/Student");
const Room = require("../../models/Room");

const router = express.Router();

const s3Bucket = new AWS.S3({
    accessKeyId:process.env.AWS_ID,
    secretAccessKey:process.env.AWS_SECRET,
    region:process.env.AWS_REGION
});

/* 
    route : "/api/rooms/",
    desc : "Create a Room",
    auth : "Teacher",
    method: "POST"
*/
router.post("/",auth,async (req,res)=>{
    try {
        const user = req.user;
        if(!user.isTeacher){
            return res.status(401).json({"msg":"Authorization denied!"});
        }
        const room = new Room({
            teacher:user.id,
            className:req.body.className
        });
        await room.save();
        res.json(room);
    } catch (error) {
        res.status(500).send("Server Error!");
        console.log(error);
    }
});

/* 
    route : "/api/rooms/room_id/students",
    desc : "Teacher Adds Students",
    auth : "Teacher",
    method: "POST"
*/

router.post("/:id/students",auth,async (req,res)=>{
    try{
        const user = req.user;
        if(!user.isTeacher){
            return res.status(401).json({"msg":"Authorization denied!"});
        }
        const studentEmails = req.body.studentEmails.splice(",").map((studentEmail)=>studentEmail.trim());
        const studentsToAdd = await User.find({email:{$in:studentEmails}}).select("_id");
        const room = await Room.findOneAndUpdate({_id:req.params.id},{$addToSet:{students:studentsToAdd}},{new:true});
        if(!room){
            return res.status(404).json({"msg":"No room found!"});
        } 
        res.json(room.students);
    } catch (error) {
        res.status(500).send("Server Error!");
        console.log(error);
    }
});

/* 
    route : "/api/rooms/",
    desc : "Get rooms",
    auth : ["Teacher","Student"],
    method: "GET"
*/

router.get("/",auth,async (req,res)=>{
    try {
        let rooms;
        if(req.user.isTeacher){
            rooms = await Room.find({teacher:req.user.id}).select("-resources -submissions");
        }else{
            rooms = await Room.find({"students._id":req.user.id}).select("-submissions");
        }
        if(!rooms){
            return res.status(404).json({"msg":"Rooms not found!"});
        }
        res.json(rooms)
    } catch (error) {
        res.status(500).send("Server Error!");
        console.log(error); 
    }
});

/* 
    route : "/api/rooms/room_id",
    desc : "Get room by id",
    auth : ["Teacher","Student"],
    method: "GET"
*/

router.get("/:id",auth,async (req,res)=>{
    try {
        let room;
        if(req.user.isTeacher){
            room = await Room.findOne({teacher:req.user.id,_id:req.params.id});
        }else{
            room = await Room.findOne({"students._id":req.user.id,_id:req.params.id}).select("-submissions");
        }
        if(!room){
            return res.status(404).json({"msg":"Room not found!"});
        }
        res.json(room)
    } catch (error) {
        res.status(500).send("Server Error!");
        console.log(error); 
    }
});

/* 
    route : "/api/rooms/room_id/users",
    desc : "Get users in the classroom",
    auth : ["Teacher","Student"],
    method: "GET"
*/

router.get("/:id/users",auth,async (req,res)=>{
    try {
        let room;
        let students;
        let teacher;
        if(req.user.isTeacher){
            room = await Room.findOne({teacher:req.user.id,_id:req.params.id});
        }else{
            room = await Room.findOne({"students._id":req.user.id,_id:req.params.id});
        }
        if(!room){
            return res.status(404).json({"msg":"Room not found!"});
        }
        students = await User.find({_id:{$in:room.students}}).select("name email");
        teacher = await User.find({_id:room.teacher}).select("name email");
        return res.json({students,teacher:teacher[0]});
        
    } catch (error) {
        res.status(500).send("Server Error!");
        console.log(error); 
    }
});

/* 
    route : "/api/rooms/room_id/submissions"
    desc : "Student can See his Submissions",
    auth : "Student",
    method: "GET"
*/

router.get("/:id/submissions",auth,async (req,res)=>{
    try {
        if(req.user.isTeacher){
            return res.status(401).json({"msg":"Authorization denied!"});
        }else{
            const room = await Room.findOne({_id:req.params.id,"students._id":req.user.id});
            if(!room){
                return res.status(404).json({"msg":"No room found!"});
            }
            const submissions = room.submissions.reduce((result,submission)=>{
                if(submission.student_id==req.user.id){
                    result.push(submission);
                }
                return result;
            },[]);
            res.json(submissions); 
        }
    } catch (error) {
        res.status(500).send("Server Error!");
        console.log(error);
    }
});

/* 
    route : "/api/rooms/room_id/resources"
    desc : "Teacher gets the resources",
    auth : "Teacher",
    method: "GET"
*/

router.get("/:id/resources",auth,async (req,res)=>{
    try {
        let room;
        if(!req.user.isTeacher){
            room = await Room.findOne({_id:req.params.id,"students._id":req.user.id});
        }else{
            room = await Room.findOne({_id:req.params.id,teacher:req.user.id});
            if(!room){
                return res.status(404).json({"msg":"No room found!"});
            }
        }
        res.json(room.resources); 
    } catch (error) {
        res.status(500).send("Server Error!");
        console.log(error);
    }
});

/* 
    route : "/api/rooms/room_id/submissions/student_id",
    desc : "Teacher views student's submissions by his id",
    auth : "Teacher",
    method: "GET"
*/

router.get("/:id/submissions/:id2",auth,async (req,res)=>{
    try {
        if(!req.user.isTeacher){
            return res.status(401).json({"msg":"Authorization denied!"});
        }else{
            const room = await Room.findOne({_id:req.params.id,teacher:req.user.id});
            if(!room){
                return res.status(404).json({"msg":"No room found!"});
            }
            const submissions = room.submissions.reduce((result,submission)=>{
                if(submission.student_id==req.params.id2){
                    result.push(submission);
                }
                return result;
            },[]);
            res.json(submissions); 
        }
    } catch (error) {
        res.status(500).send("Server Error!");
        console.log(error);
    }
});

/* 
    route : "/api/rooms/room_id/",
    desc : "Teacher deletes room",
    auth : "Teacher",
    method: "DELETE"
*/

router.delete("/:id",auth,async (req,res)=>{
    try {
        if(req.user.isTeacher){
            const room = await Room.findOne({_id:req.params.id,teacher:req.user.id});
            if(!room){
                return res.status(404).json({"msg":"room not found!"});
            }
            await room.remove();

            const resources = room.resources.map((resource)=>{
                    return {Key:resource.resource.toString().split("/").pop()};
            });
            const submissions = room.submissions.map((submission)=>{
                return {Key:submission.submission.toString().split("/").pop()};
            });
            const objects = resources.concat(submissions);
            const params = {
                Bucket: process.env.AWS_BUCKET,
                Delete: {
                    Objects: objects
                  }
            }
            s3Bucket.deleteObjects(params,async(error,data)=>{
                if(error){
                    return res.status(500).json({ "msg":"error deleting files!" });
                }
                res.json({"msg":"room deleted!"});
            });
        }else{
            const room = await Room.findOneAndUpdate({_id:req.params.id,"students._id":req.user.id},{$pull:{students:{_id:req.user.id}}});
            if(!room){
                return res.status(404).json({"msg":"room not found!"});
            }
            res.json({"msg":"Student left the room!"});
        }
    } catch (error) {
        res.status(500).send("Server Error!");
        console.log(error);
    }
});

/* 
    route : "/api/rooms/room_id/students/student_id",
    desc : "Teacher deletes student by his id",
    auth : "Teacher",
    method: "DELETE"
*/

router.delete("/:id/students/:id2",auth,async (req,res)=>{
    try {
        if(!req.user.isTeacher){
            return res.status(401).json({"msg":"Authorization denied!"});
        }
        const room = await Room.findOneAndUpdate({_id:req.params.id,teacher:req.user.id},{$pull:{students:{_id:req.params.id2}}});
        if(!room){
            return res.status(404).json({"msg":"room not found!"});
        }
        res.json({"msg":"Student Deleted!"});
    } catch (error) {
        res.status(500).send("Server Error!");
        console.log(error);
    }
});

module.exports = router;