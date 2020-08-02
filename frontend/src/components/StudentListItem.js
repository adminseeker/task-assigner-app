import React from "react";
import {Link} from "react-router-dom";
import { connect } from "react-redux";
import LoadingPage from "./LoadingPage";

const StudentListItem = (props)=>{
    return(
        props.loading_users ? <LoadingPage /> :
    <Link to={"/profile/student/"+props.student._id}>
    <div>
        <h3>{props.student.name}</h3>
    </div>
    </Link>
    )
};


const mapStateToProps = (state,props)=>({
    loading_users:state.rooms.loading_users
})

export default connect(mapStateToProps)(StudentListItem);