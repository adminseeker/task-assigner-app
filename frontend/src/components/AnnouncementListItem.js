import React from "react";
import moment from "moment";
import { connect } from "react-redux";
import { deleteAnnouncement} from "../actions/rooms";

const AnnouncementListItem = (props)=>(
    <div>
       <h3>{props.announcement.content}</h3> 
       <p>Announced on {moment(props.announcement.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</p>
        <button onClick={(e)=>{
            props.dispatch(deleteAnnouncement(props.room_id,props.announcement._id));
        }}>
                Delete
        </button>
    </div>
);


export default connect()(AnnouncementListItem);