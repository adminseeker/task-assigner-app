import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {getRoomUsers,getAnnouncements,addAnnouncement} from "../actions/rooms";
import StudentListItem from "./StudentListItem";
import LoadingPage from "./LoadingPage";
import { Link } from "react-router-dom";
import ResourcesList from "./ResourcesList";
import Uploader from "./Uploader";
import AnnouncementsList from "./AnnouncementsList";

const Room = ({getRoomUsers,room:{className,_id},teacher,students,isTeacher,loading_users,loading_announcements,getAnnouncements,addAnnouncement,match:{params:{id}}}) => {
    useEffect(()=>{
        getRoomUsers(_id);
        getAnnouncements(_id);
    },[getRoomUsers,getAnnouncements,_id]);
    const [content, setContent] = useState("");
    return (
            loading_users ? <LoadingPage /> :
             <div>
                <h3>ClassRoom: {className}</h3>
                <h3>Teacher: <Link to={"/profile/teacher/"+teacher._id}>{teacher.name}</Link></h3>
                {isTeacher && <Link to={"/rooms/"+_id+"/students"}>Mangage Students</Link>}
                {isTeacher && <Link to={"/rooms/"+_id+"/assignments"}>Mangage Assignments</Link>}
                {!isTeacher && <Link to={"/rooms/"+_id+"/students"}>View Students</Link>}
                {!isTeacher && <Link to={"/rooms/"+_id+"/assignments"}>View Assignments</Link>}
                {isTeacher && <Link to={"/rooms/"+_id+"/materials"}>Mangage Materials</Link>}
                {!isTeacher && <Link to={"/rooms/"+_id+"/materials"}>View Materials</Link>}
              
                <h2>Announcements</h2>
                {<AnnouncementsList room_id={_id}/>}
                {isTeacher &&
                     <form onSubmit={async (e)=>{
                         e.preventDefault();
                         await addAnnouncement(content,_id);
                     }}>
                        <input type="text" name="content" placeholder="Announcement" value={content} onChange={(e)=>{setContent(e.target.value)}}></input>
                        <button type="submit">Add Announcement</button>
                     </form>}
            </div>
    )
}

const mapStateToProps = (state,props)=>({
    room: state.rooms.rooms.find((room)=>(room._id === props.match.params.id)),
    teacher:state.rooms.teacher,
    students:state.rooms.students,
    isTeacher:state.auth.user.isTeacher,
    loading_users:state.rooms.loading_users,
    loading_announcements:state.rooms.loading_announcements
})

export default connect(mapStateToProps,{getRoomUsers,getAnnouncements,addAnnouncement})(Room);