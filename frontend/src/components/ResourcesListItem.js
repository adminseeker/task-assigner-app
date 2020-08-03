import React from "react";
import moment from "moment";

const ResourcesListItem = (props)=>(
    <a href={props.resource.resource} target="_blank" rel="noopener noreferrer">
    <div>
        <h3>{props.resource.description} - {moment(props.resource.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</h3>
    </div>
    </a>
);


export default ResourcesListItem;