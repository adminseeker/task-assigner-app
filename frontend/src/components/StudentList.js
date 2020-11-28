import React from "react";
import { connect } from "react-redux";
import FacebookCircularProgress from "./FacebookCircularProgress";
import StudentListItem from "./StudentListItem";
import InviteStudents from "./InviteStudents";
import { makeStyles, Container, Typography } from "@material-ui/core";

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
    }
  }));

const StudentList = (props) => {
    const classes = useStyles();
    return (
        props.loading_rooms ? <FacebookCircularProgress /> :

        <div className={classes.root}>
        <Container className={classes.alignItemsAndJustifyContent} xs={12}>
                <div className={classes.studentsContainer}>
                <div style={{textAlign:"center"}}>
                    <Typography variant="h2">
                        Students
                    </Typography>
                </div>
               { props.students.length === 0 ?(
                    <h3>No Students</h3>
                ) : (
                    props.students.map((student)=>(
                        <StudentListItem key={student._id} student={student} room_id={props.room_id}/>
                    ))
                )
            }
            </div>
            </Container>
            
            <InviteStudents room_id={props.room_id} isTeacher={props.isTeacher}/>
        </div>
    )
}

const mapStateToProps= (state,props)=>({
    students:state.rooms.students,
    user:state.auth.user,
    room_id:props.match.params.id,
    isTeacher:state.auth.user.isTeacher
})

export default connect(mapStateToProps)(StudentList);