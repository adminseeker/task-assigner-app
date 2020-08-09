import React from "react";
import {Link} from "react-router-dom";
import moment from "moment";
import { connect } from "react-redux";
import axios from "axios";
import { getRooms } from "../actions/rooms";

const RoomListItem = (props)=>{
    const deleteRoom =async ()=>{
        await axios.delete("/api/rooms/"+props.room._id);
    }
    return(
        <div >
        <div className="content-container-item room-grid-item">
            <Link  to={"/rooms/"+props.room._id}>
                <div>
                    <h3>{props.room.className}</h3>
                    <p>Created on {moment(props.room.date).format('MMMM Do, YYYY')}</p>
                    <p>students:{props.room.students.length}</p>
                    {props.isTeacher && <p>Teacher:{props.user.name}</p>}
                </div>
            </Link><br></br>
            {props.isTeacher && <button onClick={async (e)=>{await deleteRoom(); await props.dispatch(getRooms());}}>Remove</button>}
            {!props.isTeacher && <button onClick={async (e)=>{await deleteRoom(); await props.dispatch(getRooms());}}>Leave This Class Room</button>}
        </div>
            
        </div>
    
    )
};

const mapStateToProps = (state)=>({
    isTeacher:state.auth.user.isTeacher,
     
})

export default connect(mapStateToProps)(RoomListItem);