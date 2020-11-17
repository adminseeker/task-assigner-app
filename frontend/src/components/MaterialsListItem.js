import React, { useState } from "react";
import moment from "moment";
import { deleteMaterial } from "../actions/rooms";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

const MaterialsListItem = (props)=>{
    return (
    <div>
        <a href={props.material.material} target="_blank" rel="noopener noreferrer">{props.material.description}</a>
        <p>Added on:{moment(props.material.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</p>
        <div>
        {
            props.isTeacher &&
            <button onClick={(e)=>{
                props.dispatch(deleteMaterial(props.room_id,props.material._id))
            }}>
                    Delete
            </button> }
        
          
        </div>

    </div>
    );
}


export default connect()(MaterialsListItem);


