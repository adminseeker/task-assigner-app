const express = require("express");
const AWS = require("aws-sdk");

const auth = require("../../middleware/auth");

const User = require("../../models/User");
const Teacher = require("../../models/Teacher");
const Student = require("../../models/Student");
const Room = require("../../models/Room");
const Invite = require("../../models/Invite");

const mailer = require("../../mailer/mailer");

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
    route : "/api/rooms/room_id/students/invite",
    desc : "Teacher Invites Students",
    auth : "Teacher",
    method: "POST"
*/

router.post("/:id/students/invite",auth,async (req,res)=>{
    try{
        const user = req.user;
        if(!user.isTeacher){
            return res.status(401).json({"msg":"Authorization denied!"});
        }
        const room = await Room.findOne({_id:req.params.id,teacher:req.user.id});
        if(!room){
            res.status(404).json({"msg":"Room not found!"})
        }
        const studentEmails = req.body.studentEmails.splice(",").map((studentEmail)=>studentEmail.trim());
        // let emailString = studentEmails.join();
        // let room_id = String(room._id);
        let emailHTML = "<h2>Teacher "+req.user.name+" is inviting you to join classroom "+room.className+".</h2>\n <p>Your invite code is:</p> ";
        let invites=[]
        for(let i=0;i<studentEmails.length;i++){
            invites.push({user_email:studentEmails[i],classroom_id:req.params.id,invite_id:Math.floor(100000 + Math.random() * 900000)})
        }
        await Invite.insertMany(invites); 
        invites.forEach(async (invite)=>{
            await mailer(invite.user_email,text="",html=emailHTML+"<h1>"+invite.invite_id+"</h1>")
        })
        if(!room){
            return res.status(404).json({"msg":"No room found!"});
        } 
        res.json({"msg":"Invite Sent"});
    } catch (error) {
        res.status(500).send("Server Error!");
        console.log(error);
    }
});

/* 
    route : "/api/rooms/students/join",
    desc : "Student joins the classroom using invite_id",
    auth : "Student",
    method: "POST"
*/

router.post("/students/join",auth,async (req,res)=>{
    try{
        const user = req.user;
        if(user.isTeacher){
            return res.status(401).json({"msg":"Authorization denied!"});
        }
        const invite_id = req.body.invite_id;
        const invites = await Invite.find({user_email:user.email,invite_id});
        if(invites.length===0){
            return res.json({"msg":"Invalid invite id or you are not invited!!"});
        }
        let found=false;
        let students = [];
        students.push({_id:user._id});
        invites.forEach(async (invite)=>{
            if(invite.invite_id==invite_id){
                found=true;
                const room = await Room.findOneAndUpdate({_id:invite.classroom_id},{$addToSet:{students}},{new:true});
                if(!room){
                    res.json({"msg":"No classroom Found!"});
                }
                await Invite.deleteMany({user_email:user.email,classroom_id:room.id});
            }
        })
        if(!found){
            return res.json({"msg":"Invalid invite id or you are not invited!"});
        }
        return res.json({"msg":"join successfull!"});
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
    desc : "Teacher deletes room, student leaves the room",
    auth : ["Teacher","Student"],
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
            if(objects.length!==0){
                s3Bucket.deleteObjects(params,(error,data)=>{
                    if(error){
                        return res.status(500).json({ "msg":"error deleting files!" });
                    }
                     res.json({"msg":"room deleted!"});
                });
            }else{
                res.json({"msg":"room deleted!"});
            }
        }else{
            const room = await Room.findOneAndUpdate({_id:req.params.id,"students._id":req.user.id},{$pull:{students:{_id:req.user.id}}});
            if(!room){
                return res.status(404).json({"msg":"room not found!"});
            }
            const submissions = room.submissions.reduce((result,submission)=>{
                if(submission.student_id==req.user.id){
                    result.push({Key:submission.submission.toString().split("/").pop()});
                }
                return result;
            },[]);
            const objects = submissions;
            const params = {
                Bucket: process.env.AWS_BUCKET,
                Delete: {
                    Objects: objects
                  }
            }
            if(submissions.length!==0){
                s3Bucket.deleteObjects(params,()=>{
    
                });
            }
            
            return res.json({"msg":"Student left the room!"});
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
        const room = await Room.findOneAndUpdate({_id:req.params.id,teacher:req.user.id},{$pull:{students:{_id:req.params.id2},submissions:{student_id:req.params.id2}}});
        if(!room){
            return res.status(404).json({"msg":"room not found!"});
        }
        const submissions = room.submissions.reduce((result,submission)=>{
            if(submission.student_id==req.params.id2){
                result.push({Key:submission.submission.toString().split("/").pop()});
            }
            return result;
        },[]);
        const objects = submissions;
        console.log(objects);

        const params = {
            Bucket: process.env.AWS_BUCKET,
            Delete: {
                Objects: objects
              }
        }
        if(submissions.length!==0){
            s3Bucket.deleteObjects(params,()=>{

            });
        }
        return res.json({"msg":"room deleted!"});
    } catch (error) {
        res.status(500).send("Server Error!");
        console.log(error);
    }
});

module.exports = router;