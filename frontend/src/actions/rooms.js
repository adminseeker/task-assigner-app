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

const getRoom = (id)=>{
    return async (dispatch)=>{
        try {
            const res = await axios.get("/api/rooms/"+id);
            dispatch({
                type:"GET_ROOM",
                currentRoom:res.data
            })
            console.log(res);
        } catch (error) {
            console.log(error);
            dispatch({
                type:"ROOM_ERROR",
                error:{msg:error.response}
            })
        }        
    }
}

export {getRooms,getRoom};