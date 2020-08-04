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

const getTeacherResources = (id)=>{
    return async (dispatch)=>{
        try {
            const res = await axios.get("/api/rooms/"+id+"/resources");
            console.log(res.data);
            dispatch({
                type:"GET_RESOURCES",
                resources:res.data
            });
        } catch (error) {
            console.log(error);
            dispatch({
                type:"GET_RESOURCES_ERROR",
                error:{msg:error.response}
            })
        }
    }
}

const deleteResource = (id,resource)=>{
    return async (dispatch)=>{
        try {
            await axios.delete("/api/upload/"+id+"/resources",{data:{location:resource}});
            dispatch({
                type:"DELETE_RESOURCE",
                resource
            })
        } catch (error) {
            console.log(error);
            dispatch({
                type:"DELETE_RESOURCE_ERROR",
                error:{msg:error.response}
            })
        }
        
    }
}
export {getRooms,getRoomUsers,getTeacherResources,deleteResource};