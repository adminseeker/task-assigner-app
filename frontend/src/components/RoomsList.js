import React from "react";
import RoomListItem from "./RoomListItem";
import { connect } from "react-redux";
import LoadingPage from "./LoadingPage";
import AddRoom from "./AddRoom";

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(1), //grid padding
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

const RoomsList = (props) => {
    const classes = useStyles();
    return (
        props.loading_rooms ? <LoadingPage /> :
        <div className={classes.root}>
        <Grid container xs={12} spacing={1} >
            {
                props.rooms.length === 0 ?(
                    <h3>No Classrooms</h3>
                ) : (
                    props.rooms.map((room)=>(
                        
                        <Grid item xs={12} md={6} lg={3} >
                        <RoomListItem key={room._id} room={room} user={props.user} teacher={props.teacher}/>
                        </Grid>
                        
                    ))

                )
                
            }
            <div>
                {
                    props.user.isTeacher && <AddRoom />
                }
            </div>
            </Grid>
        </div>
    )
}

const mapStateToProps= (state)=>({
    rooms:state.rooms.rooms,
    loading_rooms:state.rooms.loading_rooms,
    user:state.auth.user
})

export default connect(mapStateToProps)(RoomsList);

