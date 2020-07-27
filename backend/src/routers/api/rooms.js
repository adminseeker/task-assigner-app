const express = require("express");

const auth = require("../../middleware/auth");

const User = require("../../models/User");
const Teacher = require("../../models/Teacher");
const Student = require("../../models/Student");
const Room = require("../../models/Room");

const router = express.Router();

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
        res.json(room);
    } catch (error) {
        res.status(500).send("Server Error!");
        console.log(error);
    }
})

router.get("/",auth,async (req,res)=>{
    try {
        let rooms;
        if(req.user.isTeacher){
            rooms = await Room.find({teacher:req.user.id});
        }else{
            rooms = await Room.find({"students":req.user.id});
        }
        if(!rooms){
            return res.status(404).json({"msg":"Rooms not found!"});
        }
        res.json(rooms)
    } catch (error) {
        res.status(500).send("Server Error!");
        console.log(error); 
    }
})

router.delete("/:id",auth,async (req,res)=>{
    try {
        if(req.user.isTeacher){
            const room = await Room.findOne({_id:req.params.id,teacher:req.user.id});
            if(!room){
                return res.status(404).json({"msg":"room not found!"});
            }
            await room.remove();
            res.json({"msg":"room deleted!"});
        }else{
            const room = await Room.findOneAndUpdate({_id:req.params.id,"students._id":req.user.id},{$pull:{students:{_id:req.user.id}}});
            if(!room){
                return res.status(404).json({"msg":"room not found!"});
            }
            res.json({"msg":"left the room!"});
        }
    } catch (error) {
        res.status(500).send("Server Error!");
        console.log(error);
    }
})

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
})

module.exports = router;