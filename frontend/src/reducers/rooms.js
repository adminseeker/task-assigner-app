const initialState = {
    rooms:[],
    current_room_id:"",
    teacher:{},
    students:[],
    resources:[],
    announcements:[],
    materials:[],
    loading_rooms:true,
    loading_users:true,
    loading_resources:true,
    loading_announcements:true,
    loading_materials:true,
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
                current_room_id:action.current_room_id,
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
        case "GET_MATERIALS":
            return {
                ...state,
                materials:action.materials,     
                loading_materials:false         
    }
        case "GET_MATERIALS_ERROR":
            return{
                ...state,
                error:action.error,
                loading_materials:false         
            }
        case "DELETE_MATERIAL":
            return {
                ...state,
                materials:state.materials.filter((material)=>((action.material)!==(material.material))),
                loading_materials:false
            }
        case "DELETE_MATERIAL_ERROR":
            return{
                ...state,
                error:action.error,
                loading_materials:false
            }

            case "GET_ANNOUNCEMENTS":
                return {
                    ...state,
                    announcements:action.announcements,
                    loading_announcements:false
                                    
                }
            case "ROOM_ANNOUNCEMENTS_ERROR":
                return{
                    ...state,
                    error:action.error,
                    loading_announcements:false
                    
                }
            case "ERROR":
                return{
                    ...state
                }
            case "LOGOUT":
                return{
                    ...initialState
                }
        default :
            return state;
    }
}

export default roomsReducer;