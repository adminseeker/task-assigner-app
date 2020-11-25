import React, { useEffect,useState } from "react";
import ResorcesListItem from "./ResourcesListItem";
import { connect } from "react-redux";
import FacebookCircularProgress from "./FacebookCircularProgress";
import { getTeacherResources } from "../actions/rooms";
import { getSubmissionsByTeacher } from "../actions/submissions";
import Uploader from "./Uploader";

import { makeStyles, Container, Paper, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
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
    studentsContainer:{
        marginTop:"5rem",
        width:"100%",
        display:"flex",
        flexDirection:"column",
        justifyContent: 'center',
        padding:"2rem"
    },
  }));

const ResourcesList = ({room:{_id},getTeacherResources,resources,loading_resources,isTeacher,getSubmissionsByTeacher}) => {
    useEffect(()=>{
        getTeacherResources(_id)
    },[getTeacherResources,_id])
    const classes = useStyles();
    const [exp,setExp] = useState(false);
    const handleChange = (panel) =>async (event, isExpanded) => {
        if(isExpanded!==false){
            await getSubmissionsByTeacher(_id,panel);
        }
        setExp(isExpanded ? panel : false);
      };
    return (
        loading_resources ? <FacebookCircularProgress /> : 
        <div className={classes.root}>
        <Container className={classes.alignItemsAndJustifyContent} xs={12} >
                <div className={classes.studentsContainer}>
                <div style={{textAlign:"center"}}>
                    <Typography variant="h2">
                        Assignments
                    </Typography>
                </div>
            {
                resources.length === 0 ?(
                    <h3>No Assignments</h3>
                ) : (
                    resources.map((resource)=>(
                        <ResorcesListItem key={resource._id} room_id={_id} resource={resource} isTeacher={isTeacher} exp={exp} handleChange={handleChange}/>
                    ))
                )
            }
            </div>
            </Container>
            {isTeacher && <Uploader room_id={_id} isTeacher={isTeacher}/>}
        </div>
    )
}

const mapStateToProps= (state,props)=>({
    room: state.rooms.rooms.find((room)=>(room._id === props.match.params.id)),
    loading_resources:state.rooms.loading_resources,
    resources:state.rooms.resources,
    isTeacher:state.auth.user.isTeacher
})

export default connect(mapStateToProps,{getTeacherResources,getSubmissionsByTeacher})(ResourcesList);