import React from "react";
import moment from "moment";
import { deleteResource } from "../actions/rooms";
import { connect } from "react-redux";

const ResourcesListItem = (props)=>(
    <div>
        <a className="link-blue-style left-align" href={props.resource.resource} target="_blank" rel="noopener noreferrer">{props.resource.description}</a> - {moment(props.resource.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
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