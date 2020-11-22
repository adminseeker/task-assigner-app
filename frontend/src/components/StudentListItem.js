import React from "react";
import {Link} from "react-router-dom";
import { connect } from "react-redux";
import LoadingPage from "./LoadingPage";
import axios from "axios";
import { getRoomUsers } from "../actions/rooms";

import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Avatar from '@material-ui/core/Avatar';
import { deepOrange, deepPurple } from '@material-ui/core/colors';
import { IconButton, Container } from "@material-ui/core";
import { Delete } from "@material-ui/icons";

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
}));


const StudentListItem = (props)=>{
    const classes = useStyles();
    const removeStudent = async ()=>{
        await axios.delete("/api/rooms/"+props.room_id+"/students/"+props.student._id);
        console.log("deleted student!");
    }
    return(
        props.loading_users ? <LoadingPage /> : 
        <div>
        {!props.assignment &&
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
        <div className={classes.root2} style={{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
            
            <Avatar className={classes.orange}>{props.student.name[0]}</Avatar>
        
          <Typography className={classes.heading}>
          
          {props.student.name}
          </Typography>
          
          </div>
          <div style={{position:"absolute",right:"4rem",top:"1.6rem"}}>
        {props.isTeacher && !props.assignment && <IconButton  aria-label="delete" onClick={async (e)=>{await removeStudent(); await props.dispatch(getRoomUsers(props.room_id));}}><Delete  fontSize="large" /></IconButton>}
        </div>
        </AccordionSummary>
        <AccordionDetails>
            <div style={{display:"flex",flexDirection:"column",justifyContent:"center"}}>
          <Typography>
            Email : {props.student.email}
          </Typography>
          <Typography>
            {props.isTeacher && "Phone : " + props.student.phone}
          </Typography>
          
          </div>
        </AccordionDetails>
      </Accordion>
        }
    </div>
    )
};


const mapStateToProps = (state,props)=>({
    loading_users:state.rooms.loading_users,
    isTeacher:state.auth.user.isTeacher
})

export default connect(mapStateToProps)(StudentListItem);

// <div>
//             { !props.assignment &&
//             <Link className="link-blue-style" to={"/profile/student/"+props.student._id}>
//                 <p className="margin_0-submissions">{props.student.name}</p>
//             </Link>
//             }
//              {props.isTeacher && !props.assignment && <button onClick={async (e)=>{await removeStudent(); await props.dispatch(getRoomUsers(props.room_id));}}>Remove</button>}
//             {
//                 props.assignment && 
//                 <Link className="link-blue-style" to={"/rooms/"+props.room_id+"/assignments/"+props.resource_id+"/submissions/"+props.student._id}>
//                 <p className="margin_0-submissions">{props.student.name}</p>
//                 </Link>
//             }    
//         </div>
