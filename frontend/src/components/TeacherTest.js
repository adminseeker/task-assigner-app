import React from "react";
import { connect } from "react-redux";

const TeacherTest = (props) => {
    return (
        <div>
        {!props.isTeacher && <h1>Not authorized!!!</h1>}
        {props.isTeacher && <h1>Teacher Page!!!</h1>}
        </div>
    )
}

const mapStateToProps = (state)=>({
    isTeacher:state.auth.user.isTeacher
})

export default connect(mapStateToProps)(TeacherTest);
