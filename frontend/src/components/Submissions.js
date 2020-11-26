import React from "react"
import { getSubmittedStudents } from "../actions/submissions";
import { connect } from "react-redux";
import FacebookCircularProgress from "./FacebookCircularProgress";
import Uploader from "./Uploader";
import StudentListItem from "./StudentListItem";
import useSWR from "swr";
import moment from 'moment';
import StudentSubmissionsList from "./StudentSubmissionsList";
import { ExportToCsv } from 'export-to-csv';
import {Save} from '@material-ui/icons'
import { makeStyles, Container, Typography ,Button} from "@material-ui/core";

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

  const CSVOptions = { 
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true, 
    showTitle: true,
    title: 'Student Submissions',
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true,
  };


const Submissions = ({getSubmittedStudents,resource, room_id,resource_id,submissions,loading_submittedStudents,isTeacher,submittedIDs,submittedStudents,user}) => {
    useSWR("/rooms/"+room_id+"/assignments/"+resource_id+"/submissions",async ()=>{
            await getSubmittedStudents(room_id,submittedIDs);
    });

    const clickHandler = ()=>{
        // console.log(submissions);
        const students = submissions.map(e=>{
            const foundStudent = submittedStudents.find(f=>f._id===e.student_id);
            const temp = String(e.createdAt);
            return {
                studentName:foundStudent.name,
                phone:foundStudent.phone,
                email:foundStudent.email,
                description:e.description,
                submission:e.submission,
                
                deadline:moment(resource.deadline).format('MMMM Do YYYY, h:mm:ss a'),
                submitTime: moment(temp).format('MMMM Do YYYY, h:mm:ss a'),
                onTime: new Date(resource.deadline)<new Date(e.created_on),
                // deadline:resource.deadline,
            }
        })
        console.log('Final',students);
        console.log('csv',new ExportToCsv(CSVOptions).generateCsv(students))
    }
    const classes = useStyles();
    return (
        loading_submittedStudents  ? <FacebookCircularProgress /> :
        <div className={classes.root}>
            <Container className={classes.alignItemsAndJustifyContent} xs={12}>
                <div className={classes.studentsContainer}>
                    <div style={{textAlign:"center"}}>
                        <Typography variant="h2">
                            Submissions
                        </Typography>
                        {isTeacher && <Button
        variant="contained"
        color="primary"
        size="small"
        disabled={submissions.length===0}
        onClick={clickHandler}
        className={classes.button}
        startIcon={<Save />}
      >Export as CSV</Button>}
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
    user:state.auth.user ,
    resource:state.rooms.resources.find((resource)=>resource._id===String(props.match.params.id2))
})

export default connect(mapStateToProps,{getSubmittedStudents})(Submissions);

