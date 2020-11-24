import React,{useState} from "react";
import {Link} from "react-router-dom";
import { connect } from "react-redux";
import FacebookCircularProgress from "./FacebookCircularProgress";
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
import { IconButton, Container, Button } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import SubmissionsList from "./SubmissionsList";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


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
  const [open, setOpen] = useState(false);
  const handleDelete = async (e)=>{
    setOpen(false);
    await removeStudent(); 
    await props.dispatch(getRoomUsers(props.room_id));
  }
  
  const handleClose = () => {
    setOpen(false);
  };
    const classes = useStyles();
    const removeStudent = async ()=>{
        await axios.delete("/api/rooms/"+props.room_id+"/students/"+props.student._id);
        console.log("deleted student!");
    }
    return(
        props.loading_users ? <FacebookCircularProgress /> : 
        <div>
        {
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
        {props.isTeacher && !props.assignment && <IconButton  aria-label="delete" onClick={async (e)=>{setOpen(true)}}><Delete  fontSize="large" /></IconButton>}
        </div>
        </AccordionSummary>
        <AccordionDetails>
           { !props.assignment && <div style={{display:"flex",flexDirection:"column",justifyContent:"center"}}>
          <Typography>
            Email : {props.student.email}
          </Typography>
          <Typography>
            {props.isTeacher && "Phone : " + props.student.phone}
          </Typography>
          
          </div>}
          {
              props.assignment && 
              <Typography>
              
              <SubmissionsList resource_id={props.resource_id}  room_id={props.room_id} student_id={props.student._id}/>
              </Typography>
          }
        </AccordionDetails>
      </Accordion>
        }
        <Dialog
  open={open}
  onClose={handleClose}
  aria-labelledby="alert-dialog-title"
  aria-describedby="alert-dialog-description"
>
  <DialogTitle id="alert-dialog-title">{<Typography variant="h4">Are you sure you want to remove this student from this classroom?</Typography>}</DialogTitle>
  <DialogContent>
    <DialogContentText id="alert-dialog-description">
      {<Typography variant="h5">Along with the student all his submissions of this classroom will also be deleted permanently!</Typography>}
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
