import React, { useEffect } from "react"
import SubmissionsList from "./SubmissionsList";
import { getSubmittedStudents } from "../actions/submissions";
import { connect } from "react-redux";
import LoadingPage from "./LoadingPage";
import Uploader from "./Uploader";
import StudentListItem from "./StudentListItem";
import useSWR from "swr";
import StudentSubmissionsList from "./StudentSubmissionsList";

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
    width:"40%",
  },
  '@media (max-width: 768px)': {
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
    }
  }));

const Submissions = ({getSubmittedStudents, room_id,resource_id,submissions,loading_submittedStudents,isTeacher,submittedIDs,submittedStudents,user}) => {
    useSWR("/rooms/"+room_id+"/assignments/"+resource_id+"/submissions",async ()=>{
            await getSubmittedStudents(room_id,submittedIDs);
    });
    const classes = useStyles();
    return (
        loading_submittedStudents  ? <LoadingPage /> :
        <div className={classes.root}>
            <Container className={classes.alignItemsAndJustifyContent} xs={12}>
                <div className={classes.studentsContainer}>
                    <div style={{textAlign:"center"}}>
                        <Typography variant="h2">
                            Submissions
                        </Typography>
                    </div>
                    {isTeacher && submittedStudents.length===0 ? <h2>No submissions Yet</h2> : submittedStudents.map((student)=>(
                        <StudentListItem key={student._id} resource_id={resource_id} student={student} room_id={room_id} assignment={true} student_id={student._id}/>
                    ))}
                    
                    
                </div>
            </Container>
            {!isTeacher && <StudentSubmissionsList room_id={room_id} resource_id={resource_id} student_id={user._id}/>}
                    {!isTeacher && <Uploader room_id={room_id} isTeacher={isTeacher} resource_id={resource_id} submittedIDs={submittedIDs}/>}
        </div>
    )
}

const mapStateToProps = (state,props)=>({
    room_id: props.match.params.id1,
    resource_id: props.match.params.id2,
    loading_submittedStudents:state.submissions.loading_submittedStudents,
    isTeacher:state.auth.user.isTeacher,
    submittedIDs:state.submissions.submissions.reduce((result,submission)=>{result.push(submission.student_id); return result;},[]),
    submittedStudents:state.submissions.submittedStudents,
    submissions:state.submissions.submissions,
    user:state.auth.user 
})

export default connect(mapStateToProps,{getSubmittedStudents})(Submissions);

