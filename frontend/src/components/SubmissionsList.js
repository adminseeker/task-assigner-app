import React from "react";
import { connect } from "react-redux";
import FacebookCircularProgress from "./FacebookCircularProgress";
import SubmissionsListItem from "./SubmissionsListItem";

const SubmissionsList = (props) => {
    return (
        props.isTeacher && 
        props.loading_submissions ? <FacebookCircularProgress /> :
        <div>
            {
                props.submissions.length === 0 ?(
                    <h3>No Submissions!!!</h3>
                ) : (
                    props.submissions.map((submission)=>(
                        <SubmissionsListItem key={submission._id} room_id={props.room_id} resource_id={props.resource_id} submission={submission} isTeacher={props.isTeacher} student_id={props.student_id} assignment={true} />
                    ))
                )
            }
        </div>
    )
}

const mapStateToProps= (state,props)=>({
    submissions:state.submissions.submissions.filter((submission)=>(submission.resource_id==props.resource_id && submission.student_id==props.student_id)),
    loading_submissions:state.submissions.loading_submissions,
    isTeacher:state.auth.user.isTeacher,
    room_id:props.room_id,
    resource_id:props.resource_id,
    student_id:props.student_id
})

export default connect(mapStateToProps)(SubmissionsList);