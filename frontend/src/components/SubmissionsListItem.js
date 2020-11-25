import React,{useState} from "react";
import moment from "moment";
import { connect } from "react-redux";
import { deleteSubmission } from "../actions/submissions";

import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Avatar from '@material-ui/core/Avatar';
import { deepOrange, deepPurple,green } from '@material-ui/core/colors';
import { IconButton, Container, Button } from "@material-ui/core";
import { Delete } from "@material-ui/icons";

import PageviewIcon from '@material-ui/icons/Pageview';
import AssignmentIcon from '@material-ui/icons/Assignment';
import AssignmentView from "./AssignmentView";
import FacebookCircularProgress from "./FacebookCircularProgress";
import { getSubmissionsByTeacher } from "../actions/submissions";

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
    green: {
        color: '#fff',
        backgroundColor: green[500],
      },
  }));


const SubmissionsListItem = (props)=>{
  const [open, setOpen] = useState(false);
    const handleDelete = async (e)=>{
      setOpen(false);
      await props.dispatch(deleteSubmission(props.room_id,props.submission._id,props.submission))
    }
    
    const handleClose = () => {
      setOpen(false);
    };
    const classes = useStyles();
    return !props.isTeacher ? (
        
    <div>
    <Accordion>
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls="panel1a-content"
      id="panel1a-header"
    >
    <div className={classes.root2} style={{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
        
    <Avatar className={classes.green}> <AssignmentIcon /> </Avatar>
    
      <Typography className={classes.heading}>
      
      {props.submission.description}
      </Typography>
      
      </div>
      <div style={{position:"absolute",right:"4rem",top:"1.6rem"}}>
    {<IconButton  aria-label="delete" onClick={async (e)=>{setOpen(true)}}><Delete  fontSize="large" /></IconButton>}
    </div>
    </AccordionSummary>
    <AccordionDetails>
    
      <div style={{display:"flex",flexDirection:"column",justifyContent:"center"}}>
      <Typography>
        File : <a href={props.submission.submission} target="_blank" rel="noopener noreferrer">{props.submission.submission.split("/").pop().slice(25)}</a>
      </Typography>
      <Typography>
        Submitted On: {moment(props.submission.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
      </Typography>
      {(new Date(props.resource.deadline) < new Date(props.submission.createdAt)) && <Typography variant="h5" color="secondary">
        Deadline Exceeded!
      </Typography>}
      
      </div>
    
    </AccordionDetails>
  </Accordion>
  <Dialog
  open={open}
  onClose={handleClose}
  aria-labelledby="alert-dialog-title"
  aria-describedby="alert-dialog-description"
>
  <DialogTitle id="alert-dialog-title">{<Typography variant="h4">Are you sure you want to remove this submission?</Typography>}</DialogTitle>
  <DialogContent>
    <DialogContentText id="alert-dialog-description">
      {<Typography variant="h5">This submission will be deleted permanently!</Typography>}
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
    ) : (
     
    <div>
    <div style={{display:"flex", flexDirection:"row"}}>
    <Typography variant="h4"> {props.submission.description}</Typography>
    {<IconButton  style={{position:"absolute",right:0}} aria-label="delete" onClick={async (e)=>{setOpen(true)}}><Delete  fontSize="large" /></IconButton>}
    </div>
    <Typography variant="h5">
        File : <a href={props.submission.submission} target="_blank" rel="noopener noreferrer">{props.submission.submission.split("/").pop().slice(25)}</a>
      </Typography>
    <Typography variant="h5">Submitted On {moment(props.submission.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</Typography>
    {(new Date(props.resource.deadline) < new Date(props.submission.createdAt)) && <Typography variant="h5" color="secondary">
        Deadline Exceeded!
      </Typography>}
    <Dialog
  open={open}
  onClose={handleClose}
  aria-labelledby="alert-dialog-title"
  aria-describedby="alert-dialog-description"
>
  <DialogTitle id="alert-dialog-title">{<Typography variant="h4">Are you sure you want to remove this submission?</Typography>}</DialogTitle>
  <DialogContent>
    <DialogContentText id="alert-dialog-description">
      {<Typography variant="h5">This submission will be deleted permanently!</Typography>}
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
    </div>)
}

const mapStateToProps = (state,props)=>({
  resource_id:props.resource_id,
  resource:state.rooms.resources.find((resource)=>resource._id===String(props.resource_id))
})

export default connect(mapStateToProps)(SubmissionsListItem);

// <div className="flex-child">
        
//             {props.isTeacher && <h4><a className="link-blue-style margin_0-submissions" href={props.submission.submission} target="_blank" rel="noopener noreferrer">{props.submission.description}</a> - {moment(props.submission.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</h4>}
//             </div>
//             <div>
//             {!props.isTeacher && <h4><a className="link-blue-style-center margin_0-submissions" href={props.submission.submission} target="_blank" rel="noopener noreferrer">{props.submission.description}</a> - {moment(props.submission.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</h4>}
//             </div>
        
//         <div className="flex-child">
//         <button onClick={async(e)=>{
//             await props.dispatch(deleteSubmission(props.room_id,props.submission._id,props.submission))
//         }}>
//                 Delete
//         </button>
//         </div>