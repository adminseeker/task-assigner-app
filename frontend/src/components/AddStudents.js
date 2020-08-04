import React, { useState } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { getRoomUsers } from "../actions/rooms";

const AddStudents = (props) => {
    const [students,setStudents] =useState("");
    const addStudents = async (students)=>{
        const studentEmails = students.split(",");
        const body = JSON.stringify({studentEmails});
        const config = {
            headers:{
                "Content-Type":"application/json"
            }
        }
        await axios.post("/api/rooms/"+props.room_id+"/students",body,config);
        props.dispatch(getRoomUsers(props.room_id));
    }
    return (
        <div>
            <p>Enter Student Emails separated by commas to add Students</p>
            <input type="text" value={students} onChange={(e)=>{
                setStudents(e.target.value);
            }}/><br />
            <button onClick={(e)=>{
                addStudents(students);
            }}>Add Students</button>
        </div>
    )
}

export default connect()(AddStudents);