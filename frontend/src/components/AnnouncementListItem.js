import React,{useState} from "react";
import moment from "moment";
import { connect } from "react-redux";
import { deleteAnnouncement} from "../actions/rooms";
import { Typography, Button, makeStyles } from "@material-ui/core";
import {Delete} from "@material-ui/icons"

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import AnnouncementIcon from '@material-ui/icons/Announcement';


const useStyles = makeStyles((theme) => ({
  announcementicon:{
    position: "relative",
    float: "left"
  },
  announcementiconsize:{
    fontSize:"5rem",
    marginRight:"1.5rem"
  },
  announcementcontent:{
    display: "inline-block"
  },
  deleteicon:{
    display: "inline-block",
    position: "relative",
    float: "right"
  },
  
}));

 
const AnnouncementListItem = (props)=>{
    const [open, setOpen] = useState(false);
    const classes = useStyles();
    const handleDelete = async (e)=>{
      setOpen(false);
      await props.dispatch(deleteAnnouncement(props.room_id,props.announcement._id));
    }
    
    const handleClose = () => {
      setOpen(false);
    };
    return (
    <div style={{paddingBottom:"2rem"}}>
        <div style={{display:"flex",flexDirection:"row"}}>
        <div>
        <AnnouncementIcon className={classes.announcementiconsize}/>
        </div>
        <div>
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
        </div>
        </div>
        {props.isTeacher && <Button  
          color="secondary"  
          aria-label="delete" 
          variant="contained"
          startIcon={<Delete />}
          style={{float:"right"}}
          onClick={async (e)=>{setOpen(true)}}
          >Delete
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