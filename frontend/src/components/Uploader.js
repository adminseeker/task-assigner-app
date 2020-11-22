import React,{useState} from "react"; 
import axios from "axios"; 
import { connect } from "react-redux";
import { getSubmissions, getSubmissionsByTeacher, getSubmittedStudents } from "../actions/submissions";
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

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1)
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
  
const Uploader = (props)=> { 
    const classes = useStyles();
    const [selectedFile,setSelectedFile] = useState(null);
    const [description,setDescription] = useState("");
    const [open, setOpen] = React.useState(false);
    const [className,setClassName] =useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    setOpen(false);
  };
    
    const onFileChange = (e) => { 
        setSelectedFile(e.target.files[0]);
    }; 
    
    const onFileUpload = async () => { 
        setOpen(false);
        const formData = new FormData();
        formData.append( "file",selectedFile);
        console.log(formData)
        if(!selectedFile){
          alert("choose file!");
        }else{
          if(description==""){
            alert("Enter Description!");
          }else{
            if(props.isMaterial){
              let config = {
                headers: {
                    "description": description
                }
            }
              const result = await axios.post("/api/upload/"+props.room_id+"/materials", formData,config); 
              alert(result.data.msg);
              await props.dispatch(getMaterials(props.room_id));
            }else{

            
              if(props.isTeacher){
                let config = {
                  headers: {
                      "description": description
                  }
              }
                const result = await axios.post("/api/upload/"+props.room_id, formData,config); 
                alert(result.data.msg);
                await props.dispatch(getTeacherResources(props.room_id));
              }else{
                let config = {
                  headers: {
                      "description": description,
                      "resource_id": props.resource_id
                  }
              }
                const result = await axios.post("/api/upload/"+props.room_id, formData,config);
                alert(result.data.msg);
                await props.dispatch(getSubmissionsByTeacher(props.room_id,props.resource_id));
                await props.dispatch(getSubmittedStudents(props.room_id,props.submittedIDs));
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
                <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add Materials</DialogTitle>
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
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    Cancel
                  </Button>
                  <Button
                variant="contained"
                color="default"
                className={classes.button}
                startIcon={<CloudUploadIcon />}
                onClick={onFileUpload}
                >
                Upload
              </Button>
                </DialogActions>
              </Dialog>
              <Tooltip title="Add Materials" aria-label="add" position="right" >
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


// <input className={classes.input} type="file" id="contained-button-file" onChange={onFileChange} /> 
//                 <label htmlFor="contained-button-file">
//                 <Container>
//                 <div>
//                 <Button variant="contained" color="primary" component="span">
//                   Choose File
//                 </Button>
//                 {fileData()}
//                 </div>
//                 </Container>
//                 </label>
//                 <TextField type="text" value={description} placeholder="Enter description" onChange={(e)=>(setDescription(e.target.value))}/>