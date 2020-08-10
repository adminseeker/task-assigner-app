import React from "react";
import {Link} from "react-router-dom";
import { connect } from "react-redux";
import LoadingPage from "./LoadingPage";
import axios from "axios";
import { getRoomUsers } from "../actions/rooms";

const StudentListItem = (props)=>{
    const removeStudent = async ()=>{
        await axios.delete("/api/rooms/"+props.room_id+"/students/"+props.student._id);
        console.log("deleted student!");
    }
    return(
        props.loading_users ? <LoadingPage /> :
        <div className="room-grid-item-students-flex">
            <div className="flex-child">
            <Link className="link-blue-style" to={"/profile/student/"+props.student._id}>
                <p className="margin_0-submissions">{props.student.name}</p>
            </Link>
            </div>
            <div className="flex-child">
            {
                props.isTeacher && <button onClick={async (e)=>{await removeStudent(); await props.dispatch(getRoomUsers(props.room_id));}}>Remove</button>
            }
            </div>
        </div>
    )
};


const mapStateToProps = (state,props)=>({
    loading_users:state.rooms.loading_users,
    isTeacher:state.auth.user.isTeacher
})

export default connect(mapStateToProps)(StudentListItem);