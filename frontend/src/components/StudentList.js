import React from "react";
import { connect } from "react-redux";
import LoadingPage from "./LoadingPage";
import AddRoom from "./AddRoom";
import StudentListItem from "./StudentListItem";
import InviteStudents from "./InviteStudents";
import { Link } from "react-router-dom";

const StudentList = (props) => {
    return (
        props.loading_rooms ? <LoadingPage /> :
        <div>
            <Link to={"/rooms/"+props.room_id+"/students/invite"}>Invite Students</Link>
            {
                
                props.students.length === 0 ?(
                    <h3>No Students</h3>
                ) : (
                    props.students.map((student)=>(
                        <StudentListItem key={student._id} student={student} room_id={props.room_id}/>
                    ))
                )
            }
        </div>
    )
}

const mapStateToProps= (state,props)=>({
    students:state.rooms.students,
    user:state.auth.user,
    room_id:props.match.params.id
})

export default connect(mapStateToProps)(StudentList);