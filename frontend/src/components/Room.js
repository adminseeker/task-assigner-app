import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {getRoomUsers,getAnnouncements,addAnnouncement} from "../actions/rooms";
import StudentListItem from "./StudentListItem";
import FacebookCircularProgress from "./FacebookCircularProgress";
import { Link as RouterLink } from "react-router-dom";
import ResourcesList from "./ResourcesList";
import Uploader from "./Uploader";
import AnnouncementsList from "./AnnouncementsList";
import { Container, Paper, Typography,Link, Toolbar, TextField, Button } from "@material-ui/core";

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles'
import { Add } from "@material-ui/icons";

import EmailIcon from '@material-ui/icons/Email';

const useStyles = makeStyles(theme => ({
  marginAutoContainer: {
    width: 500,
    height: 80,
    display: 'flex',
    backgroundColor: 'gold',
  },
  marginAutoItem: {
    margin: 'auto'
  },
  alignItemsAndJustifyContent: {
    display: 'flex',
    alignItems: 'center',
    flexDirection:"column",
    justifyContent: 'center',
    width:"50%",
  },
  '@media (max-width: 1024px)': {
    alignItemsAndJustifyContent: {
        width:"100%"
    }
},
  paper1:{
      marginTop:"5rem",
      width:"100%",
      height:"18rem",
      backgroundImage: `url(${"/images/classroom_dark.jpg"})`,
      display:"flex",
      flexDirection:"column",
      justifyContent: 'center',
      padding:"2rem"
  },
  paper2:{
    marginTop:"1rem",
    width:"100%",
    display:"flex",
    flexDirection:"column",
    justifyContent: 'center',
    padding:"5rem",
    backgroundColor:"#f0f0f0"
},

  heading:{
      color:"white"
  },
  teacherLink:{
    color:"#abf",
    fontSize:"2rem"
},
linkBar: {
    backgroundColor: theme.palette.background.paper,
    width:"100%",
    },
linkBarContainer:{
    display:"flex",
    flexDirection:"row",
    justifyContent:"space-between",
},
resize:{
    fontSize:20,
    padding:"1rem",
    lineHeight:"2.4rem"
}
}))

const Room = ({getRoomUsers,room:{className,_id},teacher,students,isTeacher,loading_users,loading_announcements,getAnnouncements,addAnnouncement,match:{params:{id}}}) => {
    const classes = useStyles();
    useEffect(()=>{
        getRoomUsers(_id);
        getAnnouncements(_id);
    },[getRoomUsers,getAnnouncements,_id]);
    const [content, setContent] = useState("");
    const [value, setValue] = React.useState(0);
    const [mailClick,setMailClick] = useState(false)

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };  
    return (
            loading_users ? <FacebookCircularProgress /> :
             <div >
             <Container className={classes.alignItemsAndJustifyContent} xs={12}>
                <Paper className={classes.paper1}>
                <Typography variant="h3" className={classes.heading}>
                {className}
                </Typography>
                <Typography variant="p" style={{fontSize:"2rem",color:"#abf"}}>
                {teacher.name}
                <Button onClick={(e)=>setMailClick(!mailClick)}> {<EmailIcon style={{fontSize:"1.75rem",color:"#abf",marginBottom:"0.70rem"}}/>} </Button>
                </Typography>
                {mailClick && <Typography variant="p" style={{fontSize:"2rem",color:"#abf"}}>
                  {teacher.email}
                </Typography>}
                </Paper>
                <div className={classes.linkBar}>
                    <AppBar position="static" color="default" >
                        <Toolbar>
                        <Container className={classes.linkBarContainer}>
                        <Link component={RouterLink} to={"/rooms/"+_id+"/students"}>Students</Link>
                        <Link component={RouterLink} to={"/rooms/"+_id+"/assignments"}>Assignments</Link>
                        <Link component={RouterLink} to={"/rooms/"+_id+"/materials"}>Materials</Link>
                        </Container>
                        </Toolbar>
                        
                        
                    </AppBar>
                    </div>
                <Paper className={classes.paper2}>
                {isTeacher &&
                    <form onSubmit={async (e)=>{
                        e.preventDefault();
                        await addAnnouncement(content,_id);
                    }}>
                    {/*<input type="text" name="content" placeholder="Announcement" value={content} onChange={(e)=>{setContent(e.target.value)}}></input>*/}
                    <TextField
                    type="text"
                    name="content"
                    placeholder="Announcement"
                    value={content}
                    multiline
                    rows={4}
                    style={{width:"100%",background:"white"}}
                    InputProps={{
                        classes: {
                          input: classes.resize
                        },
                      }}
                    onChange={(e)=>{setContent(e.target.value)}}
                    variant="outlined"
                    >

                    </TextField>
                       <Button
                       type="submit"
                       variant="contained"
                       color="primary"
                       style={{marginTop:"2rem",float:"right"}}
                       startIcon={<Add />}
                       >Add</Button>

            
            
                       </form>}
                {<AnnouncementsList room_id={_id}/>}
                
                     </Paper>
                     </Container>
            </div>
    )
}

const mapStateToProps = (state,props)=>({
    room: state.rooms.rooms.find((room)=>(room._id === props.match.params.id)),
    teacher:state.rooms.teacher,
    students:state.rooms.students,
    isTeacher:state.auth.user.isTeacher,
    loading_users:state.rooms.loading_users,
    loading_announcements:state.rooms.loading_announcements
})

export default connect(mapStateToProps,{getRoomUsers,getAnnouncements,addAnnouncement})(Room);