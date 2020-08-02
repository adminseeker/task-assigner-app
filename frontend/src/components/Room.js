import React, { useEffect } from "react";
import { connect } from "react-redux";
import {getRoomUsers} from "../actions/rooms";
import StudentListItem from "./StudentListItem";
import LoadingPage from "./LoadingPage";
import { Link } from "react-router-dom";

const Room = ({getRoomUsers,room:{className,_id},teacher,students,loading_users}) => {
    useEffect(()=>{
        getRoomUsers(_id)
    },[getRoomUsers,_id]);
    return (
            loading_users ? <LoadingPage /> :
        <div>
            
            <h3>ClassRoom: {className}</h3>
            <h3>Teacher: <Link to={"/profile/teacher/"+teacher._id}>{teacher.name}</Link></h3>
            <h3>Students: </h3>
            {
                students.length === 0 ?(
                    <h3>No Students</h3>
                ) : (
                    students.map((student)=>(
                        <StudentListItem key={student._id} student={student}/>
                    ))
                )
            }
        </div>
    )
}

const mapStateToProps = (state,props)=>({
    room: state.rooms.rooms.find((room)=>(room._id === props.match.params.id)),
    teacher:state.rooms.teacher,
    students:state.rooms.students,
    loading_users:state.rooms.loading_users
})

export default connect(mapStateToProps,{getRoomUsers})(Room);