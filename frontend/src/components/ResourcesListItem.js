import React, { useState } from "react";
import moment from "moment";
import { deleteResource,updateDeadline } from "../actions/rooms";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

const ResourcesListItem = (props)=>{
    const [deadline,setDeadline] = useState("");
    return (
    <div>
        <Link to={"/rooms/"+props.room_id+"/assignments/"+props.resource._id}>{props.resource.description}</Link>
        <p>Deadline:{moment(props.resource.deadline).format('MMMM Do YYYY, h:mm:ss a')}</p>
        <div>
        {
            props.isTeacher &&
            <button onClick={(e)=>{
                props.dispatch(deleteResource(props.room_id,props.resource._id))
            }}>
                    Delete
            </button> }
        { props.isTeacher && <input type="text" placeholder="Update deadline" value={deadline} onChange={(e)=>{
            setDeadline(e.target.value);
        }}/>   }
        {
         
            props.isTeacher && <button onClick={async (e)=>{
                await props.dispatch(updateDeadline(props.room_id,props.resource._id,deadline));
                setDeadline("");
                alert("deadline updated");
             }}>Update Deadline</button>
        
        }
          
        </div>

    </div>
    );
}


export default connect()(ResourcesListItem);


