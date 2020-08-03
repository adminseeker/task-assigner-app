import React from "react";

const ResourcesListItem = (props)=>(
    <a href={props.resource.resource} target="_blank" rel="noopener noreferrer">
    <div>
        <h3>{props.resource.description}</h3>
    </div>
    </a>
);


export default ResourcesListItem;