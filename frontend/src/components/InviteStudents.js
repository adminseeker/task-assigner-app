import React, { useState } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { getRoomUsers } from "../actions/rooms";

const InviteStudents = (props) => {
    const [students,setStudents] =useState("");
    const inviteStudents = async (students)=>{
        const studentEmails = students.split(",");
        const body = JSON.stringify({studentEmails});
        const config = {
            headers:{
                "Content-Type":"application/json"
            }
        }
        const res = await axios.post("/api/rooms/"+props.room_id+"/students/invite",body,config);
        console.log(res.data);
        props.dispatch(getRoomUsers(props.room_id));
        if(res.data.msg=="Invite Sent"){
            return "Invite sent to "+studentEmails.join();
        }else{
            return "Invite failed!";
        }
    }
    return (
        <div>
            <p>Enter Student Emails separated by commas to Invite Students</p>
            <input type="text" value={students} onChange={(e)=>{
                setStudents(e.target.value);
            }}/><br />
            <button onClick={async (e)=>{
               const msg = await inviteStudents(students);
               alert(msg);
            }}>Send Invite</button>
        </div>
    )
}

const mapStateToProps=(state,props)=>({
    room_id:props.match.params.id
})

export default connect(mapStateToProps)(InviteStudents);