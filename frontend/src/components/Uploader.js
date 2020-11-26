import React,{useState} from "react"; 
import axios from "axios"; 
import { connect } from "react-redux";
import { getSubmissionsByTeacher, getSubmittedStudents } from "../actions/submissions";
import { getTeacherResources, getMaterials } from "../actions/rooms";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { TextField, Typography, Container } from "@material-ui/core";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";


const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1)
    },
    root2: {
      width: "100%",
      "& > * + *": {
        marginTop: theme.spacing(2)
      }
    }
  },
  input: {
    display: "none"
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


const CircularProgressWithLabel = (props)=> {
  return (
    <Box position="relative" display="inline-flex"  style={{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
      <CircularProgress variant="static" {...props} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}
  
const Uploader = (props)=> { 
    const classes = useStyles();
    const [selectedFile,setSelectedFile] = useState(null);
    const [description,setDescription] = useState("");
    const [open, setOpen] = React.useState(false);
    const [progress,setProgress] =useState(0);
    const [openAlert, setOpenAlert] = useState(false);
    const [AlertMsg, setAlertMsg] = useState("");
    const [AlertType, setAlertType] = useState("");


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


    
    const onFileChange = (e) => { 
        setSelectedFile(e.target.files[0]);
    }; 
    
    const onFileUpload = async () => { 
        
        //
        const formData = new FormData();
        formData.append( "file",selectedFile);
        if(!selectedFile){
          setOpenAlert(true);
          setAlertType("error");
          setAlertMsg("Choose File");
        }else{
          if(String(description)===""){
            setOpenAlert(true);
            setAlertType("error");
            setAlertMsg("Enter Description!");
          }else{
            if(props.isMaterial){
              setProgress(0);
              let config = {
                headers: {
                  "description": description
              },
                onUploadProgress: function(progressEvent) {
                  let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                  setProgress(percentCompleted)
                }
                
            }
              
              try{
                  const result = await axios.post("/api/upload/"+props.room_id+"/materials", formData,config);
                  setOpen(false);
                  if(String(result.data.code)==="1"){
                    setOpenAlert(true);
                    setAlertType("success");
                    setAlertMsg("File Uploaded Successfully!");
                  }else{
                    setOpenAlert(true);
                    setAlertType("error");
                    setAlertMsg(result.data.msg);
                  }
                  setProgress(0);
                  await props.dispatch(getMaterials(props.room_id));
              }catch(error){
                  setOpen(false);
                  setOpenAlert(true);
                  setAlertType("error");
                  setAlertMsg("error occured in uploading!!!");
                  setProgress(0);
                  
              }
              
            }else{

            
              if(props.isTeacher){
                setProgress(0);
                let config = {
                  headers: {
                      "description": description
                  },
                  onUploadProgress: function(progressEvent) {
                    let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    setProgress(percentCompleted)
                  }
              }
              try{
                const result = await axios.post("/api/upload/"+props.room_id, formData,config); 
                setOpen(false);
                if(String(result.data.code)==="1"){
                  setOpenAlert(true);
                  setAlertType("success");
                  setAlertMsg("File Uploaded Successfully!");
                }else{
                  setOpenAlert(true);
                  setAlertType("error");
                  setAlertMsg(result.data.msg);
                }
                setProgress(0);
                await props.dispatch(getTeacherResources(props.room_id));
              }catch(error){
                  setOpen(false);
                  setOpenAlert(true);
                  setAlertType("error");
                  setAlertMsg("error occured in uploading!!!");
                  setProgress(0);
                  
              }
              }else{
                setProgress(0);
                let config = {
                  headers: {
                      "description": description,
                      "resource_id": props.resource_id
                  },
                  onUploadProgress: function(progressEvent) {
                    let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    setProgress(percentCompleted)
                  }
              }
                try{
                  const result = await axios.post("/api/upload/"+props.room_id, formData,config);
                  setOpen(false);
                  if(String(result.data.code)==="1"){
                    setOpenAlert(true);
                    setAlertType("success");
                    setAlertMsg("File Uploaded Successfully!");
                  }else{
                    setOpenAlert(true);
                    setAlertType("error");
                    setAlertMsg(result.data.msg);
                  }
                  setProgress(0);
                  await props.dispatch(getSubmissionsByTeacher(props.room_id,props.resource_id));
                  await props.dispatch(getSubmittedStudents(props.room_id,props.submittedIDs));
                }catch(error){
                    setOpen(false);
                    setOpenAlert(true);
                    setAlertType("error");
                    setAlertMsg("error occured in uploading!!!");
                    setProgress(0);
                    
                }
                
              }
            }
          }
        }
    }; 
    const fileData = () => {  
        return selectedFile ? 
        <Typography style={{paddingTop:"0.5rem",paddingLeft:"0.5rem"}}>
               {selectedFile.name}
        </Typography> :
        <Typography style={{paddingTop:"0.5rem",paddingLeft:"0.5rem"}}>
            No File Selected
        </Typography>
    }; 
    return ( 
    <div className={classes.root}> 
                
              {
                <div>
                <CustomizedAlert open={openAlert} msg={AlertMsg} AlertType={AlertType} setOpen={setOpenAlert}/>
                <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
               {  <DialogTitle id="form-dialog-title">{props.isTeacher ? ( props.isMaterial ? "Add Materials" : "Add Assignments") : "Add Submissions" }</DialogTitle> }
                {progress!==0 ? <CircularProgressWithLabel value={progress}/> : 
                <DialogContent>
                  <DialogContentText>
                  <input className={classes.input} type="file" id="contained-button-file" onChange={onFileChange} /> 
                <label htmlFor="contained-button-file">
                <Container>
                <div style={{display:"flex",flexDirection:"row"}}>
                <Button variant="contained" color="primary" component="span">
                  Choose File
                </Button>
                {fileData()}
                </div>
                </Container>
                </label>
                  </DialogContentText>
                <TextField type="text" value={description} placeholder="Enter description" fullWidth onChange={(e)=>(setDescription(e.target.value))}/>
                </DialogContent>}
                { <DialogActions>
                  <Button onClick={handleClose} color="primary" disabled={progress!==0}>
                  Cancel
                  </Button>
                  <Button
                variant="contained"
                color="default"
                className={classes.button}
                startIcon= {<CloudUploadIcon />}
                disabled={progress!==0}
                onClick={onFileUpload}
                >
                Upload
              </Button>
                </DialogActions>}
              </Dialog>
              <Tooltip title={props.isTeacher ? ( props.isMaterial ? "Add Materials" : "Add Assignments") : "Add Submissions" } aria-label="add" position="right" >
                <Fab color="primary" className={classes.fixed} onClick={handleClickOpen}>
                  <AddIcon />
                </Fab>
              </Tooltip>
                </div>
              }

    </div> 
    )          
} 
     
export default connect()(Uploader); 

