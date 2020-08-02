import React from "react";
import { connect } from "react-redux";

const Student = (props) => {
    return (
        <div>
            <h3>Name: {props.student.name}</h3>
            <h3>Email: {props.student.email}</h3>
        </div>
    )
}

const mapStateToProps = (state,props)=>({
    student: state.rooms.students.find((student)=>(student._id === props.match.params.id)),
    isTeacher:state.auth.user.isTeacher
})

export default connect(mapStateToProps)(Student);