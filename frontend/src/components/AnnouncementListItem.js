import React from "react";
import moment from "moment";
import { connect } from "react-redux";
import { deleteAnnouncement} from "../actions/rooms";
import { Typography, Button } from "@material-ui/core";
import {Delete} from "@material-ui/icons"
 
const AnnouncementListItem = (props)=>{
    console.log(props.announcement.content)
    return (
    <div style={{padding:"2rem"}}>
        <Typography variant="h4" >
       {props.announcement.content.split("\n").map((content)=>(
           <div>
           {content}
           </div>
       ))} 
        </Typography>
        <Typography variant="p" style={{width:"auto"}} color="secondary">
        {moment(props.announcement.createdAt).format('MMM DD, h:mm a')}
        </Typography>
        {props.isTeacher && <Button style={{float:"right"}} 
        variant="contained"
        color="secondary"
        startIcon={<Delete />}
        onClick={(e)=>{
            props.dispatch(deleteAnnouncement(props.room_id,props.announcement._id));
        }}>
                Delete
        </Button>}
    </div>
    )
};

export default connect()(AnnouncementListItem);