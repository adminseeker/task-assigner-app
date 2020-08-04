import React from "react";
import moment from "moment";
import { deleteResource } from "../actions/rooms";
import { connect } from "react-redux";

const ResourcesListItem = (props)=>(
    <div>
        <a href={props.resource.resource} target="_blank" rel="noopener noreferrer">
        <div>
            <h3>{props.resource.description} - {moment(props.resource.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</h3>
        </div>
        </a>

        {
            props.isTeacher &&

            <button onClick={(e)=>{
                props.dispatch(deleteResource(props.room_id,props.resource.resource))
            }}>
                    Delete
            </button>
        }
    </div>
);


export default connect()(ResourcesListItem);