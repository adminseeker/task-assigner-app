import React from "react";
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
import Grid from '@material-ui/core/Grid';



const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  }
});


const RoomListItem = (props)=>{
    const classes = useStyles();
    const deleteRoom =async ()=>{
        await axios.delete("/api/rooms/"+props.room._id);
    }
    return(
        <Card className={classes.root}>
        <CardActionArea>
        <CardMedia
          component="img"
          alt={props.room._id}
          height="120"
          image="/images/classroom.jpg"
          title={props.room.className}
        />
        <Link  to={"/rooms/"+props.room._id}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2" color="primary">
          {props.room.className}
          <Typography variant="body" color="textSecondary" component="p">
            Created on {moment(props.room.date).format('MMMM Do, YYYY')}
          </Typography>
          </Typography>
          <Typography gutterBottom variant="h5" component="h5" color="textPrimary">
          students:{props.room.students.length}
          </Typography>
        </CardContent>
        </Link>
      </CardActionArea>
      <CardActions>
      {props.isTeacher && <Button size="small" color="secondary" onClick={async (e)=>{await deleteRoom(); await props.dispatch(getRooms());}}>Remove</Button>}
      {!props.isTeacher && <Button size="small" color="secondary" onClick={async (e)=>{await deleteRoom(); await props.dispatch(getRooms());}}>Leave This Class Room</Button>}
      </CardActions>
        </Card>
        
    )
};

const mapStateToProps = (state)=>({
    isTeacher:state.auth.user.isTeacher

})

export default connect(mapStateToProps)(RoomListItem);