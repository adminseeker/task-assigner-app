import axios from "axios";

const getRooms = ()=>{
    return async (dispatch)=>{
        try {
            const res = await axios.get("/api/rooms");
            dispatch({
                type:"GET_ROOMS",
                rooms:res.data
            })
        } catch (error) {
            console.log(error);
            dispatch({
                type:"ROOMS_ERROR",
                error:{msg:error.response}
            })
        }        
    }
}

const getRoomUsers = (id)=>{
    return async (dispatch)=>{
        try {
            const res = await axios.get("/api/rooms/"+id+"/users");
            dispatch({
                type:"GET_ROOM_USERS",
                teacher:res.data.teacher,
                students:res.data.students
            })
        } catch (error) {
            console.log(error);
            dispatch({
                type:"ROOM_USERS_ERROR",
                error:{msg:error.response}
            })
        }
    }
}

export {getRooms,getRoomUsers};