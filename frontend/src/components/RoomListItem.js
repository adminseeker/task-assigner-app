import React, { useState } from "react";
import {Link} from "react-router-dom";
import moment from "moment";
import { connect } from "react-redux";
import axios from "axios";
import { getRooms } from "../actions/rooms";

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';



const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  }
});


const RoomListItem = (props)=>{
    const [open, setOpen] = useState(false);
    const handleDelete = async (e)=>{
      setOpen(false);
      await deleteRoom(); 
      await props.dispatch(getRooms());
    }
    
    const handleClose = () => {
      setOpen(false);
    };
    const classes = useStyles();
    const deleteRoom =async ()=>{
        await axios.delete("/api/rooms/"+props.room._id);
    }
    return(
        <Card className={classes.root}>
        <CardActionArea>
        <Link  to={"/rooms/"+props.room._id}>
        <CardMedia
          component="img"
          alt={props.room._id}
          height="120"
          image="/images/classroom.jpg"
          title={props.room.className}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2" color="primary">
          {props.room.className}
          <Typography variant="body" color="textSecondary" component="p">
            Created on {moment(props.room.date).format('MMMM Do, YYYY')}
          </Typography>
          </Typography>
          <Typography gutterBottom variant="h5" component="h5" color="textPrimary">
          {props.room.students.length===1 ? "1 Student" : props.room.students.length + " Students"  } 
          </Typography>
        </CardContent>
        </Link>
      </CardActionArea>
      <CardActions>
      { <Button size="small" color="secondary" onClick={()=>setOpen(true)}>{props.isTeacher ? "Remove" : "Leave"}</Button>}
      </CardActions>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{props.isTeacher ? <Typography variant="h4">Are You sure you want to remove this classroom?</Typography> : <Typography variant="h4">Are you sure you want to leave this classroom?</Typography>}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.isTeacher ? <Typography variant="h5"> Along with this room all materials, assignments and submissions belonging to this classroom will be deleted permanently! </Typography>: <Typography variant="h5"> All your submissions of this classroom will be deleted permanently! </Typography>}
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
        </Card>
        
    )
};

const mapStateToProps = (state)=>({
    isTeacher:state.auth.user.isTeacher

})

export default connect(mapStateToProps)(RoomListItem);