import React from "react";
import { connect } from "react-redux";
import LoadingPage from "./LoadingPage";
import SubmissionsListItem from "./SubmissionsListItem";

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

const StudentSubmissionsList = (props) => {
    const classes = useStyles();
    return (
        !props.isTeacher && 
        props.loading_submissions ? <LoadingPage /> :
        <div className={classes.root}>
            <Container className={classes.alignItemsAndJustifyContent} xs={12}>
                <div className={classes.studentsContainer}>
                    { !props.isTeacher &&
                        props.submissions.length === 0 ?(
                            <h3>No Submissions</h3>
                        ) : (
                            props.submissions.map((submission)=>(
                                <SubmissionsListItem key={submission.createdAt} room_id={props.room_id} resource_id={props.resource_id} submission={submission} isTeacher={props.isTeacher} student_id={props.student_id}/>
                            ))
                        )
                    }
                </div>
            </Container>
        </div>
    )
}

const mapStateToProps= (state,props)=>({
    submissions:state.submissions.submissions.filter((submission)=>(submission.resource_id===String(props.resource_id) && submission.student_id===String(props.student_id))),
    loading_submissions:state.submissions.loading_submissions,
    isTeacher:state.auth.user.isTeacher,
    room_id:props.room_id,
    resource_id:props.resource_id,
    student_id:props.student_id
})

export default connect(mapStateToProps)(StudentSubmissionsList);