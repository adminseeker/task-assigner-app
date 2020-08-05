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

const getSubmissionsByTeacher = (room_id,student_id)=>{
    return async (dispatch)=>{
        try {
            const res = await axios.get("/api/rooms/"+room_id+"/submissions/"+student_id);
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

const deleteSubmission = (id,submission,student_id="")=>{
    return async (dispatch)=>{
        try {
            await axios.delete("/api/upload/"+id+"/submissions",{data:{location:submission,student_id}});
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

export {getSubmissions,deleteSubmission,getSubmissionsByTeacher};