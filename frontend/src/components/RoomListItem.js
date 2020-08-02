import React from "react";
import {Link} from "react-router-dom";
import moment from "moment";

const RoomListItem = (props)=>(
    <Link to={"/rooms/"+props.room._id}>
    <div>
        <h3>{props.room.className}</h3>
        <span>{moment(props.room.date).format('MMMM Do, YYYY')}</span>
    </div>
    </Link>
);


export default RoomListItem;