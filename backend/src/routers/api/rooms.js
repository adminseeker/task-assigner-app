const express = require("express");
const AWS = require("aws-sdk");

const auth = require("../../middleware/auth");

const User = require("../../models/User");
const Teacher = require("../../models/Teacher");
const Student = require("../../models/Student");
const Room = require("../../models/Room");
const Invite = require("../../models/Invite");
const Announcement = require("../../models/Announcement");

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
    route : "/api/rooms/room_id/announcements",
    desc : "Create a announcement",
    auth : "Teacher",
    method: "POST"
*/
router.post("/:id/announcements",auth,async (req,res)=>{
    try {
        const user = req.user;
        if(!user.isTeacher){
            return res.status(401).json({"msg":"Authorization denied!"});
        }
        const announcement = new Announcement({
            teacher_id:user.id,
            content:req.body.content
        });
        await announcement.save();
        let announcements = [announcement];
        const room = await Room.findOneAndUpdate({_id:req.params.id,teacher:req.user.id},{$addToSet:{announcements}},{new:true});
        let ids = room.students.map((student)=>(student._id));
        ids.push(req.user._id);
        let Emails = await User.find({_id:{$in:ids}}).select("email -_id");
        Emails = Emails.map(({email})=>(email));
        let HTMLText = "<h2>classroom "+room.className+"</h2>"+"\n<h3>"+announcement.content+"</h3>";
        let subject = "Tasker Announcement from Instructor "+user.name;
        await mailer(Emails,"",HTMLText,subject);
        res.json({"msg":"Created Announcement!"});
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
        if(studentEmails.length==0){
            return res.json({"msg":"No emails!"})
        }
        // let emailString = studentEmails.join();
        // let room_id = String(room._id);
        let emailHTML = "<h2>Teacher "+req.user.name+" is inviting you to join classroom "+room.className+".</h2>\n <p>Your invite code is:</p> ";
        let subject = "Invite Code for tasker classroom";
        let invites=[]
        for(let i=0;i<studentEmails.length;i++){
            invites.push({user_email:studentEmails[i],classroom_id:req.params.id,invite_id:Math.floor(100000 + Math.random() * 900000)})
        }
        await Invite.insertMany(invites); 
        invites.forEach(async (invite)=>{
            await mailer(invite.user_email,text="",html=emailHTML+"<h1>"+invite.invite_id+"</h1>",subject)
        })
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
        let students = [{_id:user._id}];
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
    route : "/api/rooms/room_id/announcements",
    desc : "Get announcements",
    auth : ["Teacher","Student"],
    method: "GET"
*/

router.get("/:id/announcements",auth,async (req,res)=>{
    try {
        let room;
        if(req.user.isTeacher){
            room = await Room.findOne({_id:req.params.id,teacher:req.user.id}).select("-resources -submissions");
        }else{
            room = await Room.findOne({_id:req.params.id,"students._id":req.user.id}).select("-submissions");
        }
        if(!room){
            return res.status(404).json({"msg":"Room not found!"});
        }
        const announcements = await Announcement.find({_id:{$in:room.announcements}});
        res.json(announcements);
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
        if(req.user.teacher){
            students = await User.find({_id:{$in:room.students}}).select("name email phone");
        }else{
            students = await User.find({_id:{$in:room.students}}).select("name email");
        }
        teacher = await User.find({_id:room.teacher}).select("name email");
        return res.json({students,teacher:teacher[0]});
        
    } catch (error) {
        res.status(500).send("Server Error!");
        console.log(error); 
    }
});

/* 
    route : "/api/rooms/room_id/materials",
    desc : "Get materials by room id",
    auth : ["Teacher","Student"],
    method: "GET"
*/

router.get("/:id/materials",auth,async (req,res)=>{
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
        return res.json(room.materials);
    } catch (error) {
        res.status(500).send("Server Error!");
        console.log(error); 
    }
});

/* 
    route : "/api/rooms/room_id/users",
    desc : "Get users in the classroom by id's",
    auth : ["Teacher"],
    method: "POST"
*/

router.post("/:id/users",auth,async (req,res)=>{
    try {
        let room;
        let students;
        let teacher;
        let ids = req.body.ids;
        if(req.user.isTeacher){
            room = await Room.findOne({teacher:req.user.id,_id:req.params.id});
        }else{
            return res.status(401).json({"msg":"Authorization denied!"});
        }
        if(!room){
            return res.status(404).json({"msg":"Room not found!"});
        }
     
        students = await User.find({_id:{$in:ids}}).select("name email phone");
        return res.json(students);
        
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
            const room = await Room.findOne({_id:req.params.id,teacher:req.user.id});
            if(!room){
                return res.status(404).json({"msg":"No room found!"});
            }
            return res.json(room.submissions);
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
            return res.json(submissions); 
        }
    } catch (error) {
        res.status(500).send("Server Error!");
        console.log(error);
    }
});

/* 
    route : "/api/rooms/room_id/resource_id/submissions"
    desc : "Student can See his Submissions for a resource, Teacher gets student submissions for a resource",
    auth : "Student,Teacher",
    method: "GET"
*/

router.get("/:id1/:id2/submissions",auth,async (req,res)=>{
    try {
        if(req.user.isTeacher){
            const room = await Room.findOne({_id:req.params.id1,teacher:req.user.id});
            if(!room){
                return res.status(404).json({"msg":"No room found!"});
            }
            const submissions = room.submissions.reduce((result,submission)=>{
                if(submission.resource_id==req.params.id2){
                    result.push(submission);
                }
                return result;
            },[]);
            res.json(submissions); 
        }else{
            const room = await Room.findOne({_id:req.params.id1,"students._id":req.user.id});
            if(!room){
                return res.status(404).json({"msg":"No room found!"});
            }
            const submissions = room.submissions.reduce((result,submission)=>{
                if(submission.student_id==req.user.id && submission.resource_id==req.params.id2){
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
    route : "/api/rooms/room_id/submissions/student_id/resource_id",
    desc : "Teacher views student's submissions by his id for a resource",
    auth : "Teacher",
    method: "GET"
*/

router.get("/:id/submissions/:id2/:id3",auth,async (req,res)=>{
    try {
        if(!req.user.isTeacher){
            return res.status(401).json({"msg":"Authorization denied!"});
        }else{
            const room = await Room.findOne({_id:req.params.id,teacher:req.user.id});
            if(!room){
                return res.status(404).json({"msg":"No room found!"});
            }
            const submissions = room.submissions.reduce((result,submission)=>{
                if(submission.student_id==req.params.id2 && submission.resource_id==req.params.id3){
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
            const resources = room.resources.map((resource)=>{
                    return {Key:resource.resource.toString().split("/").pop()};
            });
            const submissions = room.submissions.map((submission)=>{
                return {Key:submission.submission.toString().split("/").pop()};
            });
            const materials = room.materials.map((material)=>{
                return {Key:material.material.toString().split("/").pop()};
        });
            let objects = resources.concat(submissions);
            objects = objects.concat(materials);
            const params = {
                Bucket: "aravind-web-apps",
                Delete: {
                    Objects: objects
                  }
            }
            objects.forEach((object)=>{object.Key="tasker/"+object.Key});
            await room.remove();
            if(objects.length!==0){
                s3Bucket.deleteObjects(params,(error,data)=>{
                    if(error){
                        return res.status(500).json({ "msg":"error deleting files!" });
                    }
                     res.json({"msg":"room deleted!"});
                });
            }else{
                return res.json({"msg":"room deleted!"});
            }
        }else{
            const room = await Room.findOne({_id:req.params.id,"students._id":req.user.id});
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
                Bucket: "aravind-web-apps",
                Delete: {
                    Objects: objects
                  }
            }
            objects.forEach((object)=>{object.Key="tasker/"+object.Key});
            if(objects.length!==0){
                s3Bucket.deleteObjects(params,(error,data)=>{
                    if(error){
                        console.log("From S3");
                        throw new Error;
                    }
                });
            }
            const deletedRoom = await Room.findOneAndUpdate({_id:req.params.id,"students._id":req.user.id},{$pull:{students:{_id:req.user.id},submissions:{student_id:req.user.id}}});
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

/* 
    route : "/api/rooms/room_id/announcements/announcemnet_id",
    desc : "Teacher deletes an announcemnet by id",
    auth : "Teacher",
    method: "DELETE"
*/

router.delete("/:id1/announcements/:id2",auth,async (req,res)=>{
    try {
        if(!req.user.isTeacher){
            return res.status(401).json({"msg":"Authorization denied!"});
        }
        const room = await Room.findOneAndUpdate({_id:req.params.id1,teacher:req.user.id,"announcements._id":req.params.id2},{$pull:{announcements:{_id:req.params.id2}}});
        if(!room){
            return res.status(404).json({"msg":"room not found!"});
        }
        const announcement = await Announcement.findOne({_id:req.params.id2});
        await announcement.remove();
        return res.json({"msg":"Announcement deleted!"});
    } catch (error) {
        res.status(500).send("Server Error!");
        console.log(error);
    }
});

module.exports = router;