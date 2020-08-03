import axios from "axios";

const getSubmissions = (id)=>{
    return async (dispatch)=>{
        try {
            const res = await axios.get("/api/rooms/"+id+"/submissions");
            console.log(res.data);
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

export {getSubmissions}