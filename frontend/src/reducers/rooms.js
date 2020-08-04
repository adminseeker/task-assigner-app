const initialState = {
    rooms:[],
    teacher:{},
    students:[],
    resources:[],
    loading_rooms:true,
    loading_users:true,
    loading_resources:true,
    error:{}
}

const roomsReducer = (state=initialState,action)=>{
    switch(action.type){
        case "GET_ROOMS":
            return {
                ...state,
                rooms:action.rooms,
                loading_rooms:false,
                loading_users:true                
            }
        case "ROOMS_ERROR":
            return{
                ...state,
                error:action.error,
                loading_rooms:false
            }
        case "GET_ROOM_USERS":
            return {
                ...state,
                teacher:action.teacher,
                students:action.students,
                loading_users:false,
                                
            }
        case "ROOM_USERS_ERROR":
            return{
                ...state,
                error:action.error,
                loading_users:false,
                
            }
        case "GET_RESOURCES":
            return {
                ...state,
                resources:action.resources,     
                loading_resources:false         
            }
        case "GET_RESOURCES_ERROR":
            return{
                ...state,
                error:action.error,
                loading_resources:false         
            }
        case "DELETE_RESOURCE":
            return {
                ...state,
                resources:state.resources.filter((resource)=>((action.resource)!==(resource.resource))),
                loading_resources:false
            }
            case "DELETE_RESOURCE_ERROR":
                return{
                    ...state,
                    error:action.error,
                    loading_resources:false
                }
        default :
            return state;
    }
}

export default roomsReducer;