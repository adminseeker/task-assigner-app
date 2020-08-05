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
        <div>
            <Link to={"/rooms/"+props.room._id}>
                <div>
                    <h3>{props.room.className}</h3>
                    <span>{moment(props.room.date).format('MMMM Do, YYYY')}</span>
                </div>
            </Link>
            {props.isTeacher && <button onClick={async (e)=>{await deleteRoom(); await props.dispatch(getRooms());}}>Remove</button>}
            {!props.isTeacher && <button onClick={async (e)=>{await deleteRoom(); await props.dispatch(getRooms());}}>Leave This Class Room</button>}
        </div>
    
    )
};

const mapStateToProps = (state)=>({
    isTeacher:state.auth.user.isTeacher 
})

export default connect(mapStateToProps)(RoomListItem);