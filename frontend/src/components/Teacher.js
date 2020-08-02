import React from "react";
import { connect } from "react-redux";

const Teacher = (props) => {
    return (
        <div>
            <h3>Name: {props.teacher.name}</h3>
            <h3>Email: {props.teacher.email}</h3>
        </div>
    )
}

const mapStateToProps = (state,props)=>({
    teacher: state.rooms.teacher,
    isTeacher:state.auth.user.isTeacher
})

export default connect(mapStateToProps)(Teacher);