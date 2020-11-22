import React, { useEffect, useState } from "react";
import useSWR from "swr";
import moment from "moment";
import {getSubmissionsByTeacher,getSubmittedStudents, getSubmissions} from "../actions/submissions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import StudentListItem from "./StudentListItem";
import SubmissionsList from "./SubmissionsList";
import StudentSubmissionsList from "./StudentSubmissionsList";
import Uploader from "./Uploader";

const AssignmentView = ({resource:{_id,resource,createdAt,deadline,description},loading_submissions,isTeacher,room_id,submissions,getSubmissionsByTeacher,students,user})=>{
    // useEffect(()=>{
    //     getSubmissionsByTeacher(room_id,_id);
    // },[room_id,_id,getSubmissions]);
    return (   
        <div>
            <p>Added On {moment(createdAt).format('MMMM Do YYYY, h:mm:ss a')}</p>
            <p>Deadline {moment(deadline).format('MMMM Do YYYY, h:mm:ss a')}</p>
            <Link to={"/rooms/"+room_id+"/assignments/"+_id+"/submissions"}>View Submissions</Link>
        </div>
    );
}


const mapStateToProps=(state,props)=>({
    submissions:state.submissions.submissions,
    loading_submissions:state.submissions.loading_submissions,
    isTeacher:state.auth.user.isTeacher,
    user:state.auth.user,
    students:state.rooms.students
})


export default connect(mapStateToProps,{getSubmissionsByTeacher,getSubmittedStudents})(AssignmentView);




