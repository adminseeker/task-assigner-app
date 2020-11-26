import React, { useEffect, useState } from "react";
import useSWR from "swr";
import moment from "moment";
import {getSubmissionsByTeacher,getSubmittedStudents, getSubmissions} from "../actions/submissions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import FacebookCircularProgress from "./FacebookCircularProgress";
import StudentListItem from "./StudentListItem";
import SubmissionsList from "./SubmissionsList";
import StudentSubmissionsList from "./StudentSubmissionsList";
import Uploader from "./Uploader";
import {updateDeadline} from "../actions/rooms"

import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

import AlarmIcon from '@material-ui/icons/Alarm';
import { IconButton, makeStyles, Typography } from "@material-ui/core";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";


const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root2: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2)
    }
  }
}));

const CustomizedAlert = (props) => {
  const classes = useStyles();
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    props.setOpen(false);
  };

  return (
    <div className={classes.root2}>
      <Snackbar
        open={props.open}
        autoHideDuration={4000}
        
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity={props.AlertType}>
          <Typography variant="h5">
            {props.msg}
          </Typography>
        </Alert>
      </Snackbar>
    </div>
  );
}

const  MaterialUIPickers = (props) => {

  const handleDateChange = (date) => {
    props.setSelectedDate(date);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify="space-around">
        <KeyboardDatePicker
          margin="normal"
          id="date-picker-dialog"
          label="Date"
          format="MM/dd/yyyy"
          value={props.selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        <KeyboardTimePicker
          margin="normal"
          id="time-picker"
          label="Time"
          value={props.selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change time',
          }}
        />
      </Grid>
    </MuiPickersUtilsProvider>
  );
}

const AssignmentView = ({resource:{_id,resource,createdAt,deadline,description},loading_submissions,isTeacher,room_id,updateDeadline,submissions,getSubmissionsByTeacher,students,user})=>{
    const [clickedTime,setClickedTime] = useState(false);
    const [selectedDate, setSelectedDate] = useState(deadline);
    const [openAlert, setOpenAlert] = useState(false);
    const [AlertMsg, setAlertMsg] = useState("");
    const [AlertType, setAlertType] = useState("");
    const handleDeadline =async (e)=>{
        setClickedTime(false);
        e.preventDefault();
        await updateDeadline(room_id,_id,selectedDate);
        setOpenAlert(true);
        setAlertType("success");
        setAlertMsg("Deadline Updated And sent Mail to students of this classroom!");

    }
    // useEffect(()=>{
    //     getSubmissionsByTeacher(room_id,_id);
    // },[room_id,_id,getSubmissions]);
    const classes = useStyles();
    return (   
        <div>
           <CustomizedAlert open={openAlert} msg={AlertMsg} AlertType={AlertType} setOpen={setOpenAlert}/>

            <p>Added On {moment(createdAt).format('MMMM Do YYYY, h:mm:ss a')}</p>
            <p>Deadline {moment(deadline).format('MMMM Do YYYY, h:mm:ss a')} 
            <IconButton color="secondary" aria-label="add an alarm" onClick={(e)=>setClickedTime(!clickedTime)}>
                <AlarmIcon />
            </IconButton>
            </p>
            {clickedTime &&<div style={{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center"}}> <MaterialUIPickers selectedDate={selectedDate} setSelectedDate={setSelectedDate}/> <IconButton style={{color:"green",marginBottom:"-2.75rem"}} aria-label="add an alarm" onClick={handleDeadline}>
            <CheckCircleOutlineIcon />
        </IconButton> </div>}
             
            <Link to={"/rooms/"+room_id+"/assignments/"+_id+"/submissions"}>{isTeacher ? "View Submissions" : "Add/View Submissions"}</Link>
        </div>
    );
}


const mapStateToProps=(state,props)=>({
    submissions:state.submissions.submissions,
    loading_submissions:state.submissions.loading_submissions,
    isTeacher:state.auth.user.isTeacher,
    user:state.auth.user,
    students:state.rooms.students
})


export default connect(mapStateToProps,{getSubmissionsByTeacher,getSubmittedStudents,updateDeadline})(AssignmentView);




