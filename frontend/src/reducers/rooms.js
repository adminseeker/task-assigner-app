const initialState = {
    rooms:[],
    teacher:{},
    students:[],
    loading_rooms:true,
    loading_users:true,
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
                loading_users:false                
            }
        case "ROOM_USERS_ERROR":
            return{
                ...state,
                error:action.error,
                loading_users:false
            }
        default :
            return state;
    }
}

export default roomsReducer;