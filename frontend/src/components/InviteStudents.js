import React, { useState } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { getRoomUsers } from "../actions/rooms";

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Send} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(1), //grid padding
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },fab: {
      margin: theme.spacing(2),
  
    },
    fixed: {
      position: 'fixed',
      bottom: theme.spacing(4),
      right: theme.spacing(4),
    },
    button: {
        margin: theme.spacing(1),
      },
  }));

const InviteStudents = (props) => {
    const [students,setStudents] =useState("");
    const [open, setOpen] = React.useState(false);
    const [className,setClassName] =useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
      setOpen(false);
      const msg = await inviteStudents(students);
      alert(msg);
  };
    const classes = useStyles();
    const inviteStudents = async (students)=>{
        const studentEmails = students.split(",");
        const body = JSON.stringify({studentEmails});
        const config = {
            headers:{
                "Content-Type":"application/json"
            }
        }
        const res = await axios.post("/api/rooms/"+props.room_id+"/students/invite",body,config);
        console.log(res.data);
        props.dispatch(getRoomUsers(props.room_id));
        if(res.data.msg=="Invite Sent"){
            return "Invite sent to "+studentEmails.join();
        }else{
            return "Invite failed!";
        }
    }
    return (
        <div className={classes.root}>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Invite Students</DialogTitle>
        <DialogContent>
          <DialogContentText>
          Enter Student Emails separated by commas to Invite Students
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Emails"
            type="name"
            fullWidth
            onChange={(e)=>{
                setStudents(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" variant="contained">
            Cancel
          </Button>
          <Button onClick={handleSubmit}
          variant="contained"
          color="primary"
          className={classes.button}
          endIcon={<Send/>}
          >Send</Button>
        </DialogActions>
      </Dialog>
      <Tooltip title="Invite" aria-label="Invite" position="right" >
        <Fab color="primary" className={classes.fixed} onClick={handleClickOpen}>
          <AddIcon />
        </Fab>
      </Tooltip>
            
        </div>
    )
}

const mapStateToProps=(state,props)=>({
    room_id:props.room_id
})

export default connect(mapStateToProps)(InviteStudents);

// <p>Enter Student Emails separated by commas to Invite Students</p>
//             <input type="text" value={students} onChange={(e)=>{
//                 setStudents(e.target.value);
//             }}/><br />
            