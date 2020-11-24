import React,{useState} from "react";
import moment from "moment";
import { connect } from "react-redux";
import { deleteAnnouncement} from "../actions/rooms";
import { Typography, Button } from "@material-ui/core";
import {Delete} from "@material-ui/icons"

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


 
const AnnouncementListItem = (props)=>{
    const [open, setOpen] = useState(false);
    const handleDelete = async (e)=>{
      setOpen(false);
      await props.dispatch(deleteAnnouncement(props.room_id,props.announcement._id));
    }
    
    const handleClose = () => {
      setOpen(false);
    };
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
            setOpen(true);
        }}>
                Delete
        </Button>}
        <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{<Typography variant="h4">Are You sure you want to remove this Announcement?</Typography>}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {<Typography variant="h5"> This Announcement will be deleted from this classroom permanently! </Typography>}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
          <Button onClick={handleDelete} color="secondary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    )
};

export default connect()(AnnouncementListItem);