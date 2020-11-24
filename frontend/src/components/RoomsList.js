import React,{useState} from "react";
import RoomListItem from "./RoomListItem";
import { connect } from "react-redux";
import AddRoom from "./AddRoom";
import axios from "axios";
import {getRooms } from "../actions/rooms";

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
import { joinStudent } from "../actions/auth";
import { Icon } from "@material-ui/core";
import FacebookCircularProgress from "./FacebookCircularProgress";

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
}));

const RoomsList = (props) => {
    const [open, setOpen] = React.useState(false);
    const [className,setClassName] =useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
      if(props.isTeacher){
        await addRoom();
      }else{
        const res = await props.dispatch(joinStudent({invite_id:className}));
        console.log(res);
      }
    await props.dispatch(getRooms());
    setOpen(false);
  };
    const classes = useStyles();
    const addRoom = async ()=>{
        const body = JSON.stringify({className});
        const config = {
            headers:{
                "Content-Type":"application/json"
            }
        }
        await axios.post("/api/rooms/",body,config);
    }
    return (
        props.loading_rooms ? <FacebookCircularProgress /> :
        <div className={classes.root}>
        <Grid container xs={12} spacing={3}>
            {
                props.rooms.length === 0 ?(
                    <h3>No Classrooms</h3>
                ) : (
                    props.rooms.map((room)=>(
                        
                        <Grid item xs={12} md={6} lg={4} >
                        <RoomListItem key={room._id} room={room} user={props.user} teacher={props.teacher}/>
                        </Grid>
                        
                    ))

                )
                
            }
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{props.isTeacher ? "Add New Classroom": "Join Classroom"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
          {props.isTeacher ? "Enter Classroom name to create new classroom.": "Enter Invite code to join classroom."}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label={props.isTeacher ? "Classroom Name": "Invite Code"}
            type="name"
            fullWidth
            onChange={(e)=>{
                setClassName(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary" onClick={handleSubmit}
          >
          {props.isTeacher ? "Create Classroom": "Join"}
          </Button>
        </DialogActions>
      </Dialog>
            
            </Grid>
      <Tooltip title={props.isTeacher ? "Create Classroom": "Join"} aria-label="add" position="right" >
        <Fab color="primary" className={classes.fixed} onClick={handleClickOpen}>
          <AddIcon />
        </Fab>
      </Tooltip>
        </div>
    )
}

const mapStateToProps= (state)=>({
    rooms:state.rooms.rooms,
    loading_rooms:state.rooms.loading_rooms,
    user:state.auth.user,
    isTeacher:state.auth.user.isTeacher
})

export default connect(mapStateToProps)(RoomsList);

