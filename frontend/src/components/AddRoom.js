import React, { useState } from "react";
import { connect } from "react-redux";
import axios from "axios";
import {getRooms } from "../actions/rooms";

const AddRoom = (props) => {
    const [className,setClassName] =useState("");
    const addRoom = async ()=>{
        const body = JSON.stringify({className});
        const config = {
            headers:{
                "Content-Type":"application/json"
            }
        }
        await axios.post("/api/rooms/",body,config);
    }
    return (
        <div className="content-container-item rooms-grid-item">
            <form className="add-room">  
                <input type="text" value={className} placeholder="Enter Class Room name" onChange={(e)=>{
                    setClassName(e.target.value);
                }}/><br />
                <button type="submit" onClick={async (e)=>{
                    e.preventDefault();
                    await addRoom();
                    await props.dispatch(getRooms());
                }}>Create Classroom</button>
            </form>
        </div>
    )
}

export default connect()(AddRoom);