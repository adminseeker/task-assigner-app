import axios from "axios";

const getSubmissions = (id)=>{
    return async (dispatch)=>{
        try {
            const res = await axios.get("/api/rooms/"+id+"/submissions");
            dispatch({
                type:"GET_SUBMISSIONS",
                submissions:res.data
            })
        } catch (error) {
            console.log(error);
            dispatch({
                type:"GET_SUBMISSIONS_ERROR",
                error:{msg:error.response}
            })
        }
    }
}

const getSubmittedStudents = (id,ids)=>{
    return async (dispatch)=>{
        const body = JSON.stringify({ids:ids});
            const config = {
                headers:{
                    "Content-Type":"application/json"
                }
            }
        try {
            const res = await axios.post("/api/rooms/"+id+"/users",body,config);
            await dispatch({
                type:"GET_SUBMITTED_STUDENTS",
                submittedStudents:res.data
            })
        } catch (error) {
            console.log(error);
            dispatch({
                type:"GET_SUBMITTED_STUDENTS_ERROR",
                error:{msg:error.response}
            })
        }
    }
}

const getSubmissionsByTeacher = (room_id,resource_id)=>{
    return async (dispatch)=>{
        try {
            const res = await axios.get("/api/rooms/"+room_id+"/"+resource_id+"/submissions");
            dispatch({
                type:"GET_SUBMISSIONS",
                submissions:res.data
            })
        } catch (error) {
            console.log(error);
            dispatch({
                type:"GET_SUBMISSIONS_ERROR",
                error:{msg:error.response}
            })
        }
    }
}

const deleteSubmission = (id1,id2,submission)=>{
    return async (dispatch)=>{
        try {
            await axios.delete("/api/upload/"+id1+"/submissions/"+id2);
            dispatch({
                type:"DELETE_SUBMISSION",
                submission
            })
        } catch (error) {
            console.log(error);
            dispatch({
                type:"DELETE_SUBMISSION_ERROR",
                error:{msg:error.response}
            })
        }
        
    }
}

export {getSubmissions,deleteSubmission,getSubmissionsByTeacher,getSubmittedStudents};