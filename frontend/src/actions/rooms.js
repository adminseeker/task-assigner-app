import axios from "axios";

const addAnnouncement = (contentString,id)=>{
    return async (dispatch)=>{
        try {
            const body = JSON.stringify({"content":contentString});
            const config = {
                headers:{
                    "Content-Type":"application/json"
                }
            }
            const res = await axios.post("/api/rooms/"+id+"/announcements",body,config);
            await dispatch(getAnnouncements(id));
        } catch (error) {
            console.log(error);
            dispatch({
                type:"GET_ANNOUNCEMENTS_ERROR"
            })
        }
    }

}

const updateDeadline = (id1,id2,deadline)=>{
    return async (dispatch)=>{
        try {
            const body = JSON.stringify({deadline});
            const config = {
                headers:{
                    "Content-Type":"application/json"
                }
            }
            const res = await axios.post("/api/upload/"+id1+"/"+id2+"/deadline",body,config);
            await dispatch(getTeacherResources(id1));
        } catch (error) {
            console.log(error);
            dispatch({
                type:"GET_ANNOUNCEMENTS_ERROR"
            })
        }
    }

}


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
                students:res.data.students,
                current_room_id:id
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

const getAnnouncements= (id)=>{
    return async (dispatch)=>{
        try {
            const res = await axios.get("/api/rooms/"+id+"/announcements");
            dispatch({
                type:"GET_ANNOUNCEMENTS",
                announcements:res.data
            })
        } catch (error) {
            console.log(error);
            dispatch({
                type:"ROOM_ANNOUNCEMENTS_ERROR",
                error:{msg:error.response}
            })
        }
    }
}

const getTeacherResources = (id)=>{
    return async (dispatch)=>{
        try {
            const res = await axios.get("/api/rooms/"+id+"/resources");
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

const getMaterials = (id)=>{
    return async (dispatch)=>{
        try {
            const res = await axios.get("/api/rooms/"+id+"/materials");
            dispatch({
                type:"GET_MATERIALS",
                materials:res.data
            });
        } catch (error) {
            console.log(error);
            dispatch({
                type:"GET_MATERIALS_ERROR",
                error:{msg:error.response}
            })
        }
    }
}


const deleteResource = (id1,id2)=>{
    return async (dispatch)=>{
        try {
            await axios.delete("/api/upload/"+id1+"/resources/"+id2);
            await dispatch(getTeacherResources(id1));
        } catch (error) {
            console.log(error);
            dispatch({
                type:"DELETE_RESOURCE_ERROR",
                error:{msg:error.response}
            })
        }
        
    }
}

const deleteMaterial = (id1,id2)=>{
    return async (dispatch)=>{
        try {
            await axios.delete("/api/upload/"+id1+"/materials/"+id2);
            await dispatch(getMaterials(id1));
        } catch (error) {
            console.log(error);
            dispatch({
                type:"DELETE_MATERIAL_ERROR",
                error:{msg:error.response}
            })
        }
        
    }
}

const deleteAnnouncement = (id1,id2)=>{
    return async (dispatch)=>{
        try {
            await axios.delete("/api/rooms/"+id1+"/announcements/"+id2);
            await dispatch(getAnnouncements(id1));
        } catch (error) {
            console.log(error);
            dispatch({
                type:"GET_ANNOUNCEMENTS_ERROR",
                error:{msg:error.response}
            })
        }
        
    }
}
export {addAnnouncement,getRooms,getRoomUsers,getAnnouncements,getTeacherResources,deleteResource,deleteAnnouncement,updateDeadline,getMaterials,deleteMaterial};