const initialState = {
    rooms:[],
    currentRoom:{},
    loading:true,
    error:{}
    
}

const roomsReducer = (state=initialState,action)=>{
    switch(action.type){
        case "GET_ROOMS":
            return {
                ...state,
                rooms:action.rooms,
                loading:false                
            }
        case "ROOMS_ERROR":
            return{
                ...state,
                error:action.error,
                loading:false
            }
        case "GET_ROOM":
            return {
                ...state,
                currentRoom:action.currentRoom,
                loading:false                
            }
        case "ROOM_ERROR":
            return{
                ...state,
                error:action.error,
                loading:false
            }
        default :
            return state;
    }
}

export default roomsReducer;