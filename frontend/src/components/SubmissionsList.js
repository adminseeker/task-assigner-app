import React from "react";
import { connect } from "react-redux";
import LoadingPage from "./LoadingPage";
import SubmissionsListItem from "./SubmissionsListItem";

const SubmissionsList = (props) => {
    return (
        !props.isTeacher && 
        props.loading_submissions ? <LoadingPage /> :
        <div>
            {
                props.submissions.length === 0 ?(
                    <h3>No Submissions</h3>
                ) : (
                    props.submissions.map((submission)=>(
                        <SubmissionsListItem key={submission.createdAt} room_id={props.room_id} resource_id={props.resource_id} submission={submission} isTeacher={props.isTeacher} student_id={props.student_id}/>
                    ))
                )
            }
        </div>
    )
}

const mapStateToProps= (state,props)=>({
    submissions:state.submissions.submissions.filter((submission)=>(submission.resource_id===String(props.match.params.id2) && submission.student_id===String(props.match.params.id3))),
    loading_submissions:state.submissions.loading_submissions,
    isTeacher:state.auth.user.isTeacher,
    room_id:props.match.params.id1,
    resource_id:props.match.params.id2,
    student_id:props.match.params.id3
})

export default connect(mapStateToProps)(SubmissionsList);