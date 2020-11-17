import React, { useEffect, useState } from "react";
import moment from "moment";
import {getSubmissionsByTeacher,getSubmittedStudents} from "../actions/submissions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import StudentListItem from "./StudentListItem";
import SubmissionsList from "./SubmissionsList";
import StudentSubmissionsList from "./StudentSubmissionsList";
import Uploader from "./Uploader";

const AssignmentView = ({resource:{_id,resource,createdAt,deadline,description,loading_submissions},isTeacher,room_id,submissions,getSubmissionsByTeacher,submittedStudentids,getSubmittedStudents,students,user,submittedStudents})=>{
    
    const [clicked,setClicked] = useState(false);
    return loading_submissions ? <LoadingPage /> :
    (   
        <div>
            <a href={resource} target="_blank" rel="noopener noreferrer">{resource.split("/").pop().slice(25)}</a>
            <p>Added On {moment(createdAt).format('MMMM Do YYYY, h:mm:ss a')}</p>
            <p>Deadline {moment(deadline).format('MMMM Do YYYY, h:mm:ss a')}</p>
            <h2>Submissions</h2>
            <button onClick={async (e)=>{  await getSubmissionsByTeacher(room_id,_id); if(isTeacher){ await getSubmittedStudents(room_id,submittedStudentids);} setClicked(true);}}>View Submissions</button>
            {isTeacher && clicked && submittedStudents.length===0 ? <h2>No submissions Yet</h2> : submittedStudents.map((student)=>(
                <StudentListItem key={student._id} resource_id={_id} student={student} room_id={room_id} assignment={true}/>
            ))}
            {!isTeacher &&  clicked && submissions.length===0 ? <h2>No submissions Yet</h2> : <StudentSubmissionsList room_id={room_id} resource_id={_id} student_id={user._id}/>}
            {!isTeacher && <h2>Add Submissions</h2>}
            {!isTeacher && <Uploader room_id={room_id} isTeacher={isTeacher} resource_id={_id}/>}

        </div>
    );
}


const mapStateToProps=(state,props)=>({
    resource:state.rooms.resources.find((resource)=>(resource._id===String(props.match.params.id2))),
    room_id:props.match.params.id1,
    submissions:state.submissions.submissions,
    loading_submissions:state.submissions.loading_submissions,
    submittedStudentids:state.submissions.submissions.reduce((result,submission)=>{ result.push(submission.student_id); return result},[]),
    submittedStudents:state.submissions.submittedStudents,
    isTeacher:state.auth.user.isTeacher,
    user:state.auth.user
})


export default connect(mapStateToProps,{getSubmissionsByTeacher,getSubmittedStudents})(AssignmentView);
