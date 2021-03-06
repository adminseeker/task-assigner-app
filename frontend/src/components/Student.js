import React from "react";
import { connect } from "react-redux";
import { getSubmissionsByTeacher } from "../actions/submissions";

const Student = ({student,getSubmissionsByTeacher,room_id,isTeacher,phone}) => {
    return (
        <div className="container">
            <div>
                <h3>Name: {student.name}</h3>
                <h3>Email: {student.email}</h3>
                {isTeacher && <h3>Phone: {student.phone}</h3> }
                {
                    //isTeacher && <SubmissionsList room_id={room_id} student_id={student._id}/>
                }
            </div>
        </div>
    )
}

const mapStateToProps = (state,props)=>({
    student: state.rooms.students.find((student)=>(student._id === props.match.params.id)),
    isTeacher:state.auth.user.isTeacher,
    room_id:state.rooms.current_room_id
})

export default connect(mapStateToProps,{getSubmissionsByTeacher})(Student);