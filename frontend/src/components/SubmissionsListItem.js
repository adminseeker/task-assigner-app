import React from "react";
import moment from "moment";
import { connect } from "react-redux";
import { deleteSubmission } from "../actions/submissions";

const SubmissionsListItem = (props)=>(
    <div>
        <a href={props.submission.submission} target="_blank" rel="noopener noreferrer">
        <div>
            <h3>{props.submission.description} - {moment(props.submission.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</h3>
        </div>
        </a>
        <button onClick={(e)=>{
            props.dispatch(deleteSubmission(props.room_id,props.submission.submission))
        }}>
                Delete
        </button>
    </div>
);


export default connect()(SubmissionsListItem);