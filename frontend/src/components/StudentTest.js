import React from "react"
import { connect } from "react-redux";

const StudentTest = (props) => {
    return (
        <div>
           {props.isTeacher && <h1>Not Authorized!!!</h1>}
           {!props.isTeacher && <h1>Student Page!!!</h1>}
        </div>
    )
}

const mapStateToProps = (state)=>({
    isTeacher:state.auth.user.isTeacher
})

export default connect(mapStateToProps)(StudentTest);
