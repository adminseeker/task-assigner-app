import React from "react";

const SubmissionsListItem = (props)=>(
    <a href={props.submission.submission} target="_blank" rel="noopener noreferrer">
    <div>
        <h3>{props.submission.description}</h3>
    </div>
    </a>
);


export default SubmissionsListItem;