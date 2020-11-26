import React, { useState } from "react";
import { deleteResource} from "../actions/rooms";
import { connect } from "react-redux";

import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Avatar from '@material-ui/core/Avatar';
import { deepOrange, deepPurple,green } from '@material-ui/core/colors';
import { IconButton, Button } from "@material-ui/core";
import { Delete } from "@material-ui/icons";

import AssignmentIcon from '@material-ui/icons/Assignment';
import AssignmentView from "./AssignmentView";

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

const ResourcesListItem = (props)=>{
    const [open, setOpen] = useState(false);
    const handleDelete = async (e)=>{
      setOpen(false);
      await props.dispatch(deleteResource(props.room_id,props.resource._id))
    }
    
    const handleClose = () => {
      setOpen(false);
    };
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
    {props.isTeacher && <IconButton  aria-label="delete" onClick={async (e)=>{setOpen(true)}}><Delete  fontSize="large" /></IconButton>}
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
  <Dialog
  open={open}
  onClose={handleClose}
  aria-labelledby="alert-dialog-title"
  aria-describedby="alert-dialog-description"
>
  <DialogTitle id="alert-dialog-title">{<Typography variant="h4">Are you sure you want to remove this assignment?</Typography>}</DialogTitle>
  <DialogContent>
    <DialogContentText id="alert-dialog-description">
      {<Typography variant="h5">Along with this Assignment  all the submissions for this assignment will also be deleted permanently!</Typography>}
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


