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
        <div>
            <Link to={"/profile/student/"+props.student._id}>
            <div>
                <h3>{props.student.name}</h3>
            </div>
            </Link>
            
            {
                props.isTeacher && <button onClick={async (e)=>{await removeStudent(); await props.dispatch(getRoomUsers(props.room_id));}}>Remove</button>
            }

        </div>
    )
};


const mapStateToProps = (state,props)=>({
    loading_users:state.rooms.loading_users,
    isTeacher:state.auth.user.isTeacher
})

export default connect(mapStateToProps)(StudentListItem);