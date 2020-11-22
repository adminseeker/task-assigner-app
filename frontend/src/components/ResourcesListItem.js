import React, { useState } from "react";
import moment from "moment";
import { deleteResource,updateDeadline } from "../actions/rooms";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Avatar from '@material-ui/core/Avatar';
import { deepOrange, deepPurple,green } from '@material-ui/core/colors';
import { IconButton, Container } from "@material-ui/core";
import { Delete } from "@material-ui/icons";

import PageviewIcon from '@material-ui/icons/Pageview';
import AssignmentIcon from '@material-ui/icons/Assignment';
import AssignmentView from "./AssignmentView";
import LoadingPage from "./LoadingPage";
import { getSubmissionsByTeacher } from "../actions/submissions";

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    root2: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    orange: {
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: deepOrange[500],
    },
    purple: {
      color: theme.palette.getContrastText(deepPurple[500]),
      backgroundColor: deepPurple[500],
    },
    green: {
        color: '#fff',
        backgroundColor: green[500],
      },
  }));

const ResourcesListItem = (props)=>{
    const [deadline,setDeadline] = useState("");
    const classes = useStyles();
    return (
    <div>
    <Accordion expanded={props.exp===String(props.resource._id)} onChange={props.handleChange(String(props.resource._id))}>
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls="panel1a-content"
      id="panel1a-header"
    >
    <div className={classes.root2} style={{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
        
    <Avatar className={classes.green}> <AssignmentIcon /> </Avatar>
    
      <Typography className={classes.heading}>
      
      {props.resource.description}
      </Typography>
      
      </div>
      <div style={{position:"absolute",right:"4rem",top:"1.6rem"}}>
    {props.isTeacher && <IconButton  aria-label="delete" onClick={async (e)=>{await props.dispatch(deleteResource(props.room_id,props.resource._id))}}><Delete  fontSize="large" /></IconButton>}
    </div>
    </AccordionSummary>
    <AccordionDetails>
    {
        <div style={{display:"flex",flexDirection:"column",justifyContent:"center"}}>
      <Typography>
        File : <a href={props.resource.resource} target="_blank" rel="noopener noreferrer">{props.resource.resource.split("/").pop().slice(25)}</a>
      </Typography>
      <Typography>
        <AssignmentView resource={props.resource} room_id={props.room_id}/>
      </Typography>
      
      </div>
    }
    </AccordionDetails>
  </Accordion>

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

export default connect(mapStateToProps)(ResourcesListItem);


// <Link to={"/rooms/"+props.room_id+"/assignments/"+props.resource._id}>{props.resource.description}</Link>
//         <p>Deadline:{moment(props.resource.deadline).format('MMMM Do YYYY, h:mm:ss a')}</p>
//         <div>
//         {
//             props.isTeacher &&
//             <button onClick={(e)=>{
//                 props.dispatch(deleteResource(props.room_id,props.resource._id))
//             }}>
//                     Delete
//             </button> }
//         { props.isTeacher && <input type="text" placeholder="Update deadline" value={deadline} onChange={(e)=>{
//             setDeadline(e.target.value);
//         }}/>   }
//         {
         
//             props.isTeacher && <button onClick={async (e)=>{
//                 await props.dispatch(updateDeadline(props.room_id,props.resource._id,deadline));
//                 setDeadline("");
//                 alert("deadline updated");
//              }}>Update Deadline</button>
        
//         }
          
//         </div>