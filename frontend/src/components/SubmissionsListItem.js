import React from "react";
import moment from "moment";
import { connect } from "react-redux";
import { deleteSubmission } from "../actions/submissions";

const SubmissionsListItem = (props)=>(
    <div className={props.isTeacher ? "submissions-flex" : "student-submissions-flex"}>
        <div className="flex-child">
        
            {props.isTeacher && <h4><a className="link-blue-style margin_0-submissions" href={props.submission.submission} target="_blank" rel="noopener noreferrer">{props.submission.description}</a> - {moment(props.submission.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</h4>}
            </div>
            <div>
            {!props.isTeacher && <h4><a className="link-blue-style-center margin_0-submissions" href={props.submission.submission} target="_blank" rel="noopener noreferrer">{props.submission.description}</a> - {moment(props.submission.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</h4>}
            </div>
        
        <div className="flex-child">
        <button onClick={async(e)=>{
            await props.dispatch(deleteSubmission(props.room_id,props.submission._id,props.submission))
        }}>
                Delete
        </button>
        </div>
    </div>
);


export default connect()(SubmissionsListItem);