import axios from "axios";

const getRooms = ()=>{
    return async (dispatch)=>{
        try {
            const res = await axios.get("/api/rooms");
            dispatch({
                type:"GET_ROOMS",
                rooms:res.data
            })
            console.log(res);
        } catch (error) {
            console.log(error);
            dispatch({
                type:"ROOMS_ERROR",
                error:{msg:error.response}
            })
        }        
    }
}

export {getRooms};