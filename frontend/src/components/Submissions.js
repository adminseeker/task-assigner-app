import React, { useEffect } from "react"
import SubmissionsList from "./SubmissionsList";
import { getSubmittedStudents } from "../actions/submissions";
import { connect } from "react-redux";
import LoadingPage from "./LoadingPage";
import Uploader from "./Uploader";
import StudentListItem from "./StudentListItem";
import useSWR from "swr";
import StudentSubmissionsList from "./StudentSubmissionsList";

const Submissions = ({getSubmittedStudents, room_id,resource_id,submissions,loading_submittedStudents,isTeacher,submittedIDs,submittedStudents,user}) => {
    useSWR("/rooms/"+room_id+"/assignments/"+resource_id+"/submissions",async ()=>{
        await getSubmittedStudents(room_id,submittedIDs);
    });
    return (
        loading_submittedStudents  ? <LoadingPage /> :
        <div>
            <h3>Submissions</h3>
            {isTeacher && submittedStudents.length===0 ? <h2>No submissions Yet</h2> : submittedStudents.map((student)=>(
                <StudentListItem key={student._id} resource_id={resource_id} student={student} room_id={room_id} assignment={true}/>
            ))}
            
            {!isTeacher && submissions.length===0 ? <h2>No submissions Yet</h2> : <StudentSubmissionsList room_id={room_id} resource_id={resource_id} student_id={user._id}/>}
            {!isTeacher && <h2>Add Submissions</h2>}
            {!isTeacher && <Uploader room_id={room_id} isTeacher={isTeacher} resource_id={resource_id}/>}
        </div>
    )
}

const mapStateToProps = (state,props)=>({
    room_id: props.match.params.id1,
    resource_id: props.match.params.id2,
    loading_submittedStudents:state.submissions.loading_submittedStudents,
    isTeacher:state.auth.user.isTeacher,
    submittedIDs:state.submissions.submissions.reduce((result,submission)=>{result.push(submission.student_id); return result;},[]),
    submittedStudents:state.submissions.submittedStudents,
    submissions:state.submissions.submissions,
    user:state.auth.user 
})

export default connect(mapStateToProps,{getSubmittedStudents})(Submissions);

