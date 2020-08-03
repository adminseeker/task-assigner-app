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
                        <SubmissionsListItem key={submission.createdAt} room_id={props.room_id} submission={submission}/>
                    ))
                )
            }
        </div>
    )
}

const mapStateToProps= (state,props)=>({
    submissions:state.submissions.submissions,
    loading_submissions:state.submissions.loading_submissions,
    isTeacher:state.auth.user.isTeacher
})

export default connect(mapStateToProps)(SubmissionsList);